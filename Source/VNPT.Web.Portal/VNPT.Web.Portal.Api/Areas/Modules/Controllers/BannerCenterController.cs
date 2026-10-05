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
    public class BannerCenterController : Controller
    {       
        public ActionResult GetListBannerCenter(SystemParamsModel input)
        {
            using (var context = new WebDbContext())
            {
                var infomation = Session["PortalInformation"] as PortalInformation;

                infomation.PortalCode = infomation.PortalCode.ToLower();

                if (infomation != null)
                {
                    var id = input.Code + "_" + infomation.PortalCode.ToUpper();

                    var listLink = context.SystemParameters
                        .Where(s => s.Status == StatusEnum.Used
                                    && s.UnitCode.ToLower() == infomation.PortalCode
                                    && s.Id == id
                                    ).OrderBy(x => x.Id).ToList();
                    return PartialView(listLink);
                }
                return null;
            }
        }
    }
}