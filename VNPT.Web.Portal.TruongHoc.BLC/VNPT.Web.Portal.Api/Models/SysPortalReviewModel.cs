using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
	public class SysPortalReviewModel : PagingModel
	{
		public List<SysPortalReview> Reviews { get; set; }
        public Guid PortalId { get; set; }
        public Guid Id { get; set; }
        public string Subject { get; set; }
        public string Name { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Content { get; set; }
        public SysPortalReviewType? ReviewType { get; set; }
        public int? Rate { get; set; }
        public string Tag { get; set; }
        public string Description { get; set; }
        public Guid? ParentId { get; set; }
        public string LanguageId { get; set; }
        public DateTime? CreateDate { get; set; }
        public StatusEnum Status { get; set; }
        public int? Total { get; set; }
        public string Avg { get; set; }

        public SysPortalReviewModel() { }
        public SysPortalReviewModel(SysPortalReview sysPortalReview)
        {
            Id = sysPortalReview.Id;
            PortalId = sysPortalReview.PortalId;
            Name = sysPortalReview.Name;
            PhoneNo = sysPortalReview.PhoneNo;
            Email = sysPortalReview.Email;
            Address = sysPortalReview.Address;
            Content = sysPortalReview.Content;
            Subject = sysPortalReview.Subject;
            Tag = sysPortalReview.Tag;
            Description = sysPortalReview.Description;
            LanguageId = sysPortalReview.LanguageId;
            ParentId = sysPortalReview.ParentId;
            UnitCode = sysPortalReview.UnitCode;
            ReviewType = sysPortalReview.ReviewType;
            Rate = sysPortalReview.Rate;
            CreateDate = sysPortalReview.CreateDate;
            Status = sysPortalReview.Status;
        }
	}

	public class SysPortalReviewInput
    {
        public Guid PortalId { get; set; }
        public Guid Id { get; set; }
        public string Subject { get; set; }
        public string Name { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Content { get; set; }
        public decimal ReviewType { get; set; }
        public int Rate { get; set; }
        public string Tag { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public Guid? ParentId { get; set; }
        public Byte[] CreateUserId { get; set; }
        public DateTime? CreateDate { get; set; }
        public Byte[] UpdateUserId { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string LanguageId { get; set; }
        public string UnitCode { get; set; }
        public string captcha { get; set; }
        public int pageNum { get; set; }
        public int pageSize { get; set; }
        public int number { get; set; }
    }
}