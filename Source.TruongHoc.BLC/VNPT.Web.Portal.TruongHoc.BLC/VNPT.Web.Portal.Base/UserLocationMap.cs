using System;
using System.ComponentModel.DataAnnotations;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class UserLocationMap : BaseModel
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(128)]
        public string UserId { get; set; }
        //location
        public Guid? LocationProvinceId { get; set; } //tỉnh
        public Guid? LocationDistrictId { get; set; } //quận, huyện
        public Guid? LocationWardId { get; set; } //phường, xã
    }

}
