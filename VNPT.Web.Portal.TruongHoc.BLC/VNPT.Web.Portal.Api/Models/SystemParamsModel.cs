using Newtonsoft.Json;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class SystemParamsModel : PagingModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Id { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Code { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? Value { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public decimal? Value3 { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Value2 { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Value4 { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Value6 { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Value7 { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool? Value5 { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Description { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public new string UnitCode { get; set; }
        public SystemParamsModel(SystemParameter ut)
        {
            Id = ut.Id;
            Code = ut.Code;
            Value = ut.Value;
            Value3 = ut.Value3;
            Value2 = ut.Value2;
            Value4 = ut.Value4;
            Value6 = ut.Value6;
            Value7 = ut.Value7;
            Value5 = ut.Value5;
            UnitCode = ut.UnitCode;
            Description = ut.Description;
        }

        public SystemParamsModel()
        {

        }


    }
}