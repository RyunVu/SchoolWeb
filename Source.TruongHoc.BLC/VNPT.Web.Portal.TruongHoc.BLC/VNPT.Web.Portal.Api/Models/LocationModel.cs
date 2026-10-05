using Newtonsoft.Json;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class LocationModel : Location
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool? HasOtp { get; set; }
        public LocationModel()
        {

        }


        public LocationModel(Location location)
        {
            Name = location.Name;
            Name2 = location.Name2;
            Description = location.Description;
            GeoLocationCenter = location.GeoLocationCenter;
            IsPrimary = location.IsPrimary;
            Id = location.Id;
            UnitCode = location.UnitCode;
            ParentId = location.ParentId;
            CreateDate = location.CreateDate;
            ImportId = location.ImportId;
            if (location is LocationWard ward)
            {
                HasOtp = ward.HasOtp ?? false;
            }
        }

    }
}