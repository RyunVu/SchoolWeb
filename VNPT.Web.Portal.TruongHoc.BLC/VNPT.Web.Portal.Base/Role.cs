using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNet.Identity.EntityFramework;
using VNPT.Core.Constants;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class Role : IdentityRole<string, UserRole>, IBaseModel
    {
        [DefaultValue(6)]
        public int RoleLevel { get; set; }

        public string ParentId { get; set; }

        [ForeignKey("ParentId")]
        public virtual Role Parent { get; set; }


        public Guid? HomeMenuId { get; set; }


        [MaxLength(2000)]
        public string Tag { get; set; }

        [Required]
        [DefaultValue(StatusEnum.Used)]
        public StatusEnum Status { get; set; }

        [MaxLength(2000)]
        public string Description { get; set; }

        [Required]
        public DateTime CreateDate { get; set; }

        [MaxLength(128)]
        public string CreateUserId { get; set; }

        public DateTime? UpdateDate { get; set; }

        [MaxLength(128)]
        public string UpdateUserId { get; set; }

        [MaxLength(20)]
        [DefaultValue("vi")]
        public string LanguageId { get; set; }

        [MaxLength(20)]
        [DefaultValue("LDG")]
        public string UnitCode { get; set; }

        public virtual IList<RolePermission> RolePermissions { get; set; }
    }

    public partial class RolePermission : BaseModel
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(128)]
        [ForeignKey("Role")]
        public string RoleId { get; set; }


        [Required]
        [ForeignKey("SystemMenu")]
        [Column(Order = 1)]
        public Guid SysMenuId { get; set; }


        [Required]
        [MaxLength(20)]
        public new string UnitCode { get; set; }

        public bool IsAllow { get; set; }

        public virtual Role Role { get; set; }
        public virtual SystemMenu SystemMenu { get; set; }

        public virtual IList<RolePermissionProperty> RolePermissionProperties { get; set; }

    }
    public partial class RolePermissionProperty
    {
        [Key]
        [Column(Order = 1)]
        public Guid Id { get; set; }

        [Key]
        [Column(Order = 2)]
        [MaxLength(20)]
        public string Command { get; set; }

        public bool Value { get; set; }

        [ForeignKey("Id")]
        public virtual RolePermission RolePermission { get; set; }
    }


}

