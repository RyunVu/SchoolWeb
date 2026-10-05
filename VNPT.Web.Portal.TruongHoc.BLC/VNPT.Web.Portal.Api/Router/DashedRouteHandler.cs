using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace VNPT.Web.Portal.Api.Router
{
	public class DashedRouteHandler : MvcRouteHandler
    {
        protected override IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            //if (!string.IsNullOrEmpty(requestContext.RouteData.Values["SubSite"]?.ToString()))
            //    requestContext.RouteData.Values["SubSite"] =
            //        requestContext.RouteData.Values["SubSite"].ToString().Replace("-", "_");
            return base.GetHttpHandler(requestContext);
        }
    }
}