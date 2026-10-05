using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.DTO
{
    public class SystemParameterDto
    {
        public static PortalParameterModel GetParameter(string code, string id = null, string unitCode = null)
        {
            using (WebDbContext contex = new WebDbContext())
            {
                if(string.IsNullOrEmpty(unitCode))
                {
                    unitCode = "LDG";
                }

                var param = contex.SystemParameters.Where(s => s.Code.ToLower() == code.ToLower() && s.Status != StatusEnum.Deleted && s.UnitCode == unitCode);

                if (!string.IsNullOrEmpty(id))
                {
                    if(unitCode != "LDG")
                    { 
                        id = id + "_" + unitCode;
                    }

                    param = param.Where(s => s.Id.ToLower() == id.ToLower());
                }

                var paramTemp = param.ToList();

                return paramTemp.Select(s => new PortalParameterModel(s)).FirstOrDefault() ?? new PortalParameterModel();
            }
        }

        public static List<PortalParameterModel> GetParameters(string code, string unitCode = null)
        {
            using (WebDbContext contex = new WebDbContext())
            {
                var param = contex.SystemParameters.Where(s => s.Code.ToLower() == code.ToLower() && s.Status != StatusEnum.Deleted && s.UnitCode == unitCode);

                return param.ToList().Select(s => new PortalParameterModel(s)).ToList();
            }
        }

        public static GeneralCategory GetParametersPtt(string code, string unitCode = null)
        {
            using (WebDbContext contex = new WebDbContext())
            {
                var param = contex.GeneralCategories.Where(s => s.Code.ToLower() == code.ToLower() && s.Status != StatusEnum.Deleted && s.UnitCode == unitCode);

                return param.FirstOrDefault();
            }
        }

        public static string Translate(string name)
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies["Language_Portal"];

            string lang = "vi";

            if (cookie != null)
            {
                lang = cookie.Value;
                // Use the cookie value as needed
            }

            if (lang != "vi")
            {
                switch (name)
                {
                    case "Tin tức mới nhất":
                        name = "Latest news";
                        break;

                    case "Hệ thống văn bản":
                        name = "Writing system";
                        break;

                    case "Liên kết website":
                        name = "Link to website";
                        break;

                    case "Thông báo":
                        name = "Notification";
                        break;

                    case "Sự kiện":
                        name = "Event";
                        break;

                    case "Tin hoạt động của xã":
                        name = "News of commune activities";
                        break;

                    case "Tin trong tỉnh":
                        name = "News in the province";
                        break;

                    case "Kế hoạch":
                        name = "Plan";
                        break;

                    case "Văn bản chỉ đạo, điều hành":
                        name = "Directive and administrative documents";
                        break;

                    case "Sổ tay khoa học kỹ thuật":
                        name = "Scientific and technical handbook";
                        break;

                    case "Chăn nuôi":
                        name = "Breed";
                        break;

                    case "Trồng trọt":
                        name = "Farming";
                        break;

                    case "Giá nông sản":
                        name = "Agricultural product prices";
                        break;

                    case "Văn bản chỉ đạo điều hành":
                        name = "Executive direction document";
                        break;

                    case "LIÊN HỆ":
                        name = "CONTACT";
                        break;

                    case "Địa chỉ":
                        name = "Address";
                        break;

                    case "Điện thoại":
                        name = "Phone";
                        break;

                    //
                    case "THÔNG BÁO, PHỔ BIẾN":
                        name = "ANNOUNCEMENT AND DISSEMINATION";
                        break;


                    default:
                        break;
                }
            }

            return name;
        }
    }
}