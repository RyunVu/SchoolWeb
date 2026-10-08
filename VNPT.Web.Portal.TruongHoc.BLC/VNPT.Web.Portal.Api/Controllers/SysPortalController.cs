using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Core.Web;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Base.Dal;

namespace VNPT.Web.Portal.Api.Controllers
{
	[VnptAuthorization]
	public class SysPortalController : ApiController
	{
		[HttpPost]
		public IHttpActionResult GetListSysPortal(SysPortalModel input)
		{
			try
			{
				using (var context = new WebDbContext())
				{
					var cmd = context.Database.Connection.CreateCommand();

					string userId = null;

					if (!User.IsInRole(RoleCode.SuperAdminSystem)) userId = User.Identity.GetUserId();

					cmd.CommandText = "[dbo].[SysPortals_list]";
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.Add(new SqlParameter("@p_keyword", input.Keyword));
					cmd.Parameters.Add(new SqlParameter("@p_page_index", input.PageIndex ?? 1));
					cmd.Parameters.Add(new SqlParameter("@p_page_size", input.PageSize ?? 50));
					var connection = context.Database.Connection;
					if (connection.State != ConnectionState.Open)
						connection.Open();
					using (var reader = cmd.ExecuteReader())
					{
						var resultTemp = ((IObjectContextAdapter)context).ObjectContext
							.Translate<SysPortalModel>(reader)
							.ToList();
						reader.NextResult();

						var total = ((IObjectContextAdapter)context).ObjectContext
							.Translate<int>(reader)
							.ToList();
						connection.Close();

						try
						{
							var themeIds = resultTemp.Where(x => x.ThemeId.HasValue).Select(x => x.ThemeId.Value).Distinct().ToList();
							if (themeIds.Any())
							{
								var themeDict = context.SysThemes.Where(t => themeIds.Contains(t.Id))
									.Select(t => new { t.Id, t.Name })
									.ToDictionary(t => t.Id, t => t.Name);
								foreach (var item in resultTemp)
								{
									if (item.ThemeId.HasValue && themeDict.TryGetValue(item.ThemeId.Value, out var themeName))
									{
										item.ThemeName = themeName;
									}
								}
							}

							var portalIds = resultTemp.Select(x => x.Id).ToList();
							if (portalIds.Any())
							{
								var aliases = context.SysPortalAlias
									.Where(a => portalIds.Contains(a.PortalId) && a.Status != StatusEnum.Deleted && !string.IsNullOrEmpty(a.Domain))
									.Select(a => new
									{
										a.PortalId,
										a.Domain,
										a.Protocol,
										a.IsMain
									})
									.ToList();

								var aliasGrouped = aliases.GroupBy(a => a.PortalId).ToDictionary(g => g.Key, g => g.ToList());

								foreach (var item in resultTemp)
								{
									var domainList = new List<SysPortalDomainItem>();
									if (aliasGrouped.TryGetValue(item.Id, out var portalAliases))
									{
										foreach (var a in portalAliases.OrderByDescending(x => x.IsMain).ThenBy(x => x.Domain))
										{
											var cleanDomain = a.Domain?.Trim() ?? "";
											if (!string.IsNullOrEmpty(cleanDomain))
											{
												var protoStr = a.Protocol == ProtocolWeb.Http ? "http" : "https";
												var url = cleanDomain.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || cleanDomain.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
													? cleanDomain
													: $"{protoStr}://{cleanDomain}";
												domainList.Add(new SysPortalDomainItem
												{
													Domain = cleanDomain,
													Protocol = protoStr,
													Url = url,
													IsMain = a.IsMain
												});
											}
										}
									}

									if (!domainList.Any() && !string.IsNullOrWhiteSpace(item.Domain))
									{
										var cleanDomain = item.Domain.Trim();
										var url = cleanDomain.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || cleanDomain.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
											? cleanDomain
											: $"https://{cleanDomain}";
										domainList.Add(new SysPortalDomainItem
										{
											Domain = cleanDomain,
											Protocol = "https",
											Url = url,
											IsMain = true
										});
									}

									item.Domains = domainList;
								}
							}
						}
						catch
						{
						}

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
		public IHttpActionResult GetListDefaultUser(UserResultDto input)
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
					}
					else
					{
						input.UnitCode = User.Identity.UnitCode();
					}

					var roleName = !string.IsNullOrEmpty(input.Role) ? input.Role : "";
					var users = (from r in db.Roles
								 join usr in db.UserRoles
								 on r.Id equals usr.RoleId
								 join u in db.Users
								 on usr.UserId equals u.Id
								 where (r.Name.ToLower() == roleName.ToLower() && u.UnitCode.ToLower() == input.UnitCode.ToLower())
								 select new
								 {
									 Id = u.Id,
									 Name = u.UserName
								 }).ToList();

					return Json(new ResultModel
					{
						Code = ResultCode.Success,
						Result = users
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
		public IHttpActionResult GetListTheme(SysThemeModel input)
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
					}
					else
					{
						input.UnitCode = User.Identity.UnitCode();
					}

					var sysThemes = db.SysThemes.Where(x => x.Status != StatusEnum.Deleted && (x.UnitCode.ToLower() == input.UnitCode.ToLower() || x.UnitCode.ToLower() == "ldg")).ToList()
						.Select(s => new SysThemeModel(s)).ToList();

					return Json(new ResultModel
					{
						Code = ResultCode.Success,
						Result = sysThemes
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
		public IHttpActionResult GetListSite(SysPortalModel input)
		{
			try
			{
				using (var db = new WebDbContext())
				{
					var sysSites = db.SysSites.Where(x => x.PortalId == input.Id && x.ParentId == null && x.IsFeatured == true && x.Status != StatusEnum.Deleted)
												.Select(s => new
												{
													Id = s.Id,
													Name = s.Name
												}).ToList();

					return Json(new ResultModel
					{
						Code = ResultCode.Success,
						Result = sysSites,
						TotalRow = sysSites.Count(),
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
		public IHttpActionResult Modify(SysPortalModel input)
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

					var sysPortal = db.SysPortals.FirstOrDefault(x => x.Id == input.Id && x.Status != StatusEnum.Deleted);

					if (sysPortal == null)
					{
						sysPortal = new SysPortal()
						{
							Id = Guid.NewGuid(),
							AdministratorId = input.AdministratorId,
							ThemeId = input.ThemeId,
							HomeSiteId = input.HomeSiteId,
							UnitCode = input.UnitCode,
							Logo = input.Logo,
							Name = input.Name,
							Tag = input.Tag,
							Description = input.Description,

							ExpiryDate = input.ExpiryDate,
							DefaultLanguage = defaultLanguage,
							IsUsedSubdomain = input.IsUsedSubdomain,
							Status = StatusEnum.Used,
							CreateUserId = User.Identity.GetUserId(),
							CreateDate = DateTime.Now,
							LanguageId = defaultLanguage
						};

						db.SysPortals.Add(sysPortal);

						var result = db.SaveChanges();

						if (result > 0)
						{
							// Thêm SysportalAlias
							var domainTemp = input.Domain;

							SysPortalAlias sysPortalAlias = new SysPortalAlias()
							{
								Id = Guid.NewGuid(),
								PortalId = sysPortal.Id,
								Domain = domainTemp,
								Protocol = ProtocolWeb.Https,
								IsMain = true,
								Status = StatusEnum.Used,
								CreateDate = DateTime.Now,
								CreateUserId = User.Identity.GetUserId(),
								LanguageId = defaultLanguage,
								UnitCode = "LDG"
							};

							db.SysPortalAlias.Add(sysPortalAlias);

							db.SaveChanges();

							// Thêm Syssites
							var sysThemeLayoutClone = db.SysThemeLayout.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.ThemeId == input.ThemeId);
							var listSysSiteClone = db.SysSites.Where(x => x.Status != StatusEnum.Deleted && x.Code == input.UnitCodeClone).ToList();

							foreach (var itemSysSite in listSysSiteClone)
							{
								var name = itemSysSite.Name;

								if (itemSysSite.Subdomain == "home")
                                {
									name = input.Name;
								}

								SysSite sysSites = new SysSite()
								{
									Id = Guid.NewGuid(),
									Code = input.UnitCode,
									Name = name,
									Subdomain = itemSysSite.Subdomain,
									PortalId = sysPortal.Id,
									AdministratorId = input.AdministratorId,
									SiteUrl = itemSysSite.SiteUrl,
									IsSysSite = false,
									LayoutId = sysThemeLayoutClone.Id,
									IsAuthorized = false,
									MenuEnabled = true,
									MenuOrder = 1,
									IsFeatured = true,
									Status = StatusEnum.Used,
									CreateDate = DateTime.Now,
									CreateUserId = User.Identity.GetUserId(),
									LanguageId = defaultLanguage,
									UnitCode = "LDG"
								};

								db.SysSites.Add(sysSites);

								db.SaveChanges();
							}

							// Cập nhật lại HomeSiteId trong SysPortal
							var sysPortalClone = db.SysPortals.FirstOrDefault(x => x.UnitCode == input.UnitCodeClone);

							var sysSiteClone = db.SysSites.FirstOrDefault(x => x.Id == sysPortalClone.HomeSiteId);

							var sysSiteUpdate = db.SysSites.FirstOrDefault(x => x.SiteUrl == sysSiteClone.SiteUrl && x.Code == input.UnitCode);

							var sysPortalUpdate = db.SysPortals.FirstOrDefault(x => x.Id == sysPortal.Id && x.Status != StatusEnum.Deleted);

							sysPortalUpdate.HomeSiteId = sysSiteUpdate.Id;
							db.Entry(sysPortalUpdate).State = EntityState.Modified;
							db.SaveChanges();

							// Thêm Sysmenus
							var listSystemMenusParentClone = db.SystemMenus.Where(x => x.Status != StatusEnum.Deleted && x.UnitCode == input.UnitCodeClone && x.ParentId == null).ToList();

							foreach (var itemSystemMenuParent in listSystemMenusParentClone)
							{
								var itemParent = new SystemMenu()
								{
									CreateDate = DateTime.Now,
									CreateUserId = User.Identity.GetUserId(),
									Description = itemSystemMenuParent.Description,
									Id = Guid.NewGuid(),
									ParentId = null,
									RoleLevel = itemSystemMenuParent.RoleLevel,
									Status = StatusEnum.Used,
									Tag = "",
									Action = itemSystemMenuParent.Action,
									Children = null,
									Parent = null,
									Title = itemSystemMenuParent.Title,
									Icon = itemSystemMenuParent.Icon,
									LanguageId = "",
									MenuCode = itemSystemMenuParent.MenuCode,
									SortNo = itemSystemMenuParent.SortNo,
									UpdateDate = DateTime.Now,
									UpdateUserId = User.Identity.GetUserId(),
									Parameter = itemSystemMenuParent.Parameter,
									IsShowMenu = itemSystemMenuParent.IsShowMenu,
									IsUseParameterUrl = itemSystemMenuParent.IsUseParameterUrl,
									OtherRole = itemSystemMenuParent.OtherRole,
									UnitCode = input.UnitCode,
									ConfigMenu = itemSystemMenuParent.ConfigMenu,
									IsNewsImage = itemSystemMenuParent.IsNewsImage,
									IsOpenImageOnly = itemSystemMenuParent.IsOpenImageOnly,
									MenuPosition = itemSystemMenuParent.MenuPosition,
									IsOpenBlankPage = itemSystemMenuParent.IsOpenBlankPage,
									MenuType = itemSystemMenuParent.MenuType,
								};
								db.SystemMenus.Add(itemParent);
								db.SaveChanges();

								var listSystemMenusChildClone = db.SystemMenus.Where(x => x.Status != StatusEnum.Deleted && x.UnitCode == input.UnitCodeClone && x.ParentId == itemSystemMenuParent.Id).ToList();

								foreach (var itemSystemMenChild in listSystemMenusChildClone)
								{
									var itemChild = new SystemMenu()
									{
										CreateDate = DateTime.Now,
										CreateUserId = User.Identity.GetUserId(),
										Description = itemSystemMenChild.Description,
										Id = Guid.NewGuid(),
										ParentId = itemParent.Id,
										RoleLevel = itemSystemMenChild.RoleLevel,
										Status = StatusEnum.Used,
										Tag = "",
										Action = itemSystemMenChild.Action,
										Children = null,
										Parent = null,
										Title = itemSystemMenChild.Title,
										Icon = itemSystemMenChild.Icon,
										LanguageId = "",
										MenuCode = itemSystemMenChild.MenuCode,
										SortNo = itemSystemMenChild.SortNo,
										UpdateDate = DateTime.Now,
										UpdateUserId = User.Identity.GetUserId(),
										Parameter = itemSystemMenChild.Parameter,
										IsShowMenu = itemSystemMenChild.IsShowMenu,
										IsUseParameterUrl = itemSystemMenChild.IsUseParameterUrl,
										OtherRole = itemSystemMenChild.OtherRole,
										UnitCode = input.UnitCode,
										ConfigMenu = itemSystemMenChild.ConfigMenu,
										IsNewsImage = itemSystemMenChild.IsNewsImage,
										IsOpenImageOnly = itemSystemMenChild.IsOpenImageOnly,
										MenuPosition = itemSystemMenChild.MenuPosition,
										IsOpenBlankPage = itemSystemMenChild.IsOpenBlankPage,
										MenuType = itemSystemMenChild.MenuType,
									};
									db.SystemMenus.Add(itemChild);
									db.SaveChanges();
								}
							}

							// Thêm SysParameter
							var listSystemParameters = db.SystemParameters.Where(x => x.Status != StatusEnum.Deleted && x.UnitCode == input.UnitCodeClone).ToList();

							foreach (var itemSystemParameter in listSystemParameters)
							{
								var idTemp = itemSystemParameter.Id.Replace(input.UnitCodeClone, input.UnitCode);

								var value2 = itemSystemParameter.Value2;

								var description = itemSystemParameter.Description;

								if (idTemp.Contains("NAME_"))
								{
									value2 = input.Name;
								}

								if (idTemp.Contains("ADDRESS_") || idTemp.Contains("EMAIL_") || idTemp.Contains("PHONE_") || idTemp.Contains("LOGO_") || idTemp.Contains("BANNER_HEADER_"))
								{
									value2 = "";
								}

								if (idTemp.Contains("DESCRIPTION_1_"))
								{
									description = "Cơ quan quản lý ở cuối trang Web";
								}

								if (idTemp.Contains("DESCRIPTION_2_"))
								{
									value2 = "Chịu trách nhiệm chính: " + input.Name;
									description = "Chịu trách nhiệm chính ở cuối trang Web";
								}

								if (idTemp.Contains("DESCRIPTION_3_"))
								{
									value2 = "© Ghi rõ nguồn " + input.Domain + " khi sử dụng thông tin trên website này";
									description = "Nguồn ở cuối trang Web";
								}

								var item = new SystemParameter()
								{
									CreateDate = DateTime.Now,
									CreateUserId = User.Identity.GetUserId(),
									Description = description,
									Status = StatusEnum.Used,
									Tag = "",
									LanguageId = "",
									UpdateDate = DateTime.Now,
									UpdateUserId = User.Identity.GetUserId(),
									UnitCode = input.UnitCode,
									Id = idTemp,
									Code = itemSystemParameter.Code,
									Value = itemSystemParameter.Value,
									Value3 = itemSystemParameter.Value3,
									Value2 = value2,
									Value4 = itemSystemParameter.Value4,
									Value6 = itemSystemParameter.Value6,
									Value7 = itemSystemParameter.Value7,
									Value5 = itemSystemParameter.Value5,
								};
								db.SystemParameters.Add(item);
								db.SaveChanges();
							}

							// Thêm GeneraCategori
							var listGeneralCategory = db.GeneralCategories.Where(x => x.Status != StatusEnum.Deleted && x.Code == "NewsType" && x.UnitCode == input.UnitCodeClone).ToList();

							// Id loại tin cũ -> mới, để sửa lại tham số menu ("thong-bao.{Id}") trỏ đúng loại tin của đơn vị mới
							var categoryIdMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

							foreach (var itemGeneralCategory in listGeneralCategory)
							{
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
									Value = itemGeneralCategory.Value,
									Name = itemGeneralCategory.Name,
									Value2 = itemGeneralCategory.Value2,
									ImageUrl = itemGeneralCategory.ImageUrl,
									Description = itemGeneralCategory.Description,
									Code = itemGeneralCategory.Code,
									UnitCode = input.UnitCode
								};
								db.GeneralCategories.Add(item);
								db.SaveChanges();
								categoryIdMap[itemGeneralCategory.Id.ToString()] = item.Id.ToString();

								// Copy News: chỉ khi người tạo chọn "Sao chép cả bài viết" – mặc định cổng mới chỉ nhận cấu trúc
								// (tránh việc website mới hiện hàng nghìn tin của trường mẫu như tin của mình)
								var listNewsClone = !input.CopyNews
									? new List<News>()
									: db.News.Where(x => x.Status != StatusEnum.Deleted && x.NewTypeId == itemGeneralCategory.Id && x.UnitCode == input.UnitCodeClone).ToList();

								foreach (var itemNews in listNewsClone)
								{
									var newsItem = new News()
									{
										Id = Guid.NewGuid(),
										NewTypeId = item.Id,
										Code = itemNews.Code,
										Alias = itemNews.Alias,
										Title = itemNews.Title,
										Content = itemNews.Content,
										Title_En = itemNews.Title_En,
										Content_En = itemNews.Content_En,
										Description = itemNews.Description,
										ImageUrl = itemNews.ImageUrl,
										ShortContent = itemNews.ShortContent,
										Order = itemNews.Order,
										CountView = 0,
										CreateDate = itemNews.CreateDate,
										Status = StatusEnum.Used,
										CreateUserId = User.Identity.GetUserId(),
										UnitCode = input.UnitCode,
										LanguageId = "vi",
										IsOpenBlankPage = itemNews.IsOpenBlankPage,
										IsNewsImage = itemNews.IsNewsImage,
										IsOpenImageOnly = itemNews.IsOpenImageOnly,
										OtherUrl = itemNews.OtherUrl
									};
									db.News.Add(newsItem);
									db.SaveChanges();
								}
							}

							// Menu được chép trước khi có loại tin mới nên Parameter vẫn chứa Id loại tin của đơn vị nguồn
							// (VD "thong-bao.{Id cũ}") -> trang chủ/sidebar không lấy được tin. Đổi sang Id loại tin của đơn vị mới.
							if (categoryIdMap.Count > 0)
							{
								var newMenus = db.SystemMenus.Where(x => x.UnitCode == input.UnitCode && x.Parameter != null && x.Parameter.Contains(".")).ToList();
								foreach (var menu in newMenus)
								{
									menu.Parameter = PortalThemeService.RemapCategoryIds(menu.Parameter, categoryIdMap);
								}
								db.SaveChanges();
							}

							// Copy folder portals từ đơn vị clone
							try
							{
								var sourceFolder = HttpContext.Current.Server.MapPath("~/views/shared/portals/");
								var sourceTemplate = input.UnitCodeClone;

								if (Directory.Exists(sourceFolder + sourceTemplate))
								{
									var desFolder = input.UnitCode.ToUpper();

									if (!Directory.Exists(sourceFolder + desFolder))
									{
										sourceTemplate = sourceFolder + sourceTemplate;
										sourceTemplate.DirectoryCopy(sourceFolder + desFolder, true);
									}

								}
							}
							catch (Exception)
							{
							}
						}

						return Json(new ResultModel()
						{
							Code = result > 0 ? ResultCode.Success : ResultCode.Fail,
							Message = result > 0 ? ResultCode.Success.ToString() : ResultCode.Fail.ToString()
						});
					}
					else
					{
						var unitCodeOld = sysPortal.UnitCode;

						// Đổi chủ đề trong form sửa: làm giống chức năng "Đổi giao diện" (sao lưu + chép thư mục, đổi layout các trang)
						if (input.ThemeId.HasValue && input.ThemeId != sysPortal.ThemeId)
						{
							var newTheme = db.SysThemes.FirstOrDefault(x => x.Id == input.ThemeId.Value && x.Status != StatusEnum.Deleted);
							try
							{
								PortalThemeService.Apply(db, sysPortal, newTheme);
							}
							catch (InvalidOperationException ex)
							{
								return Json(new ResultModel { Code = ResultCode.UnSuccess, Message = ex.Message });
							}
						}

						sysPortal.AdministratorId = input.AdministratorId;
						sysPortal.ThemeId = input.ThemeId;
						sysPortal.HomeSiteId = input.HomeSiteId;
						sysPortal.UnitCode = input.UnitCode;
						sysPortal.Logo = input.Logo;
						sysPortal.Name = input.Name;
						sysPortal.Tag = input.Tag;
						sysPortal.Description = input.Description;

						sysPortal.ExpiryDate = input.ExpiryDate;
						sysPortal.DefaultLanguage = defaultLanguage;
						sysPortal.IsUsedSubdomain = input.IsUsedSubdomain;
						sysPortal.Status = StatusEnum.Used;
						sysPortal.UpdateUserId = User.Identity.GetUserId();
						sysPortal.UpdateDate = DateTime.Now;
						sysPortal.LanguageId = defaultLanguage;

						db.Entry(sysPortal).State = EntityState.Modified;
						var result = db.SaveChanges();

						// SystemMenus
						var listSystemMenus = db.SystemMenus.Where(x => x.Status != StatusEnum.Deleted && x.UnitCode == unitCodeOld).ToList();

						foreach (var itemSystemMenu in listSystemMenus)
						{
							itemSystemMenu.UnitCode = input.UnitCode;
							db.Entry(itemSystemMenu).State = EntityState.Modified;
							result = db.SaveChanges();
						}

						// SystemParameters
						var listSystemParameters = db.SystemParameters.Where(x => x.Status != StatusEnum.Deleted && x.UnitCode == unitCodeOld).ToList();

						foreach (var itemSystemParameter in listSystemParameters)
						{
							var idTemp = itemSystemParameter.Id.Replace(unitCodeOld, input.UnitCode);

							itemSystemParameter.Id = idTemp;
							itemSystemParameter.UnitCode = input.UnitCode;
							db.Entry(itemSystemParameter).State = EntityState.Modified;
							result = db.SaveChanges();
						}

						// GeneralCategories
						var listGeneralCategories = db.GeneralCategories.Where(x => x.Status != StatusEnum.Deleted && x.UnitCode == unitCodeOld).ToList();

						foreach (var itemGeneralCategory in listGeneralCategories)
						{
							itemGeneralCategory.UnitCode = input.UnitCode;
							db.Entry(itemGeneralCategory).State = EntityState.Modified;
							result = db.SaveChanges();
						}

						// News
						var listNews = db.News.Where(x => x.Status != StatusEnum.Deleted && x.UnitCode == unitCodeOld).ToList();

						foreach (var itemNew in listNews)
						{
							itemNew.UnitCode = input.UnitCode;
							db.Entry(itemNew).State = EntityState.Modified;
							result = db.SaveChanges();
						}

						// Copy folder portals từ đơn vị clone
						try
						{
							var sourceFolder = HttpContext.Current.Server.MapPath("~/views/shared/portals/");
							var sourceTemplate = unitCodeOld;

							if (Directory.Exists(sourceFolder + sourceTemplate))
							{
								var desFolder = input.UnitCode.ToUpper();

								if (!Directory.Exists(sourceFolder + desFolder))
								{
									sourceTemplate = sourceFolder + sourceTemplate;
									sourceTemplate.DirectoryCopy(sourceFolder + desFolder, true);
								}

							}
						}
						catch (Exception)
						{
						}

						return Json(new ResultModel()
						{
							Code = result > 0 ? ResultCode.Success : ResultCode.Fail,
							Message = result > 0 ? ResultCode.Success.ToString() : ResultCode.Fail.ToString()
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

        /// <summary>
        /// Đổi giao diện cho cổng: tạo/sao lưu thư mục Views/Shared/Portals/{UnitCode}, chép Default/{Theme} vào,
        /// đổi ThemeId của cổng và layout của mọi trang.
        /// </summary>
        [HttpPost]
        public IHttpActionResult ChangeTheme(SysPortalModel input)
        {
            try
            {
                using (var db = new WebDbContext())
                {
                    var sysPortal = db.SysPortals.FirstOrDefault(x => x.Id == input.Id && x.Status != StatusEnum.Deleted);
                    if (sysPortal == null)
                    {
                        return Json(new ResultModel { Code = ResultCode.NotFoundData, Message = "Cổng thông tin không tồn tại!" });
                    }

                    if (!User.IsInRole(RoleCode.SuperAdminSystem) && sysPortal.AdministratorId != User.Identity.GetUserId())
                    {
                        return Json(new ResultModel { Code = ResultCode.UnSuccess, Message = "Bạn không có quyền đổi giao diện của cổng này!" });
                    }

                    if (!input.ThemeId.HasValue)
                    {
                        return Json(new ResultModel { Code = ResultCode.DataNotEnough, Message = "Vui lòng chọn giao diện!" });
                    }

                    var theme = db.SysThemes.FirstOrDefault(x => x.Id == input.ThemeId.Value && x.Status != StatusEnum.Deleted);

                    PortalThemeService.ChangeThemeResult applied;
                    try
                    {
                        applied = PortalThemeService.Apply(db, sysPortal, theme);
                    }
                    catch (InvalidOperationException ex)
                    {
                        return Json(new ResultModel { Code = ResultCode.UnSuccess, Message = ex.Message });
                    }

                    sysPortal.UpdateDate = DateTime.Now;
                    sysPortal.UpdateUserId = User.Identity.GetUserId();
                    db.SaveChanges();

                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Message = "Đã đổi giao diện",
                        Result = new
                        {
                            ThemeName = theme.Name,
                            UnitFolder = PortalThemeService.ToDisplayPath(applied.UnitFolder),
                            BackupFolder = PortalThemeService.ToDisplayPath(applied.BackupFolder),
                            applied.CreatedUnitFolder,
                            applied.SiteCount
                        }
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel { Code = ResultCode.Exception, Message = e.Message });
            }
        }

        /// <summary>
        /// Cập nhật lại template: chép lại Default/{giao diện đang dùng} vào Views/Shared/Portals/{UnitCode}
        /// (sao lưu thư mục cũ vào {UnitCode}/backup trước) – dùng khi template mặc định đã sửa nhưng cổng vẫn chạy bản cũ.
        /// </summary>
        [HttpPost]
        public IHttpActionResult RefreshTemplate(SysPortalModel input)
        {
            try
            {
                using (var db = new WebDbContext())
                {
                    var sysPortal = db.SysPortals.FirstOrDefault(x => x.Id == input.Id && x.Status != StatusEnum.Deleted);
                    if (sysPortal == null)
                    {
                        return Json(new ResultModel { Code = ResultCode.NotFoundData, Message = "Cổng thông tin không tồn tại!" });
                    }

                    if (!User.IsInRole(RoleCode.SuperAdminSystem) && sysPortal.AdministratorId != User.Identity.GetUserId())
                    {
                        return Json(new ResultModel { Code = ResultCode.UnSuccess, Message = "Bạn không có quyền cập nhật template của cổng này!" });
                    }

                    var theme = sysPortal.ThemeId.HasValue
                        ? db.SysThemes.FirstOrDefault(x => x.Id == sysPortal.ThemeId.Value && x.Status != StatusEnum.Deleted)
                        : null;
                    if (theme == null)
                    {
                        return Json(new ResultModel { Code = ResultCode.UnSuccess, Message = "Cổng chưa chọn giao diện. Vui lòng dùng chức năng Đổi giao diện." });
                    }

                    PortalThemeService.ChangeThemeResult applied;
                    try
                    {
                        applied = PortalThemeService.Apply(db, sysPortal, theme);
                    }
                    catch (InvalidOperationException ex)
                    {
                        return Json(new ResultModel { Code = ResultCode.UnSuccess, Message = ex.Message });
                    }

                    sysPortal.UpdateDate = DateTime.Now;
                    sysPortal.UpdateUserId = User.Identity.GetUserId();
                    db.SaveChanges();

                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Message = "Đã cập nhật lại template",
                        Result = new
                        {
                            ThemeName = theme.Name,
                            ThemeUrl = theme.Url,
                            UnitFolder = PortalThemeService.ToDisplayPath(applied.UnitFolder),
                            BackupFolder = PortalThemeService.ToDisplayPath(applied.BackupFolder),
                            applied.CreatedUnitFolder,
                            applied.SiteCount
                        }
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel { Code = ResultCode.Exception, Message = e.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult Delete(SysPortalModel input)
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
                    }
                    else
                    {
                        input.UnitCode = User.Identity.UnitCode();
                    }

                    var sysPortal = db.SysPortals.FirstOrDefault(x => x.Id == input.Id && x.Status != StatusEnum.Deleted);
                    if (sysPortal == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Dữ liệu không tồn tại!",
                            Result = null
                        });
                    }

                    sysPortal.Status = StatusEnum.Deleted;
                    sysPortal.UpdateDate = DateTime.Now;
                    sysPortal.UpdateUserId = User.Identity.GetUserId();
                    db.Entry(sysPortal).State = EntityState.Modified;

                    var result = db.SaveChanges();
                    return Json(new ResultModel()
                    {
                        Code = result > 0 ? ResultCode.Success : ResultCode.Fail,
                        Message = result > 0 ? ResultCode.Success.ToString() : ResultCode.Fail.ToString()
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
		public IHttpActionResult UploadFile()
		{
			try
			{
				var httpRequest = HttpContext.Current.Request;

				var unitCode = HttpContext.Current.Request["UnitCode"] ?? "";

				if (!string.IsNullOrEmpty(unitCode))
				{
					unitCode = unitCode.TrimEnd('|');

					var splitUnitCode = unitCode.Split('|');

					foreach (var itemUnitCode in splitUnitCode)
					{
						for (int i = 0; i < httpRequest.Files.Count; i++)
						{
							var postedFile = httpRequest.Files[i];

							if (postedFile != null && postedFile.ContentLength > 0)
							{
								var sourceFolder = "~/views/shared/portals/";

								var sourceTemplate = itemUnitCode + "/Sites";

								var directory = sourceFolder + sourceTemplate;

								if (!Directory.Exists(HttpContext.Current.Server.MapPath(directory)))
								{
									//Directory.CreateDirectory(HttpContext.Current.Server.MapPath(directory));
									return Json(new ResultModel
									{
										Code = ResultCode.NotFoundData,
										Message = "Thư mục của đơn vị không tồn tại!"
									});
								}

								string name = postedFile.FileName;

								string path = Path.Combine(HttpContext.Current.Server.MapPath(directory), name);

								postedFile.SaveAs(path);

								Request.CreateResponse(HttpStatusCode.OK, Path.Combine(directory, postedFile.FileName));
							}
						}
					}

					return Json(new ResultModel
					{
						Code = ResultCode.Success,
						Message = ResultCode.Success.ToString()
					});
				}

				return Json(new ResultModel
				{
					Code = ResultCode.NotFoundData,
					Message = ResultCode.NotFoundData.ToString()
				});

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
	}

}
