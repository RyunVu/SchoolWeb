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

namespace VNPT.Web.Portal.Api.Areas.Modules.Controllers
{
    public class FooterController : Controller
    {
        public ActionResult GetFooter()
		{
			using (var context = new WebDbContext())
			{
				var infomation = Session["PortalInformation"] as PortalInformation;

				if (infomation != null)
				{
					var linkFb = SystemParameterDto.GetParameter("FOOTER", "LINK_FACEBOOK", infomation.PortalCode.ToUpper()).Value2;
					var name = SystemParameterDto.GetParameter("FOOTER", "NAME", infomation.PortalCode.ToUpper()).Value2;
					var address = SystemParameterDto.GetParameter("FOOTER", "ADDRESS", infomation.PortalCode.ToUpper()).Value2;
					var phone = SystemParameterDto.GetParameter("FOOTER", "PHONE", infomation.PortalCode.ToUpper()).Value2;
					var email = SystemParameterDto.GetParameter("FOOTER", "EMAIL", infomation.PortalCode.ToUpper()).Value2;
					var license = SystemParameterDto.GetParameter("FOOTER", "LICENSE", infomation.PortalCode.ToUpper()).Value2;
					var description1 = SystemParameterDto.GetParameter("FOOTER", "DESCRIPTION_1", infomation.PortalCode.ToUpper()).Value2;
					var description2 = SystemParameterDto.GetParameter("FOOTER", "DESCRIPTION_2", infomation.PortalCode.ToUpper()).Value2;
					var description3 = SystemParameterDto.GetParameter("FOOTER", "DESCRIPTION_3", infomation.PortalCode.ToUpper()).Value2;

					ViewBag.linkFb = linkFb;
					ViewBag.name = name;
					ViewBag.address = address;
					ViewBag.phone = phone;
					ViewBag.email = email;
					ViewBag.license = license;
					ViewBag.description1 = description1;
					ViewBag.description2 = description2;
					ViewBag.description3 = description3;

					return PartialView();
				}
				return null;
			}
		}


    }
}