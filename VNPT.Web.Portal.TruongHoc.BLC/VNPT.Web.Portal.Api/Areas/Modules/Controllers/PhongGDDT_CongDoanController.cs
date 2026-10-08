using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using System.Threading.Tasks;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Code;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using PagedList;
using System.Data;
using System.Data.SqlClient;
using System.Data.Entity.Infrastructure;
using System;
using System.Net;
using VNPT.Web.Portal.Api.DTO;
using Newtonsoft.Json.Linq;
using System.Web;

namespace VNPT.Web.Portal.Api.Areas.Modules.Controllers
{
	public class PhongGDDT_CongDoanController : Controller
	{
		public List<News> GetNews(string code, int number, int type)
		{
			var infomation = Session["PortalInformation"] as PortalInformation;

			if (infomation != null && !string.IsNullOrEmpty(infomation.PortalCode))
			{
				infomation.PortalCode = infomation.PortalCode.ToLower();

				HttpCookie cookie = Request.Cookies["Language_Portal"];

				string lang = "vi";

				if (cookie != null)
				{
					lang = cookie.Value;
					// Use the cookie value as needed
				}
                var codes = code.Split('.');
                var code1 = codes[0];
                string typeCode = null;
                if (codes.Length > 1)
                {
                    typeCode = codes[1];
                }

                code = code1;
                using (var context = new WebDbContext())
				{
					var cmd = context.Database.Connection.CreateCommand();

					cmd.CommandText = "[dbo].[Portal_CongDoan_GetNews]";
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.Add(new SqlParameter("@p_code", code.ToLower()));
					cmd.Parameters.Add(new SqlParameter("@p_unitcode", infomation.PortalCode));
					cmd.Parameters.Add(new SqlParameter("@p_lang", lang));
                    cmd.Parameters.Add(new SqlParameter("@p_type_code", typeCode));
					cmd.Parameters.Add(new SqlParameter("@p_type", type));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", 1));
					cmd.Parameters.Add(new SqlParameter("@p_page_size", number));
					var connection = context.Database.Connection;

					if (connection.State != ConnectionState.Open)
						connection.Open();

					using (var reader = cmd.ExecuteReader())
					{
						List<News> listNews = ((IObjectContextAdapter)context).ObjectContext
							.Translate<News>(reader)
							.ToList();

						connection.Close();

						return listNews;
					}
				}
			}

			return null;
		}
		public ActionResult StyleHaft(NewsInput input)
		{
			List<News> listNews = GetNews(input.Code, input.number, 1).ToList();

			if (listNews.Count > 0)
			{
				return PartialView(listNews);
			}
			return null;
		}

        public ActionResult StyleHaftPGDPhanTrang(NewsInput input)
        {
            //List<News> listNews = GetNews(input.Code, input.number, 1).ToList();

            //if (listNews.Count > 0)
            //{
            //    return PartialView(listNews);
            //}
            
			ViewBag.NewsInput = input;
            return PartialView(null);
        }

        public ActionResult StyleHaftStar(NewsInput input)
        {
            List<News> listNews = GetNews(input.Code, input.number, 1).ToList();

            if (listNews.Count > 0)
            {
                return PartialView(listNews);
            }
            return null;
        }

        public ActionResult StyleHaft2(NewsInput input)
		{
			List<News> listNews = GetNews(input.Code, input.number, 1).ToList();

			if (listNews.Count > 0)
			{
				return PartialView(listNews);
			}
			return null;
		}
		public ActionResult StyleFull(NewsInput input)
		{
			List<News> listNews = GetNews(input.Code, input.number, 1).ToList();

			if (listNews.Count > 0)
			{
				return PartialView(listNews);
			}
			return null;
		}
		public ActionResult CongDoanHotNews(NewsInput input)
		{
			var infomation = Session["PortalInformation"] as PortalInformation;

			if (infomation != null && !string.IsNullOrEmpty(infomation.PortalCode))
			{
				infomation.PortalCode = infomation.PortalCode.ToLower();

				HttpCookie cookie = Request.Cookies["Language_Portal"];

				string lang = "vi";

				if (cookie != null)
				{
					lang = cookie.Value;
					// Use the cookie value as needed
				}

				using (var context = new WebDbContext())
				{
					var cmd = context.Database.Connection.CreateCommand();

					cmd.CommandText = "[dbo].[Portal_CongDoan_CongDoanHotNews]";
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.Add(new SqlParameter("@p_code", input.Code));
					cmd.Parameters.Add(new SqlParameter("@p_unitcode", infomation.PortalCode));
					cmd.Parameters.Add(new SqlParameter("@p_lang", lang));
					cmd.Parameters.Add(new SqlParameter("@p_page_index", 1));
					cmd.Parameters.Add(new SqlParameter("@p_page_size", input.number));
					var connection = context.Database.Connection;

					if (connection.State != ConnectionState.Open)
						connection.Open();

					using (var reader = cmd.ExecuteReader())
					{
						List<News> lnews = ((IObjectContextAdapter)context).ObjectContext
							.Translate<News>(reader)
							.ToList();

						connection.Close();

						return PartialView(lnews);
					}
				}
			}

			return null;
		}

