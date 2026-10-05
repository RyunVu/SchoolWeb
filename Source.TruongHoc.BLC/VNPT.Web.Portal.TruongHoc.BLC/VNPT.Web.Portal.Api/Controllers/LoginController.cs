using System;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Core.Web;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Base.Dal;

namespace VNPT.Web.Portal.Api.Controllers
{
    public class LoginController : BaseApiController
    {
        //public string DomainLogin => "https://v2.lamdongtructuyen.vn";
        //public string DomainLoginSuccess => $"{DomainLogin}/#";
        //[HttpPost]
        //public IHttpActionResult GetLoginZaloUrl()
        //{
        //    var appId = 2596949766728465993;
        //    var secretKey = "JcWEBnjbqJQBRq1SJWwf";
        //    ZaloAppInfo appInfo = new ZaloAppInfo(appId, secretKey, $"{DomainLogin}/hub/api/login/zalo?IdMap={Guid.NewGuid()}");
        //    ZaloAppClient appClient = new ZaloAppClient(appInfo);
        //    string loginUrl = appClient.getLoginUrl();

        //    return Json(new ResultModel()
        //    {
        //        Code = ResultCode.Success,
        //        Result = loginUrl
        //    });
        //}

        //[HttpPost]
        //public async Task<JsonResult<ResultModel>> CheckPhone(UserModel input)
        //{
        //    try
        //    {
        //        using (var context = new WebDbContext())
        //        {
        //            var user = UserDal.FindByPhone(input.PhoneNumber, context);
        //            if (user != null)
        //            {
        //                //if (user.IsInRole(VNPT.Core.Constants.RoleCode.SuperAdminSystem))
        //                //{
        //                //    if (string.IsNullOrEmpty(input.UnitCode))
        //                //        user.UnitCode = "LDG";
        //                //}
        //                if (user.OtpCreateTime.HasValue && user.OtpCreateTime.Value > DateTime.Now.AddMinutes(-10) &&
        //                    user.OtpWrongTime.HasValue && user.OtpWrongTime < 3)
        //                {
        //                    return Json(new ResultModel()
        //                    {
        //                        Code = ResultCode.Success
        //                    });
        //                }
        //                else
        //                {
        //                    if (!user.OtpLastWrongTime.HasValue || user.OtpLastWrongTime.Value <= DateTime.Now.AddMinutes(-5))
        //                    {

        //                        var otpCode = GenerateOtp(6);
        //                        var text = $"{otpCode} la ma xac thuc cua LamDongTrucTuyen.";
        //                        switch (user.UserType)
        //                        {
        //                            case 1:
        //                                var currentUser = context.Users.First(s => s.Id == user.Id && s.Status != StatusEnum.Deleted);
        //                                currentUser.OtpCode = otpCode;
        //                                currentUser.OtpCreateTime = DateTime.Now;
        //                                currentUser.OtpWrongTime = 0;
        //                                currentUser.OtpLastWrongTime = DateTime.Now;
        //                                context.Entry(currentUser).State = EntityState.Modified;
        //                                context.SaveChanges();
        //                                HistoryDal.Write(currentUser.Id, "Users", HistoryActionEnum.Edit, currentUser.Id, null, null, GetClientIp(), context: context, note: new OtherFromHistory() { Description = $"Lấy mã đăng nhập {otpCode}" });
        //                                if (currentUser.IsDevUser != true)
        //                                {
        //                                    var result = await SmsService.Send(currentUser.UnitCode, currentUser.PhoneNumber, text);
        //                                    if (result.Code == ResultCode.Success)
        //                                    {
        //                                        return Json(new ResultModel()
        //                                        {
        //                                            Code = ResultCode.Success
        //                                        });
        //                                    }
        //                                }
        //                                break;
        //                            case 2:
        //                                var deviceId = Request.GetValues("DeviceId");
        //                                if (string.IsNullOrEmpty(deviceId) || !deviceId.StartsWith("lamdongtructuyen"))
        //                                {
        //                                    return Json(new ResultModel()
        //                                    {
        //                                        Code = ResultCode.Fail,
        //                                        Message = "Thiết bị đăng nhập không hợp lệ!"
        //                                    });
        //                                }

        //                                if (user.Tag == "demo")
        //                                {
        //                                    return Json(new ResultModel()
        //                                    {
        //                                        Code = ResultCode.Success
        //                                    });
        //                                }
        //                                var id = Guid.Parse(user.Id);
        //                                var citizen = context.Citizens.First(s => s.Id == id && s.Status != StatusEnum.Deleted);
        //                                citizen.OtpCode = otpCode;
        //                                citizen.OtpCreateTime = DateTime.Now;
        //                                citizen.OtpWrongTime = 0;
        //                                citizen.OtpLastWrongTime = DateTime.Now;
        //                                context.Entry(citizen).State = EntityState.Modified;
        //                                context.SaveChanges();
        //                                var result1 = await SmsService.Send(citizen.UnitCode, citizen.PhoneNumber, text);
        //                                if (result1.Code == ResultCode.Success)
        //                                {
        //                                    return Json(new ResultModel()
        //                                    {
        //                                        Code = ResultCode.Success
        //                                    });
        //                                }
        //                                break;
        //                        }


        //                        return Json(new ResultModel()
        //                        {
        //                            Code = ResultCode.Success
        //                        });

        //                    }
        //                    else
        //                    {
        //                        if (user.OtpLastWrongTime != null)
        //                            return Json(new ResultModel()
        //                            {
        //                                Code = ResultCode.ExpriedTime,
        //                                Result = user.OtpLastWrongTime.Value.AddMinutes(5).Subtract(DateTime.Now).TotalSeconds,
        //                                Message = "Vui lòng thử lại sau"
        //                            });
        //                    }
        //                }

        //                return Json(new ResultModel()
        //                {
        //                    Code = ResultCode.UnSuccess,
        //                    Message = "Đã có lỗi xảy ra khi xác thực. Vui lòng thử lại sau!"
        //                });

        //            }
        //            return Json(new ResultModel()
        //            {
        //                Code = ResultCode.UnSuccess,
        //                Message = "Không tìm thấy tài khoản!"
        //            });
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new ResultModel()
        //        {
        //            Code = ResultCode.UnSuccess,
        //            Message = "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        //        });
        //    }
        //}

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



    }
}
