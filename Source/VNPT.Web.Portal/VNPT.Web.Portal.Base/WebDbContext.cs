using System;
using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace VNPT.Web.Portal.Base
{
    public class WebDbContext : IdentityDbContext<User, Role, string, UserLogin, UserRole, UserClaim>
    {
        public WebDbContext() : base("WebDbContext")
        {
        }
        public static WebDbContext Create()
        {
            return new WebDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Role>().ToTable("Roles");
            modelBuilder.Entity<UserRole>().ToTable("UserRoles");
            modelBuilder.Entity<UserLogin>().ToTable("UserLogins");
            modelBuilder.Entity<UserClaim>().ToTable("UserClaims");
        }

        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UserLogin> UserLogins { get; set; }
        public DbSet<UserClaim> UserClaims { get; set; }
        public DbSet<UserNote> UserNotes { get; set; }
        public DbSet<UserLoginHistory> UserLoginHistories { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<RolePermissionProperty> RolePermissionProperties { get; set; }
        public DbSet<UserLocationMap> UserLocationMaps { get; set; }
        public DbSet<Position> Positions { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<History> Histories { get; set; }
        public DbSet<GeneralCategory> GeneralCategories { get; set; }
        public DbSet<LocationProvince> LocationProvinces { get; set; }
        public DbSet<LocationDistrict> LocationDistricts { get; set; }
        public DbSet<LocationWard> LocationWards { get; set; }
        public DbSet<LocationStreet> LocationStreets { get; set; }
        public DbSet<LocationNational> LocationNationals { get; set; }
        public DbSet<SystemParameter> SystemParameters { get; set; }
        public DbSet<SystemParameterLang> SystemParameterLangs { get; set; }
        public DbSet<SystemMenu> SystemMenus { get; set; }
        public DbSet<SysMenuFunc> SysMenuFuncs { get; set; }
        public DbSet<DataTemp> DataTemps { get; set; }
        public DbSet<Utility> Utilities { get; set; }
        public DbSet<SysPortal> SysPortals { get; set; }
        public DbSet<SysPortalAlias> SysPortalAlias { get; set; }
        public DbSet<SysSite> SysSites { get; set; }
        public DbSet<SysSiteAlias> SysSiteAlias { get; set; }
        public DbSet<SysTheme> SysThemes { get; set; }
        public DbSet<SysThemeLayout> SysThemeLayout { get; set; }
        public DbSet<SysPortalReview> SysPortalReviews { get; set; }
        public DbSet<EOffice> EOffices { get; set; }
    }
}
