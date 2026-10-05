using System;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class LocationItem
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public string UnitCode { get; set; }

        public string CodeId { get; set; }

        public LocationItem()
        {

        }

        public LocationItem(Location location)
        {
            Id = location.Id;
            Name = location.Name;
            UnitCode = location.UnitCode;
            CodeId = location.UnitCode;
            ParentId = location.ParentId;
        }

        public Guid? ParentId { get; set; }
    }
    public class LocationCodeItem
    {
        public string Id { get; set; }
        public string Name { get; set; }


        public LocationCodeItem()
        {

        }

        public LocationCodeItem(Location location)
        {
            Id = location.UnitCode;
            Name = location.Name;
        }
    }
}