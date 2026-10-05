using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Providers
{
    public class ReCaptchaService
    {
        public static ReCaptchaService Validate(string encodedResponse)
        {
            var client = new System.Net.WebClient();

            string privateKey = "";//"6LccuQAhAAAAAGN2BB7gNJAoy3ZmJ6SCVjzBwCKZ";
            using (var context = new WebDbContext())
            {
                var recaptcha =
                    context.SystemParameters.FirstOrDefault(s => s.Code == "ReCaptcha" && s.Id == "ReCaptcha");
                if (recaptcha == null || string.IsNullOrEmpty(recaptcha.Value2))
                {
                    return new ReCaptchaService() { Success = true };
                }

                privateKey = recaptcha.Value2;
            }

            var googleReply = client.DownloadString(
                $@"https://www.google.com/recaptcha/api/siteverify?secret={privateKey}&response={encodedResponse}");

            var captchaResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<ReCaptchaService>(googleReply);

            return captchaResponse;
        }

        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("error-codes")]
        public List<string> ErrorCodes { get; set; }
    }
}