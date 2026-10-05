namespace VNPT.Web.Portal.Base.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial21 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TraCuuDiems", "HDTNHNHKI", c => c.String());
            AddColumn("dbo.TraCuuDiems", "HDTNHNHKII", c => c.String());
            DropColumn("dbo.TraCuuDiems", "HDTNHNKHI");
            DropColumn("dbo.TraCuuDiems", "HDTNHNKHII");
        }
        
        public override void Down()
        {
            AddColumn("dbo.TraCuuDiems", "HDTNHNKHII", c => c.String());
            AddColumn("dbo.TraCuuDiems", "HDTNHNKHI", c => c.String());
            DropColumn("dbo.TraCuuDiems", "HDTNHNHKII");
            DropColumn("dbo.TraCuuDiems", "HDTNHNHKI");
        }
    }
}
