using System.Linq;
using System.Web.Routing;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Api.Router;
using VNPT.Web.Portal.Base;
using System.Web.Mvc;

namespace VNPT.Web.Portal.Api.Helper
{
    public class ConfigRouter
    {
        public static void DefaultConfig(RouteCollection routes)
        {
            using (var context = new WebDbContext())
            {
                var portal = context.SysPortals.Where(s => s.Status != StatusEnum.Deleted);
                //var portal = DemoData.GetData();
                foreach (var sysPortal in portal)
                {
                    var sysPortalAliases = context.SysPortalAlias.Where(x => x.Status != StatusEnum.Deleted && x.PortalId == sysPortal.Id).ToList();

                    foreach (var sysPortalAlias in sysPortalAliases)
                    {
                        routes.Add($@"Portal_{sysPortal.Id}_{sysPortalAlias.Id}_home", new DomainRoute(
                            $"{sysPortalAlias.Domain}",
                            "",
                            new
                            {
                                site = "home",
                                isSubDomain = 1,
                                domain = sysPortalAlias.Domain,
                                controller = "Portals",
                                PortalCode = sysPortal.UnitCode,
                                action = "Index",
                                SubSite = UrlParameter.Optional,
                            },
                            new DashedRouteHandler()
                        ));

                        routes.Add($@"Portal_{sysPortal.Id}_{sysPortalAlias.Id}_site", new DomainRoute(
                            $"{sysPortalAlias.Domain}",
                            "{site}",
                            new
                            {
                                site = UrlParameter.Optional,
                                isSubDomain = 1,
                                domain = sysPortalAlias.Domain,
                                controller = "Portals",
                                PortalCode = sysPortal.UnitCode,
                                action = "Index",
                                SubSite = UrlParameter.Optional,
                            },
                            new DashedRouteHandler()
                        ));

                        routes.Add($@"Portal_{sysPortal.Id}_{sysPortalAlias.Id}_full", new DomainRoute(
                            $"{sysPortalAlias.Domain}",
                            "{site}/{SubSite}",
                            new
                            {
                                isSubDomain = 1,
                                domain = sysPortalAlias.Domain,
                                controller = "Portals",
                                PortalCode = sysPortal.UnitCode,
                                action = "Index",
                            },
                            new DashedRouteHandler()
                        ));

                        routes.Add($@"Portal_{sysPortal.Id}_{sysPortalAlias.Id}_full_2", new DomainRoute(
                            $"{sysPortalAlias.Domain}",
                            "{site}/{SubSite}/",
                            new
                            {
                                isSubDomain = 1,
                                domain = sysPortalAlias.Domain,
                                controller = "Portals",
                                PortalCode = sysPortal.UnitCode,
                                action = "Index",
                            },
                            new DashedRouteHandler()
                        ));
                        //site con

                        //routes.Add($@"Portal_{sysPortal.Id}_{sysPortalAlias.Id}_lang_site", new DomainRoute(
                        //    $"{{site}}.{sysPortalAlias.Domain}",
                        //    "",
                        //    new
                        //    {
                        //        site = UrlParameter.Optional,
                        //        isSubDomain = 1,
                        //        domain = sysPortalAlias.Domain,
                        //        controller = "Portals",
                        //        PortalCode = sysPortal.UnitCode,
                        //        action = "Index",
                        //        SubSite = UrlParameter.Optional,
                        //        lang = sysPortal.DefaultLanguage
                        //    },
                        //    new DashedRouteHandler()
                        //));

                        //routes.Add($@"Portal_{sysPortal.Id}_{sysPortalAlias.Id}_sitesub", new DomainRoute(
                        //    $"{{site}}.{sysPortalAlias.Domain}",
                        //    "{SubSite}",
                        //    new
                        //    {
                        //        isSubDomain = 1,
                        //        domain = sysPortalAlias.Domain,
                        //        controller = "Portals",
                        //        PortalCode = sysPortal.UnitCode,
                        //        action = "Index",
                        //        lang = sysPortal.DefaultLanguage
                        //    },
                        //    new DashedRouteHandler()
                        //));

                        //routes.Add($@"Portal_{sysPortal.Id}_{sysPortalAlias.Id}_sitesub_2", new DomainRoute(
                        //    $"{{site}}.{sysPortalAlias.Domain}",
                        //    "{SubSite}/",
                        //    new
                        //    {
                        //        isSubDomain = 1,
                        //        domain = sysPortalAlias.Domain,
                        //        controller = "Portals",
                        //        PortalCode = sysPortal.UnitCode,
                        //        action = "Index",
                        //        lang = sysPortal.DefaultLanguage
                        //    },
                        //    new DashedRouteHandler()
                        //));
                    }
                }

                routes.MapRoute(
                        "ModulePortal_Default",
                        "module/{controller}/{action}",
                        new
                        {
                            isSubDomain = 0,
                            controller = "Portals",
                            action = "Index",
                            site = UrlParameter.Optional,
                            lang = "vi"
                        }
                    );

                routes.MapRoute(
                    "Portal_Default_Login",
                    "login",
                    new
                    {
                        isSubDomain = 0,
                        controller = "Portals",
                        action = "Index",
                        PortalCode = UrlParameter.Optional,
                        site = "login",
                        SubSite = UrlParameter.Optional,
                        lang = "vi"
                    }
                );

                routes.MapRoute(
                    "Portal_Default",
                    "{PortalCode}/{site}/{SubSite}",
                    new
                    {
                        isSubDomain = 0,
                        controller = "Portals",
                        action = "Index",
                        PortalCode = UrlParameter.Optional,
                        site = UrlParameter.Optional,
                        SubSite = UrlParameter.Optional,
                        lang = "vi"
                    }
                );
            }
        }
    }
}