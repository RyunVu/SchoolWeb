using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using VNPT.Core.Extentions;
using VNPT.Web.Portal.Api.Models;

namespace VNPT.Web.Portal.Api.Helper
{
	public static class UrlHelperExtension
    {
        /// <summary>
        /// Author: Khoa
        /// 
        /// </summary>
        /// <param name="urlHelper"></param>
        /// <param name="siteDomain">Tên site</param>
        /// <param name="parameter">Tham số truyền vào</param>
        /// <param name="lang">ngôn ngữ, ko truyền vào sẽ lấy ngôn ngữ mặc định</param>
        /// <param name="SubSites">danh sách site con của site</param>
        /// <param name="isUseQueryString">danh sách site con của site</param>
        /// <returns></returns>
        public static HtmlString Site(this UrlHelper urlHelper, string siteDomain = "", string lang = "", bool isUseQueryString = false, object parameter = null, params string[] SubSites)
        {
            var session = urlHelper.RequestContext.HttpContext.Session;
            var protocol = urlHelper.RequestContext.HttpContext.Request.Url?.Scheme ?? "http";

            var SubSite = string.Join("-", SubSites);
            SubSite = string.IsNullOrEmpty(SubSite) ? "/" : "/" + SubSite;

            var information = urlHelper.GetInfomation(siteDomain, lang, SubSite);
            information.Lang = string.IsNullOrEmpty(lang) ? Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName : lang;
            var url = "";

            var isUserSubdomain = (bool?)session["IsUserSubdomain"] ?? false;

            if (information.IsSubDomain != 0 && !isUserSubdomain)
            {
                information.IsSubDomain = -1;
            }

            switch (information.IsSubDomain)
            {
                case -1:
                    siteDomain = string.IsNullOrEmpty(siteDomain) ? "/" + information.Site : "/" + siteDomain;
                    url = $"{information.Domain}/{siteDomain}{SubSite}";
                    url = url.Replace("//", "/");
                    url = $"{protocol}://{url}";
                    break;
                case 0:
                    siteDomain = string.IsNullOrEmpty(siteDomain) ? "/" + information.Site : siteDomain;
                    url = $"/{information.PortalCode}/{siteDomain}{SubSite}";
                    break;
                case 1:
                    siteDomain = string.IsNullOrEmpty(siteDomain) ? information.Site : siteDomain;
                    url = $"{siteDomain}.{information.Domain}/{SubSite}";
                    url = url.Replace("//", "/");
                    url = $"{protocol}://{url}";
                    break;
            }
            if (parameter != null)
            {
                url += urlHelper.GetParameter(parameter);
            }
            else
            {
                var queryString = urlHelper.RequestContext.HttpContext.Request.QueryString.ToString();
                if (!string.IsNullOrEmpty(queryString) && isUseQueryString)
                {
                    url += "?" + queryString;
                    // url = url.Replace("/?", "?");
                }
            }

            return new HtmlString(url.ToLower());
        }

        /// <summary>
        /// Author: Khoa
        /// 
        /// </summary>
        /// <param name="urlHelper"></param>
        /// <param name="siteDomain">Tên site</param>
        /// <param name="parameter">Tham số truyền vào</param>
        /// <param name="lang">ngôn ngữ, ko truyền vào sẽ lấy ngôn ngữ mặc định</param>
        /// <param name="SubSites">danh sách site con của site</param>
        /// <param name="information"></param>
        /// <param name="isUseQueryString">danh sách site con của site</param>
        /// <returns></returns>
        public static HtmlString SiteNonSub(this UrlHelper urlHelper, string siteDomain = "", string lang = "", PortalInformation information = null, bool isUseQueryString = false, object parameter = null, params string[] SubSites)
        {
            var session = urlHelper.RequestContext.HttpContext.Session;
            var protocol = urlHelper.RequestContext.HttpContext.Request.Url?.Scheme ?? "http";

            information = information ?? (session["PortalInformation"] as PortalInformation ?? new PortalInformation());
            information.Lang = string.IsNullOrEmpty(lang) ? Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName : lang;
            string url;
            var SubSite = string.Join("-", SubSites);
            SubSite = string.IsNullOrEmpty(SubSite) ? "/" : "/" + SubSite;

            var isUserSubdomain = (bool?)session["IsUserSubdomain"] ?? false;

            if (information.IsSubDomain != 0 && !isUserSubdomain)
            {
                information.IsSubDomain = -1;
            }

            switch (information.IsSubDomain)
            {

                case 0:
                    siteDomain = string.IsNullOrEmpty(siteDomain) ? "/" + information.Site : "/" + siteDomain;
                    url = $"/{information.PortalCode}/{information.Lang}{siteDomain}{SubSite}";
                    break;
                default:
                    siteDomain = string.IsNullOrEmpty(siteDomain) ? "/" + information.Site : "/" + siteDomain;
                    url = $"{protocol}://{information.Domain}/{information.Lang}{siteDomain}{SubSite}";
                    break;
            }
            if (parameter != null)
            {
                url += urlHelper.GetParameter(parameter);
            }
            else
            {
                var queryString = urlHelper.RequestContext.HttpContext.Request.QueryString.ToString();
                if (!string.IsNullOrEmpty(queryString) && isUseQueryString)
                {
                    url += "?" + queryString;
                    // url = url.Replace("/?", "?");
                }
            }
            return new HtmlString(url);
        }


