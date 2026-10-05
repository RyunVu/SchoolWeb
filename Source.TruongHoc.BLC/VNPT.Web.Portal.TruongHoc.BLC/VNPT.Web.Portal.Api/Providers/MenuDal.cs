using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Providers
{
    public class MenuDal
    {
        public static List<SystemMenu> MenuDoc(PortalInformation info)
        {
            using (var context = new WebDbContext())
            {
                var menu = context.SystemMenus.Where(s =>
                    s.MenuCode == "PORTAL" && s.MenuPosition == 2 && s.Status == StatusEnum.Used && s.UnitCode.ToLower() == info.PortalCode.ToLower()).OrderBy(s=>s.SortNo).ToList();

                return menu;
            }
        }

        public static List<SystemMenu> MenuDocLeft(PortalInformation info)
        {
            using (var context = new WebDbContext())
            {
                var menu = context.SystemMenus.Where(s =>
                    s.MenuCode == "PORTAL" && s.MenuPosition == 22 && s.Status == StatusEnum.Used && s.UnitCode.ToLower() == info.PortalCode.ToLower()).OrderBy(s => s.SortNo).ToList();

                return menu;
            }
        }

        public static List<SystemMenu> MenuHome(PortalInformation info)
        {
            using (var context = new WebDbContext())
            {
                var menu = context.SystemMenus.Where(s =>
                    s.MenuCode == "PORTAL" && s.MenuPosition == 3 && s.Status == StatusEnum.Used && s.IsShowMenu == true && s.UnitCode.ToLower() == info.PortalCode.ToLower()).OrderBy(s => s.SortNo).ToList();

                return menu;
            }
        }
    }
}