		public ActionResult SearchNews(NewsInput input)
		{
			var infomation = Session["PortalInformation"] as PortalInformation;

			if (infomation != null && !string.IsNullOrEmpty(infomation.PortalCode))
			{
				infomation.PortalCode = infomation.PortalCode.ToLower();

				HttpCookie cookie = Request.Cookies["Language_Portal"];

				string lang = "vi";

				if (cookie != null)
				{
					lang = cookie.Value;
					// Use the cookie value as needed
				}

				input.keyword = string.IsNullOrWhiteSpace(input.keyword) ? "" : input.keyword;
				//input.keyword = input.keyword.RemoveUnicode().ToLower();

				using (var context = new WebDbContext())
				{
					var cmd = context.Database.Connection.CreateCommand();

					cmd.CommandText = "[dbo].[Portal_CongDoan_SearchNews]";
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.Add(new SqlParameter("@p_keyword", input.keyword));
					cmd.Parameters.Add(new SqlParameter("@p_unitcode", infomation.PortalCode));
					cmd.Parameters.Add(new SqlParameter("@p_lang", lang));
					cmd.Parameters.Add(new SqlParameter("@p_page_index", input.page));
					cmd.Parameters.Add(new SqlParameter("@p_page_size", input.pageSize));
					var connection = context.Database.Connection;

					if (connection.State != ConnectionState.Open)
						connection.Open();

					using (var reader = cmd.ExecuteReader())
					{
						List<News> lnews = ((IObjectContextAdapter)context).ObjectContext
							.Translate<News>(reader)
							.ToList();

						reader.NextResult();

						var total = ((IObjectContextAdapter)context).ObjectContext
							.Translate<int>(reader)
							.ToList();

						connection.Close();

						return Json(new {total = total.FirstOrDefault(), data = lnews}, JsonRequestBehavior.DenyGet);
					}
				}
			}

			return null;
		}
		//todo: chưa chuyển store
		public List<News> GetNews(List<string> codes, int number)
		{
			using (var context = new WebDbContext())
			{
				var infomation = Session["PortalInformation"] as PortalInformation;

				if (infomation != null)
				{
					infomation.PortalCode = infomation.PortalCode.ToLower();
					var getNews = context.News
						.Where(s => codes.Any(code => code.ToLower() == s.Code.ToLower())
									&& s.Status == StatusEnum.Used
									&& s.UnitCode.ToLower() == infomation.PortalCode
						)
						.OrderByDescending(s => s.CreateDate).Take(number)
						.ToList();

					return getNews;
				}
				return null;
			}
		}
		//todo: chưa chuyển store
		public JsonResult GetNewsList2(NewsInput input)
		{
			input.Code = string.IsNullOrEmpty(input.Code) ? NewsCode.TINHOATDONGCUAXA : input.Code;
			input.Code = input.Code.TrimEnd('/');
			input.Code = input.Code.ToLower();
			using (var context = new WebDbContext())
			{
				List<News> lstData = null;
				if (input.type == 1)
				{
					lstData = GetNews(input.Code, input.number, 1).ToList();
				}
				else if (input.type == 2)
				{
					List<string> codes;
					codes = context.GeneralCategories
						.Where(s => s.Code.ToLower() == input.Code.ToLower() && s.Status == StatusEnum.Used)
						.Select(s => s.Value).ToList();
					lstData = GetNews(codes, input.number).ToList();
				}

				if (!string.IsNullOrEmpty(input.keyword))
				{
					input.keyword = input.keyword.RemoveUnicode().ToLower();
					lstData = lstData.Where(s => ((!string.IsNullOrEmpty(s.Title) ? s.Title.ToLower().RemoveUnicode() : "").Contains(input.keyword))
										).ToList();
				}
				var lstDoc = lstData.Select(s => new
				{
					ALIAS = s.Alias,
					URL_IMG = s.ImageUrl,
					TITLE = s.Title,
					CREATE = s.CreateDate.ToString("dd/MM/yyyy"),
					SHORT_CONTENT = s.ShortContent,
					CONTENT = s.Content,
					TOTALPAGE = lstData.Count().ToString(),
				}).ToList();
				var listDoc = lstDoc.ToPagedList(input.page, input.pageSize);
				return Json(listDoc, JsonRequestBehavior.DenyGet);
			}
		}
		public ActionResult GetListAskAnswer(QaInput input)
		{
			var infomation = Session["PortalInformation"] as PortalInformation;

			if (infomation != null && !string.IsNullOrEmpty(infomation.PortalCode))
			{
				infomation.PortalCode = infomation.PortalCode.ToLower();

				using (var context = new WebDbContext())
				{
					if (!input.Page.HasValue || input.Page.Value < 1) input.Page = 1;
					if (!input.PageSize.HasValue || input.PageSize < 11) input.PageSize = 10;

					ViewBag.CurrentPageSize = input.PageSize;
					ViewBag.Page = input.Page;

					// Lấy danh sách phân trang
					var listReview = context.SysPortalReviews.Where(x => x.Status == StatusEnum.Completed
																		 && x.ReviewType == SysPortalReviewType.QA
																		 && x.ParentId == null && x.UnitCode.ToLower() == infomation.PortalCode).OrderByDescending(s => s.CreateDate).ToList();

					var lstReview = listReview.Select(s => new SysPortalReviewModel()
					{
						Subject = s.Subject,
						Reviews = context.SysPortalReviews.Where(a => a.Status == StatusEnum.Used && a.ParentId == s.Id && a.UnitCode.ToLower() == infomation.PortalCode).ToList(),
						Email = s.Email,
						PhoneNo = s.PhoneNo,
						Name = s.Name,
						ParentId = s.ParentId,
						Id = s.Id,
						Content = s.Content,
						CreateDate = s.CreateDate
					}).ToList();

					var data = lstReview.ToPagedList(input.Page.Value, input.PageSize.Value);

					return PartialView(data);
				}
			}

			return null;
		}
		public ActionResult GetDetailAnswer(Guid id)
		{
			using (var context = new WebDbContext())
			{
				var item = context.SysPortalReviews.FirstOrDefault(s => s.Status == StatusEnum.Used
															&& s.Id == id
															&& s.ParentId != null
															);
				if (item != null)
				{
					var data = new
					{
						NAME = item.Name,
						CONTENT = item.Content,
						PHONE = item.PhoneNo,
						EMAIL = item.Email,
						ADDRESS = item.Address,
						SUBJECT = item.Subject,
						CREATE = item.CreateDate.ToString("dd/MM/yyyy"),
					};
					return Json(new
					{
						data,
						success = true
					}, JsonRequestBehavior.DenyGet);
				}
				return null;
			}
		}

