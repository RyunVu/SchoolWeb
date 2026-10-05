using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Code;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Areas.Modules.Controllers
{
    public class PhongGDDT_SidebarController : Controller
    {
        public ActionResult ScrollingNews(string code)
        {
            var news = NewsDal.GetNews(code, 20, 1, Session, Request);
            return PartialView(news);
        }

        public ActionResult ScrollingVanBans(string code)
        {
            var news = EOfficeDal.GetEOffice(Session, Request, 20);
            return PartialView(news);
        }

        public ActionResult ScrollingVanBans1(string code)
        {
            var news = EOfficeDal.GetEOffice(Session, Request, 20);
            return PartialView(news);
        }

        public ActionResult GetNews(string code)
        {
            var news = NewsDal.GetNews(code, 50, 1, Session, Request);
            return PartialView(news);
        }

        public ActionResult Video1Sidebar(string code)
        {
            var news = NewsDal.GetNews(code, 50, 1, Session, Request);
            return PartialView(news);
        }

        public ActionResult WebsiteTrucThuoc(string code)
        {
            var news = NewsDal.GetNews(code, 20, 1, Session, Request);
            return PartialView(news);
        }

        public ActionResult GetNews_MenuDoc(string code)
        {
            var news = NewsDal.GetNews(code, 50, 1, Session, Request);
            return PartialView(news);
        }
        public ActionResult NewsHinh1Sidebar(string code)
        {
            var news = NewsDal.GetNews(code, 5, 1, Session, Request);

            return PartialView(news);
        }
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

        public ActionResult LinkSidebar(string code)
        {
            var news = NewsDal.GetNews(code, 20, 1, Session, Request);
            return PartialView(news);
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