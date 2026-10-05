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
	public class SysPortalAliasController : ApiController
    {
        [HttpPost]
        public IHttpActionResult GetList(SysPortalAliasModel input)
        {
            try
            {
                using (var db = new WebDbContext())
                {
                    var sysPortalAlias = db.SysPortalAlias.Where(x => x.PortalId == input.PortalId && x.Status != StatusEnum.Deleted);
                    if (!string.IsNullOrEmpty(input.Keyword))
                    {
                        input.Keyword = input.Keyword.RemoveUnicode().ToLower();
                        sysPortalAlias = sysPortalAlias.ToList().Where(s => (!string.IsNullOrEmpty(s.Domain) ? s.Domain.ToLower().RemoveUnicode() : "").Contains(input.Keyword)).AsQueryable();
                    }

                    var result = sysPortalAlias.ToList().Select(s => new SysPortalAliasModel(s)).ToList();
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
        public IHttpActionResult GetSingle(SysPortalAliasModel input)
        {
            try
            {
                using (var db = new WebDbContext())
                {
                    var sysPortalAlias = db.SysPortalAlias.Where(x => x.Id == input.Id).ToList().Select(s=>new SysPortalAliasModel(s)).FirstOrDefault();
                    if (sysPortalAlias == null)
                    {
                        sysPortalAlias = new SysPortalAliasModel();
                    }
                    
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Message = ResultCode.Success.ToString(),
                        Result = sysPortalAlias
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
        public IHttpActionResult Modify(SysPortalAliasModel input)
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

                    var sysPortalAlias = db.SysPortalAlias.FirstOrDefault(x => x.Id == input.Id && x.Status != StatusEnum.Deleted);
                    if (sysPortalAlias == null)
                    {
                        if (input.IsMain)
                        {
                            var main = db.SysPortalAlias.Where(x => x.IsMain == true).ToList();
                            foreach(var item in main)
                            {
                                item.IsMain = false;
                                db.Entry(item).State = EntityState.Modified;
                            }
                        }

                        sysPortalAlias = new SysPortalAlias()
                        {
                            Id = Guid.NewGuid(),
                            PortalId = input.PortalId,
                            Domain = input.Domain,
                            Protocol = input.Protocol,
                            IsMain = input.IsMain,
                            Tag = input.Tag,
                            Status = StatusEnum.Used,
                            Description = input.Description,
                            CreateDate = DateTime.Now,
                            CreateUserId = User.Identity.GetUserId(),
                            LanguageId = defaultLanguage,
                            UnitCode = input.UnitCode
                        };
                        db.SysPortalAlias.Add(sysPortalAlias);
                    }
                    else
                    {
                        sysPortalAlias.PortalId = input.PortalId;
                        sysPortalAlias.Domain = input.Domain;
                        sysPortalAlias.Protocol = input.Protocol;
                        sysPortalAlias.IsMain = input.IsMain;
                        sysPortalAlias.Tag = input.Tag;
                        sysPortalAlias.Status = StatusEnum.Used;
                        sysPortalAlias.Description = input.Description;
                        sysPortalAlias.UpdateDate = DateTime.Now;
                        sysPortalAlias.UpdateUserId = User.Identity.GetUserId();
                        sysPortalAlias.LanguageId = defaultLanguage;
                        sysPortalAlias.UnitCode = input.UnitCode;
                        db.Entry(sysPortalAlias).State = EntityState.Modified;
                        if (input.IsMain)
                        {
                            var main = db.SysPortalAlias.Where(x => x.IsMain == true).ToList();
                            foreach (var item in main)
                            {
                                item.IsMain = sysPortalAlias.Id != item.Id ? false : item.IsMain;
                                db.Entry(item).State = EntityState.Modified;
                            }
                        }
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
        public IHttpActionResult Delete(SysPortalAliasModel input)
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

                    var sysPortalAlias = db.SysPortalAlias.FirstOrDefault(x => x.Id == input.Id && x.Status != StatusEnum.Deleted);
                    if (sysPortalAlias == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Dữ liệu không tồn tại!",
                            Result = null
                        });
                    }

                    sysPortalAlias.Status = StatusEnum.Deleted;
                    sysPortalAlias.UpdateDate = DateTime.Now;
                    sysPortalAlias.UpdateUserId = User.Identity.GetUserId();
                    db.Entry(sysPortalAlias).State = EntityState.Modified;
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
    }
}