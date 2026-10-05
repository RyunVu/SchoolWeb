using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public  class SysTheme : BaseModel
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(2000)]
        public string Url { get; set; }

        [MaxLength(2000)]
        public string Image { get; set; }

    }
}
