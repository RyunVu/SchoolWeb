using System.Linq;
using System.Web;
using System.Web.Http;
using VNPT.Core.Web;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    public class BaseApiController : ApiController
    {
        public string CurrentLocation { get; set; }
        public string CurrentUnitCode { get; set; }

        public BaseApiController()
        {
            CurrentLocation = HttpContext.Current.Request.GetCurrentLocation("");
            CurrentUnitCode = HttpContext.Current.Request.GetUnitCode("");
        }
        protected string GetClientIp()
        {
            var localIp = "";
            System.Web.HttpContext context = System.Web.HttpContext.Current;
            string ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipAddress))
            {
                string[] addresses = ipAddress.Split(',');
                if (addresses.Length != 0)
                {
                    localIp = addresses[0];
                }
            }
            else
            {
                localIp = context.Request.ServerVariables["REMOTE_ADDR"];
            }
            return localIp;
        }

        //public string addressIOC = "https://ioc.lamdongtructuyen.vn/hub";


        // ReSharper disable once InconsistentNaming
        protected string addressIOC
        {
            get
            {
                return GetAddressIOC("IOCURL", "https://ioc.lamdongtructuyen.vn/hub");
            }
        }

        string GetAddressIOC(string code, string urlIOC)
        {
            using (WebDbContext contex = new WebDbContext())
            {
                var param = contex.SystemParameters.FirstOrDefault(s => s.Code.ToLower() == code.ToLower());
                if (param == null)
                {
                    SystemParameterDal.SaveParameter(code, code, null, urlIOC);
                    return urlIOC;
                }
                else
                {
                    return param.Value2;
                }
            }
        }
    }
}
