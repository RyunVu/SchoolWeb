using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class EOfficeModel : PagingModel
    {
        public Guid? Id { get; set; }
        public string SoKyHieu { get; set; }
        public DateTime NgayBanHanh { get; set; }
        public string NguoiKy { get; set; }
        public string TrichYeu { get; set; }
        public string CoQuanBanHanh { get; set; }
        public string LoaiVanBan { get; set; }
        public string LinhVuc { get; set; }
        public string CongBaoSo { get; set; }
        public DateTime? NgayPhatHanh { get; set; }
        public string HieuLuc { get; set; }
        public string GhiChu { get; set; }
        public string DinhKemUrl { get; set; }
        public string Tag { get; set; }
        public string Description { get; set; }
        public string StrCreateDate { get; set; }
        public DateTime? CreateDate { get; set; }
        public string CreateDateString => CreateDate.HasValue ? CreateDate.Value.ToString("dd/MM/yyyy HH:mm:ss") : "";
        public string CreateUserId { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string UpdateUserId { get; set; }
        public StatusEnum Status { get; set; }
        public string LanguageId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string UnitCode { get; set; }
        public EOfficeModel()
        {

        }      
        public EOfficeModel(EOffice eoffice)
        {
            Id = eoffice.Id;
            SoKyHieu = eoffice.SoKyHieu;
            NgayBanHanh = eoffice.NgayBanHanh;
            NguoiKy = eoffice.NguoiKy;
            TrichYeu = eoffice.TrichYeu;
            CoQuanBanHanh = eoffice.CoQuanBanHanh;
            LoaiVanBan = eoffice.LoaiVanBan;
            LinhVuc = eoffice.LinhVuc;
            CongBaoSo = eoffice.CongBaoSo;
            NgayPhatHanh = eoffice.NgayPhatHanh;
            HieuLuc = eoffice.HieuLuc;
            GhiChu = eoffice.GhiChu;
            DinhKemUrl = eoffice.DinhKemUrl;
            CreateDate = eoffice.CreateDate;
            CreateUserId = eoffice.CreateUserId;
            UpdateDate = eoffice.UpdateDate;
            Status = eoffice.Status;
            UnitCode = eoffice.UnitCode;
            LanguageId = eoffice.LanguageId;
        }
    }

    public class EOfficeInput
    {
        public Guid? Id { get; set; }
        public string SoKyHieu { get; set; }
        public string TrichYeu { get; set; }
        public string CoQuanBanHanh { get; set; }
        public string LoaiVanBan { get; set; }
        public string LinhVuc { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int pageNum { get; set; }
        public int pageSize { get; set; }
        public int number { get; set; }
        public int type { get; set; }
    }

    public class EOfficeResult
    {
        public Guid? Id { get; set; }
        public string SoKyHieu { get; set; }
        public string NgayBanHanh { get; set; }
        public string NguoiKy { get; set; }
        public string TrichYeu { get; set; }
        public string CoQuanBanHanh { get; set; }
        public string LoaiVanBan { get; set; }
        public string LinhVuc { get; set; }
        public string CongBaoSo { get; set; }
        public string NgayPhatHanh { get; set; }
        public string HieuLuc { get; set; }
        public string GhiChu { get; set; }
        public string DinhKemUrl { get; set; }
        public List<AttachmentFiles> Attachments { get; set; }
    }
    public class AttachmentFiles
    {
        public string Name { get; set; }
        public string Path { get; set; }
    }
}