		[HttpPost]
		public JsonResult InsertAskAnswer(SysPortalReviewInput input)
		{
			using (var context = new WebDbContext())
			{
				var infomation = Session["PortalInformation"] as PortalInformation;
				string secretKey = SystemParameterDto.GetParameter("RECAPTCHA", null, infomation.PortalCode.ToUpper()).Value4;
				var client = new WebClient();

				//var captcha = input.captcha;
				//string urlReQuest = $"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={captcha}";
				//var result = client.DownloadString(urlReQuest);
				//var obj = JObject.Parse(result);
				//var status = (bool)obj.SelectToken("success");

				var status = true;

				string messagePost;
				bool statusPost = false;

				if (status && infomation != null)
				{
					try
					{
						input.Content = input.Content.Trim();

						if (string.IsNullOrEmpty(input.Content) || input.Content == "")
						{
							messagePost = "Nội dung không được để trống";
						}

						SysPortalReview cmt = new SysPortalReview();
						cmt.Id = Guid.NewGuid();
						cmt.CreateDate = DateTime.Now;
						cmt.Status = StatusEnum.Used;
						cmt.Content = input.Content;
						cmt.Name = input.Name;
						cmt.Email = input.Email;
						cmt.PhoneNo = input.PhoneNo;
						cmt.UnitCode = infomation.PortalCode;
						cmt.Subject = input.Subject;
						cmt.Address = input.Address;
						cmt.PortalId = infomation.PortalId;
						cmt.ReviewType = SysPortalReviewType.QA;
						context.SysPortalReviews.Add(cmt);
						var isSaved = context.SaveChanges() > 0;
						if (isSaved)
						{
							messagePost = "Gửi câu hỏi thành công";
							statusPost = true;
						}
						else
						{
							messagePost = "Gửi câu hỏi thất bại";
						}

					}
					catch (Exception e)
					{
						messagePost = e.Message;
						statusPost = false;
					}
				}
				else
				{
					messagePost = "Xác nhận mã capcha";
				}

				var response = new
				{
					Message = messagePost,
					Status = statusPost
				};

				return Json(response, JsonRequestBehavior.DenyGet);
			}
		}

