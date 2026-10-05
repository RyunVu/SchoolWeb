using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
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
    public class MenuRoleController : ApiController
    {
        [HttpPost]
        public IHttpActionResult GetAllController(ControllerModel input)
        {
            var asm = Assembly.GetAssembly(typeof(MvcApplication));

            var controllerActionList = asm.GetTypes()
                .Where(type => typeof(ApiController).IsAssignableFrom(type))
                .SelectMany(type =>
                    type.GetMethods(BindingFlags.Instance | BindingFlags.DeclaredOnly | BindingFlags.Public))
                .Where(m => !m.GetCustomAttributes(typeof(CompilerGeneratedAttribute), true).Any())
                .Select(x => new
                {
                    Controller = x?.DeclaringType?.Name,
                    Action = x.Name,
                    ReturnType = x.ReturnType.Name,
                    Attributes = string.Join(",",
                        x.GetCustomAttributes().Select(a => a.GetType().Name.Replace("Attribute", "")))
                })
                .OrderBy(x => x.Controller).ThenBy(x => x.Action).ToList();
            if (!string.IsNullOrEmpty(input.Name))
                controllerActionList = controllerActionList
                    .Where(s => s.Controller.ToLower().Contains(input.Name.ToLower())
                                || s.Action.ToLower().Contains(input.Name.ToLower())
                    ).ToList();

            using (var context = new WebDbContext())
            {
                var existMenu =
                    context.SysMenuFuncs.Where(s => s.SystemMenuId == input.MenuId)
                        .ToList();


                var result = controllerActionList.GroupBy(s => s.Controller,
                    (k, c) => new ControllerModel
                    {
                        Name = k,
                        MenuId = input.MenuId,
                        Actions = c.Select(cs => new ActionModel
                        {
                            Name = cs.Action,
                            Actions = existMenu.Where(s =>
                                s.Controller.ToLower() == k.ToLower() && cs.Action.ToLower() == s.Method.ToLower()).Select(ww => new ActionModel()
                                {
                                    Name = ww.Action
                                }).ToList()
                        }).ToList()
                    }
                ).ToList();

                return Json(new ResultModel
                {
                    Code = ResultCode.Success,
                    Result = result
                });
            }
        }


        [HttpPost]
        public IHttpActionResult SaveFunctionInMenu(ControllerModel input)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    input.Action = input.Action?.ToLower() ?? "";
                    input.Name = input.Name?.ToLower() ?? "";
                    input.Method = input.Method?.ToLower() ?? "";

                    if (string.IsNullOrEmpty(input.Action) || string.IsNullOrEmpty(input.Name) || string.IsNullOrEmpty(input.Method))
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.UnSuccess,
                            Message = "Dữ liệu không hợp lệ"
                        });
                    }
                    var existMenu =
                        context.SysMenuFuncs.FirstOrDefault(s => s.SystemMenuId == input.MenuId
                                                                 && s.Action.ToLower() == input.Action
                                                                 && s.Controller.ToLower() == input.Name
                                                                 && s.Method.ToLower() == input.Method
                        );
                    if (existMenu == null)
                    {
                        existMenu = new SysMenuFunc()
                        {
                            Action = input.Action,
                            Controller = input.Name,
                            Method = input.Method,
                            SystemMenuId = input.MenuId
                        };
                        context.SysMenuFuncs.Add(existMenu);
                        context.SaveChanges();
                    }
                    else
                    {
                        context.Entry(existMenu).State = EntityState.Deleted;
                        context.SaveChanges();
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
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }

        }

        [HttpPost]
        public IHttpActionResult SaveFunctionInMenus(ControllerModel input)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    input.Controller = input.Controller?.ToLower() ?? "";
                    input.Method = input.Method?.ToLower() ?? "";

                    if (string.IsNullOrEmpty(input.Controller) || string.IsNullOrEmpty(input.Method))
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.UnSuccess,
                            Message = "Dữ liệu không hợp lệ!"
                        });
                    }

                    var ignores = new List<string>() { "add", "edit", "delete" };

                    if (input.Actions == null || input.Actions.Any(s => string.IsNullOrEmpty(s.Name?.Trim()) || ignores.Any(w => w == s.Name.Trim().ToLower())))
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.UnSuccess,
                            Message = "Dữ liệu Action không hợp lệ!"
                        });
                    }

                    var existMenus =
                        context.SysMenuFuncs.Where(s => s.SystemMenuId == input.MenuId
                                                                 && s.Action.ToLower() == input.Action
                                                                 && s.Controller.ToLower() == input.Controller
                                                                 && ignores.Any(w => w != s.Method.ToLower())
                        ).ToList();
                    foreach (var sysMenuFunc in existMenus)
                    {
                        context.Entry(sysMenuFunc).State = EntityState.Deleted;
                        context.SaveChanges();
                    }
                    foreach (var item in input.Actions)
                    {
                        item.Name = item.Name.ToLower().Trim();
                        var existMenu =
                            context.SysMenuFuncs.FirstOrDefault(s => s.SystemMenuId == input.MenuId
                                                                     && s.Action.ToLower() == input.Action
                                                                     && s.Controller.ToLower() == input.Controller
                                                                     && s.Method.ToLower() == item.Name
                            );
                        if (existMenu == null)
                        {
                            existMenu = new SysMenuFunc()
                            {
                                Action = item.Name,
                                Controller = input.Controller,
                                Method = input.Method,
                                SystemMenuId = input.MenuId
                            };
                            context.SysMenuFuncs.Add(existMenu);
                            context.SaveChanges();
                        }
                        else
                        {

                        }
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
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }

        }

        [HttpPost]
        public IHttpActionResult MenuByRole(MenuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);

                    var role = context.Roles.FirstOrDefault(s =>
                        s.RoleLevel > minRoleLevel && s.Id == model.RoleId && s.Status == StatusEnum.Used);
                    if (role == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnknowError,
                            Message = "Bạn ko có quyền hoặc quyền ko tồn tại"
                        });

                    }
                    var items = context.SystemMenus.Where(s => s.Status != StatusEnum.Deleted && s.RoleLevel > minRoleLevel && s.MenuCode == "Web");

                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        model.Keyword = model.Keyword.ToLower();
                        items = items.Where(s => s.Title.ToLower().Contains(model.Keyword));
                    }

                    var temp = items.ToList().Select(s =>
                    {
                        var roles = context.RolePermissions.FirstOrDefault(w =>
                            w.RoleId == model.RoleId && w.SysMenuId == s.Id)?.RolePermissionProperties ?? new List<RolePermissionProperty>();

                        var menu = new MenuModel(s)
                        {
                            Permissions = s.SysMenuFuncs.Select(w => new PermissionMenu(w.Action)
                            {
                                Value = roles.Any(k => k.Command.ToLower() == w.Action.ToLower())
                            }).ToList()
                        };
                        menu.Permissions.AddRange(roles.Where(r => menu.Permissions.All(w => w.Command.ToLower() != r.Command.ToLower())).Select(w => new PermissionMenu(w.Command, true)).ToList());
                        var goiY = string.IsNullOrEmpty(menu.OtherRole) ? new List<string>() : menu.OtherRole.Split(';').Select(k => k.Trim()).ToList();
                        goiY = goiY.Where(k => !string.IsNullOrEmpty(k) && menu.Permissions.All(w => w.Command.ToLower() != k.ToLower())).ToList();
                        menu.GoiYs = goiY;
                        menu.RoleId = model.RoleId;
                        menu.IsHomePage = menu.Id == role.HomeMenuId?.ToString();
                        return menu;
                    }
                    ).ToList();
                    var result = RoleDal<MenuModel>.GroupByParent(temp);
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        TotalRow = temp.Count
                    });
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
        public IHttpActionResult SetHomePage(MenuModel input)
        {
            try
            {
                using (var context = new WebDbContext())
                {

                    var existRole =
                        context.Roles.FirstOrDefault(s => s.Id == input.RoleId && s.Status == StatusEnum.Used);
                    if (existRole == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.UnSuccess,
                            Message = "Quyền không tồn tại!"
                        });
                    }

                    var menuId = Guid.Parse(input.Id);
                    var checkMenu = context.SystemMenus.FirstOrDefault(s => s.Id == menuId && s.Status == StatusEnum.Used);
                    if (checkMenu == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.UnSuccess,
                            Message = "Menu không tồn tại!"
                        });
                    }

                    existRole.HomeMenuId = menuId;
                    existRole.UpdateDate = DateTime.Now;
                    existRole.UpdateUserId = User.Identity.GetUserId();
                    context.Entry(existRole).State = EntityState.Modified;
                    context.SaveChanges();
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
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }

        }

        [HttpPost]
        public IHttpActionResult SaveMenuInRole(MenuRoleModel input)
        {
            try
            {
                using (var context = new WebDbContext())
                {

                    var existMenus =
                        context.RolePermissions.FirstOrDefault(s => s.SysMenuId == input.MenuId && s.RoleId == input.RoleId);
                    if (existMenus == null)
                    {
                        existMenus = new RolePermission()
                        {
                            CreateDate = DateTime.Now,
                            CreateUserId = User.Identity.GetUserId(),
                            Description = "",
                            Id = Guid.NewGuid(),
                            Status = StatusEnum.Used,
                            IsAllow = false,
                            LanguageId = "",
                            Role = null,
                            RoleId = input.RoleId,
                            RolePermissionProperties = null,
                            SysMenuId = input.MenuId,
                            Tag = "",
                            UpdateDate = DateTime.Now,
                            UpdateUserId = User.Identity.GetUserId(),
                            UnitCode = "LDG"
                        };
                        context.RolePermissions.Add(existMenus);
                        context.SaveChanges();
                    }

                    var currentPermission =
                        existMenus.RolePermissionProperties?.FirstOrDefault(s => s.Command.ToLower() == input.Command.ToLower());
                    if (currentPermission == null)
                    {
                        currentPermission = new RolePermissionProperty()
                        {
                            Id = existMenus.Id,
                            Command = input.Command.ToLower(),
                            Value = true
                        };
                        context.RolePermissionProperties.Add(currentPermission);
                        context.SaveChanges();
                    }

                    else
                    {
                        context.Entry(currentPermission).State = EntityState.Deleted;
                        context.SaveChanges();
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
                    Code = ResultCode.UnSuccess,
                    Message = e.Message
                });
            }

        }

    }

}
