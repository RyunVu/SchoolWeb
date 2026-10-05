using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web.Hosting;
using System.Web.Http;
using Bkav.edXML.API1.Entity;
using Microsoft.AspNet.Identity;
using Microsoft.Web.Administration;
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
                    var sysPortalAlias = db.SysPortalAlias.Where(x => x.Id == input.Id).ToList().Select(s => new SysPortalAliasModel(s)).FirstOrDefault();
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
                input.Domain = input.Domain.Trim();
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
                    // var logService = new LogService();

                    var sysPortalAlias = db.SysPortalAlias.FirstOrDefault(x => x.Id == input.Id && x.Status != StatusEnum.Deleted);
                    if (sysPortalAlias == null)
                    {
                        if (input.IsMain)
                        {
                            var main = db.SysPortalAlias.Where(x => x.IsMain == true).ToList();
                            foreach (var item in main)
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

                        //try
                        //{
                        //    // add domain
                        //    ServerManager server = new ServerManager();
                        //    logService.LogInfo("Bắt đầu thêm domain");
                        //    var site = server.Sites.FirstOrDefault(a => a.Name.Contains(HostingEnvironment.SiteName));
                        //    if (site != null)
                        //    {
                        //        site.Bindings.Add($"*:80:{input.Domain}", "http");
                        //        server.CommitChanges();
                        //        site.Stop();
                        //        site.Start();
                        //        logService.LogInfo($"Thêm thành công {input.Domain}");
                        //    }
                        //    else
                        //    {
                        //        logService.LogInfo("Không tìm thấy Sites");
                        //    }
                        //}
                        //catch (Exception e)
                        //{
                        //    logService.LogError("Domain", e);
                        //    Console.WriteLine(e);
                        //}
                    }
                    else
                    {
                        var oldDomain = sysPortalAlias.Domain == input.Domain ? "" : sysPortalAlias.Domain;
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
                        //try
                        //{
                        //    // add domain
                        //    if (!string.IsNullOrEmpty(oldDomain))
                        //    {
                        //        logService.LogInfo($"Site: {HostingEnvironment.SiteName}");

                        //        ServerManager server = new ServerManager();
                        //        var site = server.Sites.FirstOrDefault(a => a.Name.Contains(HostingEnvironment.SiteName));
                        //        if (site != null)
                        //        {
                        //            logService.LogInfo($"Bắt đầu xóa domain: {oldDomain}");
                        //            var binding = site.Bindings.FirstOrDefault(s =>
                        //                s.BindingInformation == $"*:80:{oldDomain}");
                        //            if (binding != null)
                        //            {
                        //                site.Bindings.Remove(binding);
                        //                logService.LogInfo($"Xóa domain: {oldDomain} thành công");
                        //            }
                        //            else
                        //            {
                        //                logService.LogInfo($"Không tìm thấy: {oldDomain}");
                        //            }
                        //            site.Bindings.Add($"*:80:{input.Domain}", "http");
                        //            server.CommitChanges();
                        //            site.Stop();
                        //            site.Start();
                        //            logService.LogInfo($"Thêm thành công {input.Domain}");
                        //        }
                        //        else
                        //        {
                        //            logService.LogInfo("Không tìm thấy Sites");
                        //        }
                        //    }

                        //}
                        //catch (Exception e)
                        //{
                        //    logService.LogError("Domain", e);
                        //    Console.WriteLine(e);
                        //}
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

                    //var logService = new LogService();

                    //ServerManager server = new ServerManager();
                    //var site = server.Sites.FirstOrDefault(a => a.Name.Contains(HostingEnvironment.SiteName));
                    //if (site != null)
                    //{
                    //    logService.LogInfo($"Bắt đầu xóa domain: {sysPortalAlias.Domain}");
                    //    var binding = site.Bindings.FirstOrDefault(s =>
                    //        s.BindingInformation == $"*:80:{sysPortalAlias.Domain}");
                    //    if (binding != null)
                    //    {
                    //        site.Bindings.Remove(binding);
                    //        server.CommitChanges();
                    //        logService.LogInfo($"Xóa domain: {sysPortalAlias.Domain} thành công");
                    //    }
                    //    else
                    //    {
                    //        logService.LogInfo($"Không tìm thấy: {sysPortalAlias.Domain}");
                    //    }
                    //    logService.LogInfo($"Stop");
                    //    site.Stop();
                    //    logService.LogInfo($"Stop thành công");
                    //    logService.LogInfo($"Start");
                    //    site.Start();
                    //    logService.LogInfo($"Start thành công");
                    //}
                    //else
                    //{
                    //    logService.LogInfo("Không tìm thấy Sites");
                    //}
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