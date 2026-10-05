using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using VNPT.Core.Extentions;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public partial class SysSite : BaseModel
    {
        public Guid Id { get; set; }
        [Required]
        [MaxLength(20)]
        public string Code { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(200)]
        public string Subdomain { get; set; }

        public Guid PortalId { get; set; }

        [MaxLength(128)]
        public string AdministratorId { get; set; }

        [Required]
        [MaxLength(1000)]
        public string SiteUrl { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [MaxLength(1000)]
        public string Logo { get; set; }

        public Guid? ParentId { get; set; }
        public bool? IsSysSite { get; set; }
        public int? SysSiteCode { get; set; }
        public Guid LayoutId { get; set; }
        public bool IsAuthorized { get; set; }
        public bool MenuEnabled { get; set; }

        [DefaultValue(0)]
        public int MenuOrder { get; set; }

        public bool IsFeatured { get; set; }
    }

}
