using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Base
{
	public enum SysPortalReviewType
    {
        Contact = 1,
        QA = 2,
        Review = 3
    }
    public class SysPortalReview : BaseModel
    {
        public Guid Id { get; set; }

        public Guid PortalId { get; set; }
        public Guid? ParentId { get; set; }

        [MaxLength(1000)]
        public string Name { get; set; }

        [MaxLength(1000)]
        public string PhoneNo { get; set; }

        [MaxLength(1000)]
        public string Email { get; set; }

        [MaxLength(1000)]
        public string Address { get; set; }

        public string Content { get; set; }

        [MaxLength(1000)]
        public string Subject { get; set; }

        public SysPortalReviewType? ReviewType { get; set; }
        public int? Rate { get; set; }
    }
}
