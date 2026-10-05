 using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;
using MenuCode = VNPT.Web.Portal.Api.Code.MenuCode;

namespace VNPT.Web.Portal.Api.Areas.Modules.Controllers
{
    public class NewsHomeController : Controller
    {
        [MvcApplication.RefreshDetectFilter]
        public ActionResult GetDetailNews(NewsInput input)
        {
            var infomation = Session["PortalInformation"] as PortalInformation;

            if (infomation != null && !string.IsNullOrEmpty(infomation.PortalCode))
            {
                infomation.PortalCode = infomation.PortalCode.ToLower();

                HttpCookie cookie = Request.Cookies["Language_Portal"];

                string lang = "vi";

                if (cookie != null)
                {
                    lang = cookie.Value;
                    // Use the cookie value as needed
                }

                using (var context = new WebDbContext())
                {
                    var cmd = context.Database.Connection.CreateCommand();

                    cmd.CommandText = "[dbo].[Portal_NewsHome_GetDetailNews]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_lang", lang));
                    cmd.Parameters.Add(new SqlParameter("@p_unitcode", infomation.PortalCode));
                    cmd.Parameters.Add(new SqlParameter("@p_alias", input.Param.ToLower()));
                    cmd.Parameters.Add(new SqlParameter("@p_isrefreshed", (bool)RouteData.Values["IsRefreshed"] == false ? 1 : 0));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", 1));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", 10));
                    var connection = context.Database.Connection;

                    if (connection.State != ConnectionState.Open)
                        connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        NewsModel news = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<NewsModel>(reader)
                            .FirstOrDefault();

                        reader.NextResult();

                        List<News> listNews = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<News>(reader)
                            .ToList();

                        connection.Close();

                        if (news == null)
                        {
                            news = new NewsModel();
                        }