        [HttpPost]
        public JsonResult InsertReviews(SysPortalReviewInput input)
        {
            using (var context = new WebDbContext())
            {
                var infomation = Session["PortalInformation"] as PortalInformation;
                var client = new WebClient();

                string messagePost;
                bool statusPost = false;

                if (infomation != null)
                {
                    try
                    {
                        SysPortalReview rv = new SysPortalReview();
                        rv.Id = Guid.NewGuid();
                        rv.CreateDate = DateTime.Now;
                        rv.Status = StatusEnum.Used;
                        rv.Content = input.Content;
                        rv.Name = input.Name;
                        rv.UnitCode = infomation.PortalCode;
                        rv.PortalId = infomation.PortalId;
                        rv.ReviewType = SysPortalReviewType.Review;
                        rv.Rate = input.Rate;
                        context.SysPortalReviews.Add(rv);
                        var isSaved = context.SaveChanges() > 0;
                        if (isSaved)
                        {
                            messagePost = "Gửi đánh giá thành công";
                            statusPost = true;
                        }
                        else
                        {
                            messagePost = "Gửi đánh giá thất bại";
                        }

                    }
                    catch (Exception e)
                    {
                        messagePost = e.Message;
                        statusPost = false;
                    }
                }
                else
                {
                    messagePost = "Lỗi!";
                }

                var response = new
                {
                    Message = messagePost,
                    Status = statusPost
                };

                return Json(response, JsonRequestBehavior.DenyGet);
            }
        }
    
        public ActionResult GetListReviews(SysPortalReviewInput input)
        {
            var information = Session["PortalInformation"] as PortalInformation;

            if (information != null && !string.IsNullOrEmpty(information.PortalCode))
            {
                information.PortalCode = information.PortalCode.ToLower();

                using (var context = new WebDbContext())
                {
                    if (input.pageNum < 1) input.pageNum = 1;
                    if (input.pageSize < 11) input.pageSize = 10;

                    ViewBag.CurrentPageSize = input.pageSize;
                    ViewBag.Page = input.pageNum;

                    var cmd = context.Database.Connection.CreateCommand();

                    cmd.CommandText = "[dbo].[Reviews_list]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_status", StatusEnum.Used));
                    cmd.Parameters.Add(new SqlParameter("@p_unitcode", information.PortalCode));                  
                    cmd.Parameters.Add(new SqlParameter("@p_reviewtype", SysPortalReviewType.Review));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", input.pageNum));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", input.pageSize));
                    var connection = context.Database.Connection;

                    if (connection.State != ConnectionState.Open)
                        connection.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        List<SysPortalReview> listReviews = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<SysPortalReview>(reader)
                            .ToList();
                        reader.NextResult();

                        var total = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<int>(reader)
                            .FirstOrDefault();

                        Decimal avg = 5;
                        if(listReviews.Count > 0)
                        {
                            avg = (decimal)Math.Round(listReviews.Average(x => x.Rate).Value, 1, MidpointRounding.AwayFromZero);
                        }

                        connection.Close();

                        var lstReview = listReviews.Select(s => new SysPortalReviewModel()
                        {
                            Id = s.Id,
                            Name = s.Name,
                            Content = s.Content,
                            Rate = s.Rate,
                            Total = total,
                            Avg = avg.ToString().Replace(',', '.')
                        }).ToList();

                        var data = lstReview.ToPagedList(input.pageNum, input.pageSize);
                        return data.Count > 0 ? PartialView(data) : null;

                    }
                }
            }

            return null;
        }
    }
}