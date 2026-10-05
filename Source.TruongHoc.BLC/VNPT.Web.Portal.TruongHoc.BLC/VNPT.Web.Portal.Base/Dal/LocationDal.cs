using System;
using System.Linq;

namespace VNPT.Web.Portal.Base.Dal
{
    public class LocationDal
    {
        public static LocationProvince Province(string unitCode = "LDG")
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var province =
                        context.LocationProvinces.FirstOrDefault(s => s.UnitCode.ToLower() == unitCode.ToLower());
                    return province;
                }
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
                return null;
            }
        }
        public static LocationDistrict District(string unitCode = "DLT")
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var province =
                        context.LocationDistricts.FirstOrDefault(s => s.UnitCode.ToLower() == unitCode.ToLower());
                    return province;
                }
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
                return null;
            }
        }
        public static LocationWard Ward(string name, string districtCode = "DLT")
        {
            try
            {
                if (string.IsNullOrEmpty(districtCode) || string.IsNullOrEmpty(name))
                {
                    return null;
                }
                using (var context = new WebDbContext())
                {
                    var wardName = name.Trim().ToLower();
                    var province =
                        context.LocationWards.FirstOrDefault(s => s.LocationDistrict.UnitCode.ToLower() == districtCode.ToLower() && 
                                                                  (s.Name.ToLower() == (wardName) || s.Name2.ToLower() == (wardName) || s.Tag.ToLower() == (wardName)));
                    return province;
                }
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
                return null;
            }
        }
        public static LocationStreet Street(Guid? wardId, string name)
        {
            try
            {
                if (string.IsNullOrEmpty(name) || wardId.HasValue)
                {
                    return null;
                }
                using (var context = new WebDbContext())
                {
                    var wardName = name.Trim().ToLower();
                    var province =
                        context.LocationStreets.FirstOrDefault(s => s.ParentId == wardId &&
                                                                  (s.Name.ToLower().Contains(wardName) || s.Name2.ToLower().Contains(wardName) || s.Tag.ToLower().Contains(wardName)));
                    return province;
                }
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
                return null;
            }
        }
    }
}
