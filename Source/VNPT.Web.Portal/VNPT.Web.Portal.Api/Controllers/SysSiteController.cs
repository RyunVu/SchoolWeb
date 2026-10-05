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
	public class SysSiteController : ApiController
    {
        [HttpPost]
        public IHttpActionResult GetList(SysSiteModel input)
        {
            try
            {
                using (var db = new WebDbContext())
                {
                    var sysSites = db.SysSites.Where(x => x.PortalId == input.PortalId && x.Status != StatusEnum.Deleted);
                    if (!string.IsNullOrEmpty(input.Keyword))
                    {
                        input.Keyword = input.Keyword.RemoveUnicode().ToLower();
                        sysSites = sysSites.ToList().Where(s => (!string.IsNullOrEmpty(s.Name) ? s.Name.ToLower().RemoveUnicode() : "").Contains(input.Keyword) 
                        || (!string.IsNullOrEmpty(s.Subdomain) ? s.Subdomain.ToLower().RemoveUnicode() : "").Contains(input.Keyword)
                        || (!string.IsNullOrEmpty(s.SiteUrl) ? s.SiteUrl.ToLower().RemoveUnicode() : "").Contains(input.Keyword)).AsQueryable();
                    }

                    var result = sysSites.ToList().Select(s => new SysSiteModel(s)).ToList();
                    var paging = result.Paging(input);
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = paging,
                        TotalRow = result.Count
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
        public IHttpActionResult Modify(SysSiteModel input)
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

                    var sysSites = db.SysSites.FirstOrDefault(x => x.Id == input.Id && x.Status != StatusEnum.Deleted);

                    var sysPortals = db.SysPortals.FirstOrDefault(x => x.Id == input.PortalId && x.Status != StatusEnum.Deleted);

                    if (sysSites == null)
                    {
                        sysSites = new SysSite()
                        {
                            Id = Guid.NewGuid(),
                            Code = sysPortals.UnitCode,
                            Name = input.Name,
                            Subdomain = input.Subdomain,
                            PortalId = input.PortalId,
                            AdministratorId = sysPortals.AdministratorId,
                            SiteUrl = input.SiteUrl,
                            IsSysSite = false,
                            LayoutId = input.LayoutId,
                            IsAuthorized = false,
                            MenuEnabled = true,
                            MenuOrder = 1,
                            IsFeatured = true,
                            Status = StatusEnum.Used,
                            CreateDate = DateTime.Now,
                            CreateUserId = User.Identity.GetUserId(),
                            LanguageId = defaultLanguage,
                            UnitCode = input.UnitCode
                        };
                        db.SysSites.Add(sysSites);
                    }
                    else
                    {
                        sysSites.Code = sysPortals.UnitCode;
                        sysSites.Name = input.Name;
                        sysSites.Subdomain = input.Subdomain;
                        sysSites.PortalId = input.PortalId;
                        sysSites.AdministratorId = sysPortals.AdministratorId;
                        sysSites.SiteUrl = input.SiteUrl;
                        sysSites.IsSysSite = false;
                        sysSites.LayoutId = input.LayoutId;
                        sysSites.IsAuthorized = false;
                        sysSites.MenuEnabled = true;
                        sysSites.MenuOrder = 1;
                        sysSites.IsFeatured = true;
                        sysSites.Status = StatusEnum.Used;
                        sysSites.UpdateDate = DateTime.Now;
                        sysSites.UpdateUserId = User.Identity.GetUserId();
                        sysSites.LanguageId = defaultLanguage;
                        sysSites.UnitCode = input.UnitCode;
                        db.Entry(sysSites).State = EntityState.Modified;
                    }
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
        public IHttpActionResult Delete(SysSiteModel input)
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

                    var sysSites = db.SysSites.FirstOrDefault(x => x.Id == input.Id && x.Status != StatusEnum.Deleted);
                    if (sysSites == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Dữ liệu không tồn tại!",
                            Result = null
                        });
                    }

                    sysSites.Status = StatusEnum.Deleted;
                    sysSites.UpdateDate = DateTime.Now;
                    sysSites.UpdateUserId = User.Identity.GetUserId();
                    db.Entry(sysSites).State = EntityState.Modified;
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
        public IHttpActionResult GetListThemeLayout(SysThemeModel input)
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

                    var sysThemeLayout = db.SysThemeLayout.Where(x => x.Status != StatusEnum.Deleted && x.UnitCode.ToLower() == input.UnitCode.ToLower()).ToList()
                        .Select(s => new SysThemeLayoutModel(s)).ToList();

                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = sysThemeLayout
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
    }
}