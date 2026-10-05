using System;
using System.ComponentModel.DataAnnotations;
using VNPT.Core.Models;
using System.Configuration;
using System.Linq;

namespace VNPT.Web.Portal.Base
{
    public class SysPortal : BaseModel
    {
        [Key]
        public Guid Id { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [MaxLength(128)]
        public string AdministratorId { get; set; }

        [MaxLength(20)]
        public string DefaultLanguage { get; set; }
        public Guid? ThemeId { get; set; }

        [MaxLength(1000)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string Logo { get; set; }
        public Guid? HomeSiteId { get; set; }

        public bool IsUsedSubdomain { get; set; }

        public SysSite GetSite(WebDbContext context, Guid siteId, bool isReturnNull = false)
        {
            var site = context.SysSites.FirstOrDefault(s => s.PortalId == Id && s.Id == siteId);

            if (!isReturnNull && site == null)
            {
                site = context.SysSites.FirstOrDefault(s => s.PortalId == Id && s.Id == HomeSiteId);
                if(site == null)
                    site = context.SysSites.FirstOrDefault(s => s.PortalId == Id);
            }
            return site;
        }

        public SysSite GetSite(WebDbContext context,string siteId, string portalCode, bool isReturnNull = false, int codeError = 200)
        {
            siteId = siteId.ToLower();

            var site = context.SysSites.FirstOrDefault(s => s.PortalId == Id && s.Code.ToLower() == portalCode && !string.IsNullOrEmpty(s.Subdomain) && s.Subdomain.ToLower() == siteId && ((s.IsFeatured) || !s.ParentId.HasValue));

            if (!isReturnNull && site == null)
            {
                site = context.SysSites.FirstOrDefault(s => s.PortalId == Id && s.Id == HomeSiteId) ?? context.SysSites.FirstOrDefault();
            }

            if (site == null && codeError != 200)
            {
                site = GetSysSite(context, portalCode, codeError, isReturnNull);
            }
            return site;
        }

        public SysSite GetSysSite(WebDbContext context, string portalCode, int code, bool isReturnNull = false)
        {
            var site = context.SysSites.FirstOrDefault(s => s.Code == portalCode && s.IsSysSite.HasValue && s.IsSysSite.Value && s.SysSiteCode == code);

            if (!isReturnNull && site == null)
            {
                site = context.SysSites.FirstOrDefault(s => s.Id == HomeSiteId) ?? context.SysSites.FirstOrDefault();
            }
            return site;
        }

    }
}
