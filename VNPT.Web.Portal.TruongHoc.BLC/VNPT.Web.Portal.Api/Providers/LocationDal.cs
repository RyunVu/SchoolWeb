using System;
using System.Linq;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Providers
{
    public class LocationInfo
    {
        public Guid? LocationProvinceId { get; set; }
        public Guid? LocationDistrictId { get; set; }
        public Guid? LocationWardId { get; set; }
    }
    public class LocationDal
    {
        public static LocationInfo District(string unitCode)
        {
            if (string.IsNullOrEmpty(unitCode))
            {
                return new LocationInfo();
            }
            using (var context = new WebDbContext())
            {
                var city = context.LocationDistricts.FirstOrDefault(s => s.UnitCode.ToLower() == unitCode.ToLower());
                if (city != null)
                {
                    var info = new LocationInfo();
                    info.LocationProvinceId = city.ParentId;
                    info.LocationDistrictId = city.Id;
                    return info;
                }
            }
            return new LocationInfo();
        }
        public static LocationInfo Ward(string unitCode, string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return new LocationInfo();
            }
            using (var context = new WebDbContext())
            {
                var city = context.LocationDistricts.FirstOrDefault(s => s.UnitCode.ToLower() == unitCode.ToLower());
                if (city != null)
                {
                    var info = new LocationInfo();
                    info.LocationProvinceId = city.ParentId;
                    info.LocationDistrictId = city.Id;
                    name = name.ToLower();
                    var ward = context.LocationWards.FirstOrDefault(s =>
                        s.Name.ToLower() == name || s.Name2.ToLower() == name || s.ShortName.ToLower() == name);
                    info.LocationWardId = ward?.Id;
                    return info;
                }
            }
            return new LocationInfo();
        }
    }


}