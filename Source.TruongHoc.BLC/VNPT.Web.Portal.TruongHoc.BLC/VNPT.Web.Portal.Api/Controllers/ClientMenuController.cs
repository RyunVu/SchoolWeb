using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    [VnptAuthorization]
    public class ClientMenuController : ApiController
    {
        [HttpPost]
        public IHttpActionResult ParentMenus(MenuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                    var menuCode = "PORTAL".ToLower();
                    var unitCode = User.Identity.GetValue(UserCode.UnitCode, "").ToLower();
                    var items = context.SystemMenus.Where(s => s.Status != StatusEnum.Deleted && s.RoleLevel >= minRoleLevel && s.MenuCode.ToLower() == menuCode && s.UnitCode.ToLower() == unitCode);

                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        items = items.Where(s =>
                            s.Title.ToLower().Contains(model.Keyword.ToLower()) ||
                            s.Action.ToLower().Contains(model.Keyword.ToLower()));
                    }

                    if (model.MenuPosition != 0)
                    {
                        items = items.Where(s => s.MenuPosition == model.MenuPosition);
                    }
                    var temp = items.ToList().Select(s => new MenuModel(s, context)).ToList();
                    var result = RoleDal<MenuModel>.GroupByParent(temp).OrderBy(s => s.MenuPosition).ThenBy(s => s.OrderNo).ToList();
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
        public IHttpActionResult Menus(MenuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                    var menuCode = "PORTAL".ToLower();
                    var unitCode = User.Identity.GetValue(UserCode.UnitCode, "").ToLower();

                    var items = context.SystemMenus.Where(s => s.Status != StatusEnum.Deleted
                                                               && s.RoleLevel >= minRoleLevel
                                                               && s.MenuCode.ToLower() == menuCode
                                                               && s.UnitCode.ToLower() == unitCode
                                                               && s.MenuPosition == model.MenuPosition);
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
        public IHttpActionResult News(MenuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                    var userId = User.Identity.GetUserId();

                    model.MenuCode = "Web";


                    var userRoles = context.UserRoles.Where(s => s.UserId == userId && s.Role.Status == StatusEnum.Used)
                        .SelectMany(s => s.Role.RolePermissions)
                        .Where(s => s.RolePermissionProperties.Count > 0)
                        .Select(s => s.SystemMenu).ToList();

                    userRoles = userRoles.Where(x => x != null).ToList();

                    userRoles = userRoles.Where(s => s.Status == StatusEnum.Used && !string.IsNullOrEmpty(s.Action) && (s.Action.StartsWith("quan-ly-tin-tuc/") || s.Action.StartsWith("phong-truyen-thong/tin-tuc/"))).ToList();

                    var temp = new List<MenuModel>();
                    foreach (var systemMenu in userRoles)
                    {
                        if (temp.All(s => systemMenu.Id.ToString() != s.Id))
                        {
                            var item = new MenuModel(systemMenu);
                            item.Title_En = item.Title + $" ({item.Parameter})";
                            //if (item.Parameter.Contains("."))
                            //{
                            //    var data = item.Parameter.Split('.');
                            //    item.Parameter = data[0];
                            //    item.TypeId = data[1];
                            //}
                            temp.Add(item);
                        }
                    }

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = temp,
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
        public IHttpActionResult GetNews(MenuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var unitCode = User.Identity.GetValue(UserCode.UnitCode, "").ToLower();
                    var news = context.News.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Parameter && s.UnitCode.ToLower() == unitCode).ToList();
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = news.Select(s => new
                        {
                            s.Id,
                            s.Title,
                            s.Alias
                        })
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
        public IHttpActionResult ListLoaiTinTuc(GeneralCategoryModel model)
        {
            try
            {
                model.Value = model.Value?.Trim() ?? "";

                if (string.IsNullOrEmpty(model.Value))
                {
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,

                    });
                }
                var codes = model.Value.Split('.');
                var code = codes[0];
                string type = null;
                if (codes.Length > 1)
                {
                    type = codes[1];
                }
                model.Code = "NewsType";
                model.Value = code;
                using (var context = new WebDbContext())
                {
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    if (currentUnitCode == "LDG")
                    {

                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                            Message = type
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
                            TotalRow = temp.Count,
                            Message = type
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
        public IHttpActionResult Save(MenuModel model)
        {
            try
            {
                Guid? parentId = null;
                var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                model.RoleLevel = minRoleLevel + 01;

                if (!string.IsNullOrEmpty(model.ParentId))
                {
                    parentId = Guid.Parse(model.ParentId);
                }
                var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                model.MenuCode = "PORTAL";
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
                        oldItem.ParentId = parentId;
                        oldItem.RoleLevel = model.RoleLevel;
                        oldItem.Action = model.Action;
                        oldItem.Title = model.Title;
                        oldItem.Title_En = model.Title_En;
                        oldItem.MenuCode = model.Code;
                        oldItem.SortNo = model.OrderNo;
                        oldItem.UpdateDate = DateTime.Now;
                        oldItem.UpdateUserId = User.Identity.GetUserId();
                        oldItem.MenuPosition = model.MenuPosition;
                        oldItem.Parameter = model.Parameter;
                        oldItem.IsShowMenu = model.IsShowMenu;
                        oldItem.IsNewsImage = model.IsNewsImage;
                        oldItem.IsOpenBlankPage = model.IsOpenBlankPage;
                        oldItem.MenuType = model.MenuType;
                        oldItem.Description = model.Description;
                        context.Entry(oldItem).State = EntityState.Modified;
                        context.SaveChanges();
                    }
                    else
                    {
                        var item = new SystemMenu
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
                            MenuCode = model.MenuCode,
                            SortNo = model.OrderNo,
                            UpdateDate = DateTime.Now,
                            UpdateUserId = User.Identity.GetUserId(),
                            Parameter = model.Parameter,
                            IsShowMenu = model.IsShowMenu,
                            IsUseParameterUrl = model.IsUseParameterUrl,
                            OtherRole = model.OtherRole,
                            UnitCode = currentUnitCode,
                            IsNewsImage = model.IsNewsImage,
                            IsOpenImageOnly = model.IsOpenImageOnly,
                            ConfigMenu = model.ConfigMenu,
                            MenuPosition = model.MenuPosition,
                            IsOpenBlankPage = model.IsOpenBlankPage,
                            MenuType = model.MenuType,

                        };
                        context.SystemMenus.Add(item);
                        context.SaveChanges();
                    }

                    //if (model.MenuCode == "Web" && model.Action.StartsWith("quan-ly-tin-tuc"))
                    //{
                    //    var news = context.News.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Parameter).ToList();
                    //    foreach (var n in news)
                    //    {
                    //        n.IsOpenBlankPage = model.IsOpenBlankPage;
                    //        n.IsNewsImage = model.IsNewsImage;
                    //        n.IsOpenImageOnly = model.IsOpenImageOnly;
                    //        context.Entry(n).State = EntityState.Modified;
                    //        context.SaveChanges();
                    //    }

                    //    var code = model.Parameter.Split('.')[0];
                    //    var types = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted &&
                    //        s.Code == "NewsType" && s.Value == code).ToList();
                    //    if (types.Count == 0)
                    //    {
                    //        var type = new GeneralCategory
                    //        {
                    //            Tag = null,
                    //            Status = StatusEnum.Used,
                    //            Description = null,
                    //            CreateDate = DateTime.Now,
                    //            CreateUserId = null,
                    //            UpdateDate = null,
                    //            UpdateUserId = null,
                    //            LanguageId = null,
                    //            UnitCode = model.UnitCode,
                    //            Id = Guid.NewGuid(),
                    //            ParentId = null,
                    //            Code = "NewsType",
                    //            Name = model.Title,
                    //            Name_En = null,
                    //            Value = model.Parameter,
                    //            Value2 = null,
                    //            ImageUrl = null,
                    //            OrderNo = null,
                    //            Parent = null,
                    //            GeneralCategories = null
                    //        };
                    //        context.GeneralCategories.Add(type);
                    //        context.SaveChanges();
                    //    }
                    //}
                    //else if (model.MenuCode == "PORTAL" && model.Action == "danh-sach-tin-tuc") // Tự động thêm menu con trong danh sách tin tức
                    //{
                    //    var actionTemp = "quan-ly-tin-tuc/" + model.Parameter;

                    //    SystemMenu systemMenuWeb = context.SystemMenus.FirstOrDefault(s => s.Status == StatusEnum.Used && s.MenuCode == "Web" && s.Action == actionTemp && s.Parameter == model.Parameter);

                    //    SystemMenu systemMenuWebParent = context.SystemMenus.FirstOrDefault(s => s.Status == StatusEnum.Used && s.MenuCode == "Web" && s.Title == "Quản lý tin tức" && s.ParentId == null);

                    //    if (systemMenuWeb == null)
                    //    {
                    //        var itemChild = new SystemMenu()
                    //        {
                    //            CreateDate = DateTime.Now,
                    //            CreateUserId = User.Identity.GetUserId(),
                    //            Id = Guid.NewGuid(),
                    //            RoleLevel = 4,
                    //            Status = StatusEnum.Used,
                    //            Tag = "",
                    //            Action = actionTemp,
                    //            Children = null,
                    //            Parent = null,
                    //            Title = model.Title,
                    //            Title_En = model.Title_En,
                    //            Icon = model.Icon,
                    //            LanguageId = "",
                    //            MenuCode = "Web",
                    //            SortNo = model.OrderNo,
                    //            UpdateDate = DateTime.Now,
                    //            UpdateUserId = User.Identity.GetUserId(),
                    //            Parameter = model.Parameter,
                    //            IsShowMenu = model.IsShowMenu,
                    //            IsUseParameterUrl = model.IsUseParameterUrl,
                    //            OtherRole = model.OtherRole,
                    //            IsNewsImage = model.IsNewsImage,
                    //            IsOpenImageOnly = model.IsOpenImageOnly,
                    //            ConfigMenu = model.ConfigMenu,
                    //            MenuPosition = model.MenuPosition,
                    //            UnitCode = "LDG",
                    //            IsOpenBlankPage = model.IsOpenBlankPage
                    //        };

                    //        if (systemMenuWebParent != null)
                    //        {
                    //            itemChild.ParentId = systemMenuWebParent.Id;
                    //        }

                    //        context.SystemMenus.Add(itemChild);
                    //        context.SaveChanges();
                    //    }
                    //}

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
        public IHttpActionResult SaveDanhMuc(MenuModel model)
        {
            try
            {
                Guid? parentId = null;
                var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                model.RoleLevel = minRoleLevel + 01;
                if (!string.IsNullOrEmpty(model.ParentId))
                {
                    parentId = Guid.Parse(model.ParentId);
                }
                var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                var roleName = $"AdminSite_{currentUnitCode.ToUpper()}";
                model.MenuCode = "Web";
                using (var context = new WebDbContext())
                {
                    using (var trans = context.Database.BeginTransaction())
                    {
                        var menu = context.SystemMenus.FirstOrDefault(s =>
                            s.Status == StatusEnum.Used && s.UnitCode == currentUnitCode && s.MenuCode == model.MenuCode &&
                            s.Parameter == model.Parameter);
                        var isEdit = false;
                        if (menu != null)
                        {
                            // kiểm tra 
                            isEdit = true;
                        }
                        else
                        {
                            if (model.OrderNo == 0)
                            {
                                model.OrderNo = context.SystemMenus.Count(s =>
                                    s.Status == StatusEnum.Used && s.UnitCode == currentUnitCode && s.MenuCode == model.MenuCode) + 1;
                            }
                            menu = new SystemMenu
                            {
                                CreateDate = DateTime.Now,
                                CreateUserId = User.Identity.GetUserId(),
                                Description = model.Description,
                                Id = Guid.NewGuid(),
                                ParentId = parentId,
                                RoleLevel = model.RoleLevel,
                                Status = StatusEnum.Used,
                                Tag = "",
                                Action = $"quan-ly-tin-tuc/{model.Parameter}",
                                Children = null,
                                Parent = null,
                                Title = model.Title,
                                Title_En = model.Title_En,
                                Icon = "fa fa-newspaper",
                                LanguageId = "",
                                MenuCode = model.MenuCode,
                                SortNo = model.OrderNo,
                                UpdateDate = DateTime.Now,
                                UpdateUserId = User.Identity.GetUserId(),
                                Parameter = model.Parameter,
                                IsShowMenu = true,
                                IsUseParameterUrl = false,
                                UnitCode = currentUnitCode,
                                IsNewsImage = model.IsNewsImage,
                                IsOpenImageOnly = model.IsOpenImageOnly,
                                ConfigMenu = model.ConfigMenu,
                                MenuPosition = model.MenuPosition,
                                IsOpenBlankPage = model.IsOpenBlankPage,
                                MenuType = model.MenuType,

                            };
                            context.SystemMenus.Add(menu);
                            context.SaveChanges();
                        }


                        var role = context.Roles.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Name == roleName);
                        if (role == null)
                        {
                            role = new Role()
                            {
                                Status = StatusEnum.Used,
                                Id = Guid.NewGuid().ToString(),
                                Name = roleName,
                                Description = $"Quản trị trang thông tin {roleName}",
                                UnitCode = currentUnitCode,
                                CreateDate = DateTime.Now,
                                HomeMenuId = menu.Id,
                                RoleLevel = minRoleLevel,
                                CreateUserId = User.Identity.GetUserId(),
                            };
                            context.Roles.Add(role);
                            context.SaveChanges();
                            context.UserRoles.Add(new UserRole()
                            {
                                RoleId = role.Id,
                                UserId = User.Identity.GetUserId()
                            });
                            context.SaveChanges();
                        }
                        var rolePermission = context.RolePermissions.FirstOrDefault(s => s.RoleId == role.Id && s.SysMenuId == menu.Id);
                        if (rolePermission == null)
                        {
                            rolePermission = new RolePermission
                            {
                                Tag = null,
                                Status = StatusEnum.Used,
                                Description = null,
                                CreateDate = DateTime.Now,
                                CreateUserId = User.Identity.GetUserId(),
                                UpdateDate = null,
                                UpdateUserId = null,
                                LanguageId = null,
                                Id = Guid.NewGuid(),
                                RoleId = role.Id,
                                SysMenuId = menu.Id,
                                UnitCode = currentUnitCode,
                                IsAllow = true,
                                Role = null,
                                SystemMenu = null,
                                RolePermissionProperties = null
                            };
                            context.RolePermissions.Add(rolePermission);
                            context.SaveChanges();
                            context.RolePermissionProperties.Add(new RolePermissionProperty()
                            {
                                Id = rolePermission.Id,
                                Value = true,
                                Command = "delete"
                            });

                            context.RolePermissionProperties.Add(new RolePermissionProperty()
                            {
                                Id = rolePermission.Id,
                                Value = true,
                                Command = "add"
                            });
                            context.RolePermissionProperties.Add(new RolePermissionProperty()
                            {
                                Id = rolePermission.Id,
                                Value = true,
                                Command = "allow"
                            });
                            context.RolePermissionProperties.Add(new RolePermissionProperty()
                            {
                                Id = rolePermission.Id,
                                Value = true,
                                Command = "edit"
                            });
                            context.SaveChanges();
                        }
                        else
                        {
                            var tolePermissionProperty = context.RolePermissionProperties.FirstOrDefault(s => s.Id == rolePermission.Id && s.Command == "delete");

                            if (tolePermissionProperty == null)
                            {
                                context.RolePermissionProperties.Add(new RolePermissionProperty()
                                {
                                    Id = rolePermission.Id,
                                    Value = true,
                                    Command = "delete"
                                });
                            }

                            tolePermissionProperty = context.RolePermissionProperties.FirstOrDefault(s => s.Id == rolePermission.Id && s.Command == "add");

                            if (tolePermissionProperty == null)
                            {
                                context.RolePermissionProperties.Add(new RolePermissionProperty()
                                {
                                    Id = rolePermission.Id,
                                    Value = true,
                                    Command = "add"
                                });
                            }

                            tolePermissionProperty = context.RolePermissionProperties.FirstOrDefault(s => s.Id == rolePermission.Id && s.Command == "allow");

                            if (tolePermissionProperty == null)
                            {
                                context.RolePermissionProperties.Add(new RolePermissionProperty()
                                {
                                    Id = rolePermission.Id,
                                    Value = true,
                                    Command = "allow"
                                });
                            }

                            tolePermissionProperty = context.RolePermissionProperties.FirstOrDefault(s => s.Id == rolePermission.Id && s.Command == "edit");

                            if (tolePermissionProperty == null)
                            {
                                context.RolePermissionProperties.Add(new RolePermissionProperty()
                                {
                                    Id = rolePermission.Id,
                                    Value = true,
                                    Command = "edit"
                                });
                            }

                            context.SaveChanges();
                        }

                        trans.Commit();

                        if (isEdit)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.Success,
                                Message = $"Danh mục {model.Parameter} đã được tạo!"
                            });
                        }
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                            Message = $"Thêm thành công!"
                        });
                    }
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
        public IHttpActionResult SaveNewsType(MenuModel model)
        {
            try
            {
                var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                using (var context = new WebDbContext())
                {
                    using (var trans = context.Database.BeginTransaction())
                    {
                        var type = context.GeneralCategories.FirstOrDefault(s =>
                            s.Status == StatusEnum.Used && s.UnitCode == currentUnitCode && s.Code == "NewsType" &&
                            s.Value.ToLower() == model.Action.ToLower() && s.Name.ToLower() == model.Title.ToLower().Trim());
                        if (type != null)
                        {
                            // kiểm tra 
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.Success,
                                Message = $"Danh mục {model.Parameter} đã được tạo!"
                            });
                        }
                        else
                        {
                            if (model.OrderNo == 0)
                            {
                                model.OrderNo = context.GeneralCategories.Count(s =>
                                    s.Status == StatusEnum.Used && s.UnitCode == currentUnitCode && s.Code == "NewsType" &&
                                    s.Value.ToLower() == model.Action.ToLower()) + 1;
                            }
                            type = new GeneralCategory
                            {
                                CreateDate = DateTime.Now,
                                CreateUserId = User.Identity.GetUserId(),
                                Description = model.Description,
                                Id = Guid.NewGuid(),
                                ParentId = null,
                                Code = "NewsType",
                                Status = StatusEnum.Used,
                                Name = model.Title.Trim(),
                                Value = model.Action,
                                Value2 = model.Parameter,
                                ImageUrl = null,
                                OrderNo = model.OrderNo,
                                UpdateDate = DateTime.Now,
                                UpdateUserId = User.Identity.GetUserId(),
                                LanguageId = null,
                                UnitCode = currentUnitCode,
                            };
                            context.GeneralCategories.Add(type);
                            context.SaveChanges();
                            trans.Commit();
                        }


                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                            Message = $"Thêm thành công!"
                        });
                    }
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
