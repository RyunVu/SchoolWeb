using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class SystemMenu : BaseModel
    {
        public Guid Id { get; set; }

        [MaxLength(20)]
        public string MenuCode { get; set; }

        [MaxLength(1000)]
        public string Icon { get; set; }

        [MaxLength(1000)]
        public string Action { get; set; }

        [MaxLength(1000)]
        public string Parameter { get; set; }

        [MaxLength(2000)]
        public string OtherRole { get; set; }

        [MaxLength(1000)]
        public string Title { get; set; }
        [MaxLength(1000)]
        public string Title_En { get; set; }

        [ForeignKey("Parent")]
        public Guid? ParentId { get; set; }

        public int SortNo { get; set; }

        public int RoleLevel { get; set; }

        public bool? IsShowMenu { get; set; }
        public bool? IsUseParameterUrl { get; set; }
        public virtual IList<SystemMenu> Children { get; set; }

        public virtual SystemMenu Parent { get; set; }
        public virtual IList<SysMenuFunc> SysMenuFuncs { get; set; }

    }
    public class SysMenuFunc
    {
        [Key]
        [Column(Order = 1)]
        public Guid SystemMenuId { get; set; }

        [MaxLength(300)]
        [Key]
        [Column(Order = 2)]
        public string Controller { get; set; }

        [MaxLength(300)]
        [Key]
        [Column(Order = 3)]
        public string Method { get; set; }

        [MaxLength(100)]
        [Key]
        [Column(Order = 4)]
        public string Action { get; set; }

        public virtual SystemMenu SystemMenu { get; set; }
    }
}
