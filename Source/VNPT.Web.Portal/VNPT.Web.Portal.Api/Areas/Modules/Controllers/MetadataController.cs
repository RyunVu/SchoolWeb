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
    public class MetadataController : Controller
    {
        public ActionResult Index(MetaData model)
        {
            using (var context = new WebDbContext())
            {
                 var infomation = Session["PortalInformation"] as PortalInformation;

                if (infomation == null)
                {
                    string domainName = HttpContext.Request.Url?.Host ?? "";
                    var portal = context.SysPortals.FirstOrDefault(s =>
                        s.Status == StatusEnum.Used);
                    if (portal != null)
                    {
                        infomation = new PortalInformation()
                        {
                            Lang = portal.DefaultLanguage,
                            PortalCode = portal.UnitCode
                        };
                        model.UnitCode = infomation.PortalCode;
                    }
                    else
                    {
                        return View(model);
                    }
                }

                model.UnitCode = infomation.PortalCode;
                var facebooks = SystemParameterDto.GetParameters("ThumbFacebook", model.UnitCode);
                model.ImageThumbFacebook = facebooks.FirstOrDefault(s => s.Id == "Url")?.Value2 ?? "";
                model.ImageThumbFacebookWidth = (int)(facebooks.FirstOrDefault(s => s.Id == "Width")?.Value ?? 0);
                model.ImageThumbFacebookHeigth = (int)(facebooks.FirstOrDefault(s => s.Id == "Heigth")?.Value ?? 0);
                model.Language = infomation.Lang;
                model.Robots = "index,follow";

                switch (model.Type)
                {
                    case MetaDataType.News:
                        model.Alias = Request["param"];
                        string alias = (model.Alias.StartsWith("0")) ? model.Alias.Substring(1) : model.Alias;
                        var news = context.News.FirstOrDefault(s => s.Status == StatusEnum.Used &&
                                                            s.UnitCode.ToLower() == infomation.PortalCode.ToLower() &&
                                                            s.Alias.ToLower() == alias.ToLower());
                        if (news != null)
                        {
                            model.Title = news.Title;
                            model.Keywords += "," + (news.Tag ?? "");
                            if (!string.IsNullOrEmpty(news.ImageUrl))
                            {
                                model.ImageThumbFacebook = news.ImageUrl;
                            }

                            else if (!string.IsNullOrEmpty(news.Content))
                            {
                                var linkA = new HtmlAgilityPack.HtmlDocument();
                                linkA.LoadHtml(news.Content);
                                var nodes = linkA.DocumentNode.SelectNodes("//*/text()");
                                var notes = "";
                                try
                                {
                                    foreach (var item in nodes.Select(s => s.InnerHtml.Trim()))
                                    {
                                        notes += item;
                                        notes += "\r\n";
                                    }
                                }
                                catch
                                {
                                }
                                model.Description = notes;
                            }
                            else
                            {
                                model.Description = news.Title;
                            }

                        }
                        break;
                    //case MetaDataType.Place:
                    //    var place = context.Places.FirstOrDefault(s => s.Status == StatusEnum.Used
                    //        && s.SysSite != null && s.SysSite.Subdomain != null && s.SysSite.Subdomain.ToLower() == infomation.Site.ToLower());
                    //    if (place != null)
                    //    {
                    //        place = place.SetLang(place.PlaceLangs.FirstOrDefault(j => j.LanguageId.ToLower() == infomation.Lang));
                    //        model.Title = place.Name;
                    //        model.Description = string.IsNullOrEmpty(place.Content) ? place.Name : place.Content;
                    //        model.Description = model.Description?.RemoveHtml().Replace(@"""", " ").GetWords(150) ?? "";
                    //        model.Keywords += "," + (place.Tag ?? "");
                    //        if (!string.IsNullOrEmpty(place.ImageUrl))
                    //        {
                    //            model.ImageThumbFacebook = place.ImageUrl;
                    //        }
                    //    }
                    //    break;
                    default:
                        model.Description = string.IsNullOrEmpty(model.Description) ? model.Title : model.Description;
                        return View(model);
                }
            }

            return View(model);
        }
    }
}