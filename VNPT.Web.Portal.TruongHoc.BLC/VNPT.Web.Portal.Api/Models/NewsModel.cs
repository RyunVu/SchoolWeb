using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Models
{
	public class NewsModel : PagingModel
    {
        public Guid? Id { get; set; }
        public List<Guid> Ids { get; set; }
        public Guid? NewTypeId { get; set; }
        public string NewTypeName { get; set; }
        public string Code { get; set; }
        public string Alias { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Title_En { get; set; }
        public string Content_En { get; set; }
        public string ImageUrl { get; set; }
        public string ShortContent { get; set; }
        public string AudioUrl { get; set; }
        public DateTime? AudioCreateDate { get; set; }
        public long? Order { get; set; }
        public long? CountView { get; set; }
        public string UnitName { get; set; }
        public string Description { get; set; }
        public NewsModel()
        {

        }
        public string StrCreateDate { get; set; }
        public DateTime? CreateDate { get; set; }
        public string CreateDateString => CreateDate.HasValue ? CreateDate.Value.ToString("dd/MM/yyyy HH:mm:ss") : "";
        public DateTime? UpdateDate { get; set; }
        public  string CreateUserId { get; set; }
        public StatusEnum? Status { get; set; }
        public string LanguageId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string UnitCode { get; set; }
        public string CodeName { get; set; }
        public string OtherUrl { get; set; }
        public bool IsNewsImage { get; set; }
        public bool IsOpenBlankPage { get; set; }
        public bool IsOpenImageOnly { get; set; }
        public string Token { get; set; }
        public NewsModel(News news)
        {
            Id = news.Id;
            NewTypeId = news.NewTypeId;
            Code = news.Code;
            Alias = news.Alias;
            Title = news.Title;
            Content = news.Content;
            ImageUrl = news.ImageUrl;
            ShortContent = news.ShortContent;
            AudioUrl = news.AudioUrl;
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

    public class NewsInput
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
        public string keyword{ get; set; }
        public Guid? placeId { get; set; }
        public int number { get; set; }
        public int type { get; set; }
    }

    public class NewsResult
    {
        public List<News> ListNews { get; set; }
        public List<News> ListHotNews { get; set; }
        public NewsModel DetailNews { get; set; }
    }

    public class NewsResult2
    {
        public List<News> ListNews { get; set; }
        public List<News> ListHotNews { get; set; }
        public News DetailNews { get; set; }
    }

    public class HomeSliderNewModel
    {
        public string Description { get; set; }
        public List<ImageItem> GetImages()
        {
            if (string.IsNullOrEmpty(Description))
                return new List<ImageItem>();

            try
            {
                return JsonConvert.DeserializeObject<List<ImageItem>>(Description) ?? new List<ImageItem>();
            }
            catch
            {
                return new List<ImageItem>();
            }
        }
    }

    public class NewApi : News
    {
        public string FullLink { get; set; }
    }
    public class NewsApiRequest
    {
        public string UnitCode { get; set; }
        public string Code { get; set; }
        public string Page { get; set; }
        public string PageSize { get; set; }
        public string Number { get; set; }
        public string Language { get; set; }
    }
    public class ApiResponse<T>
    {
        public string Code { get; set; }
        public string Message { get; set; }
        public T Result { get; set; }
        public int TotalRow { get; set; }
    }
}