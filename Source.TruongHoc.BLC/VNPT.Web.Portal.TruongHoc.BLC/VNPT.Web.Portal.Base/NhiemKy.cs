using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VNPT.Core.Extentions;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class NhiemKy :BaseModel
    {
        public Guid Id { get; set; }
        public Guid TypeId { get; set; }
        public string HinhAnh { get; set; }
        public string Ten { get; set; }
        public int ThuTu { get; set; }
        public int TuNam { get; set; }
        public int? DenNam { get; set; }
        public NhiemKy Clone()
        {
            var result = this.CloneValue<NhiemKy>();
            return result;
        }
    }

    public class ChucVuNhiemKy
    {
        public Guid Id { get; set; }
        public Guid ChucVuId { get; set; }

        public Guid NhiemKyId { get; set; }

        public int ThuTu { get; set; }
    }

    public class CanBoChucVuNhiemKy
    {
        [Key]
        [Column(Order = 1)]
        public Guid ChucVuNhiemKyId { get; set; }
        [Key]
        [Column(Order = 2)]
        public Guid TieuSuId { get; set; }
        public int ThuTu { get; set; }
    }
}
