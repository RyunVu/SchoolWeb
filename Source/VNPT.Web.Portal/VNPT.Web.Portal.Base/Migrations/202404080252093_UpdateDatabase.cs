namespace VNPT.Web.Portal.Base.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateDatabase : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.EOffices",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        SoKyHieu = c.String(),
                        NgayBanHanh = c.DateTime(nullable: false),
                        NguoiKy = c.String(),
                        TrichYeu = c.String(),
                        CoQuanBanHanh = c.String(),
                        LoaiVanBan = c.String(),
                        LinhVuc = c.String(),
                        CongBaoSo = c.String(),
                        NgayPhatHanh = c.DateTime(),
                        HieuLuc = c.String(),
                        GhiChu = c.String(),
                        DinhKemUrl = c.String(),
                        DocumentId = c.String(),
                        Tag = c.String(maxLength: 2000),
                        Status = c.Int(nullable: false),
                        Description = c.String(maxLength: 2000),
                        CreateDate = c.DateTime(nullable: false),
                        CreateUserId = c.String(maxLength: 128),
                        UpdateDate = c.DateTime(),
                        UpdateUserId = c.String(maxLength: 128),
                        LanguageId = c.String(maxLength: 20),
                        UnitCode = c.String(maxLength: 20),
                    })
                .PrimaryKey(t => t.Id);
            
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
            DropTable("dbo.EOffices");
        }
    }
}
