using System;
using System.Collections.Generic;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
    public class NewsModelPtt : PagingModel
    {
        public Guid? Id { get; set; }
        public Guid? NewTypeId { get; set; }
        public string NewTypeName { get; set; }
        public string Code { get; set; }
        public string Alias { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string ImageUrl { get; set; }
        public string ShortContent { get; set; }
        public long? Order { get; set; }
        public long? CountView { get; set; }
        public string UnitName { get; set; }
        public NewsModelPtt()
        {

        }
        public string StrCreateDate { get; set; }
        public DateTime? CreateDate { get; set; }
        public string CreateDateString => CreateDate.HasValue ? CreateDate.Value.ToString("dd/MM/yyyy HH:mm:ss") : "";
        public DateTime? UpdateDate { get; set; }
        public string CreateUserId { get; set; }
        public StatusEnum Status { get; set; }
        public string LanguageId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string CodeName { get; set; }
        public string Images { get; set; }
        public string Description { get; set; }
        public string OtherUrl { get; set; }
        public NewsModelPtt(News news)
        {
            Id = news.Id;
            NewTypeId = news.NewTypeId;
            Code = news.Code;
            Alias = news.Alias;
            Title = news.Title;
            Content = news.Content;
            ImageUrl = news.ImageUrl;
            ShortContent = news.ShortContent;
            Order = news.Order;
            CountView = news.CountView;
            CreateDate = news.CreateDate;
            CreateUserId = news.CreateUserId;
            UpdateDate = news.UpdateDate;
            Status = news.Status;
            UnitCode = news.UnitCode;
            LanguageId = news.LanguageId;
            Description = news.Description;
        }
    }

    public class NewsInputPtt
    {
        public string Code { get; set; }
        public string Param { get; set; }
        public string Title { get; set; }
        public string Main { get; set; }
        public int page { get; set; }
        public int pageSize { get; set; }
        public Guid? agencysId { get; set; }
        public Guid? fieldId { get; set; }
        public string fieldCode { get; set; }
        public string keyword { get; set; }
        public Guid? placeId { get; set; }
        public int number { get; set; }
        public int type { get; set; }
    }

    public class NewsResultPtt
    {
        public List<News> ListNews { get; set; }
        public List<News> ListHotNews { get; set; }
        public NewsModelPtt DetailNews { get; set; }
    }
}