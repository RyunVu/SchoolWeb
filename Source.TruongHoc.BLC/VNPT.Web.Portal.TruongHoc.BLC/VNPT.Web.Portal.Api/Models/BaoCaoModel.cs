using System;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class BaoCaoModel
    {
        public string Year { get; set; }


        public BaoCaoModel()
        {

        }

        public BaoCaoModel(BaoCaoModel baocao)
        {
            Year = baocao.Year;
        }

    }
}