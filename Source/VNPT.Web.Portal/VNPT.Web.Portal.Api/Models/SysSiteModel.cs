using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
	public class SysSiteModel : PagingModel
	{
		public Guid Id { get; set; }
		public string Code { get; set; }
		public string Name { get; set; }
		public string Subdomain { get; set; }
		public Guid PortalId { get; set; }
		public string AdministratorId { get; set; }
		public string SiteUrl { get; set; }
		public DateTime? ExpiryDate { get; set; }
		public string Logo { get; set; }
		public Guid? ParentId { get; set; }
		public bool? IsSysSite { get; set; }
		public int? SysSiteCode { get; set; }
		public Guid LayoutId { get; set; }
		public string LayoutName { get; set; }
		public bool IsAuthorized { get; set; }
		public bool MenuEnabled { get; set; }
		public int MenuOrder { get; set; }
		public bool IsFeatured { get; set; }

		public SysSiteModel() { }

		public SysSiteModel(SysSite sysSite)
		{
			using (var db = new WebDbContext())
			{
				Id = sysSite.Id;
				Code = sysSite.Code;
				Name = sysSite.Name;
				Subdomain = sysSite.Subdomain;
				PortalId = sysSite.PortalId;
				AdministratorId = sysSite.AdministratorId;
				SiteUrl = sysSite.SiteUrl;
				ExpiryDate = sysSite.ExpiryDate;
				Logo = sysSite.Logo;
				ParentId = sysSite.ParentId;
				IsSysSite = sysSite.IsSysSite;
				SysSiteCode = sysSite.SysSiteCode;
				LayoutId = sysSite.LayoutId;
				LayoutName = sysSite.LayoutId != null ? db.SysThemeLayout.FirstOrDefault(x=>x.Id == sysSite.LayoutId).Name : "";
				IsAuthorized = sysSite.IsAuthorized;
				MenuEnabled = sysSite.MenuEnabled;
				MenuOrder = sysSite.MenuOrder;
				IsFeatured = sysSite.IsFeatured;
			}
		}
	}
}