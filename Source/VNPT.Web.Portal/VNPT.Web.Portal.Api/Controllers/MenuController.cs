using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
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
    public class MenuController : BaseApiController
    {
        public IHttpActionResult MenuInfo(MenuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var users = context.Users.Where(s => s.Status != StatusEnum.Deleted);
                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        users = users.Where(s => s.UserName.Contains(model.Keyword));
                    }

                    var temp = users.OrderBy(s => s.FirstName).ToList();
                    var result = temp.Paging(model).Select(s => new UserModel(s)).ToList();
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
        public IHttpActionResult CheckPermission(SystemMenu requestData)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var userId = User.Identity.GetUserId();
                    var user = context.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);
                    if (user == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.DataNotEnough,
                            Message = "Tài khoản đã bị xoá!"
                        });
                    }

                    var roleIds = user.Roles.Select(s => s.RoleId).ToList();
                    var roles = context.Roles.Where(w => roleIds.Any(s => s == w.Id)).ToList();
                    var userRoles = roles.Select(s => new RoleModel()
                    {
                        Id = s.Id,
                        Name = s.Name,
                        RoleLevel = s.RoleLevel
                    }).ToList();
                    if (requestData.Action[0] == '/')
                    {
                        requestData.Action = requestData.Action.Substring(1);
                    }

                    requestData.Action = requestData.Action.ToLower();
                    if (user.IsInRole(RoleCode.SuperAdminSystem, userRoles))
                    {
                        var menu1 = context.SystemMenus.FirstOrDefault(s =>
                            s.Action.ToLower() == requestData.Action && s.Status != StatusEnum.Deleted);

                        if (menu1 == null)
                        {
                            var menuSlit = requestData.Action.Split('/').ToList();
                            for (int i = menuSlit.Count - 1; i > 0; i--)
                            {
                                menuSlit.RemoveAt(i);
                                if (menuSlit.Count == 0)
                                    break;
                                var actionTemp = string.Join("/", menuSlit);
                                menu1 = context.SystemMenus.FirstOrDefault(s =>
                                    s.Action.ToLower() == actionTemp && s.IsUseParameterUrl == true && s.Status != StatusEnum.Deleted);
                                if (menu1 != null)
                                {
                                    break;
                                }
                            }
                        }
                        if (menu1 != null)
                        {
                            HistoryDal.Write(User.Identity.GetUserId(), "Menus", HistoryActionEnum.View, menu1.Id, null, menu1.Action, GetClientIp(), context: context);
                        }
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Success,
                            Result = new MenuModel()
                            {
                                Permissions = new List<PermissionMenu>()
                                {
                                    new PermissionMenu("FullRole")
                                },
                                Parameter = menu1?.Parameter,
                                Title = menu1?.Title,
                                Id = menu1?.Id.ToString()
                            }
                        });
                    }

                    requestData.Action = requestData.Action.ToLower();
                    var menu = context.SystemMenus.FirstOrDefault(s =>
                        s.Action.ToLower() == requestData.Action && s.Status != StatusEnum.Deleted);

                    if (menu == null)
                    {
                        var menuSlit = requestData.Action.Split('/').ToList();
                        for (int i = menuSlit.Count - 1; i > 0; i--)
                        {
                            menuSlit.RemoveAt(i);
                            if (menuSlit.Count == 0)
                                break;
                            var actionTemp = string.Join("/", menuSlit);
                            menu = context.SystemMenus.FirstOrDefault(s =>
                                s.Action.ToLower() == actionTemp && s.IsUseParameterUrl == true && s.Status != StatusEnum.Deleted);
                            if (menu != null)
                            {
                                break;
                            }
                        }
                    }

                    if (menu != null)
                    {
                        var permissions = context.RolePermissions
                            .Where(s => s.SysMenuId == menu.Id && roleIds.Any(w => w == s.RoleId))
                            .SelectMany(s => s.RolePermissionProperties)
                            .Where(k => k.Value)
                            .Select(s => s.Command)
                            .Distinct().ToList();
                        if (permissions.Count > 0)
                        {

                            HistoryDal.Write(User.Identity.GetUserId(), "Menus", HistoryActionEnum.View, menu.Id, null, menu.Action, GetClientIp(), context: context);
                            var userPermissions = permissions.Select(permission => new PermissionMenu(permission)).ToList();
                            return Json(new ResultModel
                            {
                                Code = ResultCode.Success,
                                Result = new MenuModel()
                                {
                                    Id = menu.Id.ToString(),
                                    Permissions = userPermissions,
                                    Parameter = menu.Parameter,
                                    Title = menu.Title
                                }
                            });
                        }
                        return Json(new ResultModel
                        {
                            Code = ResultCode.DataNotEnough,
                            Message = "Không có quyền truy cập vào trang này!"
                        });
                    }

                    return Json(new ResultModel
                    {
                        Code = ResultCode.UnSuccess,
                        Message = "Trang không còn tồn tại!"
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Exception,
                    Message = ex.Message,
                    Result = null
                });
            }
        }


        [HttpPost]
        public IHttpActionResult Menus(MenuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                    var items = context.SystemMenus.Where(s => s.Status != StatusEnum.Deleted && s.RoleLevel > minRoleLevel && s.UnitCode == model.Code && s.MenuCode == model.MenuCode);
                    items = items.OrderByDescending(s => s.UpdateDate);
                    var temp = items.ToList();
                    var result = temp.Paging(model).Select(s => new GeneralModel()
                    {
                        Id = s.Id,
                        Name = $@"{s.Title} ({s.MenuCode})"
                    }).ToList();

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
        public IHttpActionResult ParentMenus(MenuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                    var items = context.SystemMenus.Where(s => s.Status != StatusEnum.Deleted && s.RoleLevel > minRoleLevel);
                    if (!string.IsNullOrEmpty(model.MenuCode))
                    {
                        items = items.Where(s => s.MenuCode.ToLower() == model.MenuCode.ToLower());
                    }
                    if (!string.IsNullOrEmpty(model.UnitCode))
                    {
                        items = items.Where(s => s.UnitCode.ToLower() == model.UnitCode.ToLower());
                    }
                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        items = items.Where(s => s.Title.ToLower().Contains(model.Keyword.ToLower()) || s.Action.ToLower().Contains(model.Keyword.ToLower()));
                    }
                    var temp = items.ToList().Select(s => new MenuModel(s)).ToList();
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
        public IHttpActionResult LeftMenu(MenuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                    var userId = User.Identity.GetUserId();
                    List<SystemMenu> userRoles;

                    if (string.IsNullOrEmpty(model.MenuCode))
                    {
                        model.MenuCode = "Web";
                    }

                    if (User.IsInRole(RoleCode.SuperAdminSystem))
                    {
                        userRoles = context.SystemMenus.Where(s => s.Status == StatusEnum.Used && s.IsShowMenu == true && s.MenuCode == model.MenuCode).ToList();
                    }
                    else
                    {
                        userRoles =
                            context.UserRoles.Where(s => s.UserId == userId && s.Role.Status == StatusEnum.Used)
                                .SelectMany(s => s.Role.RolePermissions)
                                .Where(s => s.RolePermissionProperties.Count > 0)
                                .Select(s => s.SystemMenu).Where(s => s.IsShowMenu == true).ToList().Where(s => s.Status == StatusEnum.Used).ToList();

                    }
                    //var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    //if (currentUnitCode == "LDG")
                    //{

                    //}
                    //else
                    //{
                    //    userRoles = userRoles.Where(s => s.UnitCode.ToLower() == currentUnitCode.ToLower()).ToList();
                    //}
                    var temp = new List<MenuModel>();
                    foreach (var systemMenu in userRoles)
                    {
                        if (temp.All(s => systemMenu.Id.ToString() != s.Id))
                        {
                            var item = new MenuModel(systemMenu);
                            temp.Add(item);
                        }
                    }

                    //var temp = userRoles.ToList().Select(s => new MenuModel(s)).ToList();
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
        public IHttpActionResult Save(MenuModel model)
        {
            try
            {
                Guid? parentId = null;
                var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                if (model.RoleLevel <= minRoleLevel)
                {
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.UnSuccess,
                        Message = "Level phải lớn hơn " + minRoleLevel
                    });
                }
                if (!string.IsNullOrEmpty(model.ParentId))
                {
                    parentId = Guid.Parse(model.ParentId);
                }

                using (var context = new WebDbContext())
                {
                    if (!string.IsNullOrEmpty(model.Id))
                    {
                        var id = Guid.Parse(model.Id);
                        var oldItem = context.SystemMenus.FirstOrDefault(s => s.Status == StatusEnum.Used && s.Id == id);
                        if (oldItem == null)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = "Quyền đã bị xoá hoặc không tồn tại!"
                            });
                        }

                        oldItem.Description = model.Description;
                        oldItem.ParentId = parentId;
                        oldItem.RoleLevel = model.RoleLevel;
                        oldItem.Action = model.Action;
                        oldItem.Title = model.Title;
                        oldItem.Title_En = model.Title_En;
                        oldItem.Icon = model.Icon;
                        oldItem.MenuCode = model.Code;
                        oldItem.SortNo = model.OrderNo;
                        oldItem.UpdateDate = DateTime.Now;
                        oldItem.UpdateUserId = User.Identity.GetUserId();
                        oldItem.Parameter = model.Parameter;
                        oldItem.IsShowMenu = model.IsShowMenu;
                        oldItem.IsUseParameterUrl = model.IsUseParameterUrl;
                        oldItem.OtherRole = model.OtherRole;
                        oldItem.UnitCode = model.UnitCode;
                        context.Entry(oldItem).State = EntityState.Modified;
                        context.SaveChanges();
                    }
                    else
                    {
                        var item = new SystemMenu()
                        {
                            CreateDate = DateTime.Now,
                            CreateUserId = User.Identity.GetUserId(),
                            Description = model.Description,
                            Id = Guid.NewGuid(),
                            ParentId = parentId,
                            RoleLevel = model.RoleLevel,
                            Status = StatusEnum.Used,
                            Tag = "",
                            Action = model.Action,
                            Children = null,
                            Parent = null,
                            Title = model.Title,
                            Title_En = model.Title_En,
                            Icon = model.Icon,
                            LanguageId = "",
                            MenuCode = model.Code,
                            SortNo = model.OrderNo,
                            UpdateDate = DateTime.Now,
                            UpdateUserId = User.Identity.GetUserId(),
                            Parameter = model.Parameter,
                            IsShowMenu = model.IsShowMenu,
                            IsUseParameterUrl = model.IsUseParameterUrl,
                            OtherRole = model.OtherRole,
                            UnitCode = model.UnitCode
                        };
                        context.SystemMenus.Add(item);
                        context.SaveChanges();
                    }

                    if (model.MenuCode == "PORTAL" && model.Action == "danh-sach-tin-tuc") // Tự động thêm menu con trong danh sách tin tức
                    {
                        var actionTemp = "quan-ly-tin-tuc/" + model.Parameter;

                        SystemMenu systemMenuWeb = context.SystemMenus.FirstOrDefault(s => s.Status == StatusEnum.Used && s.MenuCode == "Web" && s.Action == actionTemp && s.Parameter == model.Parameter);

                        SystemMenu systemMenuWebParent = context.SystemMenus.FirstOrDefault(s => s.Status == StatusEnum.Used && s.MenuCode == "Web" && s.Title == "Quản lý tin tức" && s.ParentId == null);

                        if (systemMenuWeb == null)
                        {
                            var itemChild = new SystemMenu()
                            {
                                CreateDate = DateTime.Now,
                                CreateUserId = User.Identity.GetUserId(),
                                Id = Guid.NewGuid(),
                                ParentId = systemMenuWebParent.Id,
                                RoleLevel = 4,
                                Status = StatusEnum.Used,
                                Tag = "",
                                Action = actionTemp,
                                Children = null,
                                Parent = null,
                                Title = model.Title,
                                Title_En = model.Title_En,
                                Icon = model.Icon,
                                LanguageId = "",
                                MenuCode = "Web",
                                SortNo = model.OrderNo,
                                UpdateDate = DateTime.Now,
                                UpdateUserId = User.Identity.GetUserId(),
                                Parameter = model.Parameter,
                                IsShowMenu = model.IsShowMenu,
                                IsUseParameterUrl = model.IsUseParameterUrl,
                                OtherRole = model.OtherRole,
                                UnitCode = "LDG"
                            };
                            context.SystemMenus.Add(itemChild);
                            context.SaveChanges();
                        }
                    }

                    return Json(new ResultModel()
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

        [HttpPost]
        public IHttpActionResult Delete(MenuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    if (!string.IsNullOrEmpty(model.Id))
                    {
                        var id = Guid.Parse(model.Id);
                        var oldItem = context.SystemMenus.FirstOrDefault(s => s.Status == StatusEnum.Used && s.Id == id);
                        if (oldItem == null)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = "Menu đã bị xoá hoặc không tồn tại!"
                            });
                        }
                        oldItem.Status = StatusEnum.Deleted;
                        context.Entry(oldItem).State = EntityState.Modified;
                        context.SaveChanges();
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                        });
                    }
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.DataNotEnough,
                        Message = "Menu không tồn tại"
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

        [HttpPost]

        public IHttpActionResult ItemsSystemParams(SystemParamsModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var systemParameters = context.SystemParameters.Where(s => s.Status != StatusEnum.Deleted);

                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        systemParameters = systemParameters.Where(s => s.Id.ToLower().Contains(model.Keyword.ToLower()));
                    }
                    if (!string.IsNullOrEmpty(model.Code))
                    {
                        systemParameters = systemParameters.Where(s => s.Code == model.Code);
                    }

                    string userId = User.Identity.GetUserId();

                    var user = context.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);

                    if (user != null && !User.IsInRole(RoleCode.SuperAdminSystem))
                    {
                        model.UnitCode = user.UnitCode;
                    }

                    if (!string.IsNullOrEmpty(model.UnitCode))
                    {
                        systemParameters = systemParameters.Where(s => s.UnitCode == model.UnitCode);
                    }

                    var temp = systemParameters.ToList();
                    var result = temp.Paging(model).Select(s => new SystemParamsModel(s)).ToList();
                    var index = model.PageIndex ?? 1;
                    var size = model.PageSize ?? 10;
                    var resultPaging = result.Skip(size * (index - 1)).Take(size).ToList();
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = resultPaging,
                        TotalRow = result.Count
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
        public IHttpActionResult SaveSystemParams(SystemParamsModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var oldItem = context.SystemParameters.FirstOrDefault(s => s.Status == StatusEnum.Used && s.Id == model.Id && s.UnitCode == model.UnitCode);
                    if (oldItem != null)
                    {
                        var oldModel = oldItem.Clone();

                        oldItem.Value = model.Value;
                        oldItem.Value3 = model.Value3;
                        oldItem.Value2 = model.Value2;
                        oldItem.Value4 = model.Value4;
                        oldItem.Value6 = model.Value6;
                        oldItem.Value7 = model.Value7;
                        oldItem.Value5 = model.Value5;
                        oldItem.Description = model.Description;
                        oldItem.UnitCode = model.UnitCode;
                        context.Entry(oldItem).State = EntityState.Modified;
                        context.SaveChanges();

                        var newModel = oldItem.Clone();
                        //HistoryDal.Write(User.Identity.GetUserId(), "SystemParameters", HistoryActionEnum.Edit, oldItem.Id, oldModel, newModel, GetClientIp(), context: context);
                    }
                    else
                    {
                        if (model.UnitCode != "LDG")
                        {
                            model.Id = model.Id + "_" + model.UnitCode;
                        }

                        var item = new SystemParameter()
                        {
                            CreateDate = DateTime.Now,
                            CreateUserId = User.Identity.GetUserId(),
                            Description = model.Description,
                            Status = StatusEnum.Used,
                            Tag = "",
                            LanguageId = "",
                            UpdateDate = DateTime.Now,
                            UpdateUserId = User.Identity.GetUserId(),
                            UnitCode = model.UnitCode,
                            Id = model.Id,
                            Code = model.Code,
                            Value = model.Value,
                            Value3 = model.Value3,
                            Value2 = model.Value2,
                            Value4 = model.Value4,
                            Value6 = model.Value6,
                            Value7 = model.Value7,
                            Value5 = model.Value5,
                        };
                        context.SystemParameters.Add(item);
                        context.SaveChanges();

                        var newModel = item.Clone();
                        //HistoryDal.Write(User.Identity.GetUserId(), "SystemParameters", HistoryActionEnum.Add, item.Id, null, newModel, GetClientIp(), context: context);
                    }
                    return Json(new ResultModel()
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
        [HttpPost]
        public IHttpActionResult DeleteSystemParams(SystemParamsModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    if (!string.IsNullOrEmpty(model.Id))
                    {
                        var oldItem = context.SystemParameters.FirstOrDefault(s => s.Status == StatusEnum.Used && s.Id == model.Id);
                        if (oldItem == null)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = "Tham số hệ thống đã bị xoá hoặc không tồn tại!"
                            });
                        }
                        oldItem.Status = StatusEnum.Deleted;
                        context.Entry(oldItem).State = EntityState.Modified;
                        context.SaveChanges();

                        var newModel = oldItem.Clone();
                        HistoryDal.Write(User.Identity.GetUserId(), "SystemParameters", HistoryActionEnum.Delete, oldItem.Id, null, newModel, GetClientIp());

                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                        });
                    }
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.DataNotEnough,
                        Message = "Tham số không tồn tại"
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
        [HttpPost]
        public IHttpActionResult CodesSystemParams(SystemParamsModel model)
        {
            try
            {
                //todo: viết store lấy code
                using (var context = new WebDbContext())
                {
                    var systemParameter = context.SystemParameters.Where(s => s.Status == StatusEnum.Used && s.Code != null).Select(
                        s => new
                        {
                            Code = s.Code
                        }
                        ).Distinct().OrderBy(s => s.Code).ToList();

                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Message = ResultCode.Success.ToString(),
                        Result = systemParameter,
                    });
                }
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnknowError,
                });
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
    }

}
