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
using System.Web.Http;
using VNPT.Core.Models;
using System.Globalization;
using System.Web;

namespace VNPT.Web.Portal.Api.Areas.Modules.Controllers
{
	public class SidebarController : Controller
	{
		public async Task<JsonResult> GetDetailDocument2(string maCongVan, string sodi, string code, string alias)
		{
			if (code != "null")
			{
				using (var context = new WebDbContext())
				{
					var detail = context.News.FirstOrDefault(s => s.Status == StatusEnum.Used
																&& s.Alias == alias
																&& s.Code.ToLower() == code.ToLower());
					if (detail != null)
					{
						var value = new
						{
							TEN_LOAI = context.GeneralCategories.FirstOrDefault(s => s.Id == detail.NewTypeId)?.Name,
							TRICH_YEU = detail.Title,
							//BUT_PHE = detail.GeoLocation,
							//SO_HIEU = detail.Header,
							//NGAY_DUYET = detail.StartDate.HasValue ? detail.StartDate.Value.ToString("dd/MM/yyyy") : "",
							//NGAY_BAN_HANH = detail.EndDate.HasValue ? detail.EndDate.Value.ToString("dd/MM/yyyy") : "",
							CONG_VAN = detail.Content,
						};

						List<object> item = new List<object>();
						item.Add(value);

						string json = new JavaScriptSerializer().Serialize(item);

						return Json(json, JsonRequestBehavior.DenyGet);

					}
					return null;
				}
			}
			else
			{
				using (var client = new HttpClient())
				{
					if (sodi == "null")
					{
						var response = await client.GetAsync("https://apiqlvb.dalat.vn/api/ioffice/GetDetailVanBanDenByMaCongVan?P_Ma_Van_Ban=" + maCongVan + "&P_token=b9ca32a193a5f7364ae5ae40b804a987");

						if (response.IsSuccessStatusCode)
						{
							var result = await response.Content.ReadAsAsync<object>();

							string value = result.ToString();

							return Json(value, JsonRequestBehavior.DenyGet);
						}
					}
					else
					{
						var response = await client.GetAsync("https://apiqlvb.dalat.vn/api/ioffice/GetDetailVanBanDiByMaCongVan?P_Ma_Van_Ban=" + maCongVan + "&P_token=b9ca32a193a5f7364ae5ae40b804a987");

						if (response.IsSuccessStatusCode)
						{
							var result = await response.Content.ReadAsAsync<object>();

							string value = result.ToString();

							return Json(value, JsonRequestBehavior.DenyGet);
						}
					}
				}
			}
			return null;
		}

        public ActionResult GetNewsNoti(string code)
        {
			using (var context = new WebDbContext())
			{
                var infomation = Session["PortalInformation"] as PortalInformation;

                infomation.PortalCode = infomation.PortalCode.ToLower();

                if (infomation != null)
                {
                    var news = context.News
                        .Where(s => s.Status == StatusEnum.Used
                                    && s.UnitCode.ToLower() == infomation.PortalCode
                                    && s.Code == code
                                    ).OrderByDescending(s => s.CreateDate).ToList();
                    return PartialView(news);
                }
                return null;
            }
        }

        public ActionResult GetNews(string code)
        {
            using (var context = new WebDbContext())
            {
                var infomation = Session["PortalInformation"] as PortalInformation;

                infomation.PortalCode = infomation.PortalCode.ToLower();

                if (infomation != null)
                {
                    var news = context.News
                        .Where(s => s.Status == StatusEnum.Used
                                    && s.UnitCode.ToLower() == infomation.PortalCode
                                    && s.Code == code
                                    ).OrderByDescending(s => s.CreateDate).ToList();
                    return PartialView(news);
                }
                return null;
            }
        }

        public ActionResult LinkSidebar()
		{
			using (var context = new WebDbContext())
			{
				var infomation = Session["PortalInformation"] as PortalInformation;

				infomation.PortalCode = infomation.PortalCode.ToLower();

				if (infomation != null)
				{
					var listLink = context.SystemParameters
						.Where(s => s.Status == StatusEnum.Used
									&& s.UnitCode.ToLower() == infomation.PortalCode
									&& s.Code == NewsCode.LINK_MENU
									).OrderBy(x => x.Id).ToList();
					return PartialView(listLink);
				}
				return null;
			}
		}

		public ActionResult UpdateSession(string lang)
		{
			try
			{
				using (var context = new WebDbContext())
				{
					var information = Session["PortalInformation"] as PortalInformation;

					if (information != null)
					{
						information.Lang = lang;

						try
						{
							Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(information.Lang);
							Thread.CurrentThread.CurrentUICulture = new CultureInfo(information.Lang);
							var cookie = new HttpCookie("Language_Portal") { Value = information.Lang };
							Response.Cookies.Add(cookie);
						}
						catch
						{
							
						}
					}

					return Json(new ResultModel()
					{
						Code = ResultCode.Success
					});
				}
			}
			catch (Exception e)
			{
				return Json(new ResultModel()
				{
					Code = ResultCode.UnSuccess,
					Message = e.Message
				});
			}
		}
	}
}