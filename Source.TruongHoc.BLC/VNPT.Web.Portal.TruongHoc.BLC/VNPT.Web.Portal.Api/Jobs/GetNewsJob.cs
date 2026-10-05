using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using FluentScheduler;
using Newtonsoft.Json;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Base;
using VNPT.Core.Bkav;
using VNPT.Core.Models;
using Microsoft.AspNet.Identity;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using VNPT.Core.Media.DAL;
using VNPT.Core.Media.DAL.Models;
using System.Text.RegularExpressions;
using System.Globalization;

namespace VNPT.Web.Portal.Api.Jobs
{
    public class GetNewsJob : IJob
    {
        public async void Execute()
        {
            try
            {
                // Thay đổi URL của bạn
                string apiUrl = "https://lamdong.edu.vn/Modules/NewsHome/GetNewsList2";

                // Dữ liệu JSON cần gửi
                string jsonData = "{\"page\": \"1\",\"pageSize\": \"20\",\"keyword\": \"\",\"number\": \"20\",\"Code\": \"CODE_CATEGORIES\"}";

                try
                {
                    // Gọi hàm gửi HTTP POST
                    string resultString = await PostJsonAsync(apiUrl, jsonData);

                    if (!string.IsNullOrEmpty(resultString))
                    {
                        List<NewsEduModel> listNewEdu = JsonConvert.DeserializeObject<List<NewsEduModel>>(resultString);

                        using (var context = new WebDbContext())
                        {
                            var sysPortals = context.SysPortals.Where(x => x.Status != StatusEnum.Deleted).ToList();

                            foreach (var itemSys in sysPortals)
                            {
                                var newType = context.GeneralCategories.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Code == "NewsType" && x.Value == "tin-tuc-tu-so-gddt" && x.UnitCode == itemSys.UnitCode);

                                if (newType != null)
                                {
                                    foreach (var item in listNewEdu)
                                    {
                                        // Check tồn tại
                                        var alias = item.ALIAS.Replace("-" + newType.Id.ToString(), "") + "-" + newType.Id.ToString();

                                        var newsTemp = context.News.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Alias == alias && x.Code == "tin-tuc-tu-so-gddt");

                                        if (newsTemp == null)
                                        {
                                            var newsItem = new News()
                                            {
                                                Id = Guid.NewGuid(),
                                                NewTypeId = newType.Id,
                                                Code = "tin-tuc-tu-so-gddt",
                                                Alias = alias,
                                                Title = item.TITLE,
                                                Content = item.CONTENT.Replace("\\\"", "\"").Replace("\n", ""),
                                                //Title_En = input.Title_En,
                                                //Content_En = input.Content_En,
                                                ImageUrl = "https://edumedia.lamdongtructuyen.vn/" + item.URL_IMG,
                                                ShortContent = item.SHORT_CONTENT,
                                                //Order = input.Order,
                                                CountView = 0,
                                                CreateDate = DateTime.ParseExact(item.CREATE, "dd/MM/yyyy", CultureInfo.InvariantCulture),
                                                Status = StatusEnum.Used,
                                                CreateUserId = "10ecdf16-04ec-4f3a-8573-1ac429c7d0db",
                                                UnitCode = itemSys.UnitCode,
                                                LanguageId = "vi",
                                                Description = "",
                                            };
                                            context.News.Add(newsItem);
                                            context.SaveChanges();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {

                }
            }
            catch (Exception e)
            {

            }
        }

        static async Task<string> PostJsonAsync(string url, string jsonContent)
        {
            using (HttpClient client = new HttpClient())
            {
                // Tạo nội dung JSON
                StringContent content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                // Gửi HTTP POST
                HttpResponseMessage response = await client.PostAsync(url, content);

                // Kiểm tra phản hồi thành công
                response.EnsureSuccessStatusCode();

                // Đọc và trả về nội dung phản hồi
                return await response.Content.ReadAsStringAsync();
            }
        }
    }

    public class NewsEduModel
    {
        public string ALIAS { get; set; }
        public string URL_IMG { get; set; }
        public string TITLE { get; set; }
        public string CREATE { get; set; }
        public string SHORT_CONTENT { get; set; }
        public string CONTENT { get; set; }
    }
}