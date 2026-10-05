using System;
using System.Data.Entity;
using System.Linq;
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
    public class RoleController : ApiController
    {
        [HttpPost]
        public IHttpActionResult Roles(GeneralModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                    var items = context.Roles.Where(s => s.Status != StatusEnum.Deleted && s.RoleLevel > minRoleLevel);
                    items = items.OrderByDescending(s => s.UpdateDate);
                    var temp = items.ToList();
                    var result = temp.Paging(model).Select(s => new GeneralModel()
                    {
                        Id = Guid.Parse(s.Id),
                        Name = s.Name,
                        Description = s.Description
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
        public IHttpActionResult AdminRoles(AdminRoleModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                    var users = context.Roles.Where(s => s.Status != StatusEnum.Deleted && s.RoleLevel > minRoleLevel);


                    if (model.Filters != null)
                    {
                        foreach (var fieldFilterModel in model.Filters.Where(s => !string.IsNullOrEmpty(s.Value)).ToList())
                        {
                            var value = fieldFilterModel.Value.ToLower();
                            switch (fieldFilterModel.Name)
                            {
                                case "Name":
                                    switch (fieldFilterModel.MatchMode)
                                    {
                                        case "startsWith":
                                            users = users.Where(s => s.Name.ToLower().StartsWith(value));
                                            break;
                                        case "contains":
                                            users = users.Where(s => s.Name.ToLower().Contains(value));
                                            break;
                                        case "endsWith":
                                            users = users.Where(s => s.Name.ToLower().EndsWith(value));
                                            break;
                                        case "equals":
                                            users = users.Where(s => s.Name.ToLower() == value);
                                            break;
                                        case "notEquals":
                                            users = users.Where(s => s.Name.ToLower() != value);
                                            break;
                                        case "notContains":
                                            users = users.Where(s => !s.Name.ToLower().Contains(value));
                                            break;
                                    }
                                    break;
                                case "Description":
                                    switch (fieldFilterModel.MatchMode)
                                    {
                                        case "startsWith":
                                            users = users.Where(s => s.Description.ToLower().StartsWith(value));
                                            break;
                                        case "contains":
                                            users = users.Where(s => s.Description.ToLower().Contains(value));
                                            break;
                                        case "endsWith":
                                            users = users.Where(s => s.Description.ToLower().EndsWith(value));
                                            break;
                                        case "equals":
                                            users = users.Where(s => s.Description.ToLower() == value);
                                            break;
                                        case "notEquals":
                                            users = users.Where(s => s.Description.ToLower() != value);
                                            break;
                                        case "notContains":
                                            users = users.Where(s => !s.Description.ToLower().Contains(value));
                                            break;
                                    }
                                    break;
                                case "RoleLevel":
                                    var roleLevel = value.ToInt();
                                    switch (fieldFilterModel.MatchMode)
                                    {
                                        case "startsWith":
                                        case "contains":
                                        case "endsWith":
                                        case "equals":
                                            users = users.Where(s => s.RoleLevel == roleLevel);
                                            break;
                                        case "notEquals":
                                        case "notContains":
                                            users = users.Where(s => s.RoleLevel != roleLevel);
                                            break;
                                    }
                                    break;
                                case "ParentId":
                                    switch (fieldFilterModel.MatchMode)
                                    {
                                        case "startsWith":
                                            users = users.Where(s => s.Parent.Name.ToLower().StartsWith(value));
                                            break;
                                        case "contains":
                                            users = users.Where(s => s.Parent.Name.ToLower().Contains(value));
                                            break;
                                        case "endsWith":
                                            users = users.Where(s => s.Parent.Name.ToLower().EndsWith(value));
                                            break;
                                        case "equals":
                                            users = users.Where(s => s.Parent.Name.ToLower() == value);
                                            break;
                                        case "notEquals":
                                            users = users.Where(s => s.Parent.Name.ToLower() != value);
                                            break;
                                        case "notContains":
                                            users = users.Where(s => !s.Parent.Name.ToLower().Contains(value));
                                            break;
                                    }
                                    break;
                            }
                        }
                    }

                    if (!string.IsNullOrEmpty(model.SortField))
                    {
                        switch (model.SortField)
                        {
                            case "Name":
                                users = model.SortOrder
                                    ? users.OrderByDescending(s => s.Name)
                                    : users.OrderBy(s => s.Name);
                                break;
                            case "Description":
                                users = model.SortOrder
                                    ? users.OrderByDescending(s => s.Description)
                                    : users.OrderBy(s => s.Description);
                                break;
                            case "RoleLevel":
                                users = model.SortOrder
                                    ? users.OrderByDescending(s => s.RoleLevel)
                                    : users.OrderBy(s => s.RoleLevel);
                                break;
                            case "ParentId":
                                users = model.SortOrder
                                    ? users.OrderByDescending(s => s.Parent.Name)
                                    : users.OrderBy(s => s.Parent.Name);
                                break;
                        }
                    }
                    var temp = users.ToList();
                    var result = temp.Paging(model).Select(s => new AdminRoleModel(s)).ToList();

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
        public IHttpActionResult ParentRoles(AdminRoleModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                    var items = context.Roles.Where(s => s.Status != StatusEnum.Deleted && s.RoleLevel > minRoleLevel);
                    var temp = items.ToList().Select(s => new AdminRoleModel(s)).ToList();
                    var result = RoleDal<AdminRoleModel>.GroupByParent(temp);
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
        public IHttpActionResult Save(AdminRoleModel model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.ParentId))
                {
                    model.ParentId = null;
                }
                var minRoleLevel = User.Identity.GetValue<int>(UserCode.RoleLevel);
                if (minRoleLevel > model.RoleLevel)
                {
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.UnSuccess,
                        Message = "Role Level không được nhỏ hơn hoặc bằng" + minRoleLevel
                    });
                }
                using (var context = new WebDbContext())
                {
                    if (!string.IsNullOrEmpty(model.Id))
                    {
                        var oldItem = context.Roles.FirstOrDefault(s => s.Status == StatusEnum.Used && s.Id == model.Id);
                        if (oldItem == null)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = "Quyền đã bị xoá hoặc không tồn tại!"
                            });
                        }
                        oldItem.Name = model.Name;
                        oldItem.ParentId = model.ParentId;
                        oldItem.RoleLevel = model.RoleLevel;
                        oldItem.Description = model.Description;
                        context.Entry(oldItem).State = EntityState.Modified;
                        context.SaveChanges();
                    }
                    else
                    {
                        var item = new Role()
                        {
                            CreateDate = DateTime.Now,
                            CreateUserId = User.Identity.GetUserId(),
                            Description = model.Description,
                            Id = Guid.NewGuid().ToString(),
                            Name = model.Name,
                            ParentId = model.ParentId,
                            RoleLevel = model.RoleLevel,
                            Status = StatusEnum.Used,
                            Tag = "",
                            UnitCode = "",
                        };
                        context.Roles.Add(item);
                        context.SaveChanges();
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
        public IHttpActionResult Delete(AdminRoleModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    if (!string.IsNullOrEmpty(model.Id))
                    {
                        var oldItem = context.Roles.FirstOrDefault(s => s.Status == StatusEnum.Used && s.Id == model.Id);
                        if (oldItem == null)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = "Quyền đã bị xoá hoặc không tồn tại!"
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
                        Message = "Quyền không tồn tại"
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