using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNPT.Web.Portal.Api.Models
{
    public class PortalInformation
    {
        public PortalInformation()
        {

        }
        public PortalInformation(HttpRequestBase httpContextRequest, string site = "", string lang = "vi", string SubSite = "")
        {
            IsSubDomain = -1;
            Domain = httpContextRequest.Url?.Host ?? "";

        }

        public Guid PortalId { get; set; }
        public string PortalCode { get; set; }
        public string Domain { get; set; }
        public string Site { get; set; }
        public string SubSite { get; set; }
        public string Lang { get; set; }

        /// <summary>
        /// 0 = ko sử dụng - local
        /// 1 = sử dụng subdomain
        /// -1 = sử dụng domain, ko subdomain
        /// </summary>
        public int IsSubDomain { get; set; }


        public bool IsEmpty()
        {
            if (IsSubDomain == 0)
            {
                return false;
            }
            if (string.IsNullOrEmpty(PortalCode) || string.IsNullOrEmpty(Domain))
                return true;
            return false;
        }
    }
}