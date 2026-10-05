using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.Cookies;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class User : IdentityUser<string, UserLogin, UserRole, UserClaim>
    {
        [Required, MaxLength(50)]
        public string FirstName { get; set; }

        [Required, MaxLength(50)]
        public string LastName { get; set; }

        public string FullName => $"{LastName ?? ""} {FirstName ?? ""}";

        [MaxLength(10)]
        public string GenderId { get; set; }

        public DateTime? DayOfBirth { get; set; }

        [MaxLength(1000)]
        public string Address { get; set; }

        [MaxLength(1000)]
        public string AvatarUrl { get; set; }

        [MaxLength(20)]
        public new string PhoneNumber { get; set; }

        [MaxLength(6)]
        public string OtpCode { get; set; }
        public int? OtpWrongTime { get; set; }
        public DateTime? OtpCreateTime { get; set; }
        public DateTime? OtpLastWrongTime { get; set; }

        //location
        public Guid? LocationNationalityId { get; set; } //quốc tịch
        public Guid? LocationNationalId { get; set; } //quốc gia
        public Guid? LocationProvinceId { get; set; } //tỉnh
        public Guid? LocationDistrictId { get; set; } //quận, huyện
        public Guid? LocationWardId { get; set; } //phường, xã
        public Guid? LocationStreetId { get; set; } //đường

        //BaseModel
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


        public Guid? PositionId { get; set; }

        public Guid? UnitId { get; set; }

        [MaxLength(20)]
        public string Code { get; set; }
        public Guid? TemplateUnitId { get; set; }

        public virtual Unit Unit { get; set; }
        public virtual Position Position { get; set; }
        public virtual List<UserNote> UserNotes { get; set; }


        [MaxLength(500)]
        public string ImportId { get; set; }

        [MaxLength(500)]
        public string ZaloUserId { get; set; }

        [MaxLength(500)]
        public string OtherPositionName { get; set; }

        public bool? EnableOtp { get; set; }

        public bool? IsDevUser { get; set; }
        [MaxLength(200)]
        public string LastIpLogin { get; set; }
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<User, string> manager, string authenticationType = null)
        {
            if (string.IsNullOrEmpty(authenticationType))
            {
                authenticationType = CookieAuthenticationDefaults.AuthenticationType;
            }
            try
            {
                var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
                // Add custom user claims here
                userIdentity.AddClaim(new Claim(UserCode.Email, Email ?? ""));
                userIdentity.AddClaim(new Claim(UserCode.UnitCode, UnitCode ?? ""));
                userIdentity.AddClaim(new Claim(UserCode.UserName, UserName ?? ""));
                userIdentity.AddClaim(new Claim(UserCode.FullName, FullName ?? ""));
                userIdentity.AddClaim(new Claim(UserCode.Id, Id ?? ""));
                userIdentity.AddClaim(new Claim("UserType", "1"));
                var roleIds = Roles.Select(s => s.RoleId).ToList();
                using (var context = new WebDbContext())
                {
                    var roles = context.Roles.Where(w => roleIds.Any(s => s == w.Id)).ToList();
                    if (roles.Count > 0)
                    {
                        var minRoleLevel = roles.Min(s => s.RoleLevel);
                        userIdentity.AddClaim(new Claim(UserCode.RoleLevel, minRoleLevel + ""));
                    }
                }
                return userIdentity;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return null;
            }

        }

        //public bool IsInMenu(Guid menuId, List<Guid> menus = null)
        //{
        //    using (var context = new QuanLyNhaDBContext())
        //    {
        //        var roleIds = Roles.Select(s => s.RoleId).ToList();
        //        var roleTemps = context.Roles.Where(w => roleIds.Any(s => s == w.Id)).ToList();
        //        roles = roleTemps.Select(s => new RoleModel()
        //        {
        //            Id = s.Id,
        //            Name = s.Name,
        //            RoleLevel = s.RoleLevel
        //        }).ToList();
        //    }
        //    return menus.Any(s => s == menuId);
        //}
        public bool IsInRole(string roleName, List<RoleModel> roles = null)
        {
            if (roles == null)
            {
                using (var context = new WebDbContext())
                {
                    var roleIds = Roles.Select(s => s.RoleId).ToList();
                    var roleTemps = context.Roles.Where(w => roleIds.Any(s => s == w.Id)).ToList();
                    roles = roleTemps.Select(s => new RoleModel()
                    {
                        Id = s.Id,
                        Name = s.Name,
                        RoleLevel = s.RoleLevel
                    }).ToList();
                }
            }
            return roles.Any(s => s.Name.ToLower() == roleName.ToLower());
        }

        public User Clone()
        {
            var result = this.CloneValue<User>(ignoreProperties: new List<string> { "Unit","Position", });
            return result;
        }
    }

    public class UserClaim : IdentityUserClaim
    {
    }
    public class UserLogin : IdentityUserLogin
    {
    }
    public class UserRole : IdentityUserRole
    {
        public virtual Role Role { get; set; }
    }

    public class UserNote : BaseModel
    {
        public Guid Id { get; set; }

        [MaxLength(1000)]
        public string Title { get; set; }

        [MaxLength(2000)]
        public string Content { get; set; }

        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }

}
