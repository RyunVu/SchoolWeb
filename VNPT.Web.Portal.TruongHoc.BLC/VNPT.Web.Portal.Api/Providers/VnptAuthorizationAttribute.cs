using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
using Microsoft.AspNet.Identity;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Base.Dal;

namespace VNPT.Web.Portal.Api.Providers
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public class VnptAuthorizationAttribute : AuthorizeAttribute
    {
        public List<AccessLevel> AccessLevels { get; set; }
        public bool IsCheckPermission { get; set; }
        public bool IsForAll { get; set; }

        public string AccessLevel
        {
            get => string.Join(",", AccessLevels);
            set
            {
                var accessLevels = value.Split(',');
                AccessLevels = new List<AccessLevel>();
                foreach (var accessLevel in accessLevels) AccessLevels.Add(new AccessLevel(accessLevel));
                AccessLevels = AccessLevels.Where(s => !string.IsNullOrEmpty(s.Menu)).ToList();
            }
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            base.OnAuthorization(actionContext);
            if (actionContext.RequestContext.Principal.Identity.GetValue<int>("UserType") != 1)
            {
                HandleUnauthorizedRequest(actionContext, "Không phải cán bộ!");
                return;
            }


            if (!IsAuthorized(actionContext))
            {
                HandleUnauthorizedRequest(actionContext, "Chưa đăng nhập!");
                return;
            }

            try
            {
                var deviceId = "";
                try
                {
                    deviceId = actionContext.Request.Headers.GetValues("DeviceId").FirstOrDefault() ?? "";
                }
                catch
                {
                    deviceId = "";
                }
                var authorization = actionContext.Request.Headers.GetValues("Authorization").FirstOrDefault() ?? "";
                authorization = authorization.Replace("Bearer ", "").Replace("bearer ", "");
                if (!UserDal.CheckValidToken(new UserLoginHistory()
                {
                    AccessToken = authorization.Trim(),
                    DeviceId = deviceId.Trim(),
                    UserId = actionContext.RequestContext.Principal.Identity.GetValue<string>("Id"),
                }))
                {
                    HandlePermissionRequest(actionContext, "Phiên đăng nhập không hợp lệ!");
                    return;
                }
            }
            catch (Exception e)
            {
                HandlePermissionRequest(actionContext, "Lỗi xác nhận đăng nhập!");
                return;
            }
            //// kiểm tra permisstion
            //if (!IsPermission(actionContext))
            //{
            //    HandlePermissionRequest(actionContext, "Lỗi ko có quyền vào menu!");
            //    return;
            //}

            if (!IsForAll && !CheckController(actionContext))
            {
                HandlePermissionRequest(actionContext, "Không có quyền truy cập Url!");
            }
        }

        private bool CheckController(HttpActionContext actionContext)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var userId = actionContext.RequestContext.Principal.Identity.GetUserId();

                    var user =
                        context.Users.FirstOrDefault(
                            s => s.Id == userId && s.Status != StatusEnum.Deleted
                        );
                    if (user == null) return false;

                    // nếu là super admin system thì ko cần check
                    if (user.IsInRole(RoleCode.SuperAdminSystem)) return true;
                    var controllerName = actionContext.ControllerContext.ControllerDescriptor.ControllerName.ToLower() +
                                         "controller";
                    var actionName = actionContext.ActionDescriptor.ActionName.ToLower();


                    var menu = context.SysMenuFuncs.Where(s =>
                        s.Controller.ToLower() == controllerName && s.Method.ToLower() == actionName).ToList();

                    // Nếu action chưa được đăng ký trong SysMenuFuncs, thử tìm action cha (ví dụ: DeleteMultiple -> Delete)
                    // để kế thừa quyền cho các action mới có cùng chức năng.
                    if (!menu.Any())
                    {
                        var parentActionName = actionName;
                        if (actionName.StartsWith("delete") && actionName != "delete")
                        {
                            parentActionName = "delete";
                        }
                        else if (actionName.StartsWith("save") && actionName != "save")
                        {
                            parentActionName = "save";
                        }
                        else if (actionName.StartsWith("modify") && actionName != "modify")
                        {
                            parentActionName = "modify";
                        }
                        else if (actionName.StartsWith("add") && actionName != "add")
                        {
                            parentActionName = "add";
                        }
                        else if (actionName.StartsWith("update") && actionName != "update")
                        {
                            parentActionName = "update";
                        }

                        if (parentActionName != actionName)
                        {
                            menu = context.SysMenuFuncs.Where(s =>
                                s.Controller.ToLower() == controllerName && s.Method.ToLower() == parentActionName).ToList();
                        }
                    }

                    var roles = context.Roles.ToList()
                        .Any(s => user.Roles.Any(w => w.RoleId == s.Id) &&
                                  s.RolePermissions.Any(w => menu.Any(m => m.SystemMenuId == w.SysMenuId)));
                    return roles;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return false;
            }
        }

        private bool IsPermission(HttpActionContext actionContext)
        {
            using (var context = new WebDbContext())
            {
                var userId = actionContext.RequestContext.Principal.Identity.GetUserId();

                var user =
                    context.Users.FirstOrDefault(
                        s => s.Id == userId && s.Status != StatusEnum.Deleted
                    );
                if (user == null) return false;

                // nếu là super admin system thì ko cần check
                if (user.IsInRole(RoleCode.SuperAdminSystem)) return true;
                if (AccessLevels == null || AccessLevels.Count == 0) return true;

                var unitCode = user.UnitCode?.ToLower() ?? "";
                var roles = context.Roles.Where(s => user.Roles.Any(w => w.RoleId == s.Id)).ToList();
                var menus = roles.SelectMany(s => s.RolePermissions.Where(j =>
                    j.UnitCode?.ToLower() == unitCode &&
                    AccessLevels.Any(access => access.Menu == j.SystemMenu.MenuCode))).ToList();

                if (AccessLevels.Select(accessLevel => menus.Any(s => s.UnitCode?.ToLower() == unitCode &&
                                                                      s.SystemMenu.MenuCode == accessLevel.Menu &&
                                                                      s.RolePermissionProperties.Any(prop =>
                                                                          prop.Command == accessLevel.Method &&
                                                                          prop.Value))).Any(result => result))
                    return true;
            }

            return false;
        }

        protected void HandleUnauthorizedRequest(HttpActionContext actionContext, string message = "")
        {
            var result = new ResultModel
            {
                Code = ResultCode.Unauthentication,
                Message = message
            };

            actionContext.Response =
                actionContext.ControllerContext.Request.CreateResponse(HttpStatusCode.Unauthorized, result);
            //HandleUnauthorizedRequest(actionContext);
        }
        //protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        //{
        //    //var result = new ResultModel
        //    //{
        //    //    Code = ResultCode.Unauthentication,
        //    //    Message = ResultCode.Unauthentication.ToString()
        //    //};

        //    //actionContext.Response =
        //    //    actionContext.ControllerContext.Request.CreateResponse(HttpStatusCode.Unauthorized, result);
        //}
        protected void HandlePermissionRequest(HttpActionContext actionContext, string message = "")
        {
            var result = new ResultModel
            {
                Code = ResultCode.NotPermission,
                Message = message
            };

            actionContext.Response =
                actionContext.ControllerContext.Request.CreateResponse(HttpStatusCode.Unauthorized, result);
        }
        //protected override bool AuthorizeCore(HttpContextBase httpContext)
        //{
        //    var isAuthorized = base.AuthorizeCore(httpContext);
        //    if (!isAuthorized)
        //    {
        //        return false;
        //    }

        //    // // Call another method to get rights of the user from DB

        //    return true;
        //}
    }
    public class AccessLevel
    {
        public string Method { get; set; }
        public string Menu { get; set; }

        public AccessLevel()
        {
        }

        public AccessLevel(string accessLevel)
        {
            var temp = accessLevel.Split('.');
            if (temp.Length != 2) return;
            Menu = temp[0].Trim();
            Method = temp[1].Trim();
        }

        public override string ToString()
        {
            return Menu + "." + Method;
        }

    }
}