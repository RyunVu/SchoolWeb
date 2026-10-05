using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Base.Dal;

namespace VNPT.Web.Portal.Api.Controllers
{
    public class UserController : BaseApiController
    {
        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult Users(UserSearchModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var unitCode = User.Identity.GetValue<string>(UserCode.UnitCode);
                    var cmd = context.Database.Connection.CreateCommand();
                    cmd.CommandText = "[dbo].[User_list]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_unit_code", unitCode));
                    cmd.Parameters.Add(new SqlParameter("@p_unit_id", model.UnitId));
                    cmd.Parameters.Add(new SqlParameter("@p_keyword", model.Keyword));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", model.PageIndex ?? 1));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", model.PageSize ?? 10));

                    var connection = context.Database.Connection;
                    if (connection.State != ConnectionState.Open)
                        connection.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        var resultTemp = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<UserStoreModel>(reader)
                            .ToList(); reader.NextResult();

                        var total = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<int>(reader)
                            .ToList();
                        connection.Close();

                        return Json(new ResultModel
                        {
                            Code = ResultCode.Success,
                            Message = ResultCode.Success.ToString(),
                            Result = resultTemp,
                            TotalRow = total.DefaultIfEmpty(0).FirstOrDefault()
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

    
        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult DetailsUserHistoryForAdmin(UserLoginHistoryModel model)
        {
            try
            {
                //todo: viết store lấy code
                using (var context = new WebDbContext())
                {
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.UnknowError,
                    });
                    //var p_unit_id = new OracleParameter("p_unit_id", OracleDbType.NVarchar2, model.UserId, ParameterDirection.Input);
                    //var p_page_index = new OracleParameter("p_page_index", OracleDbType.Decimal, model.PageIndex ?? 1, ParameterDirection.Input);
                    //var p_page_size = new OracleParameter("p_page_size", OracleDbType.Decimal, model.PageSize ?? 10, ParameterDirection.Input);
                    //var v_cur = new OracleParameter("v_cur", OracleDbType.RefCursor, ParameterDirection.Output);
                    //var v_cur_total = new OracleParameter("v_cur_total", OracleDbType.RefCursor, ParameterDirection.Output);
                    //var v_cur_logout_total = new OracleParameter("v_cur_logout_total", OracleDbType.RefCursor, ParameterDirection.Output);

                    //var proc =
                    //    $"BEGIN LIST_USER_LOGIN_HISTORY_pkg.list(:p_unit_id,:p_page_index,:p_page_size,:v_cur,:v_cur_totalm,:v_cur_logout_total); END;";

                    //var connection = context.Database.Connection;
                    //connection.Open();
                    //var command = connection.CreateCommand();
                    //command.CommandText = proc;
                    //var listParam = new List<OracleParameter>
                    //{
                    //    p_unit_id,p_page_index,p_page_size,v_cur,v_cur_total,v_cur_logout_total
                    //};
                    //command.Parameters.AddRange(listParam.ToArray());
                    //using (var reader = command.ExecuteReader())
                    //{
                    //    var resultTemp = ((IObjectContextAdapter)context).ObjectContext
                    //        .Translate<UserLoginHistoryModel>(reader)
                    //        .ToList(); reader.NextResult();

                    //    var total = ((IObjectContextAdapter)context).ObjectContext
                    //        .Translate<int>(reader)
                    //        .ToList(); reader.NextResult();
                    //    var totalLogout = ((IObjectContextAdapter)context).ObjectContext
                    //      .Translate<int>(reader)
                    //      .ToList();
                    //    connection.Close();

                    //    return Json(new ResultModel
                    //    {
                    //        Code = ResultCode.Success,
                    //        Message = totalLogout.DefaultIfEmpty(0).FirstOrDefault().ToString(),
                    //        Result = resultTemp,
                    //        TotalRow = total.DefaultIfEmpty(0).FirstOrDefault()
                    //    });
                    //}

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

      
        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult DeleteUserLoginHistoryForAdmin(UserLoginHistoryModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var user = context.UserLoginHistories.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
                    if (user == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "Lịch sử đăng nhập không tồn tại",
                            Result = null
                        });
                    }
                    user.Status = StatusEnum.Deleted;
                    user.UpdateDate = DateTime.Now;
                    user.UpdateUserId = User.Identity.GetUserId();
                    context.Entry(user).State = EntityState.Modified;
                    context.SaveChanges();
                    //var newModel = GetUserModel(user.Id, context);
                    //HistoryDal.Write(User.Identity.GetUserId(), "Users", HistoryActionEnum.Delete, user.Id, null, newModel, GetClientIp());
                    return Json(new ResultModel
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

       
        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult DeleteAllUserLoginHistoryForAdmin(UserLoginHistoryModel model)
        {
            try
            {
                //todo: viết store lấy code
                using (var context = new WebDbContext())
                {
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.UnknowError,
                    });
                    //var p_user_id = new OracleParameter("p_user_id", OracleDbType.Varchar2, model.UserId, ParameterDirection.Input);
                    //var proc =
                    //    $"BEGIN USER_LOGIN_HISTORY_PKG.deleteAll(:p_user_id); END;";

                    //var connection = context.Database.Connection;
                    //connection.Open();
                    //var command = connection.CreateCommand();
                    //command.CommandText = proc;
                    //var listParam = new List<OracleParameter>
                    //{
                    //    p_user_id
                    //};
                    //command.Parameters.AddRange(listParam.ToArray());
                    //using (var reader = command.ExecuteReader())
                    //{
                    //    connection.Close();
                    //    return Json(new ResultModel
                    //    {
                    //        Code = ResultCode.Success,
                    //        Message = ResultCode.Success.ToString(),
                    //    });
                    //}
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
        private UserModel GetUserModel(string userId, WebDbContext context)
        {
            return UserDal.GetUserById(userId, context);
        }

        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult Single(UserSearchModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var user = GetUserModel(model.Id, context);
                    if (user == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.DataNotEnough,
                            Message = "User không tồn tại"
                        });
                    }
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Message = ResultCode.Success.ToString(),
                        Result = user,
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

        private void UpdateRole(User user, UserModel model, WebDbContext context)
        {
            var roles = context.UserRoles.Where(s => s.UserId == model.Id).ToList();
            foreach (var userRole in roles)
            {
                context.Entry(userRole).State = EntityState.Deleted;
            }

            context.SaveChanges();
            foreach (var roleId in model.RoleIds)
            {
                context.UserRoles.Add(new UserRole()
                {
                    RoleId = roleId,
                    UserId = user.Id
                });
            }
            context.SaveChanges();


            var locations = context.UserLocationMaps.Where(s => s.UserId == model.Id).ToList();
            foreach (var userRole in locations)
            {
                context.Entry(userRole).State = EntityState.Deleted;
            }

            context.SaveChanges();
            foreach (var local in model.UserLocations)
            {
                context.UserLocationMaps.Add(new UserLocationMap()
                {
                    UserId = user.Id,
                    CreateDate = DateTime.Now,
                    CreateUserId = User.Identity.GetUserId(),
                    Description = "",
                    Id = Guid.NewGuid(),
                    Status = StatusEnum.Used,
                    LocationDistrictId = local.DistrictId,
                    UnitCode = user.UnitCode,
                    LanguageId = "",
                    LocationProvinceId = local.ProvinceId,
                    LocationWardId = local.WardId,
                    Tag = ""
                });
            }
            context.SaveChanges();
        }


        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult Save(UserModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");

                    if (string.IsNullOrEmpty(model.FirstName))
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Tên không được để trống!"
                        });
                    }
                    if (string.IsNullOrEmpty(model.LastName))
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Họ không được để trống!"
                        });
                    }
                    if (string.IsNullOrEmpty(model.UserName) || model.UserName.Length < 3)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Tên đăng nhập phải có ít nhất 3 ký tự!"
                        });
                    }

                    if (!model.UnitId.HasValue)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Đơn vị không được để trống!"
                        });
                    }
                    if (!model.PositionId.HasValue)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Chức vụ không được để trống!"
                        });
                    }

                    var unitId = model.UnitId;
                    var unit = context.Units.FirstOrDefault(s => s.Id == unitId && s.Status != StatusEnum.Deleted);
                    if (unit == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Đơn vị không còn tồn tại!"
                        });
                    }
                    if (!User.IsInRole(RoleCode.SuperAdminSystem) && currentUnitCode.ToLower() != "LDG".ToLower() && unit.UnitCode.ToLower() != currentUnitCode)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Bạn không có quyền tạo user cho tài khoản này!"
                        });
                    }

                    if (!string.IsNullOrEmpty(model.Id))
                    {
                        var id = model.Id;
                        var item =
                            context.Users.FirstOrDefault(s => s.Id == id && s.Status != StatusEnum.Deleted);
                        if (item == null)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.DataNotEnough,
                                Message = "User không tồn tại hoặc bị xoá"
                            });
                        }

                        if (!string.IsNullOrEmpty(model.PhoneNumber))
                        {
                            var checkPhone = context.Users.FirstOrDefault(s =>
                                s.PhoneNumber == model.PhoneNumber && s.Status != StatusEnum.Deleted && s.Id != item.Id);
                            if (checkPhone != null)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.DataNotEnough,
                                    Message = "Số điện thoại đã được sử dụng"
                                });
                            }
                        }

                        var oldModel = item.Clone();//GetUserModel(item.Id, context);
                        item.FirstName = model.FirstName;
                        item.LastName = model.LastName;
                        item.Email = model.Email;
                        item.UpdateDate = DateTime.Now;
                        item.UpdateUserId = User.Identity.GetUserId();
                        item.PhoneNumber = model.PhoneNumber;
                        item.EnableOtp = true;
                        item.UnitCode = unit.Code;
                        item.OtherPositionName = model.OtherPositionName;
                        item.UnitId = model.UnitId;
                        item.PositionId = model.PositionId;

                        if (!string.IsNullOrEmpty(model.Password))
                        {
                            var password = UserManager.PasswordHasher.HashPassword(model.Password);
                            item.PasswordHash = password;
                        }

                        var stamp = UserManager.GetSecurityStamp(item.Id);
                        item.SecurityStamp = stamp;

                        context.Entry(item).State = EntityState.Modified;
                        context.SaveChanges();
                        UpdateRole(item, model, context);
                        var newModel = item.Clone();
                        HistoryDal.Write(User.Identity.GetUserId(), "Users", HistoryActionEnum.Edit, item.Id, oldModel, newModel, GetClientIp(), context: context);
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(model.PhoneNumber))
                        {
                            var checkPhone = context.Users.FirstOrDefault(s =>
                                s.PhoneNumber == model.PhoneNumber && s.Status != StatusEnum.Deleted);
                            if (checkPhone != null)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.DataNotEnough,
                                    Message = "Số điện thoại đã được sử dụng"
                                });
                            }
                        }


                        var item = new User
                        {
                            Code = "",
                            CreateDate = DateTime.Now,
                            CreateUserId = User.Identity.GetUserId(),
                            Description = "",
                            Id = Guid.NewGuid().ToString(),
                            LanguageId = "vi",
                            FirstName = model.FirstName,
                            LastName = model.LastName,
                            Tag = "",
                            Status = StatusEnum.Used,
                            Email = model.Email,
                            UserName = model.UserName,
                            UpdateDate = DateTime.Now,
                            UpdateUserId = User.Identity.GetUserId(),
                            Address = "",
                            PhoneNumber = model.PhoneNumber,
                            AccessFailedCount = 0,
                            AvatarUrl = "",
                            DayOfBirth = null,
                            EmailConfirmed = true,
                            GenderId = "",
                            LockoutEnabled = true,
                            LockoutEndDateUtc = null,
                            OtpCode = "",
                            OtpCreateTime = null,
                            OtpLastWrongTime = null,
                            OtpWrongTime = 0,
                            PhoneNumberConfirmed = true,
                            SecurityStamp = "",
                            TwoFactorEnabled = true,
                            EnableOtp = true,
                            UnitCode = unit.UnitCode,
                            OtherPositionName = model.OtherPositionName,
                        };
                        if (!string.IsNullOrEmpty(model.Password))
                        {
                            var password = UserManager.PasswordHasher.HashPassword(model.Password);
                            item.PasswordHash = password;
                        }

                        item.UnitId = model.UnitId;

                        item.PositionId = model.PositionId;

                        //var stamp = UserManager.GetSecurityStamp(item.Id);
                        //item.SecurityStamp = stamp;
                        context.Users.Add(item);
                        context.SaveChanges();
                        UpdateRole(item, model, context);
                        var newModel = item.Clone();
                        HistoryDal.Write(User.Identity.GetUserId(), "Users", HistoryActionEnum.Add, item.Id, null, newModel, GetClientIp(), context: context);
                    }
                }
                return Json(new ResultModel()
                {
                    Code = ResultCode.Success
                });
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


        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult ChangeOtpStatus(UserModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var user = context.Users.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
                    if (user == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "User không tồn tại",
                            Result = null
                        });
                    }
                    user.EnableOtp = !user.EnableOtp;
                    user.UpdateDate = DateTime.Now;
                    user.UpdateUserId = User.Identity.GetUserId();
                    context.Entry(user).State = EntityState.Modified;
                    context.SaveChanges();
                    var newModel = GetUserModel(user.Id, context);
                    HistoryDal.Write(User.Identity.GetUserId(), "Users", HistoryActionEnum.Edit, user.Id, null, newModel, GetClientIp(), note: new OtherFromHistory() { Description = $"Thay đổi trạng thái nhận Otp: {user.EnableOtp ?? false}" });
                    return Json(new ResultModel
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

        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult DeleteUser(UserModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var user = context.Users.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
                    if (user == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "User không tồn tại",
                            Result = null
                        });
                    }
                    user.Status = StatusEnum.Deleted;
                    user.UpdateDate = DateTime.Now;
                    user.UpdateUserId = User.Identity.GetUserId();
                    context.Entry(user).State = EntityState.Modified;
                    context.SaveChanges();
                    var newModel = GetUserModel(user.Id, context);
                    HistoryDal.Write(User.Identity.GetUserId(), "Users", HistoryActionEnum.Delete, user.Id, null, newModel, GetClientIp());
                    return Json(new ResultModel
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

        private string GenerateOtp(int len)
        {
            string res = "";
            Random rnd = new Random();
            while (res.Length < len) res += (new Func<Random, string>((r) =>
            {
                char c = (char)((r.Next(123) * DateTime.Now.Millisecond % 123));
                return (Char.IsDigit(c)) ? c.ToString() : "";
            }))(rnd);
            return res;
        }

        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult GetNewOtp(UserModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var user = context.Users.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
                    if (user == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "User không tồn tại",
                            Result = null
                        });
                    }
                    var otpCode = GenerateOtp(6);
                    user.OtpCode = otpCode;
                    user.OtpCreateTime = DateTime.Now;
                    user.OtpWrongTime = 0;
                    user.OtpLastWrongTime = DateTime.Now;
                    context.Entry(user).State = EntityState.Modified;
                    context.SaveChanges();
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = otpCode
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


        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult ResetPassword(UserModel model)
        {
            try
            {
                using (var db = new WebDbContext())
                {

                    var userManager = new ApplicationUserManager(new UserStore<User>(db));
                    var newPassword = "Vnpt#$123"; //GeneratePassword(6);
                    var item = db.Users.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
                    var newHashPassword = userManager.PasswordHasher.HashPassword(newPassword);
                    if (item != null)
                    {
                        item.PasswordHash = newHashPassword;
                        db.Entry(item).State = EntityState.Modified;
                    }
                    var result = db.SaveChanges();
                    if (result > 0)
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Success,
                            Message = ResultCode.Success.ToString(),
                            Result = null
                        });
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Message = ResultCode.Success.ToString(),
                        Result = null
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
        public IHttpActionResult ChangePassword(UserModel model)
        {
            try
            {
                using (var db = new WebDbContext())
                {

                    var userManager = new ApplicationUserManager(new UserStore<User>(db));
                    var newPassword = model.Password; //GeneratePassword(6);
                    var userId = User.Identity.GetUserId();
                    var item = db.Users.FirstOrDefault(s => s.Id == userId && s.Status != StatusEnum.Deleted);
                    var newHashPassword = userManager.PasswordHasher.HashPassword(newPassword);
                    if (item != null)
                    {
                        item.PasswordHash = newHashPassword;
                        db.Entry(item).State = EntityState.Modified;
                    }
                    var result = db.SaveChanges();
                    if (result > 0)
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Success,
                            Message = ResultCode.Success.ToString(),
                            Result = null
                        });
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Message = ResultCode.Success.ToString(),
                        Result = null
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

        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult Units(UserSearchModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    
                    var units = context.Units.Where(s => s.Status != StatusEnum.Deleted);

                    if (currentUnitCode == "LDG")
                    {

                    }
                    else
                    {
                        units = units.Where(s => s.UnitCode.ToLower() == currentUnitCode.ToLower());
                    }
                    var result = units.OrderBy(s => s.SortNo).ThenBy(s => s.Name).ToList().Select(s => new UnitModel(s)).ToList();
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result
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

        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult Roles(UserSearchModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    var units = context.Roles.Where(s => s.Status != StatusEnum.Deleted && s.RoleLevel > 0);

                    var result = units.OrderBy(s => s.Name).ToList().Select(s => new Role()
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Description = s.Description,
                    }).ToList();
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result
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
        public IHttpActionResult Positions()
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var units = context.Positions.Where(s => s.Status != StatusEnum.Deleted);
                    var result = units.OrderBy(s => s.OrderNo).ThenBy(s => s.Name).ToList().Select(s => new PositionModel(s)).ToList();
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result
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

    }
}
