using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using System.Threading.Tasks;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Code;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using PagedList;
using System.Data;
using System.Data.SqlClient;
using System.Data.Entity.Infrastructure;
using System;
using System.Web;
using System.Web.Http;
using System.IO;
using System.Net;
using VNPT.Web.Portal.Api.DTO;
using Newtonsoft.Json.Linq;
using System.Data.SqlTypes;
using VNPT.Web.Portal.Api.Helper;

namespace VNPT.Web.Portal.Api.Areas.Modules.Controllers
{
    public class EOfficeDocController : Controller
    {
        public JsonResult GetDocuments(EOfficeInput input)
        {
            var infomation = Session["PortalInformation"] as PortalInformation;

            DateTime? fromDate, toDate;

            if (input.FromDate == null)
                input.FromDate = SqlDateTime.MinValue.Value;
            if (input.ToDate == null)
                input.ToDate = DateTime.Now;

            string fromDateStr = input.FromDate.Value.ToLocalTime().ToString("dd/MM/yyyy");
            string toDateStr = input.ToDate.Value.ToLocalTime().ToString("dd/MM/yyyy") + " 23:59:59";

            fromDate = fromDateStr.ParseDate("dd/MM/yyyy");
            toDate = toDateStr.ParseDate("dd/MM/yyyy HH:mm:ss");
           
            if (infomation != null && !string.IsNullOrEmpty(infomation.PortalCode))
            {
                infomation.PortalCode = infomation.PortalCode.ToLower();

                using (var context = new WebDbContext())
                {
                    var cmd = context.Database.Connection.CreateCommand();

                    cmd.CommandText = "[dbo].[Portal_EOffice_GetDocuments]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_status", StatusEnum.Used));
                    cmd.Parameters.Add(new SqlParameter("@p_unitcode", infomation.PortalCode));
                    cmd.Parameters.Add(new SqlParameter("@p_sokyhieu", input.SoKyHieu));
                    cmd.Parameters.Add(new SqlParameter("@p_trichyeu", input.TrichYeu));
                    cmd.Parameters.Add(new SqlParameter("@p_loaivanban", input.LoaiVanBan));
                    cmd.Parameters.Add(new SqlParameter("@p_linhvuc", input.LinhVuc));
                    cmd.Parameters.Add(new SqlParameter("@p_tungay", fromDate));
                    cmd.Parameters.Add(new SqlParameter("@p_denngay", toDate));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", input.pageNum));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", input.pageSize));
                    var connection = context.Database.Connection;

                    if (connection.State != ConnectionState.Open)
                        connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        List<EOffice> listDocuments = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<EOffice>(reader)
                            .ToList();
                        reader.NextResult();

                        var total = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<int>(reader)
                            .FirstOrDefault();

                        connection.Close();

                        var lstDoc = listDocuments.Select(s => new
                        {
                            ID = s.Id,
                            SOKYHIEU = s.SoKyHieu,
                            NGAYBANHANH = s.NgayBanHanh.Date.ToString("MM/dd/yyyy"),
                            TRICHYEU = s.TrichYeu,
                            TOTALDOC = total
                        }).ToList();
                        return Json(lstDoc, JsonRequestBehavior.DenyGet);
                    }
                }
            }

            return null;
        }

        public JsonResult GetDocumentByTag(EOfficeInput input)
        {
            var infomation = Session["PortalInformation"] as PortalInformation;

            DateTime? fromDate, toDate;

            if (input.FromDate == null)
                input.FromDate = SqlDateTime.MinValue.Value;
            if (input.ToDate == null)
                input.ToDate = DateTime.Now;

            string fromDateStr = input.FromDate.Value.ToLocalTime().ToString("dd/MM/yyyy");
            string toDateStr = input.ToDate.Value.ToLocalTime().ToString("dd/MM/yyyy") + " 23:59:59";

            fromDate = fromDateStr.ParseDate("dd/MM/yyyy");
            toDate = toDateStr.ParseDate("dd/MM/yyyy HH:mm:ss");

            if (infomation != null && !string.IsNullOrEmpty(infomation.PortalCode))
            {
                infomation.PortalCode = infomation.PortalCode.ToLower();

                using (var context = new WebDbContext())
                {
                    var cmd = context.Database.Connection.CreateCommand();

                    cmd.CommandText = "[dbo].[Portal_EOffice_GetDocumentByTag]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_status", StatusEnum.Used));
                    cmd.Parameters.Add(new SqlParameter("@p_unitcode", infomation.PortalCode));
                    cmd.Parameters.Add(new SqlParameter("@p_sokyhieu", input.SoKyHieu));
                    cmd.Parameters.Add(new SqlParameter("@p_trichyeu", input.TrichYeu));
                    cmd.Parameters.Add(new SqlParameter("@p_coquanbanhanh", input.CoQuanBanHanh));
                    cmd.Parameters.Add(new SqlParameter("@p_loaivanban", input.LoaiVanBan));
                    cmd.Parameters.Add(new SqlParameter("@p_linhvuc", input.LinhVuc));
                    cmd.Parameters.Add(new SqlParameter("@p_tungay", fromDate));
                    cmd.Parameters.Add(new SqlParameter("@p_denngay", toDate));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", input.pageNum));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", input.pageSize));
                    cmd.Parameters.Add(new SqlParameter("@p_tag", input.Tag));
                    var connection = context.Database.Connection;

                    if (connection.State != ConnectionState.Open)
                        connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        List<EOffice> listDocuments = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<EOffice>(reader)
                            .ToList();
                        reader.NextResult();

                        var total = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<int>(reader)
                            .FirstOrDefault();

                        connection.Close();

                        var lstDoc = listDocuments.Select(s => new
                        {
                            ID = s.Id,
                            SOKYHIEU = s.SoKyHieu,
                            NGAYBANHANH = s.NgayBanHanh.Date.ToString("MM/dd/yyyy"),
                            TRICHYEU = s.TrichYeu,
                            TOTALDOC = total
                        }).ToList();
                        return Json(lstDoc, JsonRequestBehavior.DenyGet);
                    }
                }
            }

            return null;
        }

        public JsonResult GetDetailDoc(EOfficeInput input)
        {
            var infomation = Session["PortalInformation"] as PortalInformation;
            if (infomation != null && !string.IsNullOrEmpty(infomation.PortalCode))
            {
                using (var context = new WebDbContext())
                {
                    var cmd = context.Database.Connection.CreateCommand();

                    cmd.CommandText = "[dbo].[Portal_EOffice_GetDetailDoc]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_id", input.Id));
                    var connection = context.Database.Connection;

                    if (connection.State != ConnectionState.Open)
                        connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        EOfficeResult doc = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<EOfficeResult>(reader)
                            .FirstOrDefault();

                        connection.Close();

                        if(doc != null)
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
                            return Json(rs, JsonRequestBehavior.DenyGet);
                        }                        
                    }
                }                
            }
            return null;
        }
        public JsonResult GetListCategory(GeneralCategoryModel input)
        {
            using (var context = new WebDbContext())
            {
                var infomation = Session["PortalInformation"] as PortalInformation;
                var items = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == input.Code && s.UnitCode.ToLower() == infomation.PortalCode.ToLower());           
                items = items.OrderBy(s => s.OrderNo).ThenByDescending(s => s.UpdateDate).ThenByDescending(s => s.CreateDate);
                var lstCategory = items.Select(s => new
                {
                    ID = s.Id,
                    NAME = s.Name,
                    VALUE = s.Value
                }).ToList();
                return Json(lstCategory, JsonRequestBehavior.DenyGet);
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
    }
}