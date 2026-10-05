using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNPT.Web.Portal.Api.Models;

namespace VNPT.Web.Portal.Api.Controllers
{
	public class PortalsController : BaseController
    {
        // GET: Portals
        public ActionResult Index(PortalInformation infomation)
        {
            return Portal(infomation);
        }
    }
}