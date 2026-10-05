using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Code;
using VNPT.Core.Constants;
using MenuCode = VNPT.Web.Portal.Api.Code.MenuCode;
using VNPT.Web.Portal.Api.Providers;
using System.Web;
using System.Data;
using System.Data.Entity.Core.Common.CommandTrees.ExpressionBuilder;
using System.Web.UI.WebControls;

namespace VNPT.Web.Portal.Api.Areas.Modules.Controllers
{
    public class PhongTruyenThongController : Controller
    {
        public ActionResult DanhSachBaiVietPtt(NewsInput input)
        {
            var listIntro = NewsDal.GetNews(input.Code, 100, 1, Session, Request)?.ToList();

            if (listIntro.Count > 0)
            {
                return PartialView(listIntro);
            }
            return null;
        }

        public ActionResult PhongTruyenThongPage(NewsInput input) 
        {
            using (var context = new WebDbContext())
            {
                if(input.Code == null)
                {
                    input.Code = NewsCode.INTROPHONGTRUYENTHONG;
                }
                
                if (input.Code == NewsCode.INTROPHONGTRUYENTHONG)
                {
                    var listIntro = NewsDal.GetNews(input.Code, input.number, 1, Session, Request)?.ToList();

                    if (listIntro.Count > 0)
                    {
                        HomeSliderNewModel newsIntro = new HomeSliderNewModel
                        {
                            Description = listIntro.FirstOrDefault().Description,
                        };
                    
                        return PartialView("IntroHinhAnhPtt", newsIntro);
                    }
                }
                else if (input.Code == NewsCode.HOMEPHONGTRUYENTHONG)
                {

                    var listTrangChu = GetMenuPhongTruyenThong();

                    if (listTrangChu.Count > 0)
                    {
                        return PartialView("HomePtt", listTrangChu);
                    }
                }
                return null;
            }
        }

        public List<MenuModel> GetMenuPhongTruyenThong()
        {
            using (var context = new WebDbContext())
            {
                var information = Session["PortalInformation"] as PortalInformation;

                if (information != null)
                {
                    information.PortalCode = information.PortalCode.ToLower();
                    HttpCookie cookie = Request.Cookies["Language_Portal"];

                    string lang = "vi";

                    if (cookie != null)
                    {
                        lang = cookie.Value;
                        // Use the cookie value as needed
                    }

                    var allmenus = context.SystemMenus
                    .Where(s => s.MenuCode == MenuCode.Portal.ToUpper()
                             && s.Status == StatusEnum.Used
                             && s.MenuPosition == 5
                             && s.IsShowMenu == true
                             && s.UnitCode.ToLower() == information.PortalCode)
                    .OrderBy(m => m.SortNo).ToList();

                    var temp = new List<MenuModel>();

                    foreach (var systemMenu in allmenus)
                    {
                        if (temp.All(s => systemMenu.Id.ToString() != s.Id))
                        {
                            if (lang != "vi")
                            {
                                systemMenu.Title = string.IsNullOrEmpty(systemMenu.Title_En) ? systemMenu.Title : systemMenu.Title_En;
                            }

                            var item = new MenuModel(systemMenu);

                            temp.Add(item);
                        }
                    }

                    var result = RoleDal<MenuModel>.GroupByParent(temp);

                    return result;
                }
                return null;
            }
        }


        [MvcApplication.RefreshDetectFilter]
        public ActionResult ChiTietBaiVietPtt(NewsInput input)
        {
            var infomation = Session["PortalInformation"] as PortalInformation;

            if (infomation != null && !string.IsNullOrEmpty(infomation.PortalCode))
            {
                infomation.PortalCode = infomation.PortalCode.ToLower();

                HttpCookie cookie = Request.Cookies["Language_Portal"];

                string lang = "vi";

                if (cookie != null)
                {
                    lang = cookie.Value;
                    // Use the cookie value as needed
                }

                using (var context = new WebDbContext())
                {
                    Guid paramGuid;
                    if (Guid.TryParse(input.Param, out paramGuid))
                    {
                        var baiPhatBieu = context.BaiPhatBieus.FirstOrDefault(s => s.Id == paramGuid && s.Status == StatusEnum.Used && s.UnitCode.ToLower() == infomation.PortalCode.ToLower());
                        News newtemp = new News()
                        {
                            Title = baiPhatBieu.TieuDe,
                            Content = baiPhatBieu.NoiDung,
                            CountView = baiPhatBieu.CountView,
                            CreateDate = baiPhatBieu.CreateDate
                        };

                        var model = new NewsResult2()
                        {
                            ListNews = new List<News>(),
                            DetailNews = newtemp
                        };
                        return PartialView(model);
                    }
                    else
                    {
                        News news = context.News.FirstOrDefault(s => s.Alias == input.Param && s.Status == StatusEnum.Used && s.UnitCode.ToLower() == infomation.PortalCode.ToLower());
                        List<News> listNews = new List<News>();
                        if (news != null)
                        {
                            listNews = context.News.Where(s => s.Id != news.Id
                            && s.Code == input.Code
                            && s.Status == StatusEnum.Used && s.UnitCode.ToLower() == infomation.PortalCode.ToLower()).ToList();
                        }

                        var model = new NewsResult2()
                        {
                            ListNews = listNews,
                            DetailNews = news
                        };
                        return PartialView(model);
                    }
                    
                }
            }

            return null;
        }

    }
}