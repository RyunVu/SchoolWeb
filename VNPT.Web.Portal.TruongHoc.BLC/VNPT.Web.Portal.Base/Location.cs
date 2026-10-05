using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class Location : BaseModel
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(200)]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Name2 { get; set; }
        [MaxLength(200)]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ShortName { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Guid? ParentId { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        [MaxLength(200)]
        public string GeoLocationCenter { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        [MaxLength(20)]
        public string CodeId { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        [MaxLength(20)]
        public string CodeParentId { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? OrderNo { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool? IsPrimary { get; set; }

        [MaxLength(200)]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ImportId { get; set; }
    }

    /// <summary>
    /// danh sách quốc gia
    /// </summary>
    public class LocationNational : Location
    {
        [MaxLength(50)]
        public string Alpha3Code { get; set; }
        [MaxLength(100)]
        public string Alpha2Language { get; set; }
        [MaxLength(100)]
        public string Alpha3Language { get; set; }
        //
        public virtual IList<LocationProvince> LocationProvince { get; set; }
    }

    /// <summary>
    /// danh sách tỉnh/ thành phố trung ương
    /// </summary>
    public class LocationProvince : Location
    {
        [ForeignKey("ParentId")]
        public virtual LocationNational LocationNational { get; set; }
        public virtual IList<LocationDistrict> LocationDistricts { get; set; }
    }

    /// <summary>
    /// danh sách thành phố/ huyện
    /// </summary>
    public class LocationDistrict : Location
    {
        [ForeignKey("ParentId")]
        public virtual LocationProvince LocationProvince { get; set; }
        public virtual IList<LocationWard> LocationWards { get; set; }
    }

    /// <summary>
    /// danh sách phường/ xã
    /// </summary>
    public class LocationWard : Location
    {
        [ForeignKey("ParentId")]
        public virtual LocationDistrict LocationDistrict { get; set; }
        public virtual IList<LocationStreet> LocationStreets { get; set; }
        public bool? HasOtp { get; set; }
    }

    /// <summary>
    /// danh sách tên đường
    /// </summary>
    public class LocationStreet : Location
    {
        [ForeignKey("ParentId")]
        public virtual LocationWard LocationWard { get; set; }
    }
}

