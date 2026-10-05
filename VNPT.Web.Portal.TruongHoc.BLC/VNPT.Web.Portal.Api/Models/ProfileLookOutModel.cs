using System.Collections.Generic;

namespace VNPT.Web.Portal.Api.Models
{
    public class ProfileLookOutModel
    {
        public string SoHoSo { get; set; }
        public string ThuTucThucHien { get; set; }
        public List<string> NguoiThucHien { get; set; }
        public string TinhTrangHoSo { get; set; }
        public string TenNguoiDaiDien { get; set; }
        public string BoPhanXuLy { get; set; }
        public string TenCoQuan { get; set; }
        public string MaDinhDanh { get; set; }
        public string TenLinhVuc { get; set; }
        public string TenThuTuc { get; set; }
        public string NgayTiepNhan { get; set; }
        public string NgayHenTra { get; set; }
        public string HinhThucNhanKetQua { get; set; }
        public string TaiGiayBienNhanKetQua{ get; set; }
        public string Title { get; set; }
        public string TenTrangThai { get; set; }

    }

    public class ProfileLookOutSearch
    {
        public string Type { get; set; }
        public string Text { get; set; }
        public string SoHoSo { get; set; }

        public string CMND { get; set; }
        public string TenNguoiNop { get; set; }
        public string General { get; set; }

        public bool UseForApp { get; set; }
        public string Keyword { get; set; }
        public int? PageIndex { get; set; }
        public int? PageSize { get; set; }
        public string UnitCode { get; set; }

        public bool? IsPagination { get; set; }

        public string ThuTucThucHien { get; set; }
        public List<string> NguoiThucHien { get; set; }
        public string TinhTrangHoSo { get; set; }
        public List<string> Ids { get; set; }
    }
}