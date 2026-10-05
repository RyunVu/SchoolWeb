using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
	public class SysPortalAliasModel : PagingModel
	{
		public Guid Id { get; set; }
		public Guid PortalId { get; set; }
		public string Domain { get; set; }
		public ProtocolWeb Protocol { get; set; }
		public string ProtocolName { get; set; }
		public bool IsMain { get; set; }
		public string Tag { get; set; }
		public string Description { get; set; }
		public string UnitName { get; set; }

		public SysPortalAliasModel() { }

		public SysPortalAliasModel(SysPortalAlias sysPortalAlias)
		{
			using (var db = new WebDbContext())
			{
				Id = sysPortalAlias.Id;
				PortalId = sysPortalAlias.PortalId;
				Domain = sysPortalAlias.Domain;
				Protocol = sysPortalAlias.Protocol;
				ProtocolName = Protocol.ToString().ToLower();
				IsMain = sysPortalAlias.IsMain;
				Tag = sysPortalAlias.Tag;
				Description = sysPortalAlias.Description;
				UnitCode = sysPortalAlias.UnitCode;
				UnitName = !string.IsNullOrEmpty(sysPortalAlias.UnitCode) ? db.Units.FirstOrDefault(x=>x.Code == sysPortalAlias.UnitCode).Name : "";
			}
		}
	}
}