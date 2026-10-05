using System;
using System.ComponentModel.DataAnnotations;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class Utility : BaseModel
    {
        public Guid Id { get; set; }

        public Guid? ParentId { get; set; }

        [MaxLength(100)]
        public string Code { get; set; }

        [MaxLength(1000)]
        public string ImageUrl { get; set; }


        [MaxLength(50)]
        public string PhoneNumber { get; set; }

        [MaxLength(1000)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string GeoLocation { get; set; }

        [MaxLength(1000)]
        public string Address { get; set; }

        public int OrderNo { get; set; }

        public Guid? LocationProvinceId { get; set; } //tỉnh
        public Guid? LocationDistrictId { get; set; } //quận, huyện
        public Guid? LocationWardId { get; set; } //phường, xã

        [MaxLength(200)]
        public string ImportId { get; set; }

        [MaxLength(200)]
        public string Email { get; set; }
        [MaxLength(200)]
        public string WebsiteUrl { get; set; }
        [MaxLength(200)]
        public string Price { get; set; }
        public bool? IsGetAllChildren { get; set; }
    }
}
