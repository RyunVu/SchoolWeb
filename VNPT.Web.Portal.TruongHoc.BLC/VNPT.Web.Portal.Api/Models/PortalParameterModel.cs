using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class PortalParameterModel
    {
        public PortalParameterModel()
        {

        }

        public PortalParameterModel(SystemParameter parameter)
        {
            Code = parameter.Code;
            Id = parameter.Id;
            Value = parameter.Value;
            Value2 = parameter.Value2;
            Value3 = parameter.Value3;
            Value4 = parameter.Value4;
            Value5 = parameter.Value5;
            Value6 = parameter.Value6;
            Value7 = parameter.Value7;
        }

        public string Code { get; set; }

        public string Id { get; set; }

        public string LanguageId { get; set; }


        public decimal? Value3 { get; set; }

        public decimal? Value { get; set; }

        public string Value2 { get; set; }

        public string Value4 { get; set; }
        public string Value6 { get; set; }
        public string Value7 { get; set; }


        public bool? Value5 { get; set; }
    }
}