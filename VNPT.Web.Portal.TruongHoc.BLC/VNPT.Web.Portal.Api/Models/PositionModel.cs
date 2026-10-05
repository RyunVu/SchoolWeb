using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
	public class PositionModel : PagingModel
    {
        public PositionModel()
        {

        }
        public PositionModel(Position s)
        {
            Description = s.Description;
            Name = s.Name;
            Id = s.Id;
        }


        public Guid? Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Code { get; set; }
        public int OrderNo { get; set; }
    }
}