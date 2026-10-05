using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
	[VnptAuthorization]
	public class SysPortalReviewController : ApiController
	{
		[HttpPost]
		public IHttpActionResult GetList(SysPortalReviewModel input)
		{
			try
			{
				using (var db = new WebDbContext())
				{
					string userId = userId = User.Identity.GetUserId();
					var user = db.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);

					if (User.IsInRole(RoleCode.SuperAdminSystem))
					{
						user.UnitCode = input.UnitCode;
					}

					string tagTemp = "";

					if (!string.IsNullOrEmpty(input.Tag) && input.Tag == "1")
					{
						tagTemp = "DTL";
					}

					var cmd = db.Database.Connection.CreateCommand();

					cmd.CommandText = "[dbo].[SysPortalReviews_list]";
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.Add(new SqlParameter("@p_unitcode", user.UnitCode ));
					cmd.Parameters.Add(new SqlParameter("@p_keyword", input.Keyword));
					cmd.Parameters.Add(new SqlParameter("@p_tag", !string.IsNullOrEmpty(input.Tag) && input.Tag != "0" ? tagTemp : null));
					cmd.Parameters.Add(new SqlParameter("@p_status", input.Status));
					cmd.Parameters.Add(new SqlParameter("@p_page_index", input.PageIndex ?? 1));
					cmd.Parameters.Add(new SqlParameter("@p_page_size", input.PageSize ?? 10));
					var connection = db.Database.Connection;
					if (connection.State != ConnectionState.Open)
						connection.Open();
					using (var reader = cmd.ExecuteReader())
					{
						var resultTemp = ((IObjectContextAdapter)db).ObjectContext
							.Translate<SysPortalReviewModel>(reader)
							.ToList();
						reader.NextResult();

						var total = ((IObjectContextAdapter)db).ObjectContext
							.Translate<int>(reader)
							.ToList();
						connection.Close();
						return Json(new ResultModel
						{
							Code = ResultCode.Success,
							Result = resultTemp,
							TotalRow = total.FirstOrDefault()
						});
					}
				}
			}
			catch (Exception e)
			{
				return Json(new ResultModel
				{
					Code = ResultCode.Exception,
					Message = e.Message + "\n" + e.StackTrace,
					Result = null
				});
			}
		}

		[HttpPost]
		public IHttpActionResult ChangePublic(SysPortalReviewModel input)
		{
			try
			{
				using (var context = new WebDbContext())
				{
					var item = context.SysPortalReviews.FirstOrDefault(s => s.Id == input.Id && s.Status != StatusEnum.Deleted);
					if (item == null)
						return Json(new ResultModel
						{
							Code = ResultCode.NotFoundData,
							Message = "Dữ liệu đã bị xóa!"
						});
					item.Status = StatusEnum.Completed;
					context.Entry(item).State = EntityState.Modified;
					if (context.SaveChanges() > 0)
						return Json(new ResultModel
						{
							Code = ResultCode.Success
						});
					return Json(new ResultModel
					{
						Code = ResultCode.UnSuccess,
						Message = "Không cập nhật được!"
					});
				}
			}
			catch (Exception e)
			{
				return Json(new ResultModel
				{
					Code = ResultCode.UnknowError,
					Result = null,
					Message = e.Message
				});
			}
		}
		[HttpPost]
		public IHttpActionResult ChangeUnPublic(SysPortalReviewModel input)
		{
			try
			{
				using (var context = new WebDbContext())
				{
					var item = context.SysPortalReviews.FirstOrDefault(s => s.Id == input.Id && s.Status != StatusEnum.Deleted);
					if (item == null)
						return Json(new ResultModel
						{
							Code = ResultCode.NotFoundData,
							Message = "Dữ liệu đã bị xóa!"
						});
					item.Status = StatusEnum.CDC_6;
					context.Entry(item).State = EntityState.Modified;
					if (context.SaveChanges() > 0)
						return Json(new ResultModel
						{
							Code = ResultCode.Success
						});
					return Json(new ResultModel
					{
						Code = ResultCode.UnSuccess,
						Message = "Không cập nhật được!"
					});
				}
			}
			catch (Exception e)
			{
				return Json(new ResultModel
				{
					Code = ResultCode.UnknowError,
					Result = null,
					Message = e.Message
				});
			}
		}

		[HttpPost]
		public IHttpActionResult Delete(SysPortalReviewModel item)
		{
			try
			{
				using (var db = new WebDbContext())
				{
					var record = db.SysPortalReviews.FirstOrDefault(s => s.Id == item.Id && s.Status != StatusEnum.Deleted);
					if (record != null)
					{
						record.Status = StatusEnum.Deleted;
						db.Entry(record).State = EntityState.Modified;
						var result = db.SaveChanges();
						return Json(new ResultModel()
						{
							Code = result > 0 ? ResultCode.Success : ResultCode.Fail,
							Message = result > 0 ? ResultCode.Success.ToString() : ResultCode.Fail.ToString(),
							Result = item
						});
					}
				}
				return Json(new ResultModel()
				{
					Code = ResultCode.NotFoundData,
					Message = ResultCode.NotFoundData.ToString(),
					Result = item
				});
			}
			catch (Exception e)
			{
				return Json(new ResultModel()
				{
					Code = ResultCode.Fail,
					Result = null,
					Message = e.Message
				});
			}
		}

		[HttpPost]
		public IHttpActionResult GetListChild(SysPortalReviewModel input)
		{
			try
			{
				using (var db = new WebDbContext())
				{
					if (User.IsInRole(RoleCode.SuperAdminSystem))
					{
						if (string.IsNullOrEmpty(input.UnitCode) || input.UnitCode == "undefined")
							input.UnitCode = User.Identity.UnitCode();

						if (string.IsNullOrEmpty(input.UnitCode))
							input.UnitCode = "LDG";

						var sysPortalReviews = db.SysPortalReviews.Where(x => x.ParentId == input.ParentId
																		&& x.PortalId == input.PortalId
																		&& x.Status != StatusEnum.Deleted
																		&& x.ReviewType == SysPortalReviewType.QA);
						if (!string.IsNullOrEmpty(input.Keyword))
						{
							input.Keyword = input.Keyword.RemoveUnicode().ToLower();
							sysPortalReviews = sysPortalReviews.ToList().Where(s => ((!string.IsNullOrEmpty(s.Subject) ? s.Subject.ToLower().RemoveUnicode() : "").Contains(input.Keyword))
																					|| ((!string.IsNullOrEmpty(s.Content) ? s.Content.ToLower().RemoveUnicode() : "").Contains(input.Keyword))
																					|| ((!string.IsNullOrEmpty(s.Name) ? s.Name.ToLower().RemoveUnicode() : "").Contains(input.Keyword))
																				).AsQueryable();
						}

						var result = sysPortalReviews.OrderBy(x => x.CreateDate).ToList().Select(s => new SysPortalReviewModel(s)).ToList();
						var paging = result.Paging(input);
						return Json(new ResultModel
						{
							Code = ResultCode.Success,
							Result = paging,
							TotalRow = result.Count
						});
					}
					else
					{
						input.UnitCode = User.Identity.UnitCode();

						var sysPortalReviews = db.SysPortalReviews.Where(x => x.ParentId == input.ParentId
																		&& x.PortalId == input.PortalId
																		&& x.Status != StatusEnum.Deleted
																		&& x.ReviewType == SysPortalReviewType.QA
																		&& x.UnitCode.ToLower() == input.UnitCode.ToLower());
						if (!string.IsNullOrEmpty(input.Keyword))
						{
							input.Keyword = input.Keyword.RemoveUnicode().ToLower();
							sysPortalReviews = sysPortalReviews.ToList().Where(s => ((!string.IsNullOrEmpty(s.Subject) ? s.Subject.ToLower().RemoveUnicode() : "").Contains(input.Keyword))
																					|| ((!string.IsNullOrEmpty(s.Content) ? s.Content.ToLower().RemoveUnicode() : "").Contains(input.Keyword))
																					|| ((!string.IsNullOrEmpty(s.Name) ? s.Name.ToLower().RemoveUnicode() : "").Contains(input.Keyword))
																				).AsQueryable();
						}

						var result = sysPortalReviews.OrderBy(x => x.CreateDate).ToList().Select(s => new SysPortalReviewModel(s)).ToList();
						var paging = result.Paging(input);
						return Json(new ResultModel
						{
							Code = ResultCode.Success,
							Result = paging,
							TotalRow = result.Count
						});
					}


				}
			}
			catch (Exception e)
			{
				return Json(new ResultModel
				{
					Code = ResultCode.Exception,
					Message = e.Message + "\n" + e.StackTrace,
					Result = null
				});
			}
		}

		[HttpPost]
		public IHttpActionResult Insert(SysPortalReviewModel input)
		{
			try
			{
				var defaultLanguage = "vi";
				using (var db = new WebDbContext())
				{
					if (User.IsInRole(RoleCode.SuperAdminSystem))
					{
						if (string.IsNullOrEmpty(input.UnitCode) || input.UnitCode == "undefined")
							input.UnitCode = User.Identity.UnitCode();

						if (string.IsNullOrEmpty(input.UnitCode))
							input.UnitCode = "LDG";
					}
					else
					{
						input.UnitCode = User.Identity.UnitCode();
					}
					var user = new Guid(User.Identity.GetUserId()).ToString();
					var item = db.Users.FirstOrDefault(s => s.Id == user && s.Status != StatusEnum.Deleted);
					if (item != null)
					{
						var sysPortalReview = new SysPortalReview()
						{
							PortalId = input.PortalId,
							Id = Guid.NewGuid(),
							Name = item.UserName,
							PhoneNo = item.PhoneNumber,
							Email = item.Email,
							Address = item.Address,
							Content = input.Content,
							Subject = input.Subject,
							Tag = input.Tag,
							Status = StatusEnum.Used,
							Description = input.Description,
							CreateDate = DateTime.Now,
							CreateUserId = User.Identity.GetUserId(),
							LanguageId = defaultLanguage,
							UnitCode = input.UnitCode,
							ParentId = input.ParentId,
							ReviewType = input.ReviewType
						};
						db.SysPortalReviews.Add(sysPortalReview);
						var result = db.SaveChanges();
						if (result > 0)
						{
							var parentPA = db.SysPortalReviews.FirstOrDefault(m => m.Id == input.ParentId && m.Status != StatusEnum.Deleted);
							parentPA.Tag = "DTL";
							db.Entry(parentPA).State = EntityState.Modified;
							db.SaveChanges();
						}
						//var itemparent = new SysPortalReview()
						//{
						//    Id = sysPortalReview.Parent.Id,
						//    PortalId = sysPortalReview.Parent.PortalId,
						//    Name = sysPortalReview.Parent.Name,
						//    PhoneNo = sysPortalReview.Parent.PhoneNo,
						//    Email = sysPortalReview.Parent.Email,
						//    Address = sysPortalReview.Parent.Address,
						//    Content = sysPortalReview.Parent.Content,
						//    Subject = sysPortalReview.Parent.Subject,
						//    Tag = sysPortalReview.Parent.Tag,
						//    Status = sysPortalReview.Parent.Status,
						//    Description = sysPortalReview.Parent.Description,
						//    CreateDate = sysPortalReview.Parent.CreateDate,
						//    CreateUserId = sysPortalReview.Parent.CreateUserId,
						//    UpdateDate = sysPortalReview.Parent.UpdateDate,
						//    UpdateUserId = sysPortalReview.Parent.UpdateUserId,
						//    LanguageId = sysPortalReview.Parent.LanguageId,
						//    UnitCode = sysPortalReview.Parent.UnitCode,
						//    ReviewType = sysPortalReview.Parent.ReviewType,
						//    ParentId = sysPortalReview.Parent.ParentId,
						//};
						//sysPortalReview.Parent = itemparent;
						return Json(new ResultModel
						{
							Code = result > 0 ? ResultCode.Success : ResultCode.Fail,
							Message = result > 0 ? ResultCode.Success.ToString() : ResultCode.Fail.ToString(),
							Result = sysPortalReview
						});
					}

					return Json(new ResultModel
					{
						Code = ResultCode.Exception,
						Message = ResultCode.Fail.ToString(),
						Result = null
					});
				}
			}
			catch (Exception e)
			{
				return Json(new ResultModel
				{
					Code = ResultCode.Exception,
					Message = e.Message + "\n" + e.StackTrace,
					Result = null
				});
			}
		}

		[HttpPost]
        public IHttpActionResult ChangeReviewStatus(SysPortalReviewModel input)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var item = context.SysPortalReviews
                        .FirstOrDefault(s => s.Id == input.Id &&
                                             s.PortalId == input.PortalId);
                    if (item == null)
                        return Json(new ResultModel
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Dữ liệu đã bị xóa!"
                        });
                    item.Status = input.Status;
                    context.Entry(item).State = EntityState.Modified;
                    if (context.SaveChanges() > 0)
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Success
                        });
                    return Json(new ResultModel
                    {
                        Code = ResultCode.UnSuccess,
                        Message = "Không cập nhật được!"
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.UnknowError,
                    Result = null,
                    Message = e.Message
                });
            }
        }
	}
}