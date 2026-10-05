namespace VNPT.Web.Portal.Base.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            //CreateTable(
            //    "dbo.BaiPhatBieux",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            TieuSuId = c.Guid(nullable: false),
            //            NgayDang = c.DateTime(),
            //            TieuDe = c.String(nullable: false, maxLength: 1000),
            //            MoTaNgan = c.String(maxLength: 1000),
            //            NoiDung = c.String(),
            //            CountView = c.Long(),
            //            ThuTu = c.Int(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.CanBoChucVuNhiemKies",
            //    c => new
            //        {
            //            ChucVuNhiemKyId = c.Guid(nullable: false),
            //            TieuSuId = c.Guid(nullable: false),
            //            ThuTu = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => new { t.ChucVuNhiemKyId, t.TieuSuId });
            
            //CreateTable(
            //    "dbo.ChucVuNhiemKies",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            ChucVuId = c.Guid(nullable: false),
            //            NhiemKyId = c.Guid(nullable: false),
            //            ThuTu = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.DataTemps",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Code = c.String(maxLength: 50),
            //            Value1 = c.String(maxLength: 1000),
            //            Value2 = c.String(maxLength: 2000),
            //            DataJson = c.String(),
            //            Value3 = c.Int(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.EOffices",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            SoKyHieu = c.String(),
            //            NgayBanHanh = c.DateTime(nullable: false),
            //            NguoiKy = c.String(),
            //            TrichYeu = c.String(),
            //            CoQuanBanHanh = c.String(),
            //            LoaiVanBan = c.String(),
            //            LinhVuc = c.String(),
            //            CongBaoSo = c.String(),
            //            NgayPhatHanh = c.DateTime(),
            //            HieuLuc = c.String(),
            //            GhiChu = c.String(),
            //            DinhKemUrl = c.String(),
            //            DocumentId = c.String(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.GeneralCategories",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            ParentId = c.Guid(),
            //            Code = c.String(maxLength: 20),
            //            Name = c.String(maxLength: 100),
            //            Name_En = c.String(maxLength: 100),
            //            Value = c.String(maxLength: 1000),
            //            Value2 = c.String(maxLength: 2000),
            //            ImageUrl = c.String(maxLength: 1000),
            //            OrderNo = c.Int(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.GeneralCategories", t => t.ParentId)
            //    .Index(t => t.ParentId);
            
            //CreateTable(
            //    "dbo.GroupTables",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            ParentId = c.Guid(),
            //            Name = c.String(maxLength: 1000),
            //            UnsignName = c.String(maxLength: 1000),
            //            Metadata = c.String(),
            //            Order = c.Int(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.GroupTables", t => t.ParentId)
            //    .Index(t => t.ParentId);
            
            //CreateTable(
            //    "dbo.HinhAnhHoatDongs",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            TieuSuId = c.Guid(nullable: false),
            //            Url = c.String(nullable: false, maxLength: 1000),
            //            ThumbUrl = c.String(maxLength: 1000),
            //            TenHinh = c.String(maxLength: 1000),
            //            MoTa = c.String(),
            //            ThuTu = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.Histories",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            ItemId = c.Guid(nullable: false),
            //            TableName = c.String(maxLength: 100),
            //            Action = c.Int(nullable: false),
            //            OldVersion = c.String(),
            //            ParentId = c.Guid(),
            //            NewVersion = c.String(),
            //            CurrentIp = c.String(maxLength: 200),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.LocationDistricts",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Name = c.String(nullable: false, maxLength: 200),
            //            Name2 = c.String(maxLength: 200),
            //            ShortName = c.String(maxLength: 200),
            //            ParentId = c.Guid(),
            //            GeoLocationCenter = c.String(maxLength: 200),
            //            CodeId = c.String(maxLength: 20),
            //            CodeParentId = c.String(maxLength: 20),
            //            OrderNo = c.Int(),
            //            IsPrimary = c.Boolean(),
            //            ImportId = c.String(maxLength: 200),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.LocationProvinces", t => t.ParentId)
            //    .Index(t => t.ParentId);
            
            //CreateTable(
            //    "dbo.LocationProvinces",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Name = c.String(nullable: false, maxLength: 200),
            //            Name2 = c.String(maxLength: 200),
            //            ShortName = c.String(maxLength: 200),
            //            ParentId = c.Guid(),
            //            GeoLocationCenter = c.String(maxLength: 200),
            //            CodeId = c.String(maxLength: 20),
            //            CodeParentId = c.String(maxLength: 20),
            //            OrderNo = c.Int(),
            //            IsPrimary = c.Boolean(),
            //            ImportId = c.String(maxLength: 200),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.LocationNationals", t => t.ParentId)
            //    .Index(t => t.ParentId);
            
            //CreateTable(
            //    "dbo.LocationNationals",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Alpha3Code = c.String(maxLength: 50),
            //            Alpha2Language = c.String(maxLength: 100),
            //            Alpha3Language = c.String(maxLength: 100),
            //            Name = c.String(nullable: false, maxLength: 200),
            //            Name2 = c.String(maxLength: 200),
            //            ShortName = c.String(maxLength: 200),
            //            ParentId = c.Guid(),
            //            GeoLocationCenter = c.String(maxLength: 200),
            //            CodeId = c.String(maxLength: 20),
            //            CodeParentId = c.String(maxLength: 20),
            //            OrderNo = c.Int(),
            //            IsPrimary = c.Boolean(),
            //            ImportId = c.String(maxLength: 200),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.LocationWards",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            HasOtp = c.Boolean(),
            //            Name = c.String(nullable: false, maxLength: 200),
            //            Name2 = c.String(maxLength: 200),
            //            ShortName = c.String(maxLength: 200),
            //            ParentId = c.Guid(),
            //            GeoLocationCenter = c.String(maxLength: 200),
            //            CodeId = c.String(maxLength: 20),
            //            CodeParentId = c.String(maxLength: 20),
            //            OrderNo = c.Int(),
            //            IsPrimary = c.Boolean(),
            //            ImportId = c.String(maxLength: 200),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.LocationDistricts", t => t.ParentId)
            //    .Index(t => t.ParentId);
            
            //CreateTable(
            //    "dbo.LocationStreets",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Name = c.String(nullable: false, maxLength: 200),
            //            Name2 = c.String(maxLength: 200),
            //            ShortName = c.String(maxLength: 200),
            //            ParentId = c.Guid(),
            //            GeoLocationCenter = c.String(maxLength: 200),
            //            CodeId = c.String(maxLength: 20),
            //            CodeParentId = c.String(maxLength: 20),
            //            OrderNo = c.Int(),
            //            IsPrimary = c.Boolean(),
            //            ImportId = c.String(maxLength: 200),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.LocationWards", t => t.ParentId)
            //    .Index(t => t.ParentId);
            
            //CreateTable(
            //    "dbo.News",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            NewTypeId = c.Guid(nullable: false),
            //            Code = c.String(maxLength: 200),
            //            Alias = c.String(maxLength: 2000),
            //            Title = c.String(maxLength: 1000),
            //            Content = c.String(),
            //            ShortContent = c.String(maxLength: 2000),
            //            Title_En = c.String(maxLength: 1000),
            //            Content_En = c.String(),
            //            ShortContent_En = c.String(maxLength: 2000),
            //            ImageUrl = c.String(maxLength: 2000),
            //            AudioUrl = c.String(),
            //            AudioCreateDate = c.DateTime(),
            //            Order = c.Long(),
            //            CountView = c.Long(),
            //            OtherUrl = c.String(maxLength: 2000),
            //            IsNewsImage = c.Boolean(nullable: false),
            //            IsOpenBlankPage = c.Boolean(nullable: false),
            //            IsOpenImageOnly = c.Boolean(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.NhiemKies",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            TypeId = c.Guid(nullable: false),
            //            HinhAnh = c.String(),
            //            Ten = c.String(),
            //            ThuTu = c.Int(nullable: false),
            //            TuNam = c.Int(nullable: false),
            //            DenNam = c.Int(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.Positions",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Name = c.String(nullable: false, maxLength: 200),
            //            Code = c.String(maxLength: 200),
            //            TypeGetList = c.Int(nullable: false),
            //            ImportId = c.String(maxLength: 500),
            //            OrderNo = c.Int(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.Users",
            //    c => new
            //        {
            //            Id = c.String(nullable: false, maxLength: 128),
            //            FirstName = c.String(nullable: false, maxLength: 50),
            //            LastName = c.String(nullable: false, maxLength: 50),
            //            GenderId = c.String(maxLength: 10),
            //            DayOfBirth = c.DateTime(),
            //            Address = c.String(maxLength: 1000),
            //            AvatarUrl = c.String(maxLength: 1000),
            //            PhoneNumber = c.String(maxLength: 20),
            //            OtpCode = c.String(maxLength: 6),
            //            OtpWrongTime = c.Int(),
            //            OtpCreateTime = c.DateTime(),
            //            OtpLastWrongTime = c.DateTime(),
            //            LocationNationalityId = c.Guid(),
            //            LocationNationalId = c.Guid(),
            //            LocationProvinceId = c.Guid(),
            //            LocationDistrictId = c.Guid(),
            //            LocationWardId = c.Guid(),
            //            LocationStreetId = c.Guid(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //            PositionId = c.Guid(),
            //            UnitId = c.Guid(),
            //            Code = c.String(maxLength: 20),
            //            TemplateUnitId = c.Guid(),
            //            ImportId = c.String(maxLength: 500),
            //            ZaloUserId = c.String(maxLength: 500),
            //            OtherPositionName = c.String(maxLength: 500),
            //            EnableOtp = c.Boolean(),
            //            IsDevUser = c.Boolean(),
            //            LastIpLogin = c.String(maxLength: 200),
            //            Email = c.String(maxLength: 256),
            //            EmailConfirmed = c.Boolean(nullable: false),
            //            PasswordHash = c.String(),
            //            SecurityStamp = c.String(),
            //            PhoneNumberConfirmed = c.Boolean(nullable: false),
            //            TwoFactorEnabled = c.Boolean(nullable: false),
            //            LockoutEndDateUtc = c.DateTime(),
            //            LockoutEnabled = c.Boolean(nullable: false),
            //            AccessFailedCount = c.Int(nullable: false),
            //            UserName = c.String(nullable: false, maxLength: 256),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.Positions", t => t.PositionId)
            //    .ForeignKey("dbo.Units", t => t.UnitId)
            //    .Index(t => t.PositionId)
            //    .Index(t => t.UnitId)
            //    .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            //CreateTable(
            //    "dbo.UserClaims",
            //    c => new
            //        {
            //            Id = c.Int(nullable: false, identity: true),
            //            UserId = c.String(nullable: false, maxLength: 128),
            //            ClaimType = c.String(),
            //            ClaimValue = c.String(),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
            //    .Index(t => t.UserId);
            
            //CreateTable(
            //    "dbo.UserLogins",
            //    c => new
            //        {
            //            LoginProvider = c.String(nullable: false, maxLength: 128),
            //            ProviderKey = c.String(nullable: false, maxLength: 128),
            //            UserId = c.String(nullable: false, maxLength: 128),
            //        })
            //    .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
            //    .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
            //    .Index(t => t.UserId);
            
            //CreateTable(
            //    "dbo.UserRoles",
            //    c => new
            //        {
            //            UserId = c.String(nullable: false, maxLength: 128),
            //            RoleId = c.String(nullable: false, maxLength: 128),
            //        })
            //    .PrimaryKey(t => new { t.UserId, t.RoleId })
            //    .ForeignKey("dbo.Roles", t => t.RoleId, cascadeDelete: true)
            //    .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
            //    .Index(t => t.UserId)
            //    .Index(t => t.RoleId);
            
            //CreateTable(
            //    "dbo.Roles",
            //    c => new
            //        {
            //            Id = c.String(nullable: false, maxLength: 128),
            //            RoleLevel = c.Int(nullable: false),
            //            ParentId = c.String(maxLength: 128),
            //            HomeMenuId = c.Guid(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //            Name = c.String(nullable: false, maxLength: 256),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.Roles", t => t.ParentId)
            //    .Index(t => t.ParentId)
            //    .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            //CreateTable(
            //    "dbo.RolePermissions",
            //    c => new
            //        {
            //            SysMenuId = c.Guid(nullable: false),
            //            Id = c.Guid(nullable: false),
            //            RoleId = c.String(nullable: false, maxLength: 128),
            //            UnitCode = c.String(nullable: false, maxLength: 20),
            //            IsAllow = c.Boolean(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.Roles", t => t.RoleId, cascadeDelete: true)
            //    .ForeignKey("dbo.SystemMenus", t => t.SysMenuId, cascadeDelete: true)
            //    .Index(t => t.SysMenuId)
            //    .Index(t => t.RoleId);
            
            //CreateTable(
            //    "dbo.RolePermissionProperties",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Command = c.String(nullable: false, maxLength: 20),
            //            Value = c.Boolean(nullable: false),
            //        })
            //    .PrimaryKey(t => new { t.Id, t.Command })
            //    .ForeignKey("dbo.RolePermissions", t => t.Id, cascadeDelete: true)
            //    .Index(t => t.Id);
            
            //CreateTable(
            //    "dbo.SystemMenus",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            MenuCode = c.String(maxLength: 20),
            //            Icon = c.String(maxLength: 1000),
            //            Action = c.String(maxLength: 1000),
            //            Parameter = c.String(maxLength: 1000),
            //            OtherRole = c.String(maxLength: 2000),
            //            Title = c.String(maxLength: 1000),
            //            Title_En = c.String(maxLength: 1000),
            //            ParentId = c.Guid(),
            //            SortNo = c.Int(nullable: false),
            //            RoleLevel = c.Int(nullable: false),
            //            IsShowMenu = c.Boolean(),
            //            IsUseParameterUrl = c.Boolean(),
            //            IsNewsImage = c.Boolean(nullable: false),
            //            IsOpenBlankPage = c.Boolean(nullable: false),
            //            IsOpenImageOnly = c.Boolean(nullable: false),
            //            MenuPosition = c.Int(nullable: false),
            //            MenuType = c.Int(),
            //            ConfigMenu = c.String(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.SystemMenus", t => t.ParentId)
            //    .Index(t => t.ParentId);
            
            //CreateTable(
            //    "dbo.SysMenuFuncs",
            //    c => new
            //        {
            //            SystemMenuId = c.Guid(nullable: false),
            //            Controller = c.String(nullable: false, maxLength: 300),
            //            Method = c.String(nullable: false, maxLength: 300),
            //            Action = c.String(nullable: false, maxLength: 100),
            //        })
            //    .PrimaryKey(t => new { t.SystemMenuId, t.Controller, t.Method, t.Action })
            //    .ForeignKey("dbo.SystemMenus", t => t.SystemMenuId, cascadeDelete: true)
            //    .Index(t => t.SystemMenuId);
            
            //CreateTable(
            //    "dbo.Units",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Code = c.String(maxLength: 50),
            //            Name = c.String(nullable: false, maxLength: 200),
            //            ImportId = c.String(maxLength: 500),
            //            PlaceId = c.Guid(),
            //            UnitFeedbackType = c.Int(nullable: false),
            //            LocationProvinceId = c.Guid(),
            //            LocationDistrictId = c.Guid(),
            //            LocationWardId = c.Guid(),
            //            SortNo = c.Int(nullable: false),
            //            IsNotPublic = c.Boolean(nullable: false),
            //            IsProvinceUnit = c.Boolean(),
            //            IsPrimary = c.Boolean(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.UserNotes",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Title = c.String(maxLength: 1000),
            //            Content = c.String(maxLength: 2000),
            //            UserId = c.String(maxLength: 128),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id)
            //    .ForeignKey("dbo.Users", t => t.UserId)
            //    .Index(t => t.UserId);
            
            //CreateTable(
            //    "dbo.QuaTrinhCongTacs",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            TieuSuId = c.Guid(nullable: false),
            //            TuNgay = c.DateTime(),
            //            DenNgay = c.DateTime(),
            //            NoiDung = c.String(nullable: false),
            //            ThuTu = c.Int(nullable: false),
            //            TuNgayDenNgay = c.String(maxLength: 1000),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.SysPortalAlias",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            PortalId = c.Guid(nullable: false),
            //            Domain = c.String(maxLength: 1000),
            //            Protocol = c.Int(nullable: false),
            //            IsMain = c.Boolean(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.SysPortalReviews",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            PortalId = c.Guid(nullable: false),
            //            ParentId = c.Guid(),
            //            Name = c.String(maxLength: 1000),
            //            PhoneNo = c.String(maxLength: 1000),
            //            Email = c.String(maxLength: 1000),
            //            Address = c.String(maxLength: 1000),
            //            Content = c.String(),
            //            Subject = c.String(maxLength: 1000),
            //            ReviewType = c.Int(),
            //            Rate = c.Int(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.SysPortals",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            ExpiryDate = c.DateTime(),
            //            AdministratorId = c.String(maxLength: 128),
            //            DefaultLanguage = c.String(maxLength: 20),
            //            ThemeId = c.Guid(),
            //            Name = c.String(maxLength: 1000),
            //            Logo = c.String(maxLength: 1000),
            //            HomeSiteId = c.Guid(),
            //            IsUsedSubdomain = c.Boolean(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.SysSiteAlias",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            SiteId = c.Guid(nullable: false),
            //            Domain = c.String(maxLength: 1000),
            //            Protocol = c.Int(nullable: false),
            //            IsMain = c.Boolean(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.SysSites",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Code = c.String(nullable: false, maxLength: 20),
            //            Name = c.String(nullable: false, maxLength: 200),
            //            Subdomain = c.String(maxLength: 200),
            //            PortalId = c.Guid(nullable: false),
            //            AdministratorId = c.String(maxLength: 128),
            //            SiteUrl = c.String(nullable: false, maxLength: 1000),
            //            ExpiryDate = c.DateTime(),
            //            Logo = c.String(maxLength: 1000),
            //            ParentId = c.Guid(),
            //            IsSysSite = c.Boolean(),
            //            SysSiteCode = c.Int(),
            //            LayoutId = c.Guid(nullable: false),
            //            IsAuthorized = c.Boolean(nullable: false),
            //            MenuEnabled = c.Boolean(nullable: false),
            //            MenuOrder = c.Int(nullable: false),
            //            IsFeatured = c.Boolean(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.SystemParameterLangs",
            //    c => new
            //        {
            //            Id = c.String(nullable: false, maxLength: 100),
            //            Code = c.String(nullable: false, maxLength: 20),
            //            LanguageId = c.String(nullable: false, maxLength: 20),
            //            Value = c.Decimal(precision: 18, scale: 2),
            //            Value3 = c.Decimal(precision: 18, scale: 2),
            //            Value2 = c.String(maxLength: 2000),
            //            Value4 = c.String(maxLength: 2000),
            //            Value5 = c.Boolean(),
            //            Value6 = c.String(maxLength: 1000),
            //            Value7 = c.String(maxLength: 1000),
            //        })
            //    .PrimaryKey(t => new { t.Id, t.Code, t.LanguageId })
            //    .ForeignKey("dbo.SystemParameters", t => new { t.Id, t.Code }, cascadeDelete: true)
            //    .Index(t => new { t.Id, t.Code });
            
            //CreateTable(
            //    "dbo.SystemParameters",
            //    c => new
            //        {
            //            Id = c.String(nullable: false, maxLength: 100),
            //            Code = c.String(nullable: false, maxLength: 20),
            //            Value = c.Decimal(precision: 18, scale: 2),
            //            Value3 = c.Decimal(precision: 18, scale: 2),
            //            Value2 = c.String(maxLength: 2000),
            //            Value4 = c.String(maxLength: 2000),
            //            Value6 = c.String(maxLength: 1000),
            //            Value7 = c.String(maxLength: 1000),
            //            Value5 = c.Boolean(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => new { t.Id, t.Code });
            
            //CreateTable(
            //    "dbo.SysThemeLayouts",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Name = c.String(nullable: false, maxLength: 200),
            //            Url = c.String(maxLength: 1000),
            //            ThemeId = c.Guid(nullable: false),
            //            IsAuthorized = c.Boolean(),
            //            IsFeatured = c.Boolean(),
            //            MenuEnabled = c.Boolean(),
            //            MenuOrder = c.Int(),
            //            SiteUrl = c.String(maxLength: 1000),
            //            SysSiteCode = c.Int(),
            //            Logo = c.String(maxLength: 1000),
            //            IsSysSite = c.Boolean(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.SysThemes",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            Name = c.String(nullable: false, maxLength: 200),
            //            Url = c.String(maxLength: 2000),
            //            Image = c.String(maxLength: 2000),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.TableCells",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            TableTemplateId = c.Guid(nullable: false),
            //            TableColumnId = c.Guid(nullable: false),
            //            RowNo = c.Int(nullable: false),
            //            ColSpan = c.Int(nullable: false),
            //            RowSpan = c.Int(nullable: false),
            //            Value = c.String(maxLength: 500),
            //            UnsignValue = c.String(maxLength: 500),
            //            MinValue = c.String(maxLength: 500),
            //            MaxValue = c.String(maxLength: 500),
            //            ValueType = c.String(maxLength: 50),
            //            ReadOnly = c.Boolean(nullable: false),
            //            Metadata = c.String(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.TableColumns",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            TableTemplateId = c.Guid(nullable: false),
            //            Name = c.String(maxLength: 1000),
            //            UnsignName = c.String(maxLength: 1000),
            //            RowNo = c.Int(nullable: false),
            //            ColNo = c.Int(nullable: false),
            //            ColSpan = c.Int(nullable: false),
            //            RowSpan = c.Int(nullable: false),
            //            Metadata = c.String(),
            //            Order = c.Int(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.TableTemplates",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            GroupTableId = c.Guid(nullable: false),
            //            Name = c.String(maxLength: 500),
            //            UnsignName = c.String(maxLength: 500),
            //            Type = c.String(maxLength: 50),
            //            PeriodType = c.String(maxLength: 20),
            //            Metadata = c.String(),
            //            Order = c.Int(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.TableValues",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            TableTemplateId = c.Guid(nullable: false),
            //            TableCellId = c.Guid(nullable: false),
            //            InputUnitId = c.Guid(),
            //            Period = c.String(),
            //            Value = c.String(maxLength: 500),
            //            UnsignValue = c.String(maxLength: 500),
            //            Metadata = c.String(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.TieuSus",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            LoaiChucVuId = c.Guid(nullable: false),
            //            HoTen = c.String(maxLength: 500),
            //            Alias = c.String(maxLength: 200),
            //            BiDanh = c.String(),
            //            NgaySinh = c.DateTime(),
            //            QueQuan = c.String(maxLength: 500),
            //            NoiThuongTru = c.String(maxLength: 500),
            //            DanTocId = c.Guid(nullable: false),
            //            TonGiaoId = c.Guid(nullable: false),
            //            NgayVaoDang = c.DateTime(),
            //            NgayChinhThuc = c.DateTime(),
            //            KhenThuong = c.String(),
            //            TrinhDoLyLuanChinhTri = c.String(),
            //            TrinhDoChuyenMon = c.String(),
            //            SDT = c.String(maxLength: 500),
            //            UrlAvt1 = c.String(maxLength: 500),
            //            UrlAvt2 = c.String(maxLength: 500),
            //            ChucVu = c.String(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.TraCuuDiems",
                c => new
                    {
                        MaHocsinh = c.String(nullable: false, maxLength: 128),
                        NamHoc = c.String(nullable: false, maxLength: 128),
                        STT = c.String(),
                        SoCCCD = c.String(),
                        Hovaten = c.String(),
                        Lop = c.String(),
                        Ngaysinh = c.String(),
                        ToanHKI = c.String(),
                        ToanHKII = c.String(),
                        ToanCN = c.String(),
                        ToanTL = c.String(),
                        LyHKI = c.String(),
                        LyHKII = c.String(),
                        LyCN = c.String(),
                        LyTL = c.String(),
                        HoaHKI = c.String(),
                        HoaHKII = c.String(),
                        HoaCN = c.String(),
                        SinhHKI = c.String(),
                        SinhHKII = c.String(),
                        SinhCN = c.String(),
                        SinhTL = c.String(),
                        TinHKI = c.String(),
                        TinHKII = c.String(),
                        TinCN = c.String(),
                        TinTL = c.String(),
                        VanHKI = c.String(),
                        VanHKII = c.String(),
                        VanCN = c.String(),
                        VanTL = c.String(),
                        SuHKI = c.String(),
                        SuHKII = c.String(),
                        SuCN = c.String(),
                        SuTL = c.String(),
                        DiaHKI = c.String(),
                        DiaHKII = c.String(),
                        DiaCN = c.String(),
                        DiaTL = c.String(),
                        GDKTPLHKI = c.String(),
                        GDKTPLHKII = c.String(),
                        GDKTPLCN = c.String(),
                        GDKTPLTL = c.String(),
                        HDTNTNKHI = c.String(),
                        HDTNHNKHII = c.String(),
                        HDTNHNCN = c.String(),
                        HDTNHNTL = c.String(),
                        KQHTHKI = c.String(),
                        KQHTHKII = c.String(),
                        KQHTCN = c.String(),
                        KQRLHKI = c.String(),
                        KQRLHKII = c.String(),
                        KQRLCN = c.String(),
                        VangHKI = c.String(),
                        VangHKII = c.String(),
                        VangCN = c.String(),
                        DanhHieu = c.String(),
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
                .PrimaryKey(t => new { t.MaHocsinh, t.NamHoc });
            
            //CreateTable(
            //    "dbo.UserLocationMaps",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            UserId = c.String(nullable: false, maxLength: 128),
            //            LocationProvinceId = c.Guid(),
            //            LocationDistrictId = c.Guid(),
            //            LocationWardId = c.Guid(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.UserLoginHistories",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            LoginHistory = c.Int(nullable: false),
            //            UserId = c.String(maxLength: 128),
            //            DeviceId = c.String(maxLength: 200),
            //            AccessToken = c.String(maxLength: 2000),
            //            ExpiredDate = c.DateTime(nullable: false),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
            //CreateTable(
            //    "dbo.Utilities",
            //    c => new
            //        {
            //            Id = c.Guid(nullable: false),
            //            ParentId = c.Guid(),
            //            Code = c.String(maxLength: 100),
            //            ImageUrl = c.String(maxLength: 1000),
            //            PhoneNumber = c.String(maxLength: 50),
            //            Name = c.String(maxLength: 1000),
            //            GeoLocation = c.String(maxLength: 1000),
            //            Address = c.String(maxLength: 1000),
            //            OrderNo = c.Int(nullable: false),
            //            LocationProvinceId = c.Guid(),
            //            LocationDistrictId = c.Guid(),
            //            LocationWardId = c.Guid(),
            //            ImportId = c.String(maxLength: 200),
            //            Email = c.String(maxLength: 200),
            //            WebsiteUrl = c.String(maxLength: 200),
            //            Price = c.String(maxLength: 200),
            //            IsGetAllChildren = c.Boolean(),
            //            Tag = c.String(maxLength: 2000),
            //            Status = c.Int(nullable: false),
            //            Description = c.String(maxLength: 2000),
            //            CreateDate = c.DateTime(nullable: false),
            //            CreateUserId = c.String(maxLength: 128),
            //            UpdateDate = c.DateTime(),
            //            UpdateUserId = c.String(maxLength: 128),
            //            LanguageId = c.String(maxLength: 20),
            //            UnitCode = c.String(maxLength: 20),
            //        })
            //    .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            //DropForeignKey("dbo.SystemParameterLangs", new[] { "Id", "Code" }, "dbo.SystemParameters");
            //DropForeignKey("dbo.UserNotes", "UserId", "dbo.Users");
            //DropForeignKey("dbo.Users", "UnitId", "dbo.Units");
            //DropForeignKey("dbo.UserRoles", "UserId", "dbo.Users");
            //DropForeignKey("dbo.UserRoles", "RoleId", "dbo.Roles");
            //DropForeignKey("dbo.RolePermissions", "SysMenuId", "dbo.SystemMenus");
            //DropForeignKey("dbo.SysMenuFuncs", "SystemMenuId", "dbo.SystemMenus");
            //DropForeignKey("dbo.SystemMenus", "ParentId", "dbo.SystemMenus");
            //DropForeignKey("dbo.RolePermissionProperties", "Id", "dbo.RolePermissions");
            //DropForeignKey("dbo.RolePermissions", "RoleId", "dbo.Roles");
            //DropForeignKey("dbo.Roles", "ParentId", "dbo.Roles");
            //DropForeignKey("dbo.Users", "PositionId", "dbo.Positions");
            //DropForeignKey("dbo.UserLogins", "UserId", "dbo.Users");
            //DropForeignKey("dbo.UserClaims", "UserId", "dbo.Users");
            //DropForeignKey("dbo.LocationStreets", "ParentId", "dbo.LocationWards");
            //DropForeignKey("dbo.LocationWards", "ParentId", "dbo.LocationDistricts");
            //DropForeignKey("dbo.LocationProvinces", "ParentId", "dbo.LocationNationals");
            //DropForeignKey("dbo.LocationDistricts", "ParentId", "dbo.LocationProvinces");
            //DropForeignKey("dbo.GroupTables", "ParentId", "dbo.GroupTables");
            //DropForeignKey("dbo.GeneralCategories", "ParentId", "dbo.GeneralCategories");
            //DropIndex("dbo.SystemParameterLangs", new[] { "Id", "Code" });
            //DropIndex("dbo.UserNotes", new[] { "UserId" });
            //DropIndex("dbo.SysMenuFuncs", new[] { "SystemMenuId" });
            //DropIndex("dbo.SystemMenus", new[] { "ParentId" });
            //DropIndex("dbo.RolePermissionProperties", new[] { "Id" });
            //DropIndex("dbo.RolePermissions", new[] { "RoleId" });
            //DropIndex("dbo.RolePermissions", new[] { "SysMenuId" });
            //DropIndex("dbo.Roles", "RoleNameIndex");
            //DropIndex("dbo.Roles", new[] { "ParentId" });
            //DropIndex("dbo.UserRoles", new[] { "RoleId" });
            //DropIndex("dbo.UserRoles", new[] { "UserId" });
            //DropIndex("dbo.UserLogins", new[] { "UserId" });
            //DropIndex("dbo.UserClaims", new[] { "UserId" });
            //DropIndex("dbo.Users", "UserNameIndex");
            //DropIndex("dbo.Users", new[] { "UnitId" });
            //DropIndex("dbo.Users", new[] { "PositionId" });
            //DropIndex("dbo.LocationStreets", new[] { "ParentId" });
            //DropIndex("dbo.LocationWards", new[] { "ParentId" });
            //DropIndex("dbo.LocationProvinces", new[] { "ParentId" });
            //DropIndex("dbo.LocationDistricts", new[] { "ParentId" });
            //DropIndex("dbo.GroupTables", new[] { "ParentId" });
            //DropIndex("dbo.GeneralCategories", new[] { "ParentId" });
            //DropTable("dbo.Utilities");
            //DropTable("dbo.UserLoginHistories");
            //DropTable("dbo.UserLocationMaps");
            DropTable("dbo.TraCuuDiems");
            //DropTable("dbo.TieuSus");
            //DropTable("dbo.TableValues");
            //DropTable("dbo.TableTemplates");
            //DropTable("dbo.TableColumns");
            //DropTable("dbo.TableCells");
            //DropTable("dbo.SysThemes");
            //DropTable("dbo.SysThemeLayouts");
            //DropTable("dbo.SystemParameters");
            //DropTable("dbo.SystemParameterLangs");
            //DropTable("dbo.SysSites");
            //DropTable("dbo.SysSiteAlias");
            //DropTable("dbo.SysPortals");
            //DropTable("dbo.SysPortalReviews");
            //DropTable("dbo.SysPortalAlias");
            //DropTable("dbo.QuaTrinhCongTacs");
            //DropTable("dbo.UserNotes");
            //DropTable("dbo.Units");
            //DropTable("dbo.SysMenuFuncs");
            //DropTable("dbo.SystemMenus");
            //DropTable("dbo.RolePermissionProperties");
            //DropTable("dbo.RolePermissions");
            //DropTable("dbo.Roles");
            //DropTable("dbo.UserRoles");
            //DropTable("dbo.UserLogins");
            //DropTable("dbo.UserClaims");
            //DropTable("dbo.Users");
            //DropTable("dbo.Positions");
            //DropTable("dbo.NhiemKies");
            //DropTable("dbo.News");
            //DropTable("dbo.LocationStreets");
            //DropTable("dbo.LocationWards");
            //DropTable("dbo.LocationNationals");
            //DropTable("dbo.LocationProvinces");
            //DropTable("dbo.LocationDistricts");
            //DropTable("dbo.Histories");
            //DropTable("dbo.HinhAnhHoatDongs");
            //DropTable("dbo.GroupTables");
            //DropTable("dbo.GeneralCategories");
            //DropTable("dbo.EOffices");
            //DropTable("dbo.DataTemps");
            //DropTable("dbo.ChucVuNhiemKies");
            //DropTable("dbo.CanBoChucVuNhiemKies");
            //DropTable("dbo.BaiPhatBieux");
        }
    }
}
