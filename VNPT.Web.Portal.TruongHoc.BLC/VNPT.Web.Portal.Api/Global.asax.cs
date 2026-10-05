using FluentScheduler;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using VNPT.Core.Media.DAL;
using VNPT.Web.Portal.Api.Jobs;

namespace VNPT.Web.Portal.Api
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            string domainMedia = ConfigurationManager.AppSettings["DomainMedia"] + "";

            //Bảo Lộc
            //MediaService.SetKey(domainMedia, "TruongHocBLC", "7fe5923b8c994dfb8cdd0b671336e249");

            //Bảo Lâm
            //MediaService.SetKey(domainMedia, "TruongHocBLM", "a0c5a00898504d75bce75fdb7a0072a9");

            //Di Linh
            //MediaService.SetKey(domainMedia, "TruongHoc", "63fae18d931c49d4bd6885a229f8eaa4");

            //Đạ Huoai
            //MediaService.SetKey(domainMedia, "WebPX", "dzkrLHpniEoGtcLF4Kaa");

            //Lâm Hà | Đam Rông
            MediaService.SetKey(domainMedia, "VNPT.Web.Portal.TruongHoc.LHA", "3b6ec8be807743ee88281856077eb6af");

            //Đức Trọng
            //MediaService.SetKey(domainMedia, "VNPT.Web.Portal.TruongHoc.DTG", "098c4fdad1b24e28b54c0fe79ddc0873");

            //Đà Lạt
            //MediaService.SetKey(domainMedia, "Website.TruongHoc.DaLat", "8f26f588cc124aedb5ce01f0eaf66d7e");

            BundleConfig.RegisterBundles(BundleTable.Bundles);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            ConfigureScheduler();
        }

        public void ConfigureScheduler()
        {
            Registry registry = new Registry();
            //registry.Schedule<EOfficeJob>().ToRunNow().AndEvery(30).Minutes();
            registry.Schedule<GetNewsJob>().ToRunNow().AndEvery(30).Minutes();
            //registry.Schedule<FixNewsJob>().ToRunNow().AndEvery(30).Minutes();
            JobManager.Initialize(registry);
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies["Language"];
            System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("vi");
            System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo("vi");

            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
            {
                HttpContext.Current.Response.AddHeader("Cache-Control", "no-cache");
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, content-type, Accept,Authorization,Data-Type,UnitCode,UrlReferrer,CurrentLocation, CurrentPublicIp,DeviceId");
                HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");
                HttpContext.Current.Response.End();
            }
        }

        public class RefreshDetectFilter : ActionFilterAttribute, IActionFilter
		{
			public new void OnActionExecuting(ActionExecutingContext filterContext)
			{
				try
				{
					var cookie = filterContext.HttpContext.Request.Cookies["RefreshFilter"];
					filterContext.RouteData.Values["IsRefreshed"] = filterContext.HttpContext.Request.Url != null && (cookie != null &&
																													  cookie.Value == filterContext.HttpContext.Request.Url.ToString());
				}
				catch (Exception)
				{
					// ignored
				}
			}
			public new void OnActionExecuted(ActionExecutedContext filterContext)
			{
				try
				{
					if (filterContext.HttpContext.Request.Url != null)
						filterContext.HttpContext.Response.SetCookie(new HttpCookie("RefreshFilter", filterContext.HttpContext.Request.Url.ToString()));
				}
				catch (Exception)
				{
					// ignored
				}
			}
		}
    }
}
