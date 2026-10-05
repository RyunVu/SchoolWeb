using System;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Api.Models
{
    public class GeneralModel : PagingModel
    {

        public GeneralModel()
        {
            
        }

        public Guid? Id { get; set; }

        public string Name { get; set; }
        public string Name2 { get; set; }

        public string Description { get; set; }
        public string Code { get; set; }
    }
}