                        var model = new NewsResult()
                        {
                            ListNews = listNews,
                            DetailNews = news
                        };
                        return PartialView(model);
                    }
                }
            }

            return null;
        }
        //todo: chưa chuyển store
        public ActionResult GetMenu()
        {
            using (var context = new WebDbContext())
            {
                var information = Session["PortalInformation"] as PortalInformation;

                if (information != null)
                {
                    information.PortalCode = information.PortalCode.ToLower();
                    HttpCookie cookie = Request.Cookies["Language_Portal"];

                    string lang = "vi";

                    if (cookie != null)
                    {
                        lang = cookie.Value;
                        // Use the cookie value as needed
                    }

                    var allmenus = context.SystemMenus
                    .Where(s => s.MenuCode == MenuCode.Portal.ToUpper()
                             && s.Status == StatusEnum.Used
                             && s.MenuPosition == 1
                             && s.IsShowMenu == true
                             && s.UnitCode.ToLower() == information.PortalCode)
                    .OrderBy(m => m.SortNo).ToList();

                    var temp = new List<MenuModel>();

                    foreach (var systemMenu in allmenus)
                    {
                        if (temp.All(s => systemMenu.Id.ToString() != s.Id))
                        {
                            if (lang != "vi")
                            {
                                systemMenu.Title = string.IsNullOrEmpty(systemMenu.Title_En) ? systemMenu.Title : systemMenu.Title_En;
                            }

                            var item = new MenuModel(systemMenu);

                            temp.Add(item);
                        }
                    }

                    var result = RoleDal<MenuModel>.GroupByParent(temp);

                    return PartialView("GetMenu", result);
                }
                return null;
            }
        }
        //todo: chưa chuyển store
        public ActionResult GetMenuDoc()
        {
            using (var context = new WebDbContext())
            {
                var information = Session["PortalInformation"] as PortalInformation;

                if (information != null)
                {
                    information.PortalCode = information.PortalCode.ToLower();
                    HttpCookie cookie = Request.Cookies["Language_Portal"];

                    string lang = "vi";

                    if (cookie != null)
                    {
                        lang = cookie.Value;
                        // Use the cookie value as needed
                    }

                    var allmenus = context.SystemMenus
                    .Where(s => s.MenuCode == MenuCode.Portal.ToUpper()
                             && s.Status == StatusEnum.Used
                             && s.Description == "2"
                             && s.IsShowMenu == true
                             && s.UnitCode.ToLower() == information.PortalCode)
                    .OrderBy(m => m.SortNo).ToList();

                    var temp = new List<MenuModel>();

                    foreach (var systemMenu in allmenus)
                    {
                        if (temp.All(s => systemMenu.Id.ToString() != s.Id))
                        {
                            if (lang != "vi")
                            {
                                systemMenu.Title = string.IsNullOrEmpty(systemMenu.Title_En) ? systemMenu.Title : systemMenu.Title_En;
                            }

                            var item = new MenuModel(systemMenu);

                            temp.Add(item);
                        }
                    }

                    var result = RoleDal<MenuModel>.GroupByParent(temp);

                    return PartialView("GetMenuDoc", result);
                }
                return null;
            }
        }

        public async Task<JsonResult> GetAudioUrl(News input)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var information = Session["PortalInformation"] as PortalInformation;
                    var news = context.News.FirstOrDefault(s => s.Id == input.Id
                                                                && s.Status == StatusEnum.Used
                                                                && s.UnitCode.ToLower() == information.PortalCode);
                    if (news != null)
                    {
                        if (!string.IsNullOrEmpty(news.AudioUrl))
                        {
                            var rs = new
                            {
                                Id = news.Id,
                                AudioUrl = news.AudioUrl
                            };
                            return Json(rs, JsonRequestBehavior.DenyGet);
                        }
                        else
                        {
                            using (var client = new HttpClient())
                            {
                                string newcontent = Regex.Replace(HttpUtility.HtmlDecode(Regex.Replace(news.Content, "<.*?>", String.Empty)), @"\t|\n|\r", "").Trim();
                                var model = new
                                {
                                    Token = "d7052ef6-efce-11ed-a05b-0242ac120003",
                                    Content = newcontent
                                };
                                client.BaseAddress = new Uri("https://lamdongtructuyen.vn/hub/");
                                client.DefaultRequestHeaders.Accept.Clear();
                                HttpContent content = new StringContent(JsonConvert.SerializeObject(model), Encoding.UTF8, "application/json");
                                //POST Method  
                                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                                var response = await client.PostAsync("api/client/texttospeech", content);
                                if (response.IsSuccessStatusCode)
                                {
                                    var result = await response.Content.ReadAsAsync<ResultModel>();
                                    news.AudioUrl = !string.IsNullOrEmpty(result.Result.ToString()) ? result.Result.ToString() : "";
                                    news.AudioCreateDate = DateTime.Now;
                                    context.Entry(news).State = EntityState.Modified;
                                    context.SaveChanges();
                                    var rs = new
                                    {
                                        Id = news.Id,
                                        AudioUrl = news.AudioUrl
                                    };
                                    return Json(rs, JsonRequestBehavior.DenyGet);
                                }
                            }
                        }
                    }
                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        public ActionResult ListMedia(string code)
        {
            var lstData = NewsDal.GetNews(code, 12, 1, Session, Request)?.ToList();
            return PartialView(lstData);
        }

        public ActionResult MainCarousel()
        {
            using (var context = new WebDbContext())
            {
                var bieuNgus =
                    context.SystemParameters.Where(s => s.Status != StatusEnum.Deleted && s.Code.ToLower() == "BieuNgu".ToLower()).ToList();
                ViewBag.BieuNguHeight = (int)(bieuNgus.FirstOrDefault(s => s.Id.Contains("ChieuCaoSlide_"))?.Value ?? 400);
                ViewBag.BieuNguBatTat = bieuNgus.FirstOrDefault(s => s.Id.Contains("BatTatBieuNgu_"))?.Value5 ?? false;
                var lstData = ViewBag.BieuNguBatTat == true ? NewsDal.GetNews("slide-main", 12, 1, Session, Request)?.ToList() : new List<News>();
                return PartialView(lstData);
            }
        }

        public ActionResult SubCarousel(string code)
        {
            using (var context = new WebDbContext())
            {
                var bieuNgus =
                    context.SystemParameters.Where(s => s.Status != StatusEnum.Deleted && s.Code.ToLower() == "SlideHinhAnh".ToLower()).ToList();
                ViewBag.BieuNguHeight = (int)(bieuNgus.FirstOrDefault(s => s.Id.Contains("ChieuCaoSlide_"))?.Value ?? 400);
                ViewBag.BieuNguBatTat = true;
                var lstData = ViewBag.BieuNguBatTat == true ? NewsDal.GetNews(code, 12, 1, Session, Request)?.ToList() : new List<News>();
                return PartialView("MainCarousel", lstData);
            }
        }

    }
}