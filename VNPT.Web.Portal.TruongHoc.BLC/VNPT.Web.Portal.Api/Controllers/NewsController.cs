using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Http;
using Bkav.edXML.API.Entity;
using Microsoft.AspNet.Identity;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Base.Dal;

namespace VNPT.Web.Portal.Api.Controllers
{
    [VnptAuthorization]
    public class NewsController : BaseApiController
    {
        public IHttpActionResult CheckDuyetTin(NewsModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var unitCode = "";
                    string userId = User.Identity.GetUserId();
                    var user = context.Users.First(s => s.Id == userId && s.Status == StatusEnum.Used);

                    if (User.IsInRole(RoleCode.SuperAdminSystem))
                    {
                        unitCode = model.UnitCode;
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(user.UnitCode))
                        {
                            var unit = context.Units.FirstOrDefault(s => s.Id == user.UnitId && s.Status == StatusEnum.Used);

                            unitCode = unit?.Code;
                        }
                        else
                        {
                            unitCode = user.UnitCode;
                        }
                    }


                    var checkDuyetTin = SystemParameterDal.CheckDuyetTin(unitCode);
                    if (!checkDuyetTin)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                            Result = false
                        });
                    }
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = User.IsInRole(RoleCode.SuperAdminSystem) || User.IsInRole("DuyetTin")
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
        public IHttpActionResult ListLoaiTinTuc(GeneralCategoryModel model)
        {
            try
            {

                var codes = model.Value.Split('.');
                var code = codes[0];
                string type = null;
                if (codes.Length > 1)
                {
                    type = codes[1];
                }

                model.Value = code;
                using (var context = new WebDbContext())
                {
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    if (currentUnitCode == "LDG")
                    {
                        var items = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Code && s.Value == model.Value);

                        if (!string.IsNullOrEmpty(model.UnitCode))
                        {
                            items = items.Where(s => s.UnitCode.ToLower() == model.UnitCode.ToLower());
                        }

                        var temp = items.OrderBy(x => x.Name).ThenBy(x => x.UnitCode).ToList();

                        var result = temp.Select(s => new
                        {
                            Id = s.Id,
                            Name = s.Name + " (" + context.Units.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Code == s.UnitCode)?.Name + ")",
                            TypeCode = s.Value2
                        }).ToList();

                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                            Result = result,
                            TotalRow = temp.Count,
                            Message = type
                        });
                    }
                    else
                    {
                        // Nếu chưa có loại tin tức thì tự thêm mới

                        var newTypeTemp = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Code && s.Value == model.Value && s.UnitCode == currentUnitCode);

                        if (!newTypeTemp.Any())
                        {
                            var sysMenu = context.SystemMenus.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Parameter == model.Value && x.MenuCode == "Web");

                            var item = new GeneralCategory()
                            {
                                CreateDate = DateTime.Now,
                                CreateUserId = User.Identity.GetUserId(),
                                Id = Guid.NewGuid(),
                                LanguageId = "vi",
                                Tag = "",
                                Status = StatusEnum.Used,
                                UpdateDate = DateTime.Now,
                                UpdateUserId = User.Identity.GetUserId(),
                                Value = model.Value,
                                Name = sysMenu?.Title,
                                Code = "NewsType",
                                UnitCode = currentUnitCode
                            };
                            context.GeneralCategories.Add(item);
                            context.SaveChanges();
                        }

                        var items = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Code && s.Value == model.Value);

                        items = items.Where(s => s.UnitCode.ToLower() == currentUnitCode.ToLower());

                        var temp = items.OrderBy(x => x.Name).ThenBy(x => x.UnitCode).ToList();

                        var result = temp.Select(s => new
                        {
                            Id = s.Id,
                            Name = s.Name,
                            TypeCode = s.Value2
                        }).ToList();

                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                            Result = result,
                            TotalRow = temp.Count,
                            Message = type
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

        [HttpPost]
        public IHttpActionResult ListGioiThieuHeThongChinhTri()
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    if (currentUnitCode == "LDG")
                    {
                        var items = context.SystemMenus.Where(s => s.Status != StatusEnum.Deleted && s.Action == "chi-tiet-tin-tuc");

                        var temp = items.OrderBy(x => x.Title).ThenBy(x => x.UnitCode).ToList();

                        var result = temp.Select(s => new
                        {
                            Id = s.Id,
                            Parameter = s.Parameter,
                            Name = s.Title + " (" + context.Units.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Code == s.UnitCode)?.Name + ")"
                        }).ToList();

                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                            Result = result,
                            TotalRow = temp.Count
                        });
                    }
                    else
                    {
                        var items = context.SystemMenus.Where(s => s.Status != StatusEnum.Deleted && s.Action == "chi-tiet-tin-tuc");

                        items = items.Where(s => s.UnitCode.ToLower() == currentUnitCode.ToLower());

                        var temp = items.OrderBy(x => x.Title).ThenBy(x => x.UnitCode).ToList();

                        var result = temp.Select(s => new
                        {
                            Id = s.Id,
                            Parameter = s.Parameter,
                            Name = s.Title
                        }).ToList();

                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                            Result = result,
                            TotalRow = temp.Count
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

        [HttpPost]
        public IHttpActionResult GetList(NewsModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var cmd = context.Database.Connection.CreateCommand();

                    DateTime? fromDate = null;
                    DateTime? toDate = null;

                    if (model.FromDate.HasValue)
                    {
                        string fromDateStr = model.FromDate.Value.ToLocalTime().ToString("dd/MM/yyyy");
                        fromDate = fromDateStr.ParseDate("dd/MM/yyyy");
                    }
                    if (model.ToDate.HasValue)
                    {
                        string toDateStr = model.ToDate.Value.ToLocalTime().ToString("dd/MM/yyyy") + " 23:59:59";
                        toDate = toDateStr.ParseDate("dd/MM/yyyy HH:mm:ss");
                    }

                    var codes = model.Code.Split('.');
                    var code = codes[0];
                    string type = null;
                    if (codes.Length > 1)
                    {
                        type = codes[1];
                    }
                    if (model.Code == "tin-tuc-khac")
                    {
                        fromDate = new DateTime(2000, 1, 1);
                        toDate = new DateTime(3000, 1, 1);
                    }
                    model.Code = code;
                    string userId = User.Identity.GetUserId();
                    var user = context.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);

                    if (User.IsInRole(RoleCode.SuperAdminSystem))
                    {
                        user.UnitCode = model.UnitCode;
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(user.UnitCode))
                        {
                            var unit = context.Units.FirstOrDefault(s => s.Id == user.UnitId && s.Status == StatusEnum.Used);

                            user.UnitCode = unit.Code;
                        }
                    }

                    if (!User.Identity.IsAuthenticated)
                    {
                        model.Status = StatusEnum.Used;
                    }

                    cmd.CommandText = "[dbo].[News_list]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_status", model.Status));
                    cmd.Parameters.Add(new SqlParameter("@p_code", model.Code));
                    cmd.Parameters.Add(new SqlParameter("@p_type", type));
                    cmd.Parameters.Add(new SqlParameter("@p_unitcode", user.UnitCode));
                    cmd.Parameters.Add(new SqlParameter("@p_date_from", (object)fromDate ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@p_date_to", (object)toDate ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@p_keyword", model.Keyword));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", model.PageIndex ?? 1));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", model.PageSize ?? 10));
                    var connection = context.Database.Connection;
                    if (connection.State != ConnectionState.Open)
                        connection.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        var resultTemp = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<NewsModel>(reader)
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
        public IHttpActionResult GetListDuyetTinTuc(NewsModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var cmd = context.Database.Connection.CreateCommand();

                    DateTime? fromDate = null;
                    DateTime? toDate = null;

                    if (model.FromDate.HasValue)
                    {
                        string fromDateStr = model.FromDate.Value.ToLocalTime().ToString("dd/MM/yyyy");
                        fromDate = fromDateStr.ParseDate("dd/MM/yyyy");
                    }
                    if (model.ToDate.HasValue)
                    {
                        string toDateStr = model.ToDate.Value.ToLocalTime().ToString("dd/MM/yyyy") + " 23:59:59";
                        toDate = toDateStr.ParseDate("dd/MM/yyyy HH:mm:ss");
                    }

                    //var codes = model.Code.Split('.');
                    //var code = codes[0];
                    string type = null;
                    //if (codes.Length > 1)
                    //{
                    //    type = codes[1];
                    //}
                    //if (model.Code == "tin-tuc-khac")
                    //{
                    //    fromDate = new DateTime(2000, 1, 1);
                    //    toDate = new DateTime(3000, 1, 1);
                    //}
                    //model.Code = code;
                    string userId = User.Identity.GetUserId();
                    var user = context.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);

                    string code = null;
                    user.UnitCode = model.UnitCode;

                    cmd.CommandText = "[dbo].[News_list_duyet_tin_tuc]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_code", code));
                    cmd.Parameters.Add(new SqlParameter("@p_type", type));
                    cmd.Parameters.Add(new SqlParameter("@p_unitcode", user.UnitCode));
                    cmd.Parameters.Add(new SqlParameter("@p_date_from", (object)fromDate ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@p_date_to", (object)toDate ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@p_keyword", model.Keyword));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", model.PageIndex ?? 1));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", model.PageSize ?? 10));
                    var connection = context.Database.Connection;
                    if (connection.State != ConnectionState.Open)
                        connection.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        var resultTemp = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<NewsModel>(reader)
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
        public IHttpActionResult Modify(NewsModel input)
        {
            try
            {
                // Check tiêu đề và nội dung
                var checkSensitiveContent = ContainsSensitiveContent(input.Title, input.Content);

                if (checkSensitiveContent)
                {
                    return Json(new ResultModel
                    {
                        Code = ResultCode.NotPermission,
                        Message = "Tiêu đề hoặc bài viết chứa nội dung không hợp lệ. Vui lòng kiểm tra lại!"
                    });
                }

                var codes = input.Code.Split('.');
                var code = codes[0];
                string type = null;
                if (codes.Length > 1)
                {
                    type = codes[1];
                }

                input.Code = code;

                using (var context = new WebDbContext())
                {
                    var userId = User.Identity.GetUserId();

                    var user = context.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);

                    var newsItem = context.News.FirstOrDefault(s => s.Id == input.Id && s.Status != StatusEnum.Deleted);

                    var newType = context.GeneralCategories.FirstOrDefault(s => s.Id == input.NewTypeId && s.Status != StatusEnum.Deleted);

                    input.UnitCode = newType != null ? newType.UnitCode : User.Identity.UnitCode();

                    // kiểm tra alias
                    input.Alias = input.Alias?.ToLower().RemoveUnicode().ReplaceRegex("", "-") ?? "";
                    if (string.IsNullOrEmpty(input.Alias))
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.DataNotEnough,
                            Message = "Alias không được để trống!"
                        });
                    }

                    // 
                    if (input.Code.ToUpper() == "TIN-TUC-KHAC")
                    {
                        var newTypeId = context.GeneralCategories.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Code == "NewsType" && s.Value.ToUpper() == input.Code.ToUpper() && s.UnitCode.ToUpper() == input.UnitCode.ToUpper());

                        if (newTypeId == null && input.UnitCode.ToUpper() == "LDG")
                        {
                            var systemMenus = context.SystemMenus.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Action == "chi-tiet-tin-tuc" && s.Id == input.NewTypeId);

                            if (systemMenus != null)
                            {
                                newTypeId = context.GeneralCategories.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Code == "NewsType" && s.Value.ToUpper() == input.Code.ToUpper() && s.UnitCode.ToUpper() == systemMenus.UnitCode.ToUpper());
                            }
                        }

                        input.NewTypeId = newTypeId?.Id;
                    }

                    input.Alias = input.Alias.Replace("-" + input.NewTypeId.Value.ToString(), "") + "-" + input.NewTypeId.Value.ToString();

                    if (newsItem == null)
                    {
                        var newsAlisa = context.News.FirstOrDefault(s =>
                            s.Status != StatusEnum.Deleted && s.Alias.ToLower() == input.Alias.ToLower() && s.Code.ToUpper() == input.Code.ToUpper() && s.UnitCode.ToUpper() == input.UnitCode.ToUpper());
                        if (newsAlisa != null)
                        {
                            return Json(new ResultModel
                            {
                                Code = ResultCode.DataNotEnough,
                                Message = "Alias đã tồn tại!"
                            });
                        }
                        var checkDuyetTin = SystemParameterDal.CheckDuyetTin(input.UnitCode);

                        newsItem = new News()
                        {
                            Id = Guid.NewGuid(),
                            NewTypeId = input.NewTypeId.Value,
                            Code = input.Code,
                            Alias = input.Alias,
                            Title = input.Title,
                            Content = input.Content,
                            Title_En = input.Title_En,
                            Content_En = input.Content_En,
                            Description = input.Description,
                            ImageUrl = input.ImageUrl,
                            ShortContent = input.ShortContent,
                            Order = input.Order,
                            CountView = 0,
                            CreateDate = DateTime.ParseExact(input.StrCreateDate, "dd/MM/yyyy HH:mm:ss",
                                    CultureInfo.InvariantCulture),

                            Status = checkDuyetTin ? StatusEnum.NotReadyOrPending : StatusEnum.Used,
                            CreateUserId = User.Identity.GetUserId(),
                            UnitCode = input.UnitCode,
                            LanguageId = "vi",
                            IsOpenBlankPage = input.IsOpenBlankPage,
                            IsNewsImage = input.IsNewsImage,
                            IsOpenImageOnly = input.IsOpenImageOnly,
                            OtherUrl = input.OtherUrl
                        };

                        //khi tk có unitcode là PHONGGDDT thì tin đăng k cần duyệt và ngược lại
                        var isDuyetTinTuTruong = SystemParameterDal.CheckDuyetTinTuTruong(input.UnitCode);

                        context.News.Add(newsItem);
                        context.SaveChanges();

                        var newModel = newsItem.Clone();
                        HistoryDal.Write(User.Identity.GetUserId(), "News", HistoryActionEnum.Add, newsItem.Id, null, newModel, GetClientIp(), context: context);

                        if (!checkDuyetTin && input.UnitCode != "PHONGGDDT")
                        {
                            if (string.IsNullOrEmpty(input.Description)) //Phòng truyền thống thêm nhiều hình ảnh liên quan
                            {     
                                var newPHONGGDDT = newsItem.Clone();

                                var unit = context.Units.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Code == newsItem.UnitCode);

                                var generalCategory = context.GeneralCategories.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Value == "tin-tuc-tu-truong" && x.UnitCode == "PHONGGDDT");

                                if(generalCategory != null)
                                {
                                    newPHONGGDDT.Id = Guid.NewGuid();
                                    newPHONGGDDT.NewTypeId = generalCategory.Id;
                                    newPHONGGDDT.Code = "tin-tuc-tu-truong";
                                    newPHONGGDDT.Title = newPHONGGDDT.Title + " - " + unit?.Name;
                                    newPHONGGDDT.Alias = newPHONGGDDT.Alias + "-" + newPHONGGDDT.UnitCode.ToLower();
                                    newPHONGGDDT.CreateUserId = User.Identity.GetUserId();
                                    newPHONGGDDT.UnitCode = "PHONGGDDT";
                                    newPHONGGDDT.CountView = 0;
                                    newPHONGGDDT.Status = isDuyetTinTuTruong ? StatusEnum.Used : StatusEnum.NotReadyOrPending;

                                    context.News.Add(newPHONGGDDT);
                                    context.SaveChanges();
                                }    
                            }
                        }
                    }
                    else
                    {
                        var oldModel = newsItem.Clone();

                        var newsAlisa = context.News.FirstOrDefault(s => s.Id != newsItem.Id &&
                            s.Status != StatusEnum.Deleted && s.Alias.ToLower() == input.Alias.ToLower() && s.Code.ToUpper() == input.Code.ToUpper() && s.UnitCode.ToUpper() == input.UnitCode.ToUpper());

                        if (newsAlisa != null)
                        {
                            return Json(new ResultModel
                            {
                                Code = ResultCode.DataNotEnough,
                                Message = "Alias đã tồn tại!"
                            });
                        }

                        newsItem.NewTypeId = input.NewTypeId.Value;
                        newsItem.Code = input.Code;
                        newsItem.Alias = input.Alias;
                        newsItem.Title = input.Title;
                        newsItem.Content = input.Content;
                        newsItem.Title_En = input.Title_En;
                        newsItem.Content_En = input.Content_En;
                        newsItem.ImageUrl = input.ImageUrl;
                        newsItem.ShortContent = input.ShortContent;
                        newsItem.Description = input.Description;
                        newsItem.IsOpenBlankPage = input.IsOpenBlankPage;
                        newsItem.IsNewsImage = input.IsNewsImage;
                        newsItem.IsOpenImageOnly = input.IsOpenImageOnly;
                        newsItem.OtherUrl = input.OtherUrl;
                        newsItem.CreateDate = DateTime.ParseExact(input.StrCreateDate, "dd/MM/yyyy HH:mm:ss",
                                CultureInfo.InvariantCulture);

                        newsItem.UpdateUserId = User.Identity.GetUserId();
                        newsItem.UpdateDate = DateTime.Now;
                        newsItem.UnitCode = input.UnitCode;
                        newsItem.LanguageId = "vi";
                        var checkDuyetTin = SystemParameterDal.CheckDuyetTin(input.UnitCode);
                        if (checkDuyetTin)
                        {
                            newsItem.Status = StatusEnum.NotReadyOrPending;
                        }
                        else
                        {
                            newsItem.Status = StatusEnum.Used;
                        }
                        context.Entry(newsItem).State = EntityState.Modified;

                        context.SaveChanges();

                        var newModel = newsItem.Clone();
                        HistoryDal.Write(User.Identity.GetUserId(), "News", HistoryActionEnum.Edit, newsItem.Id, oldModel, newModel, GetClientIp(), context: context);
                    }

                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.UnknowError,
                    Message = "Đã có lỗi xảy ra. Vui lòng thử lại sau",
                    Result = e.Message
                });
            }
        }

        public static bool ContainsSensitiveContent(string title, string content)
        {
            var sensitiveWords = SystemParameterDal.GetParameter("SensitiveWords");
            if (sensitiveWords != null)
            {
                string[] words = sensitiveWords.Value2.Split(',');

                foreach (var word in words)
                {
                    string pattern = $@"\b{Regex.Escape(word.Trim())}\b";

                    if (Regex.IsMatch(title, pattern, RegexOptions.IgnoreCase))
                    {
                        return true;
                    }

                    if (Regex.IsMatch(content, pattern, RegexOptions.IgnoreCase))
                    {
                        return true;
                    }
                }
                return false;
            }
            else
            {
                return false;
            }
        }

        [HttpPost]
        public IHttpActionResult Delete(NewsModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var newsItem = context.News.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
                    if (newsItem == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "Tin tức không tồn tại",
                            Result = null
                        });
                    }
                    var oldModel = newsItem.Clone();
                    newsItem.Status = StatusEnum.Deleted;
                    newsItem.UpdateDate = DateTime.Now;
                    newsItem.UpdateUserId = User.Identity.GetUserId();
                    context.Entry(newsItem).State = EntityState.Modified;

                    context.SaveChanges();

                    var newModel = newsItem.Clone();
                    HistoryDal.Write(User.Identity.GetUserId(), "News", HistoryActionEnum.Delete, newsItem.Id, oldModel, newModel, GetClientIp());

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
        [HttpPost]
        public IHttpActionResult DeleteMultiple(NewsModel model)
        {
            try
            {
                if (model.Ids == null || !model.Ids.Any())
                {
                    return Json(new ResultModel
                    {
                        Code = ResultCode.DataNotEnough,
                        Message = "Danh sách Id không được để trống"
                    });
                }

                using (var context = new WebDbContext())
                {
                    var newsItems = context.News
                        .Where(s => model.Ids.Contains(s.Id) && s.Status != StatusEnum.Deleted)
                        .ToList();

                    if (!newsItems.Any())
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "Không tìm thấy tin tức nào để xoá"
                        });
                    }

                    var userId = User.Identity.GetUserId();
                    var now = DateTime.Now;
                    int successCount = 0;

                    foreach (var newsItem in newsItems)
                    {
                        var oldModel = newsItem.Clone();
                        newsItem.Status = StatusEnum.Deleted;
                        newsItem.UpdateDate = now;
                        newsItem.UpdateUserId = userId;
                        context.Entry(newsItem).State = EntityState.Modified;
                        context.SaveChanges();

                        var newModel = newsItem.Clone();
                        HistoryDal.Write(userId, "News", HistoryActionEnum.Delete, newsItem.Id, oldModel, newModel, GetClientIp());
                        successCount++;
                    }

                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Message = $"Đã xoá thành công {successCount} tin tức",
                        Result = successCount
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
        public IHttpActionResult DuyetTinTuc(NewsModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var newsItem = context.News.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
                    if (newsItem == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "Tin tức không tồn tại",
                            Result = null
                        });
                    }
                    var oldModel = newsItem.Clone();
                    if (model.Code == "1")
                    {
                        newsItem.Tag = "DADUYET";
                    }
                    else
                    {
                        newsItem.Tag = "BODUYET";
                    }

                    context.Entry(newsItem).State = EntityState.Modified;

                    context.SaveChanges();

                    var newModel = newsItem.Clone();

                    if (model.Code == "1")
                    {
                        var unit = context.Units.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Code == newsItem.UnitCode);

                        var generalCategory = context.GeneralCategories.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Value == "tin-tuc-tu-truong" && x.UnitCode == "PHONGGDDT");

                        newModel.Id = Guid.NewGuid();
                        newModel.NewTypeId = generalCategory.Id;
                        newModel.Code = "tin-tuc-tu-truong";
                        newModel.Title = newModel.Title + " - " + unit?.Name;
                        newModel.Alias = newModel.Alias + "-" + newsItem.UnitCode.ToLower();
                        newModel.CreateUserId = User.Identity.GetUserId();
                        newModel.UnitCode = "PHONGGDDT";
                        newModel.CountView = 0;

                        context.News.Add(newModel);
                        context.SaveChanges();
                    }

                    HistoryDal.Write(User.Identity.GetUserId(), "News", HistoryActionEnum.Other, newsItem.Id, oldModel, newModel, GetClientIp());

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

        [HttpPost]
        public IHttpActionResult DuyetTin(NewsModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var newsItem = context.News.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
                    if (newsItem == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "Tin tức không tồn tại",
                            Result = null
                        });
                    }

                    var text = "";
                    if (newsItem.Status == StatusEnum.Used)
                    {
                        newsItem.Status = StatusEnum.NotReadyOrPending;
                        text = $"{User.Identity.GetUserName()} hủy duyệt tin bài";
                    }
                    else
                    {
                        newsItem.Status = StatusEnum.Used;
                        text = $"{User.Identity.GetUserName()} duyệt tin bài";
                    }
                    newsItem.UpdateDate = DateTime.Now;
                    newsItem.UpdateUserId = User.Identity.GetUserId();
                    context.Entry(newsItem).State = EntityState.Modified;
                    context.SaveChanges();
                    var newModel = newsItem.Clone();
                    HistoryDal.Write(User.Identity.GetUserId(), "News", HistoryActionEnum.Edit, newsItem.Id, null, newModel, GetClientIp(), note: new OtherFromHistory() { Description = text });
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

        /// <summary>
        /// Danh sách phiên bản (lịch sử dữ liệu) của một bài viết, đọc từ bảng Histories. Chỉ SuperAdminSystem.
        /// </summary>
        [HttpPost]
        public IHttpActionResult Histories(NewsHistoryInput model)
        {
            try
            {
                if (!User.IsInRole(RoleCode.SuperAdminSystem))
                {
                    return Json(new ResultModel { Code = ResultCode.UnSuccess, Message = "Bạn không có quyền xem lịch sử dữ liệu" });
                }
                using (var context = new WebDbContext())
                {
                    var items = (from h in context.Histories
                                 where h.TableName == "News" && h.ItemId == model.Id
                                 join u in context.Users on h.CreateUserId equals u.Id into users
                                 from u in users.DefaultIfEmpty()
                                 orderby h.CreateDate descending
                                 select new
                                 {
                                     h.Id,
                                     h.Action,
                                     h.CreateDate,
                                     h.CurrentIp,
                                     h.Description,
                                     UserName = u.UserName,
                                     FirstName = u.FirstName,
                                     LastName = u.LastName
                                 }).ToList()
                        .Select(h => new
                        {
                            h.Id,
                            Action = (int)h.Action,
                            CreateDate = h.CreateDate.ToString("dd/MM/yyyy HH:mm:ss"),
                            h.CurrentIp,
                            Note = ReadHistoryNote(h.Description),
                            UserName = h.UserName,
                            FullName = $"{h.LastName} {h.FirstName}".Trim()
                        })
                        .ToList();

                    return Json(new ResultModel { Code = ResultCode.Success, Result = items, TotalRow = items.Count });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel { Code = ResultCode.UnknowError, Message = e.Message });
            }
        }

        /// <summary>
        /// Dữ liệu trước/sau của một phiên bản. Nếu phiên bản không lưu dữ liệu cũ (thêm mới, đổi trạng thái...)
        /// thì so với phiên bản liền trước của cùng bài viết. Chỉ SuperAdminSystem.
        /// </summary>
        [HttpPost]
        public IHttpActionResult HistoryDetail(NewsHistoryInput model)
        {
            try
            {
                if (!User.IsInRole(RoleCode.SuperAdminSystem))
                {
                    return Json(new ResultModel { Code = ResultCode.UnSuccess, Message = "Bạn không có quyền xem lịch sử dữ liệu" });
                }
                using (var context = new WebDbContext())
                {
                    var history = context.Histories.FirstOrDefault(s => s.Id == model.Id && s.TableName == "News");
                    if (history == null)
                    {
                        return Json(new ResultModel { Code = ResultCode.UnSuccess, Message = "Không tìm thấy phiên bản" });
                    }

                    var oldVersion = history.OldVersion;
                    var comparedWithPrevious = false;
                    if (IsEmptyVersion(oldVersion))
                    {
                        oldVersion = context.Histories
                            .Where(s => s.TableName == "News" && s.ItemId == history.ItemId && s.CreateDate < history.CreateDate
                                        && s.NewVersion != null && s.NewVersion != "null")
                            .OrderByDescending(s => s.CreateDate)
                            .Select(s => s.NewVersion)
                            .FirstOrDefault();
                        comparedWithPrevious = !IsEmptyVersion(oldVersion);
                    }

                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = new
                        {
                            history.Id,
                            Action = (int)history.Action,
                            OldVersion = IsEmptyVersion(oldVersion) ? null : oldVersion,
                            NewVersion = IsEmptyVersion(history.NewVersion) ? null : history.NewVersion,
                            ComparedWithPrevious = comparedWithPrevious
                        }
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel { Code = ResultCode.UnknowError, Message = e.Message });
            }
        }

        private static bool IsEmptyVersion(string version)
        {
            return string.IsNullOrWhiteSpace(version) || version == "null" || version == "{}";
        }

        private static string ReadHistoryNote(string description)
        {
            if (IsEmptyVersion(description))
            {
                return null;
            }
            try
            {
                return Newtonsoft.Json.Linq.JObject.Parse(description).Value<string>("Description");
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Tìm bài viết theo alias (lấy từ link ngoài portal) để mở đúng menu quản trị và bài viết.
        /// UnitCode: mã cổng trong link; SuperAdminSystem tìm được mọi đơn vị, tài khoản khác chỉ đơn vị của mình.
        /// </summary>
        [HttpPost]
        public IHttpActionResult FindByAlias(NewsModel model)
        {
            try
            {
                var alias = (model.Alias ?? "").Trim();
                if (string.IsNullOrEmpty(alias))
                {
                    return Json(new ResultModel { Code = ResultCode.DataNotEnough, Message = "Thiếu đường dẫn bài viết" });
                }
                using (var context = new WebDbContext())
                {
                    string userId = User.Identity.GetUserId();
                    var user = context.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);
                    var isSuperAdmin = User.IsInRole(RoleCode.SuperAdminSystem);
                    var userUnitCode = user?.UnitCode;
                    if (!isSuperAdmin && string.IsNullOrEmpty(userUnitCode) && user != null)
                    {
                        userUnitCode = context.Units.FirstOrDefault(s => s.Id == user.UnitId && s.Status == StatusEnum.Used)?.Code;
                    }

                    var news = context.News.Where(s => s.Status != StatusEnum.Deleted && s.Alias == alias);
                    if (!string.IsNullOrEmpty(model.UnitCode))
                    {
                        var portalCode = model.UnitCode.ToLower();
                        news = news.Where(s => s.UnitCode.ToLower() == portalCode);
                    }
                    if (!isSuperAdmin)
                    {
                        var unitCode = (userUnitCode ?? "").ToLower();
                        news = news.Where(s => s.UnitCode.ToLower() == unitCode);
                    }

                    var item = news.OrderByDescending(s => s.CreateDate).FirstOrDefault();
                    if (item == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.UnSuccess,
                            Message = "Không tìm thấy bài viết hoặc bài viết thuộc đơn vị khác"
                        });
                    }

                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = new
                        {
                            item.Id,
                            item.Code,
                            item.NewTypeId,
                            item.UnitCode,
                            item.Title,
                            item.CreateDate
                        }
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel { Code = ResultCode.UnknowError, Message = e.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult ChangeStatus(NewsModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var newsItem = context.News.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
                    if (newsItem == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "Tin tức không tồn tại",
                            Result = null
                        });
                    }
                    var checkDuyetTin = SystemParameterDal.CheckDuyetTin(newsItem.UnitCode);
                    if (checkDuyetTin)
                    {
                        newsItem.Status = StatusEnum.CDC_ChuaCoKQXN;
                    }
                    else
                    {
                        newsItem.Status = newsItem.Status == StatusEnum.CDC_ChuaCoKQXN ? StatusEnum.CDC_DaCoKQXN : StatusEnum.CDC_ChuaCoKQXN;
                    }
                    newsItem.UpdateDate = DateTime.Now;
                    newsItem.UpdateUserId = User.Identity.GetUserId();
                    context.Entry(newsItem).State = EntityState.Modified;

                    context.SaveChanges();

                    var newModel = newsItem.Clone();
                    HistoryDal.Write(User.Identity.GetUserId(), "News", HistoryActionEnum.Edit, newsItem.Id, null, newModel, GetClientIp(), note: new OtherFromHistory() { Description = $"{User.Identity.GetUserName()} tắt xem tin bài" });

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
    }

}
