using System;
using System.ComponentModel.DataAnnotations;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public  class SysThemeLayout : BaseModel
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string Url { get; set; }

        public Guid ThemeId { get; set; }
        public bool? IsAuthorized { get; set; }
        public bool? IsFeatured { get; set; }
        public bool? MenuEnabled { get; set; }
        public int? MenuOrder { get; set; }

        [MaxLength(1000)]
        public string SiteUrl { get; set; }

        public int? SysSiteCode { get; set; }
        [MaxLength(1000)]
        public string Logo { get; set; }

        public bool? IsSysSite { get; set; }

    }

 }
