using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Media.DAL.Models;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    public class NewGuestController : ApiController
    {
        [HttpPost]
        public IHttpActionResult GetList(NewsModelPtt model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var cmd = context.Database.Connection.CreateCommand();
                    cmd.CommandText = "[dbo].[News_list]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_code", model.Code));
                    //cmd.Parameters.Add(new SqlParameter("@p_id", model.Id));
                    cmd.Parameters.Add(new SqlParameter("@p_unitcode", model.UnitCode));
                    cmd.Parameters.Add(new SqlParameter("@p_date_to", !string.IsNullOrEmpty(model.ToDate) ? $"{model.ToDate} 23:59:59".ParseDate("dd/MM/yyyy HH:mm:ss") : (DateTime?)null));
                    cmd.Parameters.Add(new SqlParameter("@p_date_from", !string.IsNullOrEmpty(model.FromDate) ? $"{model.FromDate}".ParseDate("dd/MM/yyyy") : (DateTime?)null));
                    cmd.Parameters.Add(new SqlParameter("@p_keyword", model.Keyword));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", model.PageIndex ?? 1));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", model.PageSize ?? 10));
                    var connection = context.Database.Connection;
                    if (connection.State != ConnectionState.Open)
                        connection.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        var resultTemp = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<NewsModelPtt>(reader)
                            .ToList();
                        reader.NextResult();

                        var total = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<int>(reader)
                            .ToList();
                        connection.Close();
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Success,
                            Result = resultTemp,
                            TotalRow = total.FirstOrDefault()
                        });
                    }
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.UnknowError,
                    Message = e.Message
                });
            }
        }
        [HttpPost]
        public IHttpActionResult Detail(NewsModelPtt model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    model.Alias = model.Alias.ToLower();
                    if (string.IsNullOrEmpty(model.Alias))
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.UnknowError,
                            Message = "Không tìm thấy bài viết!"
                        });
                    }
                    var news = context.News.FirstOrDefault(s =>
                        s.Status == StatusEnum.Used && s.Alias.ToLower() == model.Alias.ToLower() && s.UnitCode.ToLower() == model.UnitCode.ToLower());
                    if (news == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.UnknowError,
                            Message = "Không tìm thấy bài viết!"
                        });
                    }

                    news.CountView = news.CountView ?? 0;
                    news.CountView++;
                    context.Entry(news).State = EntityState.Modified;
                    context.SaveChanges();


                    var createUser = context.Users.FirstOrDefault(s => s.Id == news.CreateUserId)?.FullName ?? "";
                    List<FileModelV2> images;
                    try
                    {
                        images = JsonConvert.DeserializeObject<List<FileModelV2>>(news.Description);
                    }
                    catch (Exception e)
                    {
                        images = new List<FileModelV2>();
                    }
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = new
                        {
                            news.Id,
                            news.Content,
                            news.ShortContent,
                            news.Tag,
                            news.ImageUrl,
                            Images = images,
                            news.Title,
                            news.Description,
                            news.CountView,
                            FullName = createUser,
                            CreateDate = news.CreateDate.ToString("dd/MM/yyyy HH:mm")
                        }
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.UnknowError,
                    Message = e.Message
                });
            }
        }
    }
}
