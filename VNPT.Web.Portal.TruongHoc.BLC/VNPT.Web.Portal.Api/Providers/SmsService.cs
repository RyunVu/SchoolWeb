using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using VNPT.Core.Constants;
using VNPT.Core.Models;

namespace VNPT.Web.Portal.Api.Providers
{
    public class SmsService
    {
        public static string GenerateOtp(int len = 6)
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
        public static Task<ResultModel> Send(string phoneNumber, string text)
        {
            //var sms = new SMSServiceWeb.ServiceSMSClient();
            //var res = await sms.InsertSMSAsync("SmsTravel#789", phoneNumber, text, "SMSSchool");
            //var uri = "https://sms.lamdongtructuyen.vn/api/sms/SendContent";
            //using (var client = new HttpClient())
            //{
            //    client.BaseAddress = new Uri(uri);
            //    client.DefaultRequestHeaders.Accept.Clear();
            //    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            //    var content = new
            //    {
            //        SecretKey = "e87bfbba-ed50-4909-ab21-507d817095ea",
            //        Site = "iGovConnect LDG V2",
            //        PhoneNo = phoneNumber,
            //        Content = text
            //    };
            //    HttpResponseMessage response = await client.PostAsJsonAsync(uri, content);
            //    var result = await response.Content.ReadAsAsync<ResultModel>();
            //    return result;
            //}
            //todo: 8. chưa cấu hình brandname riêng thì tắt đi
            return Task.FromResult(new ResultModel()
            {
                Code = ResultCode.Success,
                Message = "Chưa cấu hình OTP"
            });
        }
    }
}