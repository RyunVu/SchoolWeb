using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VNPT.Core.Extentions;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class TieuSu : BaseModel
    {
        public Guid Id { get; set; }
        public Guid LoaiChucVuId { get; set; }

        [MaxLength(500)]
        public string HoTen { get; set; }

        [MaxLength(200)]
        public string Alias { get; set; }
        public string BiDanh { get; set; }
        public DateTime? NgaySinh { get; set; }
        [MaxLength(500)]
        public string QueQuan { get; set; }

        [MaxLength(500)]
        public string NoiThuongTru { get; set; }

        public Guid DanTocId { get; set; }
        public Guid TonGiaoId { get; set; }

        public DateTime? NgayVaoDang { get; set; }

        public DateTime?  NgayChinhThuc { get; set; }

        [DataType(DataType.MultilineText)]
        public string KhenThuong { get; set; }
        [DataType(DataType.MultilineText)]
        public string TrinhDoLyLuanChinhTri { get; set; }
        [DataType(DataType.MultilineText)]
        public string TrinhDoChuyenMon { get; set; }
        [MaxLength(500)]
        public string SDT { get; set; }
        [MaxLength(500)]
        public string UrlAvt1 { get; set; }
        [MaxLength(500)]
        public string UrlAvt2 { get; set; }

        [DataType(DataType.MultilineText)]
        public string ChucVu { get; set; }
        public TieuSu Clone()
        {
            var result = this.CloneValue<TieuSu>();
            return result;
        }
    }
    public class QuaTrinhCongTac 
    {
        public Guid Id { get; set; }
        public Guid TieuSuId { get; set; }

        public DateTime? TuNgay { get; set; }

        public DateTime? DenNgay { get; set; }

        [Required]
        [DataType(DataType.MultilineText)]
        public string NoiDung { get; set; }
        public int ThuTu { get; set; }

        [MaxLength(1000)]
        public string TuNgayDenNgay { get; set; }
    }
    public class HinhAnhHoatDong 
    {
        public Guid Id { get; set; }
        public Guid TieuSuId { get; set; }
        [Required]
        [MaxLength(1000)]
        public string Url { get; set; }
        [MaxLength(1000)]
        public string ThumbUrl { get; set; }
        [MaxLength(1000)]
        public string TenHinh { get; set; }
        [DataType(DataType.MultilineText)]
        public string MoTa { get; set; }

        public int ThuTu { get; set; }
    }
    public class BaiPhatBieu : BaseModel
    {
        public Guid Id { get; set; }
        public Guid TieuSuId { get; set; }
        public DateTime? NgayDang { get; set; }
        [Required]
        [MaxLength(1000)]
        public string TieuDe { get; set; }
        [MaxLength(1000)]
        public string MoTaNgan { get; set; }
        [DataType(DataType.MultilineText)]
        public string NoiDung { get; set; }
        public long? CountView { get; set; }
        public int ThuTu { get; set; }
        public BaiPhatBieu Clone()
        {
            var result = this.CloneValue<BaiPhatBieu>();
            return result;
        }
    }
}
