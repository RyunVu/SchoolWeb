namespace VNPT.Web.Portal.Base.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TraCuuDiems", "HoaTL", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.TraCuuDiems", "HoaTL");
        }
    }
}
