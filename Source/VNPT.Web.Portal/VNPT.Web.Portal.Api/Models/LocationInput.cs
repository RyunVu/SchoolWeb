using System;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Api.Models
{
    public class LocationInput : PagingModel
    {
        public string Code { get; set; }
        public Guid? ParentId { get; set; }
    }
}