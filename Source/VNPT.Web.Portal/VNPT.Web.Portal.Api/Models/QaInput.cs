using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNPT.Web.Portal.Api.Models
{
	public class QaInput
	{
		public Guid? Id { get; set; }
		public Guid? sortOrder { get; set; }
		public string Keyword { get; set; }
		public int? Page { get; set; }
		public int? PageSize { get; set; }
	}
}