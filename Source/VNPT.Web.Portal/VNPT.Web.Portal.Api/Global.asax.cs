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

            // media || media2 || Cát tiên || Đạ Tẻh || Bảo Lâm || Đà Lạt || Lạc Dương
            MediaService.SetKey(domainMedia, "WebPX", "dzkrLHpniEoGtcLF4Kaa");

            // Đơn Dương
            //MediaService.SetKey(domainMedia, "WebPX", "46d41f1b8c2c4b9db2ed40b4d72990bd");

            // Đức Trọng
            //MediaService.SetKey(domainMedia, "WebPX", "fb72cd0bffb14ee0bd7ae62df3008018");

            // Bảo Lộc
            //MediaService.SetKey(domainMedia, "WebPhuongXaBLC", "24dd86b4b07942ffbbc41c4e9b118122");

            BundleConfig.RegisterBundles(BundleTable.Bundles);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            //Văn bản
            var env = ConfigurationManager.AppSettings["Environment"];

            if (env == "Prod")
            {
                string unitCode = ConfigurationManager.AppSettings["UnitCode"] + "";

                if (unitCode == "DTH" || unitCode == "CTN" || unitCode == "DLT")
                {
                    ConfigureScheduler();
                }
            }
        }

        public void ConfigureScheduler()
        {
            //Registry registry = new Registry();
            //registry.Schedule<EOfficeJob>().ToRunNow().AndEvery(30).Minutes();
            //JobManager.Initialize(registry);

            Registry registry = new Registry();
            registry.Schedule<EOfficeV2Job>().ToRunNow().AndEvery(5).Minutes();
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
