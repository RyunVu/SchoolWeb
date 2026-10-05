using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using VNPT.Core.Extentions;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
    public class EOffice : BaseModel
    {
        [Key]
        public Guid Id { get; set; }
        public string SoKyHieu { get; set; }
        public DateTime NgayBanHanh { get; set; }
        public string NguoiKy { get; set; }
        public string TrichYeu { get; set; }
        public string CoQuanBanHanh { get; set; }
        public string LoaiVanBan { get; set; }
        public string LinhVuc { get; set; }
        public string CongBaoSo { get; set; }
        public DateTime? NgayPhatHanh { get; set; }
        public string HieuLuc { get; set; }
        public string GhiChu { get; set; }
        public string DinhKemUrl { get; set; }
        public string DocumentId { get; set; }

        public EOffice Clone()
        {
            var result = this.CloneValue<EOffice>(ignoreProperties: new List<string>() { });
            return result;
        }
    }
}
