using System;
using System.Linq;
using Newtonsoft.Json;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
	public class GeneralCategoryModel : PagingModel
	{
		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public Guid? Id { get; set; }
		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string Name { get; set; }
		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string Name_En { get; set; }
		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string Value { get; set; }
		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string Code { get; set; }
		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string ImageUrl { get; set; }
		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string Value2 { get; set; }
		[JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
		public string Description { get; set; }
		public string UnitName { get; set; }
		public string Token { get; set; }

		public GeneralCategoryModel()
		{

		}

		public GeneralCategoryModel(GeneralCategory model)
		{
			using (var db = new WebDbContext())
			{
				Id = model.Id;
				Name = model.Name;
				Name_En = model.Name_En;
				Value = model.Value;
				Code = model.Code;
				ImageUrl = model.ImageUrl;
				Value2 = model.Value2;
				Description = model.Description;
				UnitCode = model.UnitCode;
				UnitName = !string.IsNullOrEmpty(model.UnitCode) ? db.Units.FirstOrDefault(x=>x.Code == model.UnitCode)?.Name : "";
			}
		}
	}
}