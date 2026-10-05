using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using VNPT.Core.Constants;

namespace VNPT.Web.Portal.Base.Dal
{
    public class UserDal
    {
        public static UserModel GetUserById(string userId, WebDbContext context = null)
        {
            if (context == null)
            {
                using (context = new WebDbContext())
                {
                    return CallStore(userId, null, context);
                }
            }
            else
            {
                return CallStore(userId, null, context);
            }
        }

        private static UserModel CallStore(string userId, string phoneNumber, WebDbContext context)
        {
            
            Console.Write(phoneNumber);
            var cmd = context.Database.Connection.CreateCommand();
            cmd.CommandText = "[dbo].[User_single]";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(new SqlParameter("@p_user_id", userId));

            var connection = context.Database.Connection;
            if (connection.State != ConnectionState.Open)
                connection.Open();
            using (var reader = cmd.ExecuteReader())
            {
                var resultTemp = ((IObjectContextAdapter)context).ObjectContext
                    .Translate<UserModel>(reader)
                   .ToList();

                if (resultTemp.Count == 0)
                {
                    return null;
                }
                var user = resultTemp.First();
                reader.NextResult();
                var roles = ((IObjectContextAdapter)context).ObjectContext
                    .Translate<string>(reader)
                   .ToList();
               reader.NextResult();
                user.RoleIds = roles;
                var locations = ((IObjectContextAdapter)context).ObjectContext
                    .Translate<LocationUserModel>(reader)
                    .ToList();
                user.UserLocations = locations;
                return user;
            }

            //var proc =
            //    $"BEGIN user_pkg.Single(:p_user_id,:v_cur,:v_cur_role,:v_cur_field,:v_cur_location); END;";

            //var connection = context.Database.Connection;
            //if (connection.State != ConnectionState.Open)
            //    connection.Open();
            //var command = connection.CreateCommand();
            //command.CommandText = proc;
            //var listParam = new List<OracleParameter>
            //        {
            //            p_user_id,v_cur,v_cur_role,v_cur_field,v_cur_location
            //        };
            //command.Parameters.AddRange(listParam.ToArray());
            //using (var reader = command.ExecuteReader())
            //{
            //    var resultTemp = ((IObjectContextAdapter)context).ObjectContext
            //        .Translate<UserModel>(reader)
            //        .ToList();

            //    if (resultTemp.Count == 0)
            //    {
            //        return null;
            //    }

            //    var user = resultTemp.First();
            //    reader.NextResult();
            //    var roles = ((IObjectContextAdapter)context).ObjectContext
            //        .Translate<string>(reader)
            //        .ToList();
            //    reader.NextResult();

            //    user.RoleIds = roles;
            //    var fields = ((IObjectContextAdapter)context).ObjectContext
            //        .Translate<string>(reader)
            //        .ToList();
            //    user.FieldIds = fields.Select(s => Guid.Parse(s)).ToList();
            //    reader.NextResult();

            //    var locations = ((IObjectContextAdapter)context).ObjectContext
            //        .Translate<LocationUserModel>(reader)
            //        .ToList();
            //    user.UserLocations = locations;
            //    return user;
            //}
        }
        public static bool CheckValidToken(UserLoginHistory login)
        {
            //todo: 6. Sửa hàm check đăng nhập
            using (var context = new WebDbContext())
            {
                var id = Guid.Parse(login.UserId);
                var userLogin = context.UserLoginHistories.Any(s => s.Status == StatusEnum.Used
                                                                    && s.AccessToken == login.AccessToken
                                                                    && s.UserId == login.UserId
                                                                    && s.DeviceId == login.DeviceId
                                                                    && s.ExpiredDate > DateTime.Now);
                return userLogin;
            }
        }
    }

    public class UserModel
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }


        public string UserName { get; set; }
        public string AvatarUrl { get; set; }

        public string PhoneNumber { get; set; }

        public string OtherPositionName { get; set; }

        public string Email { get; set; }

        public Guid? PositionId { get; set; }

        public Guid? UnitId { get; set; }
        public string UnitName { get; set; }
        public string PositionName { get; set; }

        public List<Guid> FieldIds { get; set; }
        public List<string> RoleIds { get; set; }
        public List<LocationUserModel> UserLocations { get; set; }
        public string Password { get; set; }
        public bool? EnableOtp { get; set; }

        public string FullName
        {
            get
            {
                return $"{(LastName?.Trim() ?? "")} {(FirstName?.Trim() ?? "")}";
            }
        }

        public bool IsInRoleByName(string roleName, WebDbContext context = null)
        {
            string roleId = null;
            if (context == null)
            {
                using (var ctx = new WebDbContext())
                {
                    roleId = ctx.Roles.FirstOrDefault(s => s.Name.ToLower() == roleName)?.Id;
                }
            }
            else
            {
                roleId = context.Roles.FirstOrDefault(s => s.Name.ToLower() == roleName)?.Id;
            }

            if (string.IsNullOrEmpty(roleId))
            {
                return false;
            }
            return IsInRoleById(roleId);
        }

        public bool IsInRoleById(string roleId)
        {
            return RoleIds?.Any(s => s == roleId) ?? false;
        }

        public UserModel()
        {

        }
        public UserModel(User model)
        {
            FirstName = model.FirstName ?? "";
            LastName = model.LastName ?? "";
            Id = model.Id;
            UserName = model.UserName ?? "";
            PositionId = model.PositionId;
            UnitId = model.UnitId;
            PhoneNumber = model.PhoneNumber ?? "";
            Email = model.Email ?? "";
            RoleIds = model.Roles.Select(s => s.RoleId).ToList();
        }
    }

    public class LocationUserModel
    {
        public Guid? ProvinceId { get; set; }
        public Guid? DistrictId { get; set; }

        public Guid? WardId { get; set; }

        public string ProvinceName { get; set; }

        public string DistrictName { get; set; }

        public string WardName { get; set; }
    }
}
