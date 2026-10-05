namespace VNPT.Web.Portal.Base.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.GeneralCategories", "Name_En", c => c.String(maxLength: 100));
            AddColumn("dbo.News", "Title_En", c => c.String(maxLength: 1000));
            AddColumn("dbo.News", "Content_En", c => c.String());
            AddColumn("dbo.News", "ShortContent_En", c => c.String(maxLength: 2000));
            AddColumn("dbo.News", "AudioUrl", c => c.String());
            AddColumn("dbo.News", "AudioCreateDate", c => c.DateTime());
            AddColumn("dbo.SystemMenus", "Title_En", c => c.String(maxLength: 1000));
            AddColumn("dbo.SysPortalReviews", "Rate", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dbo.SysPortalReviews", "Rate");
            DropColumn("dbo.SystemMenus", "Title_En");
            DropColumn("dbo.News", "AudioCreateDate");
            DropColumn("dbo.News", "AudioUrl");
            DropColumn("dbo.News", "ShortContent_En");
            DropColumn("dbo.News", "Content_En");
            DropColumn("dbo.News", "Title_En");
            DropColumn("dbo.GeneralCategories", "Name_En");
        }
    }
}
