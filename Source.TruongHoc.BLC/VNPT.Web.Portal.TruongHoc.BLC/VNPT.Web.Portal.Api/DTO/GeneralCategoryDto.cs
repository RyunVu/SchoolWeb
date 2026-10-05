using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.DTO
{
    public class GeneralCategoryDto
    {
        public static GeneralCategory GetNameNewsType(string value, string unitCode = null)
        {
            value = string.IsNullOrEmpty(value) ? "" : value.TrimEnd('/');

            using (WebDbContext contex = new WebDbContext())
            {
                if(string.IsNullOrEmpty(unitCode))
                {
                    unitCode = "LDG";
                }

                if(value.Contains("."))
                {
                    value = value.Split('.')[0];
                }

                var generalCategory = contex.GeneralCategories.FirstOrDefault(s => s.Code == "NewsType" && s.Status != StatusEnum.Deleted && s.UnitCode == unitCode && s.Value == value);

                return generalCategory;
            }
        }
    }
}