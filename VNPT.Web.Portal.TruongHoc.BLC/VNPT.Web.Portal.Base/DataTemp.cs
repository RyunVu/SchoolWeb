using System;
using System.ComponentModel.DataAnnotations;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class DataTemp: BaseModel
    {
        public Guid Id { get; set; }

        [MaxLength(50)]
        public string Code { get; set; }

        [MaxLength(1000)]
        public string Value1 { get; set; }

        [MaxLength(2000)]
        public string Value2 { get; set; }

        public string DataJson { get; set; }

        public int? Value3 { get; set; }

        
    }
}
