using System;
using System.Linq;
using System.Web;
using System.Web.Http;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Core.Web;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    public class MenuGuestController : BaseApiController
    {
        [HttpPost]
        public IHttpActionResult GetList(MenuInput input)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    input.MenuCode = "AppAnonymous";

                    var allmenus = context.SystemMenus
                        .Where(s =>  s.Status != StatusEnum.Deleted && (s.UnitCode == CurrentLocation || s.UnitCode == null || s.UnitCode == "LDG") &&
                                    s.MenuCode == input.MenuCode)
                        .OrderBy(m => m.SortNo).ToList()
                        .Select(s => new MenuModel(s)).ToList();
                    var result = RoleDal<MenuModel>.GroupByParent(allmenus);
                    //var menus = MenuModel.GetMenu(allmenus).ToList();
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        Message = ""
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Exception,
                    Message = ex.Message,
                    Result = null
                });
            }
        }


        [HttpPost]
        public IHttpActionResult GetApps(MenuInput input)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    input.MenuCode = "LinkApp";
                    var currentLocation = HttpContext.Current.Request.GetCurrentLocation();

                    var allmenus = context.SystemMenus
                        .Where(s =>  s.Status != StatusEnum.Deleted && s.UnitCode == currentLocation &&
                                    s.MenuCode == input.MenuCode)
                        .OrderBy(m => m.SortNo).ToList()
                        .Select(s => new MenuModel(s)).ToList();

                    var result = RoleDal<MenuModel>.GroupByParent(allmenus);
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        Message = ""
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Exception,
                    Message = ex.Message,
                    Result = null
                });
            }
        }

    }
}
