using System;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class UnitModel : PagingModel
    {
        public UnitModel()
        {

        }
        public UnitModel(Unit s)
        {
            Code = s.Code;
            Description = s.Description;
            Name = s.Name;
            Id = s.Id;
            SortNo = s.SortNo;
        }


        public Guid? Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Code { get; set; }
        public int? SortNo { get; set; }
        public Guid? ProvinceId { get; set; }
        public bool IsProvinceUnit { get; set; }
        public Guid? DistrictId { get; set; }
        public Guid? WardId { get; set; }
    }
}