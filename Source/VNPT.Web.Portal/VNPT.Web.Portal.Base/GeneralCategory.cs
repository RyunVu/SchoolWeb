using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class GeneralCategory : BaseModel
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        public Guid? ParentId { get; set; }

        [MaxLength(20)]
        public string Code { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(100)]
        public string Name_En { get; set; }

        [MaxLength(1000)]
        public string Value { get; set; }

        [MaxLength(2000)]
        public string Value2 { get; set; }

        [MaxLength(1000)]
        public string ImageUrl { get; set; }
        public int? OrderNo { get; set; }

        [ForeignKey("ParentId")]
        public virtual GeneralCategory Parent { get; set; }

        [ForeignKey("ParentId")]
        public virtual IList<GeneralCategory> GeneralCategories { get; set; }

    }

  }