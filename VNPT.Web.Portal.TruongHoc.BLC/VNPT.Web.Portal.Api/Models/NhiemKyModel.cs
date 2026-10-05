using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Api.Models
{
    public class NhiemKyModel : PagingModel
    {
        public NhiemKyModel()
        {

        }
        public Guid? Id { get; set; }
        public Guid? ChucVuId { get; set; }
        public Guid? TieuSuId { get; set; }
        public Guid? ChucVuNhiemKyId { get; set; }
        public string Ten { get; set; }
        public string ThuTu { get; set; }
        public string ThuTuChucVuNhiemKy { get; set; }
        public string ThuTuCanBoChucVuNhiemKy { get; set; }
        public string TuNam { get; set; }
        public string DenNam { get; set; }
        public List<ChucVuNhiemKyModel> CVNKlst { get; set; }
        public List<CanBoChucVuNhiemKyModel> CBCVNKlst { get; set; }
        public string HinhAnh { get; set; }
        public string Code { get; set; }
        public Guid TypeId { get; set; }
    }
    public class ChucVuNhiemKyModel : PagingModel
    {
        public ChucVuNhiemKyModel()
        {

        }
        public Guid? Id { get; set; }
        public Guid? ChucVuId { get; set; }
        public Guid? NhiemKyId { get; set; }
        public string ThuTu { get; set; }
        public List<CanBoChucVuNhiemKyModel> CBCVNKlst { get; set; }
        public string Name { get; set; }
    }
    public class CanBoChucVuNhiemKyModel : PagingModel
    {
        public CanBoChucVuNhiemKyModel()
        {

        }
        public Guid? ChucVuNhiemKyId { get; set; }
        public Guid? TieuSuId { get; set; }
        public string ThuTu { get; set; }
        public string HoTen { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string QueQuan { get; set; }
        public string NoiThuongTru { get; set; }
        public string UrlAvt1 { get; set; }
    }
}