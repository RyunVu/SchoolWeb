using FluentScheduler;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
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
            // Cấu hình theo đơn vị nằm trong Web.config (khi Publish được ghi đè bởi Web.{MÃ}_{Tên}.config)
            ValidateRegionConfig();
            MediaService.SetKey(
                ConfigurationManager.AppSettings["DomainMedia"],
                ConfigurationManager.AppSettings["MediaAppName"],
                ConfigurationManager.AppSettings["MediaKey"]);

            BundleConfig.RegisterBundles(BundleTable.Bundles);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            ConfigureScheduler();
        }

        /// <summary>
        /// Chặn lỗi build nhầm đơn vị: thiếu cấu hình hoặc Region không khớp với DB thì dừng ngay khi khởi động.
        /// </summary>
        private static void ValidateRegionConfig()
        {
            var region = (ConfigurationManager.AppSettings["Region"] ?? "").Trim();
            var missing = new[] { "Region", "DomainMedia", "MediaAppName", "MediaKey" }
                .Where(k => string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings[k]))
                .ToList();
            var connection = ConfigurationManager.ConnectionStrings["WebDbContext"];
            if (connection == null || string.IsNullOrWhiteSpace(connection.ConnectionString))
            {
                missing.Add("connectionStrings/WebDbContext");
            }
            if (missing.Count > 0)
            {
                throw new ConfigurationErrorsException("Web.config thiếu cấu hình đơn vị: " + string.Join(", ", missing));
            }

            // Tên DB của mọi đơn vị đều kết thúc bằng mã đơn vị, VD: VNPT.Web.TruongHoc.DLH
            var database = new SqlConnectionStringBuilder(connection.ConnectionString).InitialCatalog ?? "";
            if (!database.EndsWith("." + region, StringComparison.OrdinalIgnoreCase))
            {
                throw new ConfigurationErrorsException(
                    $"Cấu hình đơn vị không khớp: Region = \"{region}\" nhưng database = \"{database}\". " +
                    "Kiểm tra lại Web.config hoặc publish profile đã chọn.");
            }
        }

        // FluentScheduler 6: giữ tham chiếu để lịch không bị GC thu hồi
        private static Schedule _getNewsSchedule;

        public void ConfigureScheduler()
        {
            //new Schedule(() => new EOfficeJob().Execute(), run => run.Now().AndEvery(30).Minutes()).Start();
            _getNewsSchedule = new Schedule(() => new GetNewsJob().Execute(), run => run.Now().AndEvery(30).Minutes());
            _getNewsSchedule.Start();
            //new Schedule(() => new FixNewsJob().Execute(), run => run.Now().AndEvery(30).Minutes()).Start();
        }

        protected void Application_End()
        {
            _getNewsSchedule?.Stop();
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
