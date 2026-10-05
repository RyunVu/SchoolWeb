namespace VNPT.Web.Portal.Base.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using VNPT.Core.Constants;

    internal sealed class Configuration : DbMigrationsConfiguration<VNPT.Web.Portal.Base.WebDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(VNPT.Web.Portal.Base.WebDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method
            //  to avoid creating duplicate seed data.
            var i = 1;
            var menu = new SystemMenu
            {
                Status = StatusEnum.Used,
                CreateDate = DateTime.Now,
                UnitCode = "LDG",
                RoleLevel = 5,
                IsShowMenu = true,
                Id = new Guid("23a2d3e8-1503-45f0-a26a-b932db5d7112"),
                MenuCode = "Web",
                Icon = "fas fa-bars",
                Action = "system/client-menu",
                Title = "Quản lý Menu",
                SortNo = i++,
                OtherRole = null,
                Parameter = null,
                ParentId = null,
                IsUseParameterUrl = null
            };
            if (!context.SystemMenus.Any(s => s.Id == menu.Id))
            {
                context.SystemMenus.Add(menu);
                context.SaveChanges();
            }
        }
    }
}
