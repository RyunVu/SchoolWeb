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
					cmd.Parameters.Add(new SqlParameter("@p_page_size", input.PageSize ?? 10));
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

					var sysThemes = db.SysThemes.Where(x => x.Status != StatusEnum.Deleted && x.UnitCode.ToLower() == input.UnitCode.ToLower()).ToList()
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
						Result = sysSites
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
							var domainTemp = input.UnitCode.ToLower() + ".lamdongtructuyen.vn";

							SysPortalAlias sysPortalAlias = new SysPortalAlias()
							{
								Id = Guid.NewGuid(),
								PortalId = sysPortal.Id,
								Domain = domainTemp,
								Protocol = ProtocolWeb.Https,
								IsMain = false,
								Status = StatusEnum.Used,
								CreateDate = DateTime.Now,
								CreateUserId = User.Identity.GetUserId(),
								LanguageId = defaultLanguage,
								UnitCode = "LDG"
							};

							db.SysPortalAlias.Add(sysPortalAlias);

							db.SaveChanges();

							domainTemp = input.UnitCode.ToLower() + ".lamdong.gov.vn";

							sysPortalAlias = new SysPortalAlias()
							{
								Id = Guid.NewGuid(),
								PortalId = sysPortal.Id,
								Domain = domainTemp,
								Protocol = ProtocolWeb.Https,
								IsMain = false,
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
								SysSite sysSites = new SysSite()
								{
									Id = Guid.NewGuid(),
									Code = input.UnitCode,
									Name = itemSysSite.Name,
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
									UnitCode = input.UnitCode
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
										UnitCode = input.UnitCode
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

								var item = new SystemParameter()
								{
									CreateDate = DateTime.Now,
									CreateUserId = User.Identity.GetUserId(),
									Description = itemSystemParameter.Description,
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
									Value2 = itemSystemParameter.Value2,
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