        public static string GetParameter(this UrlHelper urlHelper, object parameter)
        {
            var server = urlHelper.RequestContext.HttpContext.Server;
            var query = "?";
            var param = new List<string>();
            var propTInfos = parameter.GetType().GetProperties().ToList();
            foreach (var propertyInfo in propTInfos)
            {
                var val = propertyInfo.GetValue(parameter);
                if (val != null)
                    param.Add($"{propertyInfo.Name}={server.UrlEncode(val.ToString())}");
            }


            query += string.Join("&", param);
            //query = server.UrlEncode(query);
            return query;
        }

        public static HtmlString Image(this UrlHelper urlHelper, string src)
        {
            if (string.IsNullOrEmpty(src))
                return new HtmlString("");
            var url = src;
            Uri uriResult;
            string domainMedia = ConfigurationManager.AppSettings["DomainMedia"] + "";
            var urlserver = domainMedia;

            var tempUrl = HttpUtility.HtmlDecode(url);

            var result = Uri.TryCreate(tempUrl, UriKind.Absolute, out uriResult)
                          && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
            if (!result)
            {
                src = HttpUtility.UrlPathEncode(src);
                url = urlserver + src;
            }
            return new HtmlString(url);
        }
        public static HtmlString ImageThumb(this UrlHelper urlHelper, string src)
        {
            if (string.IsNullOrEmpty(src))
                return new HtmlString("");
            var url = src;
            string domainMedia = ConfigurationManager.AppSettings["DomainMedia"] + "";
            var urlserver = domainMedia;
            var tempUrl = HttpUtility.HtmlDecode(url);
            Uri uriResult;
            var result = Uri.TryCreate(tempUrl, UriKind.Absolute, out uriResult)
                         && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
            if (!result)
            {
                src = HttpUtility.UrlPathEncode(src);
                var name = Path.GetFileName(src) ?? "";
                var path = Path.GetDirectoryName(src) ?? "";
                src = Path.Combine(path, "thumb", name);
                //todo: chua sua
               url = urlserver + src;
            }
            else
            {
                //todo: chua sua
                if (tempUrl.Contains(urlserver))
                {
                    src = HttpUtility.UrlPathEncode(tempUrl);
                    var name = Path.GetFileName(tempUrl) ?? "";
                    var path = src.ReplaceLastOccurrence(name, "");
                    src = Path.Combine("thumb", name);
                    url = path + @"/" + src;
                }
            }
            return new HtmlString(url);
        }

        public static string ImageThumb(this string src)
        {
            var url = src;
            Uri uriResult;
            string domainMedia = ConfigurationManager.AppSettings["DomainMedia"] + "";
            var urlserver = domainMedia;
            var result = Uri.TryCreate(url, UriKind.Absolute, out uriResult)
                         && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
            if (!result)
            {
                src = HttpUtility.UrlPathEncode(src);
                var name = Path.GetFileName(src) ?? "";
                var path = Path.GetDirectoryName(src) ?? "";
                src = Path.Combine(path, "thumb", name);
                //todo: chua sua
                url = urlserver + src;
            }
            else
            {
                //todo: chua sua
                if (src.Contains(urlserver))
                {
                    src = HttpUtility.UrlPathEncode(src);
                    var name = Path.GetFileName(src) ?? "";
                    var path = src.ReplaceLastOccurrence(name, "");
                    src = Path.Combine("thumb", name);
                    url = path + @"/" + src;
                }
            }
            return url;
        }
        public static bool CheckUrl(this string src)
        {
            var url = src;
            Uri uriResult;
            var result = Uri.TryCreate(url, UriKind.Absolute, out uriResult)
                         && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
            return result;
        }

        //public static HtmlString CheckUrl(this UrlHelper urlHelper, string src)
        //{
        //    if (string.IsNullOrEmpty(src))
        //        return new HtmlString("");
        //    var url = src;
        //    Uri uriResult;
           

        //    var result = Uri.TryCreate(url, UriKind.Absolute, out uriResult)
        //                  && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        //    if (!result)
        //    {
        //        src = HttpUtility.UrlPathEncode(src);
        //        url = src;
        //    }
        //    return new HtmlString(url);
        //}
    }
}