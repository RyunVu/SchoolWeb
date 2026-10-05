using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class TieuSuModel : PagingModel
    {
        public TieuSuModel()
        {

        }
        public TieuSuModel(TieuSu s)
        {
            Id = s.Id;
            HoTen = s.HoTen;
            LoaiChucVuId = s.LoaiChucVuId;
            Alias = s.Alias;
            BiDanh = s.BiDanh;
            SDT = s.SDT;
            NgaySinh = s.NgaySinh;
            QueQuan = s.QueQuan;
            NoiThuongTru = s.NoiThuongTru;
            TonGiaoId = s.TonGiaoId;
            DanTocId = s.DanTocId;
            NgayVaoDang = s.NgayVaoDang;
            NgayChinhThuc = s.NgayChinhThuc;
            KhenThuong = s.KhenThuong;
            TrinhDoChuyenMon = s.TrinhDoChuyenMon;
            TrinhDoLyLuanChinhTri = s.TrinhDoLyLuanChinhTri;
            UrlAvt1 = s.UrlAvt1;
            UrlAvt2 = s.UrlAvt2;
            ChucVu = s.ChucVu;
        }
        public Guid? Id { get; set; }
        public Guid? LoaiChucVuId { get; set; }
        public string HoTen { get; set; }
        public string Alias { get; set; }
        public string BiDanh { get; set; }
        public string SDT { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string QueQuan { get; set; }
        public string NoiThuongTru { get; set; }
        public Guid? TonGiaoId { get; set; }
        public Guid? DanTocId { get; set; }
        public DateTime? NgayVaoDang { get; set; }
        public DateTime? NgayChinhThuc { get; set; }
        public string KhenThuong { get; set; }
        public string TrinhDoLyLuanChinhTri { get; set; }
        public string TrinhDoChuyenMon { get; set; }
        public QuaTrinhCongTacModel QTCT { get; set; }
        public List<QuaTrinhCongTacModel> QTCTlst { get; set; }
        public HinhAnhHoatDongModel HAHD { get; set; }
        public List<HinhAnhHoatDongModel> HAHDlst { get; set; }
        public BaiPhatBieuModel BPB { get; set; }
        public List<BaiPhatBieuModel> BPBlst { get; set; }
        public string NgaySinhString => NgaySinh?.ToString("dd/MM/yyyy");
        public string NgayVaoDangString => NgayVaoDang?.ToString("dd/MM/yyyy");
        public string NgayChinhThucString => NgayChinhThuc?.ToString("dd/MM/yyyy");
        public string NgaySinhSaveString { get; set; }
        public string NgayVaoDangSaveString { get; set; }
        public string NgayChinhThucSaveString { get; set; }
        public string TenChucVu { get; set; }
        public string UrlAvt1 { get; set; }
        public string UrlAvt2 { get; set; }
        public string Description { get; set; }
        public string TonGiao { get; set; }
        public string DanToc { get; set; }
        public string[] ChucVuLst { get; set; }
        public string[] KhenThuongLst { get; set; }
        public string CodeChucVu { get; set; }
        public NhiemKyModel NhiemKy { get; set; }
        public string ChucVu { get; set; }
    }

    public class QuaTrinhCongTacModel : PagingModel
    {
        public Guid? Id { get; set; }
        public Guid? TieuSuId { get; set; }
        public DateTime? TuNgay { get; set; }
        public DateTime? DenNgay { get; set; }
        public string ThuTu { get; set; }
        public string NoiDung { get; set; }
        public string TuNgayString => TuNgay?.ToString("MM/yyyy");
        public string DenNgayString => DenNgay?.ToString("MM/yyyy");
        public int ThuTuInt => int.TryParse(ThuTu, out int stt) ? int.Parse(ThuTu) : 0;
        public string TuNgaySaveString { get; set; }
        public string DenNgaySaveString { get; set; }
        public string TuNgayDenNgay { get; set; }
    }
    public class HinhAnhHoatDongModel : PagingModel
    {
        public Guid? Id { get; set; }
        public Guid? TieuSuId { get; set; }
        public string Url { get; set; }
        public string ThumbUrl { get; set; }
        public string TenHinh { get; set; }
        public string MoTa { get; set; }
    }
    public class BaiPhatBieuModel : PagingModel
    {
        public Guid? Id { get; set; }
        public Guid? TieuSuId { get; set; }
        public DateTime? NgayDang { get; set; }
        public string TieuDe { get; set; }
        public string MoTaNgan { get; set; }
        public string NoiDung { get; set; }
        public string NgayDangString => NgayDang?.ToString("dd/MM/yyyy");
        public string NgayDangSaveString { get; set; }
        public long? CountView { get; set; }
    }
}