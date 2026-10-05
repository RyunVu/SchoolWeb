using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    [VnptAuthorization]
    public class EOfficeController : BaseApiController
    {
        [HttpPost]
        public IHttpActionResult GetList(EOfficeModel input)
        {
            try
            {
                using (var db = new WebDbContext())
                {
                    string userId = userId = User.Identity.GetUserId();
                    var user = db.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);

                    if (User.IsInRole(RoleCode.SuperAdminSystem))
                    {
                        user.UnitCode = input.UnitCode;
                    }

                    var cmd = db.Database.Connection.CreateCommand();

                    cmd.CommandText = "[dbo].[Portal_EOffice_GetDocuments]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_unitcode", user.UnitCode));
                    //cmd.Parameters.Add(new SqlParameter("@p_tag", input.Tag));
                    cmd.Parameters.Add(new SqlParameter("@p_loaivanban", input.LoaiVanBan));
                    cmd.Parameters.Add(new SqlParameter("@p_keyword", input.Keyword));
                    cmd.Parameters.Add(new SqlParameter("@p_status", input.Status));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", input.PageIndex ?? 1));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", input.PageSize ?? 10));
                    var connection = db.Database.Connection;
                    if (connection.State != ConnectionState.Open)
                        connection.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        List<EOffice> resultTemp = ((IObjectContextAdapter)db).ObjectContext
                            .Translate<EOffice>(reader)
                            .ToList();
                        reader.NextResult();

                        var total = ((IObjectContextAdapter)db).ObjectContext
                            .Translate<int>(reader)
                            .FirstOrDefault();
                        connection.Close();
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Success,
                            Result = resultTemp,
                            TotalRow = total
                        });
                    }
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Exception,
                    Message = e.Message + "\n" + e.StackTrace,
                    Result = null
                });
            }
        }

        [HttpPost]
        public IHttpActionResult Add()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;

                string ngayBanHanhStr = HttpContext.Current.Request["NgayBanHanh"] ?? "";
                DateTime ngayBanHanh;

                if (!DateTime.TryParse(ngayBanHanhStr, out ngayBanHanh))
                {
                    ngayBanHanhStr = "";
                }

                DateTime? ngayPhatHanh = DateTime.TryParse(HttpContext.Current.Request["NgayPhatHanh"] ?? "", out var date)
                ? date
                : (DateTime?)null;

                EOffice newEntity = new EOffice()
                {
                    Id = Guid.NewGuid(),
                    SoKyHieu = HttpContext.Current.Request["SoKyHieu"],
                    CongBaoSo = HttpContext.Current.Request["CongBaoSo"],
                    CoQuanBanHanh = HttpContext.Current.Request["CoQuanBanHanh"],
                    GhiChu = HttpContext.Current.Request["GhiChu"],
                    LinhVuc = HttpContext.Current.Request["LinhVuc"],
                    LoaiVanBan = HttpContext.Current.Request["LoaiVanBan"],
                    NgayBanHanh = ngayBanHanh,
                    NgayPhatHanh = ngayPhatHanh,
                    NguoiKy = HttpContext.Current.Request["NguoiKy"],
                    TrichYeu = HttpContext.Current.Request["TrichYeu"],
                    UnitCode = HttpContext.Current.Request["UnitCode"] ?? "TTGDTXLD",

                    // Other attributes
                    Status = StatusEnum.Used,
                    CreateDate = DateTime.Now,
                    CreateUserId = User.Identity.GetUserId(),
                };

                using (var db = new WebDbContext())
                {
                    string userId = userId = User.Identity.GetUserId();
                    var user = db.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);
                    newEntity.UnitCode = user.UnitCode;

                    //thêm vào cho pgdbaolam
                    newEntity.Tag = user.UnitCode;
                    //end thêm vào cho pgdbaolam

                    var record = db.EOffices.FirstOrDefault(s => s.SoKyHieu == newEntity.SoKyHieu && s.UnitCode.ToLower() == newEntity.UnitCode.ToLower() && s.Status != StatusEnum.Deleted);
                    if (record != null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Duplication,
                            Message = $"Văn bản với số ký hiệu {newEntity.SoKyHieu} đã tồn tại trong hệ thống!",
                            Result = newEntity
                        });
                    }

                    SaveFile(httpRequest.Files, newEntity);

                    db.EOffices.Add(newEntity);
                    db.SaveChanges();

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Message = "",
                        Result = newEntity
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.Fail,
                    Result = null,
                    Message = e.Message
                });
            }
        }

        [HttpPost]
        public IHttpActionResult Edit()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;

                if (!Guid.TryParse(httpRequest["Id"], out Guid id))
                {
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Fail,
                        Message = "Id không hợp lệ!",
                        Result = null
                    });
                }

                using (var db = new WebDbContext())
                {
                    var existingEntity = db.EOffices.FirstOrDefault(s => s.Id == id && s.Status != StatusEnum.Deleted);
                    if (existingEntity == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Văn bản không tồn tại hoặc đã bị xóa!",
                            Result = null
                        });
                    }

                    string ngayBanHanhStr = httpRequest["NgayBanHanh"] ?? "";
                    DateTime ngayBanHanh;
                    if (!DateTime.TryParse(ngayBanHanhStr, out ngayBanHanh))
                    {
                        ngayBanHanhStr = "";
                    }

                    DateTime? ngayPhatHanh = DateTime.TryParse(httpRequest["NgayPhatHanh"] ?? "", out var date)
                        ? date
                        : (DateTime?)null;

                    // Cập nhật thông tin văn bản
                    existingEntity.SoKyHieu = httpRequest["SoKyHieu"];
                    existingEntity.CongBaoSo = httpRequest["CongBaoSo"];
                    existingEntity.CoQuanBanHanh = httpRequest["CoQuanBanHanh"];
                    existingEntity.GhiChu = httpRequest["GhiChu"];
                    existingEntity.LinhVuc = httpRequest["LinhVuc"];
                    existingEntity.LoaiVanBan = httpRequest["LoaiVanBan"];
                    existingEntity.NgayBanHanh = ngayBanHanh;
                    existingEntity.NgayPhatHanh = ngayPhatHanh;
                    existingEntity.NguoiKy = httpRequest["NguoiKy"];
                    existingEntity.TrichYeu = httpRequest["TrichYeu"];

                    // Cập nhật thông tin người sửa
                    existingEntity.UpdateDate = DateTime.Now;
                    existingEntity.UpdateUserId = User.Identity.GetUserId();

                    //// Kiểm tra trùng số ký hiệu (trừ chính nó)
                    //var duplicateRecord = db.EOffices.FirstOrDefault(s =>
                    //    s.SoKyHieu == existingEntity.SoKyHieu &&
                    //    s.Id != existingEntity.Id &&
                    //    s.Status != StatusEnum.Deleted && s.UnitCode.ToLower() != existingEntity.UnitCode.ToLower());

                    //if (duplicateRecord != null)
                    //{
                    //    return Json(new ResultModel()
                    //    {
                    //        Code = ResultCode.Duplication,
                    //        Message = $"Văn bản với số ký hiệu {existingEntity.SoKyHieu} đã tồn tại trong hệ thống!",
                    //        Result = existingEntity
                    //    });
                    //}

                    // **Xử lý file đính kèm**
                    if (httpRequest.Files.Count > 0)
                    {
                        // Xóa file cũ nếu có
                        //DeleteOldFiles(existingEntity.DinhKemUrl);

                        // Lưu file mới
                        SaveFile(httpRequest.Files, existingEntity);
                    }

                    // Lưu thay đổi vào DB
                    db.SaveChanges();

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Message = "Cập nhật văn bản thành công!",
                        Result = existingEntity
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.Fail,
                    Message = e.Message,
                    Result = null
                });
            }
        }

        private List<AttachmentFiles> GetListAttachments(string url)
        {
            var path = $@"" + url;
            List<AttachmentFiles> attachments = new List<AttachmentFiles>();
            var fullPath = System.Web.HttpContext.Current.Request.MapPath(path);

            Uri myuri = new Uri(System.Web.HttpContext.Current.Request.Url.AbsoluteUri);
            string pathQuery = myuri.PathAndQuery;
            string hostName = myuri.ToString().Replace(pathQuery, "");

            if (Directory.Exists(fullPath))
            {
                DirectoryInfo d = new DirectoryInfo(fullPath); //Assuming Test is your Folder

                FileInfo[] Files = d.GetFiles(); //Getting Text files

                foreach (var file in Files)
                {
                    attachments.Add(new AttachmentFiles() { Name = file.Name, Path = hostName + url + "/" + file.Name });
                }

            }
            return attachments;
        }

        [HttpPost]
        public IHttpActionResult GetDetailDoc(EOfficeModel input)
        {
            try
            {
                using (var db = new WebDbContext())
                {
                    var cmd = db.Database.Connection.CreateCommand();

                    cmd.CommandText = "[dbo].[Portal_EOffice_GetDetailDoc]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_id", input.Id));
                    var connection = db.Database.Connection;

                    if (connection.State != ConnectionState.Open)
                        connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        EOfficeResult doc = ((IObjectContextAdapter)db).ObjectContext
                            .Translate<EOfficeResult>(reader)
                            .FirstOrDefault();

                        connection.Close();

                        if (doc != null)
                        {
                            List<AttachmentFiles> attachments = new List<AttachmentFiles>();
                            if (!string.IsNullOrEmpty(doc.DinhKemUrl))
                                attachments = GetListAttachments(doc.DinhKemUrl);

                            var rs = new EOfficeResult()
                            {
                                Id = doc.Id,
                                SoKyHieu = !string.IsNullOrEmpty(doc.SoKyHieu) ? doc.SoKyHieu : "",
                                NgayBanHanh = !string.IsNullOrEmpty(doc.NgayBanHanh) ? doc.NgayBanHanh : "",
                                NguoiKy = !string.IsNullOrEmpty(doc.NguoiKy) ? doc.NguoiKy : "",
                                TrichYeu = !string.IsNullOrEmpty(doc.TrichYeu) ? doc.TrichYeu : "",
                                CoQuanBanHanh = !string.IsNullOrEmpty(doc.CoQuanBanHanh) ? doc.CoQuanBanHanh : "",
                                LoaiVanBan = !string.IsNullOrEmpty(doc.LoaiVanBan) ? doc.LoaiVanBan : "",
                                LinhVuc = !string.IsNullOrEmpty(doc.LinhVuc) ? doc.LinhVuc : "",
                                CongBaoSo = !string.IsNullOrEmpty(doc.CongBaoSo) ? doc.CongBaoSo : "",
                                NgayPhatHanh = !string.IsNullOrEmpty(doc.NgayPhatHanh) ? doc.NgayPhatHanh : "",
                                HieuLuc = !string.IsNullOrEmpty(doc.HieuLuc) ? doc.HieuLuc : "",
                                GhiChu = !string.IsNullOrEmpty(doc.GhiChu) ? doc.GhiChu : "",
                                DinhKemUrl = !string.IsNullOrEmpty(doc.DinhKemUrl) ? doc.DinhKemUrl : "",
                                Attachments = attachments
                            };

                            return Json(new ResultModel
                            {
                                Code = ResultCode.Success,
                                Result = rs,
                            });
                        }

                        return Json(new ResultModel
                        {
                            Code = ResultCode.NotFoundData,
                            Result = null,
                        });

                    }
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Exception,
                    Message = e.Message + "\n" + e.StackTrace,
                    Result = null
                });
            }
        }

        //private void DeleteOldFiles(string filePath)
        //{
        //    if (!string.IsNullOrEmpty(filePath))
        //    {
        //        string absolutePath = HttpContext.Current.Server.MapPath(filePath);
        //        if (Directory.Exists(absolutePath))
        //        {
        //            string[] files = Directory.GetFiles(absolutePath);
        //            foreach (var file in files)
        //            {
        //                File.Delete(file);
        //            }

        //            // Xóa thư mục nếu rỗng
        //            Directory.Delete(absolutePath, true);
        //        }
        //    }
        //}

        [HttpPost]
        public IHttpActionResult DeleteFile()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                string filePath = httpRequest["filePath"];
                string fileName = httpRequest["fileName"];

                if (string.IsNullOrEmpty(filePath) || string.IsNullOrEmpty(fileName))
                {
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Fail,
                        Message = "Đường dẫn hoặc tên file không hợp lệ!",
                        Result = null
                    });
                }

                // Chuyển đổi đường dẫn thành tương đối
                string relativePath = filePath.Replace(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority), "");
                string absolutePath = HttpContext.Current.Server.MapPath(relativePath);

                //string fileToDelete = Path.Combine(absolutePath, fileName);

                if (File.Exists(absolutePath))
                {
                    File.Delete(absolutePath);
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Message = "Xóa file thành công!",
                        Result = fileName
                    });
                }
                else
                {
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.NotFoundData,
                        Message = "File không tồn tại!",
                        Result = null
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.Fail,
                    Message = e.Message,
                    Result = null
                });
            }
        }


        [HttpPost]
        public IHttpActionResult ChangeStatus(EOfficeModel item)
        {
            try
            {
                using (var db = new WebDbContext())
                {
                    var record = db.EOffices.FirstOrDefault(s => s.Id == item.Id && s.Status != item.Status);
                    if (record != null)
                    {
                        var oldModel = record.Clone();

                        record.Status = item.Status;
                        db.Entry(record).State = EntityState.Modified;
                        var result = db.SaveChanges();

                        var newModel = record.Clone();
                        HistoryDal.Write(User.Identity.GetUserId(), "EOffices", HistoryActionEnum.Edit, record.Id, oldModel, newModel, GetClientIp(), context: db);

                        return Json(new ResultModel()
                        {
                            Code = result > 0 ? ResultCode.Success : ResultCode.Fail,
                            Message = result > 0 ? ResultCode.Success.ToString() : ResultCode.Fail.ToString(),
                            Result = item
                        });
                    }
                }
                return Json(new ResultModel()
                {
                    Code = ResultCode.NotFoundData,
                    Message = ResultCode.NotFoundData.ToString(),
                    Result = item
                });
            }
            catch (Exception e)
            {
                return Json(new ResultModel()
                {
                    Code = ResultCode.Fail,
                    Result = null,
                    Message = e.Message
                });
            }
        }

        private void SaveFile(HttpFileCollection files, EOffice entity)
        {
            var documentId = DateTime.Now.ToFileTime().ToString();
            // Kiểm tra nếu entity đã có thư mục đính kèm
            string path = string.IsNullOrEmpty(entity.DinhKemUrl)
                ? $"/Files/Eoffice/{entity.UnitCode}/{documentId}"
                : entity.DinhKemUrl;  // Giữ nguyên thư mục cũ nếu có

            string absolutePath = HttpContext.Current.Server.MapPath(path);

            // Tạo thư mục nếu chưa tồn tại
            if (!Directory.Exists(absolutePath))
            {
                Directory.CreateDirectory(absolutePath);
            }

            entity.DinhKemUrl = path; // Cập nhật đường dẫn thư mục
            entity.DocumentId = documentId;

            for (int i = 0; i < files.Count; i++)
            {
                var postedFile = files[i];

                if (postedFile != null && postedFile.ContentLength > 0)
                {
                    string filePath = Path.Combine(absolutePath, postedFile.FileName);

                    // Nếu file đã tồn tại, thêm hậu tố tránh trùng tên
                    if (File.Exists(filePath))
                    {
                        string fileNameWithoutExt = Path.GetFileNameWithoutExtension(postedFile.FileName);
                        string extension = Path.GetExtension(postedFile.FileName);
                        string newFileName = $"{fileNameWithoutExt}_{DateTime.Now.Ticks}{extension}";
                        filePath = Path.Combine(absolutePath, newFileName);
                    }

                    postedFile.SaveAs(filePath);
                }
            }
        }

    }
}