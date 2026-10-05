using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Web;
using VNPT.Core.Constants;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Jobs;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Providers
{
    public class AnalyticsDal
    {
        public static GoogleAnalyticsResponse GetAnalyticData(string unitCode)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var analytics = context.SystemParameters.FirstOrDefault(s => s.Status == StatusEnum.Used && s.Code == "ANALYTICS" && s.UnitCode.ToLower() == unitCode.ToLower());

                    if (analytics != null)
                    {
                        if (!string.IsNullOrEmpty(analytics.Value4) && !string.IsNullOrEmpty(analytics.Value6))
                        {
                            using (var client = new HttpClient())
                            {
                                client.Timeout = TimeSpan.FromMinutes(1);
                                client.BaseAddress = new Uri("https://analytic.lamdongtructuyen.vn/hub/"); //api bridge
                                client.DefaultRequestHeaders.Accept.Clear();
                                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                                GoogleAnalyticsInput googleDTOAnalytics = new GoogleAnalyticsInput()
                                {
                                    PropertyId = analytics.Value4,
                                    Token = analytics.Value6
                                };

                                var json = JsonConvert.SerializeObject(googleDTOAnalytics);
                                var stringContent = new StringContent(json, Encoding.UTF8, "application/json");

                                // Thay thế PostAsync bằng Post và đợi kết quả bằng Result
                                var responseAPI = client.PostAsync("api/AnalyticData/GetYear", stringContent).Result;

                                if (responseAPI.IsSuccessStatusCode)
                                {
                                    // Đọc nội dung trả về dưới dạng chuỗi một cách đồng bộ
                                    var result = responseAPI.Content.ReadAsStringAsync().Result;

                                    var dataObjResult = JsonConvert.DeserializeObject<ResultModel>(result);

                                    if (dataObjResult.Code == VNPT.Core.Constants.ResultCode.Success)
                                    {
                                        var responseResult = JsonConvert.DeserializeObject<GoogleAnalyticsResponse>(dataObjResult.Result.ToString());

                                        return responseResult;
                                    }
                                }
                            }
                        }
                    }

                    return null;
                }
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }

    public class GoogleAnalyticsInput
    {
        public string PropertyId { get; set; }

        public string Token { get; set; }
    }

    public class GoogleAnalyticsResponse
    {
        public int YearCount { get; set; }

        public int MonthCount { get; set; }
        public int DayCount { get; set; }
    }
}