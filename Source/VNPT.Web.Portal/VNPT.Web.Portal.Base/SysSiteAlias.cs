using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class SysSiteAlias : BaseModel
    {
        [Key]
        public Guid Id { get; set; }

        public Guid SiteId { get; set; }


        [MaxLength(1000)]
        public string Domain { get; set; }

        public ProtocolWeb Protocol { get; set; }

        public bool IsMain { get; set; }


    }
}
