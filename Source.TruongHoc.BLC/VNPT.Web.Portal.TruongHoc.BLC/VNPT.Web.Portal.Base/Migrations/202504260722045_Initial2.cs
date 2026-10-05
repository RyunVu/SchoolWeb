namespace VNPT.Web.Portal.Base.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TraCuuDiems", "HDTNHNKHI", c => c.String());
            DropColumn("dbo.TraCuuDiems", "HDTNTNKHI");
        }
        
        public override void Down()
        {
            AddColumn("dbo.TraCuuDiems", "HDTNTNKHI", c => c.String());
            DropColumn("dbo.TraCuuDiems", "HDTNHNKHI");
        }
    }
}
