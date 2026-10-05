using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using VNPT.Core.Extentions;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public enum PositionFeedbackType
    {
        Nothing = 0,
        All = 1,
        ByField = 2,
        ByDivision = 3
    }
    public class Position : BaseModel
    {
        [Required]
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(200)]
        public string Code { get; set; }

        public PositionFeedbackType TypeGetList { get; set; } // All = 1 Or Detail = 2

        [MaxLength(500)]
        public string ImportId { get; set; }

        public virtual IList<User> Users { get; set; }
        public int OrderNo { get; set; }

        public Position Clone()
        {
            var result = this.CloneValue<Position>(ignoreProperties: new List<string>() { "Users" });
            return result;
        }
    }

}
