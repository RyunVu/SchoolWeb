using System;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Xml.Linq;
using Google.Authenticator;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Core.Web;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Base.Dal;

namespace VNPT.Web.Portal.Api.Controllers
{
    public class LoginV2Controller : ApiController
    {
        [HttpPost]
        public async Task<IHttpActionResult> CheckLoginByUsername(LoginV2Model model)
        {
            try
            {
                var userManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();

                string emailSentFrom = ConfigurationManager.AppSettings["EmailSentFrom"] + "";

                using (var context = new WebDbContext())
                {
                    var user = await userManager.FindAsync(model.Username, model.Password);
                    if (user == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.DataNotEnough,
                            Message = "Sai mật khẩu hoặc tài khoản không tồn tại"
                        });
                    }
                    // var checkOtp
                    var check = context.SystemParameters.FirstOrDefault(s =>
                        s.Status == StatusEnum.Used && s.Id == "CheckLoginOTP");
                    if (check == null)
                    {
                        check = new SystemParameter
                        {
                            Tag = null,
                            Status = StatusEnum.Used,
                            Description = null,
                            CreateDate = DateTime.Now,
                            CreateUserId = null,
                            UpdateDate = null,
                            UpdateUserId = null,
                            LanguageId = null,
                            UnitCode = null,
                            Id = "CheckLoginOTP",
                            Code = "CheckLoginOTP",
                            Value5 = true
                        };
                        context.SystemParameters.Add(check);
                        context.SaveChanges();
                    }

                    if (check.Value5 == true)
                    {
                        //send Otp
                        var userDb = context.Users.First(s => s.Id == user.Id && s.Status != StatusEnum.Deleted);

                        if (userDb.OtpCreateTime.HasValue && userDb.OtpCreateTime.Value > DateTime.Now.AddMinutes(-5) &&
                            userDb.OtpWrongTime.HasValue && userDb.OtpWrongTime < 3)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.Success,
                                Result = check.Value5 == true
                            });
                        }
                        else
                        {
                            if (!userDb.OtpLastWrongTime.HasValue || userDb.OtpLastWrongTime.Value <= DateTime.Now.AddMinutes(-5))
                            {

                                var otpCode = SmsService.GenerateOtp(6);
                                userDb.OtpCode = otpCode;
                                userDb.OtpCreateTime = DateTime.Now;
                                userDb.OtpWrongTime = 0;
                                userDb.OtpLastWrongTime = DateTime.Now;
                                context.Entry(userDb).State = EntityState.Modified;
                                context.SaveChanges();
                                if (!string.IsNullOrEmpty(userDb.Email))
                                {
                                    var email = new IdentityMessage
                                    {
                                        Body = EmailService.GetBodyUserMail(userDb.FullName, $"<h1>OTP: <b>{otpCode}</b></h1>"),
                                        Subject = emailSentFrom,
                                        Destination = userDb.Email
                                    };
                                    EmailProvider.SendEmail(email, "");
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.Success,
                                        Result = check.Value5 == true
                                    });
                                }
                                //if (userDb.EnableOtp == true && !string.IsNullOrEmpty(userDb.PhoneNumber))
                                //{
                                //    var text = $"{otpCode} la ma xac thuc OTP cua ban.";
                                //    var result = await SmsService.Send(user.PhoneNumber, text);
                                //    if (result.Code == ResultCode.Success)
                                //    {
                                //        return Json(new ResultModel()
                                //        {
                                //            Code = ResultCode.Success,
                                //            Result = check.Value5 == true
                                //        });
                                //    }
                                //}
                                else
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.Success,
                                        Result = check.Value5 == true
                                    });
                                }

                            }
                            else
                            {
                                if (user.OtpLastWrongTime != null)
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.ExpriedTime,
                                        Result = check.Value5 == true,
                                        Message = user.OtpLastWrongTime.Value.AddMinutes(5).Subtract(DateTime.Now).TotalSeconds + "",
                                    });
                            }
                        }
                    }
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = check.Value5 == true
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Exception,
                    Message = e.Message,
                    Result = null
                });
            }
        }

        [HttpPost]
        [VnptAuthorization(IsForAll = true)]
        public IHttpActionResult GetQrAuthorization(LoginV2Model model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var userId = User.Identity.GetUserId();
                    var user = context.Users.FirstOrDefault(s => s.Id == userId && s.Status != StatusEnum.Deleted);
                    if (user == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.DataNotEnough,
                            Result = null,
                            Message = "Tài khoản không tồn tại"
                        });
                    }
                    var userManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
                    var check = userManager.CheckPassword(user, model.Password);
                    if (!check)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.DataNotEnough,
                            Result = null,
                            Message = "Mật khẩu không đúng!"
                        });
                    }

                    if (string.IsNullOrEmpty(user.ImportId))
                    {
                        user.ImportId = Guid.NewGuid().ToString().Replace("-", "");
                        context.Entry(user).State = EntityState.Modified;
                        context.SaveChanges();
                    }
                    var key = $"{user.ImportId}";
                    TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
                    SetupCode setupInfo = tfa.GenerateSetupCode("Cục thống kê Lâm Đồng", user.FullName + $" ({user.UserName})", key, false, 3);

                    string qrCodeImageUrl = setupInfo.QrCodeSetupImageUrl;//.Replace("data:image/png;base64,", "");
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = qrCodeImageUrl,
                        Message = setupInfo.ManualEntryKey
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Fail,
                    Result = null,
                    Message = ex.Message
                });
            }
        }
        [HttpPost]
        [VnptAuthorization]
        public IHttpActionResult GetQrAuthorizationAdmin(UserModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    User user;
                    if (model.Id == "PortalAdmin")
                    {
                        var superRapidSecretKey = context.SystemParameters.FirstOrDefault(s => s.Id == "PortalRapidSecretKey");
                        if (superRapidSecretKey == null)
                        {
                            return Json(new ResultModel
                            {
                                Code = ResultCode.DataNotEnough,
                                Result = null,
                                Message = "Chưa cấu hình Admin Portal"
                            });
                        }
                        if (!User.IsInRole(RoleCode.SuperAdminSystem))
                        {
                            return Json(new ResultModel
                            {
                                Code = ResultCode.DataNotEnough,
                                Result = null,
                                Message = "Bạn không có quyền cấu hình Admin Portal"
                            });
                        }
                        user = new User()
                        {
                            ImportId = superRapidSecretKey.Value2,
                            UserName = "adminportal",
                            LastName = "Admin",
                            FirstName = "Portal"
                        };
                    }
                    else
                    {
                        var userId = model.Id;
                        user = context.Users.FirstOrDefault(s => s.Id == userId && s.Status != StatusEnum.Deleted);
                        if (user == null)
                        {
                            return Json(new ResultModel
                            {
                                Code = ResultCode.DataNotEnough,
                                Result = null,
                                Message = "Tài khoản không tồn tại"
                            });
                        }
                        if (string.IsNullOrEmpty(user.ImportId))
                        {
                            user.ImportId = Guid.NewGuid().ToString().Replace("-", "");
                            context.Entry(user).State = EntityState.Modified;
                            context.SaveChanges();
                        }
                    }

                    var key = $"{user.ImportId}";
                    TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
                    SetupCode setupInfo = tfa.GenerateSetupCode("Phòng giáo dục Bảo Lộc", user.FullName + $" ({user.UserName})", key, false, 3);

                    string qrCodeImageUrl = setupInfo.QrCodeSetupImageUrl;//.Replace("data:image/png;base64,", "");
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = qrCodeImageUrl,
                        Message = setupInfo.ManualEntryKey
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Fail,
                    Result = null,
                    Message = ex.Message
                });
            }
        }
        [VnptAuthorization(IsForAll = true)]
        [HttpPost]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return Json(new ResultModel() { Code = ResultCode.UnSuccess, Message = "Thông tin không hợp lệ" });
            }

            if (model.NewPassword != model.ConfirmPassword)
            {

                return Json(new ResultModel()
                {
                    Code = ResultCode.UnSuccess,
                    Message = "Xác nhận mật khẩu không khớp"
                });
            }

            using (var db = new WebDbContext())
            {
                var userManager = new ApplicationUserManager(new UserStore<User>(db));
                var userId = User.Identity.GetUserId();
                var item = db.Users.FirstOrDefault(s => s.Id == userId && s.Status != StatusEnum.Deleted);
                if (item != null)
                {
                    if (userManager.CheckPassword(item, model.OldPassword))
                    {
                        var newHashPassword = userManager.PasswordHasher.HashPassword(model.NewPassword);
                        item.PasswordHash = newHashPassword;
                        db.Entry(item).State = EntityState.Modified;
                        var result = db.SaveChanges();
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                        });
                    }
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.UnSuccess,
                        Message = "Mật khẩu không đúng"
                    });
                }
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnSuccess,
                    Message = "Tài khoản không tồn tại"
                });
            }
        }

    }

    public class LoginV2Model
    {
        public string Username { get; set; }

        public string Password { get; set; }
    }
    public class ChangePasswordModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
    public class EmailService
    {
        public static string GetBodyUserMail(string fullname, string content)
        {
            return $@"
                    <div id=':le' class='ii gt adP adO'>
                   <div id=':1uk' class='a3s aXjCH m15def37f72d35f1a'>
                      <div class='adM'></div>
                      <u></u>
                      <div>
                         <table width='100%' cellpadding='0' cellspacing='0'>
                            <tbody>
                               <tr>
                                  <td align='center' style='background:#e0e0e0;padding:50px 0'>
                                     <center>
                                        <table style='background:#ffffff;border:1px solid #999999;width:680px'>
                                           <tbody>
                                              <tr>
                                                 <td style='font-size:12px;font-family:arial;padding:20px 10px;vertical-align:top'>
                                                    <p></p>
                                                    <h2>Xin chào {fullname}</h2>
                                                    <p></p>
                                                    <p></p>
                                                    <div>
                                                       <small>{DateTime.Now: dd/MM/yyyy hh:mm}</small><br>
                                                       <h3>Thông tin tài khoản</h3>
                                                       {content}
                                                    </div>
                                                 </td>
                                              </tr>
                                           </tbody>
                                        </table>
                                     </center>
                                  </td>
                               </tr>
                            </tbody>
                         </table>
                        <div>
                          
                        </div>
                      </div>     
                   </div>
                </div>";
        }
    }
}
