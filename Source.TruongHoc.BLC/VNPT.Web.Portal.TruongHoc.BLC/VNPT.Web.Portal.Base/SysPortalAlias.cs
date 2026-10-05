using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Base
{
    public enum ProtocolWeb
    {
        Http = 1,
        Https = 2
    }
    public class SysPortalAlias : BaseModel
    {
        [Key]
        public Guid Id { get; set; }

        public Guid PortalId { get; set; }

       
        [MaxLength(1000)]
        public string Domain { get; set; }

        public ProtocolWeb Protocol { get; set; }

        public bool IsMain { get; set; }

    }
}
