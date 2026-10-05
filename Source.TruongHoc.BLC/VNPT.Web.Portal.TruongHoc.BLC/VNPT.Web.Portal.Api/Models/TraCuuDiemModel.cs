using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class TraCuuDiemModel : PagingModel
    {
        public string STT { get; set; }
        public string Namhoc { get; set; }
        public string MaVnedu { get; set; }
        public string SoCCCD { get; set; }
        public string Hovaten { get; set; }
        public string Lop { get; set; }
        public string Ngaysinh { get; set; }

        public string ToanHKI { get; set; }
        public string LiHKI { get; set; }
        public string HoaHKI { get; set; }
        public string SinhHKI { get; set; }
        public string TinHKI { get; set; }
        public string VanHKI { get; set; }
        public string SuHKI { get; set; }
        public string DiaHKI { get; set; }
        public string GDKTPLHKI { get; set; }
        public string CongNgheHKI { get; set; }
        public string HDTNHKI { get; set; }
        public string KQHTHKI { get; set; }
        public string KQRLHKI { get; set; }
        public string VangHKI { get; set; }

        public string ToanHKII { get; set; }
        public string LiHKII { get; set; }
        public string HoaHKII { get; set; }
        public string SinhHKII { get; set; }
        public string TinHKII { get; set; }
        public string VanHKII { get; set; }
        public string SuHKII { get; set; }
        public string DiaHKII { get; set; }
        public string GDKTPLHKII { get; set; }
        public string CongNgheHKII { get; set; }
        public string HDTNHKII { get; set; }
        public string KQHTHKII { get; set; }
        public string KQRLHKII { get; set; }
        public string VangHKII { get; set; }

        public string ToanCN { get; set; }
        public string LiCN { get; set; }
        public string HoaCN { get; set; }
        public string SinhCN { get; set; }
        public string TinCN { get; set; }
        public string VanCN { get; set; }
        public string SuCN { get; set; }
        public string DiaCN { get; set; }
        public string GDKTPLCN { get; set; }
        public string CongNgheCN { get; set; }
        public string HDTNCN { get; set; }
        public string KQHTCN { get; set; }
        public string KQRLCN { get; set; }
        public string VangCN { get; set; }

        public string ToanTL { get; set; }
        public string LiTL { get; set; }
        public string HoaTL { get; set; }
        public string SinhTL { get; set; }
        public string TinTL { get; set; }
        public string VanTL { get; set; }
        public string SuTL { get; set; }
        public string DiaTL { get; set; }
        public string GDKTPLTL { get; set; }
        public string CongNgheTL { get; set; }
        public string HDTNTL { get; set; }

        public string DTBCN { get; set; }
        public string DANHHIEU { get; set; }
        public string LENLOP { get; set; }

        public TraCuuDiemModel()
        {

        }

        public TraCuuDiemModel(TraCuuDiem model)
        {
            using (var db = new WebDbContext())
            {
                MaVnedu = model.MaVnedu;
                SoCCCD = model.SoCCCD;
                Hovaten = model.Hovaten;
                Lop = model.Lop;
                Ngaysinh = model.Ngaysinh;

                ToanHKI = model.ToanHKI;
                ToanHKII = model.ToanHKII;
                ToanCN = model.ToanCN;
                ToanTL = model.ToanTL;

                LiHKI = model.LiHKI;
                LiHKII = model.LiHKII;
                LiCN = model.LiCN;
                LiTL = model.LiTL;

                HoaHKI = model.HoaHKI;
                HoaHKII = model.HoaHKII;
                HoaCN = model.HoaCN;
                HoaTL = model.HoaTL;

                SinhHKI = model.SinhHKI;
                SinhHKII = model.SinhHKII;
                SinhCN = model.SinhCN;
                SinhTL = model.SinhTL;

                SuHKI = model.SuHKI;
                SuHKII = model.SuHKII;
                SuCN = model.SuCN;
                SuTL = model.SuTL;

                DiaHKI = model.DiaHKI;
                DiaHKII = model.DiaHKII;
                DiaCN = model.DiaCN;
                DiaTL = model.DiaTL;

                TinHKI = model.TinHKI;
                TinHKII = model.TinHKII;
                TinCN = model.TinCN;
                TinTL = model.TinTL;

                VanHKI = model.VanHKI;
                VanHKII = model.VanHKII;
                VanCN = model.VanCN;
                VanTL = model.VanTL;

                GDKTPLHKI = model.GDKTPLHKI;
                GDKTPLHKII = model.GDKTPLHKII;
                GDKTPLCN = model.GDKTPLCN;
                GDKTPLTL = model.GDKTPLTL;

                HDTNHKI = model.HDTNHKI;
                HDTNHKII = model.HDTNHKII;
                HDTNCN = model.HDTNCN;
                HDTNTL = model.HDTNTL;

                KQHTHKI = model.KQHTHKI;
                KQHTHKII = model.KQHTHKII;
                KQHTCN = model.KQHTCN;

                KQRLHKI = model.KQRLHKI;
                KQRLHKII = model.KQRLHKII;
                KQRLCN = model.KQRLCN;

                CongNgheHKI = model.CongNgheHKI;
                CongNgheHKII = model.CongNgheHKII;
                CongNgheCN = model.CongNgheCN;
                CongNgheTL = model.CongNgheTL;

                DTBCN = model.DTBCN;

                VangHKI = model.VangHKI;
                VangHKII = model.VangHKII;
                VangCN = model.VangCN;

                Namhoc = model.Namhoc;
                DANHHIEU = model.DANHHIEU;
                LENLOP = model.LENLOP;
            }
        }
    }
}