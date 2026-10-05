using System;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using DocumentFormat.OpenXml.Office2010.Word;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.AspNet.Identity;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using System.Net.Http;
using System.Threading.Tasks;
using System.IO.Packaging;
using System.Web.Http.Results;
using System.Collections.Generic;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Net;
using DocumentFormat.OpenXml.Packaging;
using Text = DocumentFormat.OpenXml.Wordprocessing.Text;
using VNPT.Web.Portal.Api.Helper;

namespace VNPT.Web.Portal.Api.Controllers
{
    [VnptAuthorization]
    public class TraCuuDiemController : BaseApiController
    {
        [HttpPost]
        public async Task<IHttpActionResult> ExportFile(TraCuuDiemModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    // Đường dẫn tới file Word mẫu (bạn có thể để trong App_Data)
                    string templatePath = HttpContext.Current.Server.MapPath("~/Templates/formxemdiem.docx");
                    var fileUrl = "~/Exports/" + model.MaVnedu + "_" + model.Namhoc + "_" + model.Hovaten + "_" + DateTime.Now.Ticks + ".docx";
                    string outputPath = HttpContext.Current.Server.MapPath(fileUrl);

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
                        FileName = Path.GetFileName(outputPath)
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


        private Dictionary<string, int> GetHeaderMap(IRow headerRow)
        {
            var map = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            for (int i = 0; i < headerRow.LastCellNum; i++)
            {
                var cellValue = headerRow.GetCell(i)?.ToString()?.Trim();
                if (!string.IsNullOrEmpty(cellValue) && !map.ContainsKey(cellValue))
                {
                    map[cellValue] = i;
                }
            }
            return map;
        }

        [HttpPost]
        public async Task<IHttpActionResult> ImportFile()
        {
            if (!Request.Content.IsMimeMultipartContent())
                return BadRequest();

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);

            var fileContent = provider.Contents.FirstOrDefault();
            if (fileContent == null)
                return BadRequest();

            var filename = fileContent.Headers.ContentDisposition.FileName.Trim('"');
            var fileBytes = await fileContent.ReadAsByteArrayAsync();

            var currentUnitCode = User.Identity.UnitCode();
            var logs = new List<string>();

            try
            {
                using (var stream = new MemoryStream(fileBytes))
                {
                    var workbook = new HSSFWorkbook(stream);
                    int sheetCount = workbook.NumberOfSheets;

                    for (int i = 0; i < sheetCount; i++)
                    {
                        var sheet = workbook.GetSheetAt(i);
                        string sheetName = sheet.SheetName;

                        // Đọc dòng tiêu đề (header) - dòng 0
                        var headerRow = sheet.GetRow(0);
                        if (headerRow == null) continue;

                        var headerMap = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                        for (int c = 0; c < headerRow.LastCellNum; c++)
                        {
                            var headerName = headerRow.GetCell(c)?.ToString()?.Trim();
                            if (!string.IsNullOrEmpty(headerName) && !headerMap.ContainsKey(headerName))
                                headerMap[headerName] = c;
                        }

                        string GetValue(IRow rowData, string columnName)
                        {
                            return headerMap.ContainsKey(columnName)
                                ? rowData.GetCell(headerMap[columnName])?.ToString()
                                : null;
                        }

                        for (int row = 1; row <= sheet.LastRowNum; row++)
                        {
                            try
                            {
                                var rowData = sheet.GetRow(row);
                                if (rowData == null) continue;
                                if (rowData.Cells.Count(c => !string.IsNullOrWhiteSpace(c?.ToString())) < 3)
                                    continue;

                                var diem = new TraCuuDiem
                                {
                                    STT = GetValue(rowData, "STT"),
                                    MaVnedu = GetValue(rowData, "MaVnedu"),
                                    SoCCCD = GetValue(rowData, "SoCCCD"),
                                    Hovaten = GetValue(rowData, "Hovaten"),
                                    Lop = GetValue(rowData, "Lop"),
                                    Ngaysinh = GetValue(rowData, "Ngaysinh"),

                                    ToanHKI = GetValue(rowData, "ToanHKI"),
                                    ToanHKII = GetValue(rowData, "ToanHKII"),
                                    ToanCN = GetValue(rowData, "ToanCN"),
                                    ToanTL = GetValue(rowData, "ToanTL"),

                                    LiHKI = GetValue(rowData, "LiHKI"),
                                    LiHKII = GetValue(rowData, "LiHKII"),
                                    LiCN = GetValue(rowData, "LiCN"),
                                    LiTL = GetValue(rowData, "LiTL"),

                                    HoaHKI = GetValue(rowData, "HoaHKI"),
                                    HoaHKII = GetValue(rowData, "HoaHKII"),
                                    HoaCN = GetValue(rowData, "HoaCN"),
                                    HoaTL = GetValue(rowData, "HoaTL"),

                                    SinhHKI = GetValue(rowData, "SinhHKI"),
                                    SinhHKII = GetValue(rowData, "SinhHKII"),
                                    SinhCN = GetValue(rowData, "SinhCN"),
                                    SinhTL = GetValue(rowData, "SinhTL"),

                                    TinHKI = GetValue(rowData, "TinHKI"),
                                    TinHKII = GetValue(rowData, "TinHKII"),
                                    TinCN = GetValue(rowData, "TinCN"),
                                    TinTL = GetValue(rowData, "TinTL"),

                                    VanHKI = GetValue(rowData, "VanHKI"),
                                    VanHKII = GetValue(rowData, "VanHKII"),
                                    VanCN = GetValue(rowData, "VanCN"),
                                    VanTL = GetValue(rowData, "VanTL"),

                                    SuHKI = GetValue(rowData, "SuHKI"),
                                    SuHKII = GetValue(rowData, "SuHKII"),
                                    SuCN = GetValue(rowData, "SuCN"),
                                    SuTL = GetValue(rowData, "SuTL"),

                                    DiaHKI = GetValue(rowData, "DiaHKI"),
                                    DiaHKII = GetValue(rowData, "DiaHKII"),
                                    DiaCN = GetValue(rowData, "DiaCN"),
                                    DiaTL = GetValue(rowData, "DiaTL"),

                                    GDKTPLHKI = GetValue(rowData, "GDKTPLHKI"),
                                    GDKTPLHKII = GetValue(rowData, "GDKTPLHKII"),
                                    GDKTPLCN = GetValue(rowData, "GDKTPLCN"),
                                    GDKTPLTL = GetValue(rowData, "GDKTPLTL"),

                                    HDTNHKI = GetValue(rowData, "HDTNHKI"),
                                    HDTNHKII = GetValue(rowData, "HDTNHKII"),
                                    HDTNCN = GetValue(rowData, "HDTNCN"),
                                    HDTNTL = GetValue(rowData, "HDTNTL"),

                                    CongNgheHKI = GetValue(rowData, "CongNgheHKI"),
                                    CongNgheHKII = GetValue(rowData, "CongNgheHKII"),
                                    CongNgheCN = GetValue(rowData, "CongNgheCN"),
                                    CongNgheTL = GetValue(rowData, "CongNgheTL"),

                                    KQHTHKI = GetValue(rowData, "KQHTHKI"),
                                    KQHTHKII = GetValue(rowData, "KQHTHKII"),
                                    KQHTCN = GetValue(rowData, "KQHTCN"),

                                    KQRLHKI = GetValue(rowData, "KQRLHKI"),
                                    KQRLHKII = GetValue(rowData, "KQRLHKII"),
                                    KQRLCN = GetValue(rowData, "KQRLCN"),

                                    VangHKI = GetValue(rowData, "VangHKI"),
                                    VangHKII = GetValue(rowData, "VangHKII"),
                                    VangCN = GetValue(rowData, "VangCN"),

                                    DTBCN = GetValue(rowData, "DTBCN"),
                                    
                                    DANHHIEU = GetValue(rowData, "DANHHIEU"),
                                    Namhoc = GetValue(rowData, "Namhoc"),
                                    LENLOP = GetValue(rowData, "LENLOP"),

                                    UnitCode = currentUnitCode,
                                    CreateDate = DateTime.Now,
                                    CreateUserId = User.Identity.GetUserId(),
                                    Status = StatusEnum.CDC_DaCoKQXN
                                };

                                using (var db = new WebDbContext())
                                {
                                    string NormalizeNamhoc(string namhoc)
                                    {
                                        if (string.IsNullOrWhiteSpace(namhoc)) return "";

                                        var normalized = namhoc.Trim()
                                                                .Replace(" ", "")
                                                                .Replace("–", "-")
                                                                .Replace("—", "-")
                                                                .Replace("--", "-");
                                        return normalized;
                                    }

                                    string GetNamKetThuc(string namhoc)
                                    {
                                        var normalized = NormalizeNamhoc(namhoc);
                                        var parts = normalized.Split('-');
                                        if (parts.Length == 2)
                                        {
                                            return parts[1]; // Năm kết thúc (vd: "2025")
                                        }
                                        return normalized; // Nếu chỉ có 1 năm (vd: "2025")
                                    }

                                    var normalizedDiemNamHoc = NormalizeNamhoc(diem.Namhoc);
                                    var diemNamKetThuc = GetNamKetThuc(diem.Namhoc);

                                    var diemTonTai = db.TraCuuDiems
                                        .AsEnumerable()
                                        .FirstOrDefault(x =>
                                            x.MaVnedu == diem.MaVnedu &&
                                            GetNamKetThuc(x.Namhoc) == diemNamKetThuc);

                                    if (diemTonTai != null)
                                    {
                                        db.Entry(diemTonTai).CurrentValues.SetValues(diem);
                                        logs.Add($"[Update] Sheet: {sheetName}, Row: {row + 1}, MaVnedu: {diem.MaVnedu}");
                                    }
                                    else
                                    {
                                        db.TraCuuDiems.Add(diem);
                                        logs.Add($"[Insert] Sheet: {sheetName}, Row: {row + 1}, MaVnedu: {diem.MaVnedu}");
                                    }

                                    db.SaveChanges();

                                    //var diemTonTai = db.TraCuuDiems
                                    //    .FirstOrDefault(x => x.MaVnedu == diem.MaVnedu && x.Namhoc == diem.Namhoc);

                                    //if (diemTonTai != null)
                                    //{
                                    //    db.Entry(diemTonTai).CurrentValues.SetValues(diem);
                                    //    logs.Add($"[Update] Sheet: {sheetName}, Row: {row + 1}, MaVnedu: {diem.MaVnedu}");
                                    //}
                                    //else
                                    //{
                                    //    db.TraCuuDiems.Add(diem);
                                    //    logs.Add($"[Insert] Sheet: {sheetName}, Row: {row + 1}, MaVnedu: {diem.MaVnedu}");
                                    //}

                                    //db.SaveChanges();
                                }
                            }
                            catch (Exception exRow)
                            {
                                logs.Add($"[Error] Sheet: {sheetName}, Row: {row + 1}, Lỗi: {exRow.Message}");
                            }
                        }
                    }
                }

                return Json(new ResultModel
                {
                    Code = ResultCode.Success,
                    Result = logs
                });
            }
            catch (Exception ex)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Exception,
                    Message = ex.Message
                });
            }
        }
        //public async Task<IHttpActionResult> ImportFile()
        //{
        //    if (!Request.Content.IsMimeMultipartContent())
        //        return BadRequest();

        //    var provider = new MultipartMemoryStreamProvider();
        //    await Request.Content.ReadAsMultipartAsync(provider);

        //    var fileContent = provider.Contents.FirstOrDefault();
        //    if (fileContent == null)
        //        return BadRequest();

        //    var filename = fileContent.Headers.ContentDisposition.FileName.Trim('"');
        //    var fileBytes = await fileContent.ReadAsByteArrayAsync();

        //    var currentUnitCode = User.Identity.UnitCode();
        //    var logs = new List<string>();

        //    try
        //    {
        //        using (var stream = new MemoryStream(fileBytes))
        //        {
        //            var workbook = new HSSFWorkbook(stream);

        //            int sheetCount = workbook.NumberOfSheets;

        //            for (int i = 0; i < sheetCount; i++)
        //            {
        //                var sheet = workbook.GetSheetAt(i);
        //                string sheetName = sheet.SheetName;

        //                for (int row = 1; row <= sheet.LastRowNum; row++)
        //                {
        //                    try
        //                    {
        //                        var rowData = sheet.GetRow(row);
        //                        if (rowData == null) continue;

        //                        var diem = new TraCuuDiem
        //                        {
        //                            STT = rowData.GetCell(0)?.ToString(),
        //                            MaVnedu = rowData.GetCell(1)?.ToString(),
        //                            SoCCCD = rowData.GetCell(2)?.ToString(),
        //                            Hovaten = rowData.GetCell(3)?.ToString(),
        //                            Lop = rowData.GetCell(4)?.ToString(),
        //                            Ngaysinh = rowData.GetCell(5)?.ToString(),

        //                            ToanHKI = rowData.GetCell(6)?.ToString(),
        //                            ToanHKII = rowData.GetCell(7)?.ToString(),
        //                            ToanCN = rowData.GetCell(8)?.ToString(),
        //                            ToanTL = rowData.GetCell(9)?.ToString(),

        //                            LiHKI = rowData.GetCell(10)?.ToString(),
        //                            LiHKII = rowData.GetCell(11)?.ToString(),
        //                            LiCN = rowData.GetCell(12)?.ToString(),
        //                            LiTL = rowData.GetCell(13)?.ToString(),

        //                            HoaHKI = rowData.GetCell(14)?.ToString(),
        //                            HoaHKII = rowData.GetCell(15)?.ToString(),
        //                            HoaCN = rowData.GetCell(16)?.ToString(),
        //                            HoaTL = rowData.GetCell(17)?.ToString(),

        //                            SinhHKI = rowData.GetCell(18)?.ToString(),
        //                            SinhHKII = rowData.GetCell(19)?.ToString(),
        //                            SinhCN = rowData.GetCell(20)?.ToString(),
        //                            SinhTL = rowData.GetCell(21)?.ToString(),

        //                            TinHKI = rowData.GetCell(22)?.ToString(),
        //                            TinHKII = rowData.GetCell(23)?.ToString(),
        //                            TinCN = rowData.GetCell(24)?.ToString(),
        //                            TinTL = rowData.GetCell(25)?.ToString(),

        //                            VanHKI = rowData.GetCell(26)?.ToString(),
        //                            VanHKII = rowData.GetCell(27)?.ToString(),
        //                            VanCN = rowData.GetCell(28)?.ToString(),
        //                            VanTL = rowData.GetCell(29)?.ToString(),

        //                            SuHKI = rowData.GetCell(30)?.ToString(),
        //                            SuHKII = rowData.GetCell(31)?.ToString(),
        //                            SuCN = rowData.GetCell(32)?.ToString(),
        //                            SuTL = rowData.GetCell(33)?.ToString(),

        //                            DiaHKI = rowData.GetCell(34)?.ToString(),
        //                            DiaHKII = rowData.GetCell(35)?.ToString(),
        //                            DiaCN = rowData.GetCell(36)?.ToString(),
        //                            DiaTL = rowData.GetCell(37)?.ToString(),

        //                            GDKTPLHKI = rowData.GetCell(38)?.ToString(),
        //                            GDKTPLHKII = rowData.GetCell(39)?.ToString(),
        //                            GDKTPLCN = rowData.GetCell(40)?.ToString(),
        //                            GDKTPLTL = rowData.GetCell(41)?.ToString(),

        //                            HDTNHKI = rowData.GetCell(42)?.ToString(),
        //                            HDTNHKII = rowData.GetCell(43)?.ToString(),
        //                            HDTNCN = rowData.GetCell(44)?.ToString(),
        //                            HDTNTL = rowData.GetCell(45)?.ToString(),

        //                            KQHTHKI = rowData.GetCell(46)?.ToString(),
        //                            KQHTHKII = rowData.GetCell(47)?.ToString(),
        //                            KQHTCN = rowData.GetCell(48)?.ToString(),
        //                            KQRLHKI = rowData.GetCell(49)?.ToString(),
        //                            KQRLHKII = rowData.GetCell(50)?.ToString(),
        //                            KQRLCN = rowData.GetCell(51)?.ToString(),

        //                            VangHKI = rowData.GetCell(52)?.ToString(),
        //                            VangHKII = rowData.GetCell(53)?.ToString(),
        //                            VangCN = rowData.GetCell(54)?.ToString(),

        //                            DANHHIEU = rowData.GetCell(55)?.ToString(),
        //                            Namhoc = rowData.GetCell(56)?.ToString(),
        //                            LENLOP = rowData.GetCell(57)?.ToString(),

        //                            UnitCode = currentUnitCode,
        //                            CreateDate = DateTime.Now,
        //                            CreateUserId = User.Identity.GetUserId(),
        //                            Status = StatusEnum.CDC_DaCoKQXN
        //                        };

        //                        using (var db = new WebDbContext())
        //                        {
        //                            var diemTonTai = db.TraCuuDiems
        //                                .FirstOrDefault(x => x.MaVnedu == diem.MaVnedu && x.Namhoc == diem.Namhoc);

        //                            if (diemTonTai != null)
        //                            {
        //                                db.Entry(diemTonTai).CurrentValues.SetValues(diem);
        //                                logs.Add($"[Update] Sheet: {sheetName}, Row: {row + 1}, MaHocsinh: {diem.MaVnedu}");
        //                            }
        //                            else
        //                            {
        //                                db.TraCuuDiems.Add(diem);
        //                                logs.Add($"[Insert] Sheet: {sheetName}, Row: {row + 1}, MaHocsinh: {diem.MaVnedu}");
        //                            }

        //                            db.SaveChanges();
        //                        }
        //                    }
        //                    catch (Exception ex)
        //                    {
        //                        logs.Add($"[Error] Sheet: {sheet.SheetName}, Row: {row + 1}, Lỗi: {ex.Message}");
        //                    }
        //                }
        //            }
        //        }    

        //        return Json(new ResultModel()
        //        {
        //            Code = ResultCode.Success,
        //            Result = logs
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new ResultModel()
        //        {
        //            Code = ResultCode.Exception,
        //            Message = ex.Message
        //        });
        //    }
        //}

        [HttpPost]
        public IHttpActionResult GetDetail(TraCuuDiemModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var item = context.TraCuuDiems.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.MaVnedu == model.MaVnedu
                    && s.Namhoc == model.Namhoc);
                    
                    if(item != null)
                    {
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

        [HttpPost]
        public IHttpActionResult GetList(TraCuuDiemModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var items = context.TraCuuDiems.Where(s => s.Status != StatusEnum.Deleted);
                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        model.Keyword = model.Keyword.ToLower();
                        items = items.Where(s => s.Hovaten.ToLower().Contains(model.Keyword) || s.MaVnedu.ToLower().Contains(model.Keyword) ||
                        s.SoCCCD.ToLower().Contains(model.Keyword));
                    }
                    if (!string.IsNullOrEmpty(model.Namhoc))
                    {
                        items = items.Where(s => s.Namhoc.ToLower() == model.Namhoc.ToLower());
                    }

                    items = items.OrderBy(s => s.UpdateDate).ThenByDescending(s => s.CreateDate);
                    var temp = items.ToList();
                    var result = temp.Paging(model).Select(s => new TraCuuDiemModel(s)).ToList();

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