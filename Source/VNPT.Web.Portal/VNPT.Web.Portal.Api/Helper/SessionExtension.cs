using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNPT.Web.Portal.Api.Models;

namespace VNPT.Web.Portal.Api.Helper
{
	public static class SessionExtension
    {
        public static PortalInformation GetInfomation(this UrlHelper urlHelper, string site = "", string lang = "vi", string SubSite = "")
        {
            var session = urlHelper.RequestContext.HttpContext.Session;
            var infomation = session["PortalInformation"] as PortalInformation;
            if (infomation == null || (infomation.IsSubDomain != 0 && infomation.IsEmpty()))
            {
                infomation = new PortalInformation(urlHelper.RequestContext.HttpContext.Request, site, lang, SubSite);
            }
            return infomation;
        }
    }
}