using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Base.Dal;

namespace VNPT.Web.Portal.Api.Controllers
{
	[VnptAuthorization]
	public class NewsController : BaseApiController
	{
		[HttpPost]
		public IHttpActionResult ListLoaiTinTuc(GeneralCategoryModel model)
		{
			try
			{
				using (var context = new WebDbContext())
				{
					var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
					if (currentUnitCode == "LDG")
					{
						var items = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Code && s.Value == model.Value);

						if (!string.IsNullOrEmpty(model.UnitCode))
						{
							items = items.Where(s => s.UnitCode.ToLower() == model.UnitCode.ToLower());
						}

						var temp = items.OrderBy(x => x.Name).ThenBy(x => x.UnitCode).ToList();

						var result = temp.Select(s => new
						{
							Id = s.Id,
							Name = s.Name + " (" + context.Units.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Code == s.UnitCode)?.Name + ")"
						}).ToList();

						return Json(new ResultModel()
						{
							Code = ResultCode.Success,
							Result = result,
							TotalRow = temp.Count
						});
					}
					else
					{
						// Nếu chưa có loại tin tức thì tự thêm mới

						var newTypeTemp = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Code && s.Value == model.Value && s.UnitCode == currentUnitCode);

						if (!newTypeTemp.Any())
						{
							var sysMenu = context.SystemMenus.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Parameter == model.Value && x.MenuCode == "Web");

							var item = new GeneralCategory()
							{
								CreateDate = DateTime.Now,
								CreateUserId = User.Identity.GetUserId(),
								Id = Guid.NewGuid(),
								LanguageId = "vi",
								Tag = "",
								Status = StatusEnum.Used,
								UpdateDate = DateTime.Now,
								UpdateUserId = User.Identity.GetUserId(),
								Value = model.Value,
								Name = sysMenu?.Title,
								Code = "NewsType",
								UnitCode = currentUnitCode
							};
							context.GeneralCategories.Add(item);
							context.SaveChanges();
						}

						var items = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Code && s.Value == model.Value);

						items = items.Where(s => s.UnitCode.ToLower() == currentUnitCode.ToLower());

						var temp = items.OrderBy(x => x.Name).ThenBy(x => x.UnitCode).ToList();

						var result = temp.Select(s => new
						{
							Id = s.Id,
							Name = s.Name
						}).ToList();

