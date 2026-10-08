using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Packaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Helper;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Areas.Modules.Controllers
{
    public class TraCuuDiemController : Controller
    {
        public JsonResult ExportFile(TraCuuDiemModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    // Đường dẫn tới file Word mẫu (bạn có thể để trong App_Data)
                    string templatePath = System.Web.HttpContext.Current.Server.MapPath("~/Templates/formxemdiem.docx");
                    var fileUrl = "~/Exports/" + model.MaVnedu + "_" + model.Namhoc + "_" + model.Hovaten + "_" + DateTime.Now.Ticks + ".docx";
                    string outputPath = System.Web.HttpContext.Current.Server.MapPath(fileUrl);

                    // Copy file gốc sang file mới
                    System.IO.File.Copy(templatePath, outputPath, true);

                    using (WordprocessingDocument doc = WordprocessingDocument.Open(outputPath, true))
                    {
                        var body = doc.MainDocumentPart.Document.Body;

                        var replacements = new Dictionary<string, string>
                        {
                            { "[MaVnedu]", model.MaVnedu },
                            { "[SoCCCD]", model.SoCCCD },
                            { "[Hovaten]", model.Hovaten },
                            { "[Lop]", model.Lop },
                            { "[Ngaysinh]", model.Ngaysinh },

                            { "[ToanHKI]", model.ToanHKI },
                            { "[ToanHKII]", model.ToanHKII },
                            { "[ToanCN]", model.ToanCN },
                            { "[ToanTL]", model.ToanTL },

                            { "[LiHKI]", model.LiHKI },
                            { "[LiHKII]", model.LiHKII },
                            { "[LiCN]", model.LiCN },
                            { "[LiTL]", model.LiTL },

                            { "[HoaHKI]", model.HoaHKI },
                            { "[HoaHKII]", model.HoaHKII },
                            { "[HoaCN]", model.HoaCN },
                            { "[HoaTL]", model.HoaTL },

                            { "[SinhHKI]", model.SinhHKI },
                            { "[SinhHKII]", model.SinhHKII },
                            { "[SinhCN]", model.SinhCN },
                            { "[SinhTL]", model.SinhTL },

                            { "[TinHKI]", model.TinHKI },
                            { "[TinHKII]", model.TinHKII },
                            { "[TinCN]", model.TinCN },
                            { "[TinTL]", model.TinTL },

                            { "[VanHKI]", model.VanHKI },
                            { "[VanHKII]", model.VanHKII },
                            { "[VanCN]", model.VanCN },
                            { "[VanTL]", model.VanTL },

                            { "[SuHKI]", model.SuHKI },
                            { "[SuHKII]", model.SuHKII },
                            { "[SuCN]", model.SuCN },
                            { "[SuTL]", model.SuTL },

                            { "[DiaHKI]", model.DiaHKI },
                            { "[DiaHKII]", model.DiaHKII },
                            { "[DiaCN]", model.DiaCN },
                            { "[DiaTL]", model.DiaTL },

                            { "[GDKTPLHKI]", model.GDKTPLHKI },
                            { "[GDKTPLHKII]", model.GDKTPLHKII },
                            { "[GDKTPLCN]", model.GDKTPLCN },
                            { "[GDKTPLTL]", model.GDKTPLTL },

                            { "[HDTNHKI]", model.HDTNHKI },
                            { "[HDTNHKII]", model.HDTNHKII },
                            { "[HDTNCN]", model.HDTNCN },
                            { "[HDTNTL]", model.HDTNTL },

                            { "[KQHTHKI]", model.KQHTHKI },
                            { "[KQHTHKII]", model.KQHTHKII },
                            { "[KQHTCN]", model.KQHTCN },

                            { "[KQRLHKI]", model.KQRLHKI },
                            { "[KQRLHKII]", model.KQRLHKII },
                            { "[KQRLCN]", model.KQRLCN },

                            { "[CongNgheHKI]", model.CongNgheHKI },
                            { "[CongNgheHKII]", model.CongNgheHKII },
                            { "[CongNgheCN]", model.CongNgheCN },
                            { "[CongNgheTL]", model.CongNgheTL },

                            { "[DTBCN]", model.DTBCN },

                            { "[VangHKI]", model.VangHKI },
                            { "[VangHKII]", model.VangHKII },
                            { "[VangCN]", model.VangCN },

                            { "[DANHHIEU]", model.DANHHIEU },
                            { "[Namhoc]", model.Namhoc },
                            { "[LENLOP]", model.LENLOP }
                        };

                        WordHelper.ReplaceTextInDocument2(body, replacements);

                        doc.MainDocumentPart.Document.Save();
                    }

                    byte[] fileBytes = System.IO.File.ReadAllBytes(outputPath);
                    var result = new HttpResponseMessage(HttpStatusCode.OK)
                    {
                        Content = new ByteArrayContent(fileBytes)
                    };
                    result.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment")
                    {
                        FileName = System.IO.Path.GetFileName(outputPath)
                    };
                    result.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

                    string relativePath = Url.Content($"{fileUrl}");

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Message = "Xuất file thành công!",
                        Result = relativePath
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnknowError,
                    Message = e.Message
                });
            }
        }


        public JsonResult GetDetail(TraCuuDiemModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var item = context.TraCuuDiems.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.MaVnedu == model.MaVnedu
                    && s.Namhoc == model.Namhoc);

                    if (item != null)
                    {
                        item.SoCCCD = null;
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                            Result = item,
                        });
                    }
                    else
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Result = null,
                        });
                    }

                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnknowError,
                    Message = e.Message
                });
            }
        }

        public JsonResult GetList(TraCuuDiemModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    if (string.IsNullOrEmpty(model.Keyword))
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                            Result = new List<TraCuuDiemModel>(),
                            TotalRow = 0
                        });
                    }

                    var items = context.TraCuuDiems.Where(s => s.Status != StatusEnum.Deleted);
                    model.Keyword = model.Keyword.ToLower();
                    items = items.Where(s => s.MaVnedu.ToLower() == model.Keyword);

                    if (!string.IsNullOrEmpty(model.Namhoc))
                    {
                        var inputYear = model.Namhoc.Trim().Replace(" ", "").Replace("–", "-").Replace("—", "-").Replace("--", "-");

                        if (inputYear.Contains("-"))
                        {
                            items = items.Where(s =>
                                s.Namhoc != null &&
                                s.Namhoc.Replace(" ", "").Replace("–", "-").Replace("—", "-").Replace("--", "-").Equals(inputYear));
                        }
                        else
                        {
                            items = items.Where(s =>
                                s.Namhoc != null &&
                                (
                                    s.Namhoc.EndsWith("-" + inputYear) || // Năm tổng kết trùng
                                    s.Namhoc.Replace(" ", "").Replace("–", "-").Replace("—", "-").Replace("--", "-").Equals(inputYear) // Trùng toàn bộ
                                ));
                        }
                    }

                    items = items.OrderByDescending(s => s.CreateDate);
                    var temp = items.ToList();
                    var result = temp.Paging(model).Select(s => new TraCuuDiemModel(s)).ToList();
                    result.ForEach(r => r.SoCCCD = null);

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        TotalRow = temp.Count
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnknowError,
                    Message = e.Message
                });
            }
        }
    }
}