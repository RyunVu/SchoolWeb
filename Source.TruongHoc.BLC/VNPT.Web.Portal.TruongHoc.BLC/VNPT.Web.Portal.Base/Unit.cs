using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using VNPT.Core.Extentions;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public enum UnitFeedbackType
    {
        Nothing = 0,
        All = 1,
        ByLocation = 2,
        ByDivision = 3
    }
    public class Unit : BaseModel
    {
        public Guid Id { get; set; }

        [MaxLength(50)]
        public string Code { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string ImportId { get; set; }

        public Guid? PlaceId { get; set; }


        public UnitFeedbackType UnitFeedbackType { get; set; }

        public Guid? LocationProvinceId { get; set; }
        public Guid? LocationDistrictId { get; set; }
        public Guid? LocationWardId { get; set; }
        public int SortNo { get; set; }
        public virtual IList<User> Users { get; set; }
        public bool IsNotPublic { get; set; }
        public bool? IsProvinceUnit { get; set; }
        public bool? IsPrimary { get; set; }

        public string UnitFeedbackTypeName
        {
            get
            {
                switch (UnitFeedbackType)
                {
                    case UnitFeedbackType.Nothing:
                        return "Không chọn loại";
                    case UnitFeedbackType.All:
                        return "Tất cả phản ánh";
                    case UnitFeedbackType.ByLocation:
                        return "Theo khu vực";
                    case UnitFeedbackType.ByDivision:
                        return "Theo phân công";
                    default:
                        return "";
                }
            }
        }

        public Unit Clone()
        {
            var result = this.CloneValue<Unit>(ignoreProperties: new List<string>() { "Users" });
            return result;
        }
    }

}