						return Json(new ResultModel()
						{
							Code = ResultCode.Success,
							Result = result,
							TotalRow = temp.Count
						});
					}


				}

			}
			catch (Exception e)
			{
				return Json(new ResultModel()
				{
					Code = ResultCode.UnknowError,
					Message = e.Message
				});
			}
		}

		[HttpPost]
		public IHttpActionResult ListGioiThieuHeThongChinhTri()
		{
			try
			{
				using (var context = new WebDbContext())
				{
					var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
					if (currentUnitCode == "LDG")
					{
						var items = context.SystemMenus.Where(s => s.Status != StatusEnum.Deleted && s.Action == "chi-tiet-tin-tuc");

						var temp = items.OrderBy(x => x.Title).ThenBy(x => x.UnitCode).ToList();

						var result = temp.Select(s => new
						{
							Id = s.Id,
							Parameter = s.Parameter,
							Name = s.Title + " (" + context.Units.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Code == s.UnitCode)?.Name + ")"
						}).ToList();

						return Json(new ResultModel()
						{
							Code = ResultCode.Success,
							Result = result,
							TotalRow = temp.Count
						});
					}
					else
					{
						var items = context.SystemMenus.Where(s => s.Status != StatusEnum.Deleted && s.Action == "chi-tiet-tin-tuc");

						items = items.Where(s => s.UnitCode.ToLower() == currentUnitCode.ToLower());

						var temp = items.OrderBy(x => x.Title).ThenBy(x => x.UnitCode).ToList();

						var result = temp.Select(s => new
						{
							Id = s.Id,
							Parameter = s.Parameter,
							Name = s.Title
						}).ToList();

						return Json(new ResultModel()
						{
							Code = ResultCode.Success,
							Result = result,
							TotalRow = temp.Count
						});
					}
				}

			}
			catch (Exception e)
			{
				return Json(new ResultModel()
				{
					Code = ResultCode.UnknowError,
					Message = e.Message
				});
			}
		}

		[HttpPost]
    public IHttpActionResult GetList(NewsModel model)
		{
			try
			{
				using (var context = new WebDbContext())
				{
					var cmd = context.Database.Connection.CreateCommand();

					DateTime? fromDate, toDate;

					string fromDateStr = model.FromDate.Value.ToLocalTime().ToString("dd/MM/yyyy");
					string toDateStr = model.ToDate.Value.ToLocalTime().ToString("dd/MM/yyyy") + " 23:59:59";

					fromDate = fromDateStr.ParseDate("dd/MM/yyyy");
					toDate = toDateStr.ParseDate("dd/MM/yyyy HH:mm:ss");

                    if (model.Code == "tin-tuc-khac")
                    {
                        fromDate = new DateTime(2000,1,1);
                        toDate = new DateTime(3000,1,1);
					}

					string userId = User.Identity.GetUserId();
					var user = context.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);

					if (User.IsInRole(RoleCode.SuperAdminSystem))
					{
						user.UnitCode = model.UnitCode;
					}
					else
					{
						if (string.IsNullOrEmpty(user.UnitCode))
						{
							var unit = context.Units.FirstOrDefault(s => s.Id == user.UnitId && s.Status == StatusEnum.Used);

                            user.UnitCode = unit.Code;
                        }
                    }

					cmd.CommandText = "[dbo].[News_list]";
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.Add(new SqlParameter("@p_code", model.Code));
					cmd.Parameters.Add(new SqlParameter("@p_unitcode", user.UnitCode));
					cmd.Parameters.Add(new SqlParameter("@p_date_from", fromDate));
					cmd.Parameters.Add(new SqlParameter("@p_date_to", toDate));
					cmd.Parameters.Add(new SqlParameter("@p_keyword", model.Keyword));
					cmd.Parameters.Add(new SqlParameter("@p_page_index", model.PageIndex ?? 1));
					cmd.Parameters.Add(new SqlParameter("@p_page_size", model.PageSize ?? 10));
					var connection = context.Database.Connection;
					if (connection.State != ConnectionState.Open)
						connection.Open();
					using (var reader = cmd.ExecuteReader())
					{
						var resultTemp = ((IObjectContextAdapter)context).ObjectContext
							.Translate<NewsModel>(reader)
							.ToList();
						reader.NextResult();

						var total = ((IObjectContextAdapter)context).ObjectContext
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
					Code = ResultCode.UnknowError,
					Message = e.Message
				});
			}
		}

		[HttpPost]
		public IHttpActionResult Modify(NewsModel input)
		{
			try
			{
				var defaultLanguage = "vi";

				using (var context = new WebDbContext())
				{
					var userId = User.Identity.GetUserId();

					var user = context.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);

					var newsItem = context.News.FirstOrDefault(s => s.Id == input.Id && s.Status != StatusEnum.Deleted);

					var newType = context.GeneralCategories.FirstOrDefault(s => s.Id == input.NewTypeId && s.Status != StatusEnum.Deleted);

					input.UnitCode = newType != null ? newType.UnitCode : User.Identity.UnitCode();

					// kiểm tra alias
					input.Alias = input.Alias?.ToLower().RemoveUnicode().ReplaceRegex("", "-") ?? "";
					if (string.IsNullOrEmpty(input.Alias))
					{
						return Json(new ResultModel
						{
							Code = ResultCode.DataNotEnough,
							Message = "Alias không được để trống!"
						});
					}

					// 
					if (input.Code.ToUpper() == "TIN-TUC-KHAC")
					{
						var newTypeId = context.GeneralCategories.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Code == "NewsType" && s.Value.ToUpper() == input.Code.ToUpper() && s.UnitCode.ToUpper() == input.UnitCode.ToUpper());

						if (newTypeId == null && input.UnitCode.ToUpper() == "LDG")
						{
							var systemMenus = context.SystemMenus.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Action == "chi-tiet-tin-tuc" && s.Id == input.NewTypeId);

							if(systemMenus != null)
                            {
								newTypeId = context.GeneralCategories.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Code == "NewsType" && s.Value.ToUpper() == input.Code.ToUpper() && s.UnitCode.ToUpper() == systemMenus.UnitCode.ToUpper());
							}
						}

						input.NewTypeId = newTypeId?.Id;
					}

					if (newsItem == null)
					{
						var newsAlisa = context.News.FirstOrDefault(s =>
							s.Status != StatusEnum.Deleted && s.Alias == input.Alias && s.Code.ToUpper() == input.Code.ToUpper() && s.UnitCode.ToUpper() == input.UnitCode.ToUpper());
						if (newsAlisa != null)
						{
							return Json(new ResultModel
							{
								Code = ResultCode.DataNotEnough,
								Message = "Alias đã tồn tại!"
							});
						}

						newsItem = new News()
						{
							Id = Guid.NewGuid(),
							NewTypeId = input.NewTypeId.Value,
							Code = input.Code,
							Alias = input.Alias,
							Title = input.Title,
							Content = input.Content,
							Title_En = input.Title_En,
							Content_En = input.Content_En,
							ImageUrl = input.ImageUrl,
							ShortContent = input.ShortContent,
							Order = input.Order,
							CountView = 0,
							CreateDate = DateTime.ParseExact(input.StrCreateDate, "dd/MM/yyyy HH:mm:ss",
								CultureInfo.InvariantCulture),

							Status = StatusEnum.Used,
							CreateUserId = User.Identity.GetUserId(),
							UnitCode = input.UnitCode,
							LanguageId = "vi",
							Description = "",
						};
						context.News.Add(newsItem);
						context.SaveChanges();

						var newModel = newsItem.Clone();
						HistoryDal.Write(User.Identity.GetUserId(), "News", HistoryActionEnum.Add, newsItem.Id, null, newModel, GetClientIp(), context: context);
					}
					else
					{
						var oldModel = newsItem.Clone();

						var newsAlisa = context.News.FirstOrDefault(s => s.Id != newsItem.Id &&
							s.Status != StatusEnum.Deleted && s.Alias == input.Alias && s.Code.ToUpper() == input.Code.ToUpper() && s.UnitCode.ToUpper() == input.UnitCode.ToUpper());

						if (newsAlisa != null)
						{
							return Json(new ResultModel
							{
								Code = ResultCode.DataNotEnough,
								Message = "Alias đã tồn tại!"
							});
						}

						newsItem.NewTypeId = input.NewTypeId.Value;
						newsItem.Code = input.Code;
						newsItem.Alias = input.Alias;
						newsItem.Title = input.Title;
						newsItem.Content = input.Content;
						newsItem.Title_En = input.Title_En;
						newsItem.Content_En = input.Content_En;
						newsItem.ImageUrl = input.ImageUrl;
						newsItem.ShortContent = input.ShortContent;

						newsItem.CreateDate = DateTime.ParseExact(input.StrCreateDate, "dd/MM/yyyy HH:mm:ss",
								CultureInfo.InvariantCulture);

						newsItem.UpdateUserId = User.Identity.GetUserId();
						newsItem.UpdateDate = DateTime.Now;
						//newsItem.UnitCode = input.UnitCode;
						newsItem.LanguageId = "vi";

						context.Entry(newsItem).State = EntityState.Modified;

						context.SaveChanges();

						var newModel = newsItem.Clone();
						HistoryDal.Write(User.Identity.GetUserId(), "News", HistoryActionEnum.Edit, newsItem.Id, oldModel, newModel, GetClientIp(), context: context);
					}

					return Json(new ResultModel
					{
						Code = ResultCode.Success,
					});
				}
			}
			catch (Exception e)
			{
				return Json(new ResultModel
				{
					Code = ResultCode.UnknowError,
					Message = "Đã có lỗi xảy ra. Vui lòng thử lại sau",
					Result = e.Message
				});
			}
		}

		[HttpPost]
		public IHttpActionResult Delete(NewsModel model)
		{
			try
			{
				using (var context = new WebDbContext())
				{
					var newsItem = context.News.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
					if (newsItem == null)
					{
						return Json(new ResultModel
						{
							Code = ResultCode.Exception,
							Message = "Tin tức không tồn tại",
							Result = null
						});
					}

					newsItem.Status = StatusEnum.Deleted;
					newsItem.UpdateDate = DateTime.Now;
					newsItem.UpdateUserId = User.Identity.GetUserId();
					context.Entry(newsItem).State = EntityState.Modified;

					context.SaveChanges();

					var newModel = newsItem.Clone();
					HistoryDal.Write(User.Identity.GetUserId(), "News", HistoryActionEnum.Delete, newsItem.Id, null, newModel, GetClientIp());

					return Json(new ResultModel
					{
						Code = ResultCode.Success,
					});
				}
			}
			catch (Exception e)
			{
				return Json(new ResultModel()
				{
					Code = ResultCode.UnSuccess,
					Message = e.Message
				});
			}
		}
	}

}
