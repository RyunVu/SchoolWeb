using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Media.DAL;
using VNPT.Core.Media.DAL.Models;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    public class ShareController : BaseApiController
    {
        [HttpPost]
        public IHttpActionResult GetListNewsType(GeneralCategoryModel model)
        {
            try
            {
                if (model.Token == "Oep5jLUrU0Z8HQ53aEuyPjtQVTcUz5hfVvvVxyEm1PLXZKdSTTp0O3xh3jKPsB8g4gs50vQ9eclzqSMZcEs1uiAXRhyAAZcw2DivSrlb5tHw6setsm9le112jX9btaLiG5jsC38d9VC1eTXGloId74Fk9rLkym0C3owsxco2CD7ZypX9kVChAq5poA5RXOfzYYztsJ16")
                {
                    using (var context = new WebDbContext())
                    {
                        if (model != null && !string.IsNullOrEmpty(model.UnitCode))
                        {
                            var items = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == "NewsType" && s.UnitCode == model.UnitCode);

                            items = items.OrderBy(s => s.OrderNo).ThenByDescending(s => s.UpdateDate).ThenByDescending(s => s.CreateDate);
                            var temp = items.ToList();
                            var result = temp.Paging(model).Select(s => new GeneralCategoryModel(s)).ToList().OrderBy(x => x.Name);

                            return Json(new ResultModel()
                            {
                                Code = ResultCode.Success,
                                Result = result,
                                TotalRow = temp.Count,
                                Message = "Lấy danh sách thành công!",
                            });
                        }
                        else
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.Exception,
                                Message = "Chưa nhập đơn vị 'UnitCode'!",
                            });
                        }
                    }
                }
                else
                {
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.NoPermission,
                        Message = "Không có quyền truy cập!"
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
        public IHttpActionResult InsertNews(NewsModel input)
        {
            try
            {
                if (input.Token == "Oep5jLUrU0Z8HQ53aEuyPjtQVTcUz5hfVvvVxyEm1PLXZKdSTTp0O3xh3jKPsB8g4gs50vQ9eclzqSMZcEs1uiAXRhyAAZcw2DivSrlb5tHw6setsm9le112jX9btaLiG5jsC38d9VC1eTXGloId74Fk9rLkym0C3owsxco2CD7ZypX9kVChAq5poA5RXOfzYYztsJ16")
                {

                    var codes = input.Code.Split('.');
                    var code = codes[0];
                    string type = null;
                    if (codes.Length > 1)
                    {
                        type = codes[1];
                    }

                    input.Code = code;
                    var defaultLanguage = "vi";

                    using (var context = new WebDbContext())
                    {
                        var userId = "10ecdf16-04ec-4f3a-8573-1ac429c7d0db"; // Superadmin

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
                                Description = "Get data by Web",
                                ImageUrl = input.ImageUrl,
                                ShortContent = input.ShortContent,
                                Order = input.Order,
                                CountView = 0,
                                CreateDate = DateTime.ParseExact(input.StrCreateDate, "dd/MM/yyyy HH:mm:ss",
                                        CultureInfo.InvariantCulture),

                                Status = StatusEnum.Used,
                                CreateUserId = userId,
                                UnitCode = input.UnitCode,
                                LanguageId = "vi",
                                IsOpenBlankPage = input.IsOpenBlankPage,
                                IsNewsImage = input.IsNewsImage,
                                IsOpenImageOnly = input.IsOpenImageOnly,
                                OtherUrl = input.OtherUrl
                            };
                            context.News.Add(newsItem);
                            context.SaveChanges();

                            var newModel = newsItem.Clone();
                            HistoryDal.Write(userId, "News", HistoryActionEnum.Add, newsItem.Id, null, newModel, GetClientIp(), context: context);
                        }
                        //else
                        //{
                        //    var oldModel = newsItem.Clone();

                        //    var newsAlisa = context.News.FirstOrDefault(s => s.Id != newsItem.Id &&
                        //        s.Status != StatusEnum.Deleted && s.Alias.ToLower() == input.Alias.ToLower() && s.Code.ToUpper() == input.Code.ToUpper() && s.UnitCode.ToUpper() == input.UnitCode.ToUpper());

                        //    if (newsAlisa != null)
                        //    {
                        //        return Json(new ResultModel
                        //        {
                        //            Code = ResultCode.DataNotEnough,
                        //            Message = "Alias đã tồn tại!"
                        //        });
                        //    }

                        //    newsItem.NewTypeId = input.NewTypeId.Value;
                        //    newsItem.Code = input.Code;
                        //    newsItem.Alias = input.Alias;
                        //    newsItem.Title = input.Title;
                        //    newsItem.Content = input.Content;
                        //    newsItem.Title_En = input.Title_En;
                        //    newsItem.Content_En = input.Content_En;
                        //    newsItem.ImageUrl = input.ImageUrl;
                        //    newsItem.ShortContent = input.ShortContent;
                        //    newsItem.Description = input.Description;
                        //    newsItem.IsOpenBlankPage = input.IsOpenBlankPage;
                        //    newsItem.IsNewsImage = input.IsNewsImage;
                        //    newsItem.IsOpenImageOnly = input.IsOpenImageOnly;
                        //    newsItem.OtherUrl = input.OtherUrl;
                        //    newsItem.CreateDate = DateTime.ParseExact(input.StrCreateDate, "dd/MM/yyyy HH:mm:ss",
                        //            CultureInfo.InvariantCulture);

                        //    newsItem.UpdateUserId = userId;
                        //    newsItem.UpdateDate = DateTime.Now;
                        //    newsItem.UnitCode = input.UnitCode;
                        //    newsItem.LanguageId = "vi";
                        //    var checkDuyetTin = SystemParameterDal.CheckDuyetTin(input.UnitCode);
                        //    if (checkDuyetTin)
                        //    {
                        //        newsItem.Status = StatusEnum.NotReadyOrPending;
                        //    }
                        //    else
                        //    {
                        //        newsItem.Status = StatusEnum.Used;
                        //    }
                        //    context.Entry(newsItem).State = EntityState.Modified;

                        //    context.SaveChanges();

                        //    var newModel = newsItem.Clone();
                        //    HistoryDal.Write(userId, "News", HistoryActionEnum.Edit, newsItem.Id, oldModel, newModel, GetClientIp(), context: context);
                        //}

                        return Json(new ResultModel
                        {
                            Code = ResultCode.Success,
                            Message = "Thêm thành công!"
                        });
                    }
                }
                else
                {
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.NoPermission,
                        Message = "Không có quyền truy cập!"
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

        [HttpPost]
        public IHttpActionResult CheckExistNews(NewsModel input)
        {
            try
            {
                if (input.Token == "Oep5jLUrU0Z8HQ53aEuyPjtQVTcUz5hfVvvVxyEm1PLXZKdSTTp0O3xh3jKPsB8g4gs50vQ9eclzqSMZcEs1uiAXRhyAAZcw2DivSrlb5tHw6setsm9le112jX9btaLiG5jsC38d9VC1eTXGloId74Fk9rLkym0C3owsxco2CD7ZypX9kVChAq5poA5RXOfzYYztsJ16")
                {

                    var codes = input.Code.Split('.');
                    var code = codes[0];
                    string type = null;
                    if (codes.Length > 1)
                    {
                        type = codes[1];
                    }

                    input.Code = code;
                    var defaultLanguage = "vi";

                    using (var context = new WebDbContext())
                    {
                        var userId = "10ecdf16-04ec-4f3a-8573-1ac429c7d0db"; // Superadmin

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

                        return Json(new ResultModel
                        {
                            Code = ResultCode.Success,
                            Message = "Bạn có thể thêm tin tức này!"
                        });
                    }
                }
                else
                {
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.NoPermission,
                        Message = "Không có quyền truy cập!"
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

        [HttpPost]
        public async Task<IHttpActionResult> UploadAttachment()
        {
            //var userId = "10ecdf16-04ec-4f3a-8573-1ac429c7d0db"; // Superadmin
            try
            {
                using (var context = new WebDbContext())
                {
                    var token = HttpContext.Current.Request["Token"];

                    var unitCode = HttpContext.Current.Request["UnitCode"];

                    if (unitCode != null && !string.IsNullOrEmpty(unitCode))
                    {

                        if (token == "Oep5jLUrU0Z8HQ53aEuyPjtQVTcUz5hfVvvVxyEm1PLXZKdSTTp0O3xh3jKPsB8g4gs50vQ9eclzqSMZcEs1uiAXRhyAAZcw2DivSrlb5tHw6setsm9le112jX9btaLiG5jsC38d9VC1eTXGloId74Fk9rLkym0C3owsxco2CD7ZypX9kVChAq5poA5RXOfzYYztsJ16")
                        {
                            //var curUser = context.Users.FirstOrDefault(u => u.Id == userId);

                            var files = HttpContext.Current.Request.Files;

                            if (files.Count == 0)
                            {
                                return Json(new ResultModel
                                {
                                    Code = ResultCode.Exception,
                                    Result = "Không có tập tin nào được upload lên!",
                                });
                            }

                            var curUserByUnitCode = context.Users.FirstOrDefault(u => u.FirstName == "Admin" && u.LastName == "Super");

                            var res = await UploadToMedia(files, curUserByUnitCode.UserName, curUserByUnitCode.Id);

                            return Json(new ResultModel()
                            {
                                Code = ResultCode.Success,
                                Result = res,
                            });
                        }
                        else
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.NoPermission,
                                Message = "Không có quyền truy cập!"
                            });
                        }
                    }
                    else
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Exception,
                            Message = "Chưa nhập đơn vị 'UnitCode'!",
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

        public static async Task<List<FileModel>> UploadToMedia(HttpFileCollection files, string folderName, string userId)
        {
            try
            {
                List<FileModel> imageModels = new List<FileModel>();

                var imageResult = await MediaService.UploadFile(new UploadFileModel()
                {
                    FileType = "all",
                    Files = files,
                    FolderId = null,
                    FolderName = folderName,
                    HasThumb = false,
                    UserId = userId,
                    //IsAnonymous = false
                });

                if (imageResult.Code == ResultCode.Success)
                {
                    imageModels = JsonConvert.DeserializeObject<List<FileModel>>(imageResult.Result.ToString());
                }
                else
                {
                    imageModels.Add(new FileModel()
                    {
                        Name = "Lỗi: " + imageResult.Message
                    });
                }

                return imageModels;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
