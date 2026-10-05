using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
	public class SysPortalModel : PagingModel
    {
        public Guid Id { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string AdministratorId { get; set; }
        public string AdministratorUserName { get; set; }
        public string DefaultLanguage { get; set; }
        public Guid? ThemeId { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
        public Guid? HomeSiteId { get; set; }
        public bool IsUsedSubdomain { get; set; }
        public string Tag { get; set; }
        public string Description { get; set; }
        public string UnitName { get; set; }
        public string UnitCodeClone { get; set; }

        public SysPortalModel()
        {

        }

        public SysPortalModel (SysPortal sysPortal) {
            Id = sysPortal.Id;
            ExpiryDate = sysPortal.ExpiryDate;
            AdministratorId = sysPortal.AdministratorId;
            AdministratorUserName = "";
            DefaultLanguage = sysPortal.DefaultLanguage;
            Name = sysPortal.Name;
            Logo = sysPortal.Logo;
            HomeSiteId = sysPortal.HomeSiteId;
            IsUsedSubdomain = sysPortal.IsUsedSubdomain;
            Tag = sysPortal.Tag;
            Description = sysPortal.Description;
            ThemeId = sysPortal.ThemeId;
            UnitCode = sysPortal.UnitCode;
        }
    }
}