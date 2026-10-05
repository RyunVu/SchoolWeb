using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VNPT.Core.Extentions;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class SystemParameter : BaseModel
    {
        [Key]
        [Column(Order = 1)]
        [MaxLength(100)]
        public string Id { get; set; }

        [Key]
        [Column(Order = 2)]
        [MaxLength(20)]
        public string Code { get; set; }

        public decimal? Value { get; set; }

        public decimal? Value3 { get; set; }

        [MaxLength(2000)]
        public string Value2 { get; set; }

        [MaxLength(2000)]
        public string Value4 { get; set; }


        [MaxLength(1000)]
        public string Value6 { get; set; }

        [MaxLength(1000)]
        public string Value7 { get; set; }

        public bool? Value5 { get; set; }

        public virtual IList<SystemParameterLang> SystemParameterLangs { get; set; }

        public SystemParameter Clone()
        {
            var result = this.CloneValue<SystemParameter>(ignoreProperties: new List<string>() { });
            return result;
        }
    }

    public class SystemParameterLang
    {
        [Key]
        [Column(Order = 1)]
        [ForeignKey("SystemParameter")]
        [MaxLength(20)]
        public string Id { get; set; }

        [Key]
        [ForeignKey("SystemParameter")]
        [Column(Order = 2)]
        [MaxLength(20)]
        public string Code { get; set; }

        [Key]
        [Column(Order = 3)]
        [MaxLength(20)]
        public string LanguageId { get; set; }

        public decimal? Value { get; set; }

        public decimal? Value3 { get; set; }

        [MaxLength(2000)]
        public string Value2 { get; set; }

        [MaxLength(2000)]
        public string Value4 { get; set; }

        public bool? Value5 { get; set; }

        [MaxLength(1000)]
        public string Value6 { get; set; }

        [MaxLength(1000)]
        public string Value7 { get; set; }

        public virtual SystemParameter SystemParameter { get; set; }

    }
}
