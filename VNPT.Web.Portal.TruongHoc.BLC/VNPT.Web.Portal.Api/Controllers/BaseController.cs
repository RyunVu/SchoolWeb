using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Api.DTO;
using VNPT.Web.Portal.Api.Helper;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
	public class BaseController : Controller
	{
		public BaseController()
		{

		}

		protected ActionResult Portal(PortalInformation information)
		{
			string domainName = HttpContext.Request.Url?.Host ?? "";

			using (var context = new WebDbContext())
			{
				information.PortalCode = string.IsNullOrEmpty(information.PortalCode) ? "" : information.PortalCode;
				// Kiểm tra PortalCode, Nếu ko có thì lấy cổng mặc định
				var portal = context.SysPortals.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.UnitCode.ToLower() == information.PortalCode.ToLower());
				if (portal == null)
				{
					//portal = context.SysPortals.First(x => x.Status != StatusEnum.Deleted);
					//portal = context.SysPortals.First(x => x.UnitCode == "PHONGGDDT");
					//portal = context.SysPortals.First(x => x.UnitCode == "TTGDTXLD");
					//portal = context.SysPortals.First(x => x.UnitCode == "THCSHIEPTHANH");
					portal = context.SysPortals.First(x => x.UnitCode == "MGTANHOI");
					//portal = context.SysPortals.First(x => x.UnitCode == "THCSGIALAM");
					information.PortalCode = portal.UnitCode;
					//return Redirect("Modules/NotFound");
				}

                information.PortalId = portal.Id;

				// Lấy Trang Home
				SysSite siteHome;
                // return Json(information, JsonRequestBehavior.AllowGet);

                if (string.IsNullOrEmpty(information.Site) || information.Site == "/" || information.Site == "home")
				{
                    // Lấy trang chủ
                    siteHome = context.SysSites
                        .FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.PortalId == portal.Id && s.Id == portal.HomeSiteId);

                    if (siteHome == null)
                    {
                        siteHome = context.SysSites
                            .FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.PortalId == portal.Id && s.SiteUrl == "home");

                        if (siteHome == null)
                        {
                            siteHome = context.SysSites
                                .FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.PortalId == portal.Id);

                            if (siteHome == null)
                            {
                                // Tùy ý: log lỗi, redirect, hoặc xử lý fallback
                                throw new Exception($"Không tìm thấy site nào phù hợp với PortalId = {portal.Id}");
                            }
                        }
                    }
                }
				else
				{
					siteHome = portal.GetSite(context, information.Site.ToLower(), information.PortalCode.ToLower(), true, 404);

					if (siteHome != null)
					{
                        // lấy trang con
                        if ((!siteHome.IsSysSite.HasValue || !siteHome.IsSysSite.Value) &&
                            !string.IsNullOrEmpty(information.SubSite))
                        {
                            var SubSite = information.SubSite.ToLower();

                            siteHome = context.SysSites.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.ParentId == siteHome.Id && s.Subdomain == SubSite);

                            if (siteHome == null)
                            {
                                siteHome = portal.GetSysSite(context, information.PortalCode.ToLower(), 404);
                                return Redirect(Url.SiteNonSub(siteHome.Subdomain, information: information).ToString());
                            }
                        }
                    }
					else
					{
                        return Redirect("/Modules/NotFound");
                    }	
					
				}

				// check login
				if (siteHome.IsAuthorized && !User.Identity.IsAuthenticated)
				{
					siteHome = portal.GetSysSite(context, information.PortalCode.ToLower(), 401);
					return Redirect(Url.SiteNonSub(siteHome.Subdomain, information.Lang, information).ToString());
				}

				//siteHome = new SysSite();

				ViewBag.Title = siteHome.Name;
				ViewBag.Description = siteHome.Description;
				ViewBag.UnitCode = information.PortalCode;
				ViewBag.CurrentSite = information.Site;
				Session["PortalInformation"] = information;
				Session["IsUserSubdomain"] = portal.IsUsedSubdomain;
				ViewBag.PortalInformation = information;
				ViewBag.Tag = portal.Tag ?? "";
				ViewBag.Tag += "," + (siteHome.Tag ?? "");

				var cmd = context.Database.Connection.CreateCommand();

				cmd.CommandText = "[dbo].[Portal_Base_GetSysSite]";
				cmd.CommandType = CommandType.StoredProcedure;
				cmd.Parameters.Add(new SqlParameter("@p_code", information.PortalCode));
				cmd.Parameters.Add(new SqlParameter("@p_portalid", portal.Id));
				var connection = context.Database.Connection;

				if (connection.State != ConnectionState.Open)
					connection.Open();

				using (var reader = cmd.ExecuteReader())
				{
					List<SysSite> listSysSites = ((IObjectContextAdapter)context).ObjectContext
						.Translate<SysSite>(reader)
						.ToList();

					connection.Close();

					ViewBag.Menus = listSysSites.Where(s => !s.ParentId.HasValue).OrderBy(s => s.MenuOrder).ToList().Select(s => new
					{
						Name = s.Name,
						Subdomain = s.Subdomain,
						MenuEnabled = s.MenuEnabled,
						Logo = s.Logo,
						SysSites = listSysSites.Where(childSite => childSite.ParentId == s.Id).OrderBy(sitechild => sitechild.MenuOrder).ToList().Select(sysSite => new SysSite()
						{
							Name = sysSite.Name,
							Subdomain = sysSite.Subdomain,
							MenuEnabled = sysSite.MenuEnabled,
							Logo = sysSite.Logo,
						}).ToList()
					}).ToList();
				}

				// tạo ra link layout

				var sysThemeLayout = context.SysThemeLayout.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Id == siteHome.LayoutId);

				var sysTheme = context.SysThemes.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Id == sysThemeLayout.ThemeId);

				ViewBag.Layout =
					$"~/Views/Shared/Portals/Layouts/{sysTheme.Url}/_{sysThemeLayout.Url}.cshtml";

				var fileCs = $"Portals/{portal.UnitCode}/Sites/{siteHome.SiteUrl}";


				//Language
				if (information.Lang != null)
				{
					try
					{
						Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(information.Lang);
						Thread.CurrentThread.CurrentUICulture = new CultureInfo(information.Lang);
						var cookie = new HttpCookie("Language") { Value = information.Lang };
						Response.Cookies.Add(cookie);
					}
					catch
					{
						Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(portal.DefaultLanguage);
						Thread.CurrentThread.CurrentUICulture = new CultureInfo(portal.DefaultLanguage);
						var cookie = new HttpCookie("Language") { Value = portal.DefaultLanguage };
						Response.Cookies.Add(cookie);
					}

				}

				// query string

				var dict = Request.QueryString;
				ViewBag.QueryString = JsonConvert.SerializeObject(
					dict.AllKeys.ToDictionary(k => k, k => dict[k])
				);

				ViewBag.GoogleMapKey = SystemParameterDto.GetParameter("GOOGLE_KEY_API", null, information.PortalCode.ToUpper()).Value2;

				ViewBag.GoogleAnalytics = SystemParameterDto.GetParameter("ANALYTICS", null, information.PortalCode.ToUpper()).Value2;

				return View(fileCs);
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