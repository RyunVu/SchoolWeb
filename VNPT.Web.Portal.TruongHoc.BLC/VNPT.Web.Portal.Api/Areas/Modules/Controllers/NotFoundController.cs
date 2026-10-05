using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading;
using System.Web.Mvc;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Code;
using VNPT.Core.Constants;
using MenuCode = VNPT.Web.Portal.Api.Code.MenuCode;
using VNPT.Web.Portal.Api.DTO;
using System.Web.Script.Serialization;

namespace VNPT.Web.Portal.Api.Areas.Modules.Controllers
{
	public class NotFoundController : Controller
	{
		// GET: Error/Error
        public ActionResult Index()
        {
            return View();
        }
	}
}