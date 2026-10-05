using System.Linq;
using System.Web.Mvc;
using Newtonsoft.Json;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    public class HomeController : Controller
    {
        protected ActionResult Portal(PortalInformation information)
        {
            using (var context = new WebDbContext())
            {
                information.PortalCode = string.IsNullOrEmpty(information.PortalCode) ? "" : information.PortalCode;
                // Kiểm tra PortalCode, Nếu ko có thì lấy cổng mặc định
                var portal =
                    context.SysPortals.FirstOrDefault(s => s.UnitCode.ToLower() == information.PortalCode.ToLower());
                if (portal == null)
                {
                    portal = context.SysPortals.First();
                    information.PortalCode = portal.UnitCode;
                }

                information.PortalId = portal.Id;
                return View();
                //todo: viết store
                // Lấy Trang Home
                // SysSite siteHome;
                //if (string.IsNullOrEmpty(information.Site) || information.Site == "/" || information.Site == "home")
                //{
                //    // lấy trang chủ
                //    siteHome = portal.SysSites.FirstOrDefault(s => s.Id == portal.HomeSiteId);
                //    if (siteHome == null)
                //    {
                //        siteHome = portal.SysSites.FirstOrDefault(s => s.SiteUrl == "home");
                //        if (siteHome == null)
                //        {
                //            siteHome = portal.SysSites.First();
                //        }
                //    }
                //}
                //else
                //{
                //    siteHome = portal.GetSite(context, information.Site.ToLower(), true, 404);

                //    //if (siteHome == null)
                //    //{
                //    //    return Json(information,JsonRequestBehavior.AllowGet);
                //    //}
                //    // lấy trang con
                //    if ((!siteHome.IsSysSite.HasValue || !siteHome.IsSysSite.Value) &&
                //        !string.IsNullOrEmpty(information.SubSite))
                //    {

                //        var SubSite = information.SubSite.ToLower();

                //        siteHome = siteHome.SysSites.FirstOrDefault(s => s.Subdomain == SubSite);

                //        if (siteHome == null)
                //        {
                //            siteHome = portal.GetSysSite(404);
                //            return Redirect(Url.SiteNonSub(siteHome.Subdomain, infomation: information).ToString());
                //        }

                //    }
                //    //else if (siteHome.IS_SysSite.HasValue && siteHome.IS_SysSite.Value)
                //    //{
                //    //    // return Redirect(Url.SiteNonSub(siteHome.SUBDOMAIN).ToString());
                //    //}


                //}

                //// check login
                //if (siteHome.IsAuthorized && !User.Identity.IsAuthenticated)
                //{
                //    siteHome = portal.GetSysSite(401);
                //    return Redirect(Url.SiteNonSub(siteHome.Subdomain, information.Lang, information).ToString());
                //}
                //siteHome = siteHome.GetLangSite(information.Lang);
                //ViewBag.Title = siteHome.Name;
                //ViewBag.Description = siteHome.Description;
                //ViewBag.UnitCode = information.PortalCode;
                //ViewBag.CurrentSite = information.Site;
                //Session["PortalInformation"] = information;
                //Session["IsUserSubdomain"] = portal.IsUsedSubdomain;
                //ViewBag.PortalInformation = information;
                //ViewBag.Tag = portal.Tag ?? "";
                //ViewBag.Tag += "," + (siteHome.Tag ?? "");
                //ViewBag.Menus =
                //    portal.SysSites.Where(s => s.Code == MenuSiteCode && s.Status == StatusEnum.Used && s.IsFeatured && s.MenuEnabled && !s.ParentId.HasValue).OrderBy(s => s.MenuOrder).ToList().Select(s => new SysSite()
                //    {
                //        Name = s.Name,
                //        Subdomain = s.Subdomain,
                //        MenuEnabled = s.MenuEnabled,
                //        Logo = s.Logo,
                //        SysSites = s.SysSites.Where(childSite => childSite.Status == StatusEnum.Used && childSite.MenuEnabled && childSite.IsFeatured).OrderBy(sitechild => sitechild.MenuOrder).ToList().Select(sysSite => new SysSite()
                //        {
                //            Name = sysSite.Name,
                //            Subdomain = sysSite.Subdomain,
                //            MenuEnabled = sysSite.MenuEnabled,
                //            Logo = sysSite.Logo,
                //        }.SetLang(sysSite.SysSiteLangs.FirstOrDefault(lang => lang.LanguageId.ToLower() == information.Lang.ToLower()))).ToList()
                //    }.SetLang(s.SysSiteLangs.FirstOrDefault(lang => lang.LanguageId.ToLower() == information.Lang.ToLower()))).ToList();

                //// tạo ra link layout

                //ViewBag.Layout =
                //    $"~/Views/Shared/Portals/{portal.UnitCode}/Layouts/{siteHome.SysThemeLayout.SysTheme.Url}/_{siteHome.SysThemeLayout.Url}.cshtml";

                //var fileCs = $"Portals/{portal.UnitCode}/Sites/{siteHome.SiteUrl}";


                ////Language
                //if (information.Lang != null)
                //{
                //    try
                //    {
                //        Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(information.Lang);
                //        Thread.CurrentThread.CurrentUICulture = new CultureInfo(information.Lang);
                //        var cookie = new HttpCookie("Language") { Value = information.Lang };
                //        Response.Cookies.Add(cookie);
                //    }
                //    catch
                //    {
                //        Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(portal.DefaultLanguage);
                //        Thread.CurrentThread.CurrentUICulture = new CultureInfo(portal.DefaultLanguage);
                //        var cookie = new HttpCookie("Language") { Value = portal.DefaultLanguage };
                //        Response.Cookies.Add(cookie);
                //    }

                //}

                // query string

                var dict = Request.QueryString;
                ViewBag.QueryString = JsonConvert.SerializeObject(
                    dict.AllKeys.ToDictionary(k => k, k => dict[k])
                );

                //todo: lấy tham số
                // ViewBag.GoogleMapKey = SystemParameterDto.GetParameter("GOOGLE_KEY_API", null, information.PortalCode.ToUpper()).Value2;
                // ViewBag.GoogleAnalytics = SystemParameterDto.GetParameter("ANALYTICS", null, information.PortalCode.ToUpper()).Value2;
                //ViewBag.Analytic = SystemParameter.GetPortalValue("ANALYTIC", information.PortalCode.ToUpper()).PAR_VALUE2;

                //
                //return View(fileCs);
            }
        }

        protected ActionResult RedirectPortal(string site, string SubSite = "", string lang = "")
        {
            var information = Session["PortalInformation"] as PortalInformation ?? new PortalInformation
            {
                Site = site,
                Lang = lang,
                SubSite = SubSite
            };

            information.Site = string.IsNullOrEmpty(information.Site) ? site : information.Site;
            information.SubSite = string.IsNullOrEmpty(information.SubSite) ? SubSite : information.SubSite;
            information.Lang = string.IsNullOrEmpty(information.Lang) ? lang : information.Lang;
            return Portal(information);
        }
    }
}