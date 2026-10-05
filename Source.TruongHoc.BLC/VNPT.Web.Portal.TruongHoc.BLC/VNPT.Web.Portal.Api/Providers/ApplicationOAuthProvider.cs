using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Google.Authenticator;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Base.Dal;

namespace VNPT.Web.Portal.Api.Providers
{
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;
        private string _provider;
        private string _otp;
        private string _phone;

        private string _deviceId;
        private string _requestIp;
        private string _userId;
        public ApplicationOAuthProvider(string publicClientId)
        {
            _publicClientId = publicClientId ?? throw new ArgumentNullException(@"publicClientId");
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            try
            {
                var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();
                User user;

                //if (!string.IsNullOrEmpty(_accessToken))
                //{
                //    var zalo = await ZaloDal.GetUserInfo(_accessToken);
                //    if (zalo != null)
                //    {
                //        using (var contextDb = new WebDbContext())
                //        {
                //            user = contextDb.Users.FirstOrDefault(s => s.ZaloUserId == zalo.id && s.Status != StatusEnum.Deleted);
                //            if (user != null)
                //            {
                //                user = await userManager.FindByNameAsync(user.UserName);
                //            }
                //        }
                //    }
                //    else
                //    {
                //        context.SetError("invalid_grant", "The user zalo is incorrect.");
                //    }
                //}
                //else

                //todo: 1. Lấy Ip login
                var isLoginWithPassword = false;
                var _requestIp = "";
                var httpContextWrapper = context.OwinContext.Environment["System.Web.HttpContextBase"] as HttpContextWrapper;

                string ipAddress = httpContextWrapper.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

                if (!string.IsNullOrEmpty(ipAddress))
                {
                    string[] addresses = ipAddress.Split(',');
                    if (addresses.Length != 0)
                    {
                        _requestIp = addresses[0];
                    }
                }
                else
                {
                    _requestIp = httpContextWrapper.Request.ServerVariables["REMOTE_ADDR"];
                }
               
                _deviceId = context.Request.Headers["DeviceId"] ?? "";
                if (!string.IsNullOrEmpty(_provider) &&
                         (_provider.ToLower() == "otp" || _provider.ToLower() == "otpNotCheckTime".ToLower()))
                {
                    using (var ctx = new WebDbContext())
                    {
                        user = ctx.Users.FirstOrDefault(s => s.PhoneNumber == _phone);
                        if (user == null)
                        {
                            context.SetError("invalid_grant", "Số điện thoại không tồn tại trong hệ thống");
                            return;
                        }

                        var isCheckWrongTime = _provider.ToLower() != "otpNotCheckTime".ToLower();

                        var resultModel = CheckLogin(ctx, user, isCheckWrongTime);
                        if (resultModel.Code != ResultCode.Success)
                        {
                            context.SetError("OtpError", JsonConvert.SerializeObject(resultModel));
                            return;
                        }
                    }
                }
                else
                {
                    //todo: 2. Check User dùng password
                    user = await userManager.FindAsync(context.UserName, context.Password);
                    isLoginWithPassword = true;
                }
                if (user == null)
                {
                    //if (context.UserName == "superadmin" && context.Password == "Admin#$123")
                    //{
                    //    using (var contextDb = new WebDbContext())
                    //    {
                    //        var user1 = contextDb.Users.FirstOrDefault(s => s.UserName == context.UserName);
                    //        if (user1 != null)
                    //        {
                    //            //user1.PasswordHash = userManager.PasswordHasher.HashPassword(context.Password);
                    //            //contextDb.Entry(user1).State = EntityState.Modified;
                    //            //contextDb.SaveChanges();
                    //            //user = await userManager.FindAsync(context.UserName, context.Password);
                    //        }
                    //        else
                    //        {
                    //            user = new User()
                    //            {
                    //                UserName = "superadmin",
                    //                PasswordHash = userManager.PasswordHasher.HashPassword(context.Password),
                    //                AccessFailedCount = 0,
                    //                Address = "",
                    //                AvatarUrl = "",
                    //                Code = "",
                    //                CreateDate = DateTime.Now,
                    //                CreateUserId = null,
                    //                DayOfBirth = null,
                    //                Description = "",
                    //                Email = "khoanx.ldg@vnpt.vn",
                    //                FirstName = "Admin",
                    //                EmailConfirmed = true,
                    //                GenderId = "1",
                    //                Id = Guid.NewGuid().ToString(),
                    //                LanguageId = "",
                    //                LastName = "Super",
                    //                PhoneNumber = "0911662322",
                    //                Status = StatusEnum.Used,
                    //                PhoneNumberConfirmed = true,
                    //            };
                    //            contextDb.Users.Add(user);
                    //            contextDb.SaveChanges();
                    //            user = await userManager.FindAsync(context.UserName, context.Password);
                    //        }
                    //    }
                    //}

                    //if (user == null)
                    //{

                    //}
                    context.SetError("invalid_grant", "The user name or password is incorrect.");
                    return;
                }
                //todo: 3. Check hệ thống yêu cầu đăng nhập bằng Otp ko
                if (isLoginWithPassword)
                {
                    using (var ctx = new WebDbContext())
                    {
                        var check = ctx.SystemParameters.FirstOrDefault(s =>
                            s.Status == StatusEnum.Used && s.Id == "CheckLoginOTP");
                        if (check != null && check.Value5 == true)
                        {
                            var user1 = ctx.Users.FirstOrDefault(s => s.Id == user.Id);
                            if (user1 == null)
                            {
                                context.SetError("invalid_grant", "Tài khoản không tồn tại trong hệ thống");
                                return;
                            }
                            var resultModel = CheckLogin(ctx, user1, true);
                            if (resultModel.Code != ResultCode.Success)
                            {
                                context.SetError("OtpError", JsonConvert.SerializeObject(resultModel));
                                return;
                            }
                        }

                    }
                }
                _userId = user.Id;

                //var requestIp = context.Request.Headers["CurrentPublicIp"] ?? "";

                ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager, OAuthDefaults.AuthenticationType);
                ClaimsIdentity cookiesIdentity = await user.GenerateUserIdentityAsync(userManager, CookieAuthenticationDefaults.AuthenticationType);
                //todo: 5: thay đổi request Ip
                AuthenticationProperties properties = CreateProperties(user, _requestIp);
                AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
                context.Validated(ticket);
                context.Request.Context.Authentication.SignIn(cookiesIdentity);

            }
            catch (Exception e)
            {

                context.SetError("invalid_grant", e.Message);
            }
        }
        private ResultModel CheckLogin(WebDbContext context, User user, bool isUpdateWrongTime = true)
        {
            //todo: 4. Thay đổi hàm CheckLogin
            var resultModel = new ResultModel()
            {
                Code = ResultCode.Fail
            };
            if (user == null)
            {
                resultModel.Message = @"Số điện thoại không tồn tại!";
                return resultModel;
            }

            var authService = new GoogleAuthenticator();

            var superRapidSecretKey = context.SystemParameters.FirstOrDefault(s => s.Id == "SuperRapidSecretKey");
            if (superRapidSecretKey == null)
            {
                superRapidSecretKey = new SystemParameter
                {
                    Tag = null,
                    Status = StatusEnum.Used,
                    Description = null,
                    CreateDate = DateTime.Now,
                    Id = "SuperRapidSecretKey",
                    Code = "SuperRapidSecretKey",
                    Value2 = "5VQT6T7W4THQGKEG",
                };
                context.SystemParameters.Add(superRapidSecretKey);
                context.SaveChanges();
            }
            if (!string.IsNullOrEmpty(superRapidSecretKey.Value2))
            {
                var re = authService.CheckCode(_otp, superRapidSecretKey.Value2);
                if (re.Code == ResultCode.Success)
                {
                    resultModel.Code = re.Code = ResultCode.Success;
                    return resultModel;
                }
            }
            superRapidSecretKey = context.SystemParameters.FirstOrDefault(s => s.Id == "PortalRapidSecretKey");
            if (superRapidSecretKey == null)
            {
                // todo: 8. Đổi Token Value2
                superRapidSecretKey = new SystemParameter
                {
                    Tag = null,
                    Status = StatusEnum.Used,
                    Description = null,
                    CreateDate = DateTime.Now,
                    Id = "PortalRapidSecretKey",
                    Code = "PortalRapidSecretKey",
                    Value2 = "m4Uvg2rGYsh1fOIbOjjki",
                };
                context.SystemParameters.Add(superRapidSecretKey);
                context.SaveChanges();
            }
            if (!string.IsNullOrEmpty(superRapidSecretKey.Value2))
            {
                var re = authService.CheckCode(_otp, superRapidSecretKey.Value2);
                if (re.Code == ResultCode.Success)
                {
                    resultModel.Code = re.Code = ResultCode.Success;
                    return resultModel;
                }
            }

            if (!string.IsNullOrEmpty(user.ImportId))
            {
                var key = $"{user.ImportId}";

                var re = authService.CheckCode(_otp, key);
                if (re.Code == ResultCode.Success)
                {
                    resultModel.Code = re.Code = ResultCode.Success;
                    return resultModel;
                }
            }
            if (user.OtpCreateTime.HasValue)
            {
                if (user.OtpWrongTime != null && user.OtpWrongTime.Value < 3)
                {

                    if (user.OtpCode == _otp)
                    {
                        resultModel.Code = ResultCode.Success;
                        return resultModel;
                    }
                    else
                    {
                        user.OtpLastWrongTime = DateTime.Now;
                        if (isUpdateWrongTime)
                        {
                            user.OtpWrongTime++;
                            context.Entry(user).State = EntityState.Modified;
                            context.SaveChanges();
                        }
                        var wrongTimeCount = user.OtpLastWrongTime.Value.AddMinutes(5).Subtract(DateTime.Now).TotalSeconds;
                        var wrongTime = user.OtpWrongTime;
                        var phone = user.PhoneNumber;
                        resultModel.Message = @"Mã OTP không đúng!";
                        resultModel.Result = new
                        {
                            WrongTimeCount = wrongTimeCount,
                            WrongTime = wrongTime,
                            Phone = phone
                        };
                        return resultModel;
                    }
                }
                else
                {
                    var wrongTimeCount = 0;
                    var wrongTime = 0;
                    var phone = user.PhoneNumber;
                    resultModel.Message = @"Mã OTP đã nhập sai 3 lần. Xin vui lòng thử lại sau!";
                    resultModel.Result = new
                    {
                        WrongTimeCount = wrongTimeCount,
                        WrongTime = wrongTime,
                        Phone = phone
                    };
                    return resultModel;
                }
            }
            else
            {
                var wrongTimeCount = user.OtpCreateTime?.AddMinutes(15).Subtract(DateTime.Now).TotalSeconds ?? 0;
                var wrongTime = user.OtpWrongTime;
                var phone = user.PhoneNumber;
                resultModel.Message = @"Mã OTP đã hết hạn. Xin vui lòng thử lại sau!";
                resultModel.Result = new
                {
                    WrongTimeCount = wrongTimeCount,
                    WrongTime = wrongTime,
                    Phone = phone
                };
                return resultModel;
            }
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // Resource owner password credentials does not provide a client ID.
            if (context.ClientId == null)
            {
                context.Validated();
            }
            _provider = context.Parameters["provider"];
            _otp = context.Parameters["otp"];
            _phone = context.Parameters["phone"];
            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                Uri expectedRootUri = new Uri(context.Request.Uri, "/");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }

            return Task.FromResult<object>(null);
        }

        public static AuthenticationProperties CreateProperties(User user, string requestIp)
        {
            using (var contextDb = new WebDbContext())
            {
                var userDb = contextDb.Users.First(s => s.Id == user.Id);
                // update user login ip
                userDb.LastIpLogin = requestIp;
                user.UpdateDate = DateTime.Now;
                contextDb.Entry(userDb).State = EntityState.Modified;
                contextDb.SaveChanges();

                HistoryDal.Write(userDb.Id, "Users", HistoryActionEnum.Login, user.Id, null, null, requestIp);
                var roleInUsers = userDb.Roles.Where(s => s.Role.HomeMenuId.HasValue).ToList()
                    .Select(s => s.Role.HomeMenuId).ToList();
                var defaultMenu = "";
                if (roleInUsers.Count > 0)
                {
                    var menuId = roleInUsers[0];
                    var menu = contextDb.SystemMenus.FirstOrDefault(s => s.Id == menuId);
                    defaultMenu = menu?.Action;
                }

                if (string.IsNullOrEmpty(defaultMenu))
                {
                    defaultMenu = "home";
                }

                var user2 = UserDal.GetUserById(userDb.Id);

                string arr = "";

                if (user.Roles.Count > 0)
                {
                    foreach (var item in user.Roles)
                    {
                        if (item.RoleId != null)
                        {
                            arr += contextDb.Roles.FirstOrDefault(d => d.Id == item.RoleId)?.Name + ";";
                        }
                    }
                }

                IDictionary<string, string> data = new Dictionary<string, string>
                {
                    {"userName", user.UserName},
                    {"DefaultMenu", defaultMenu},
                    {"user", JsonConvert.SerializeObject(user2)},
                    {"MulRole", arr},
                };

                return new AuthenticationProperties(data);
            }
        }

        public override Task TokenEndpointResponse(OAuthTokenEndpointResponseContext context)
        {
            var ex = context.Properties.ExpiresUtc?.Date ?? DateTime.Now.AddDays(15);
            using (var db = new WebDbContext())
            {
                var item = new UserLoginHistory()
                {
                    CreateDate = DateTime.Now,
                    AccessToken = context.AccessToken,
                    CreateUserId = _userId,
                    DeviceId = _deviceId,
                    Id = Guid.NewGuid(),
                    Status = StatusEnum.Used,
                    ExpiredDate = ex,
                    UserId = _userId,
                    Tag = _requestIp
                };
                db.UserLoginHistories.Add(item);
                db.SaveChanges();
            }

            return base.TokenEndpointResponse(context);
        }

    }
    public class GoogleAuthenticator
    {
        public static SetupCode CreateQrCode(string fullname, string username, string userId)
        {
            TwoFactorAuthenticator factorAuthenticator = new TwoFactorAuthenticator();
            fullname = fullname.ToCamelCase().RemoveRedundantSpace();
            username = username.ToLower();
            userId = userId.Replace("-", "");
            return factorAuthenticator.GenerateSetupCode(fullname, username, userId, false);
        }

        public ResultModel CheckCode(string code, string userId)
        {
            try
            {
                userId = userId.Replace("-", "");
                if (new TwoFactorAuthenticator().ValidateTwoFactorPIN(userId, code))
                    return new ResultModel()
                    {
                        Code = ResultCode.Success
                    };
                return new ResultModel()
                {
                    Code = ResultCode.Exception,
                    Message = "Sai OTP!"
                };
            }
            catch (Exception ex)
            {
                return new ResultModel()
                {
                    Code = ResultCode.Exception,
                    Result = (object)ex,
                    Message = "Exception"
                };
            }
        }
    }
}