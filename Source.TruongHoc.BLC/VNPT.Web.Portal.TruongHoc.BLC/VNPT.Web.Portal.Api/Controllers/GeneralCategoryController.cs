using System;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using DocumentFormat.OpenXml.Office2010.Word;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.AspNet.Identity;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    [VnptAuthorization]
    public class GeneralCategoryController : BaseApiController
    {
        [HttpPost]
        public IHttpActionResult Items(GeneralCategoryModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var items = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Code);
                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        model.Keyword = model.Keyword.ToLower();
                        items = items.Where(s => s.Name.ToLower().Contains(model.Keyword) || s.Value.ToLower().Contains(model.Keyword));
                    }
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    if (currentUnitCode == "LDG" || model.Code == "MenuType")
                    {
                        if (!string.IsNullOrEmpty(model.UnitCode))
                        {
                            items = items.Where(s => s.UnitCode.ToLower() == model.UnitCode.ToLower());
                        }
                    }
                    else
                    {
                        items = items.Where(s => s.UnitCode.ToLower() == currentUnitCode.ToLower());
                    }
                    items = items.OrderBy(s=>s.OrderNo).ThenByDescending(s => s.UpdateDate).ThenByDescending(s => s.CreateDate);
                    var temp = items.ToList();
                    var result = temp.Paging(model).Select(s => new GeneralCategoryModel(s)).ToList().OrderBy(x=>x.Name);

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        TotalRow = temp.Count
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
        public IHttpActionResult SearchItems(GeneralCategoryModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var items = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Code);
                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        model.Keyword = model.Keyword.ToLower();
                        items = items.Where(s => s.Name.ToLower().Contains(model.Keyword));
                    }
                    items = items.OrderBy(s => s.OrderNo).ThenByDescending(s => s.UpdateDate).ThenByDescending(s => s.CreateDate);
                    var temp = items.ToList();
                    var result = temp.Paging(model).Select(s => new GeneralCategoryModel(s)).ToList();

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        TotalRow = temp.Count
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
        public IHttpActionResult SearchItemsByUnitCode(GeneralCategoryModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");

                    var items = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Code.ToLower() && s.UnitCode.ToLower() == currentUnitCode.ToLower());
                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        model.Keyword = model.Keyword.ToLower();
                        items = items.Where(s => s.Name.ToLower().Contains(model.Keyword));
                    }
                    items = items.OrderBy(s => s.OrderNo).ThenByDescending(s => s.UpdateDate).ThenByDescending(s => s.CreateDate);
                    var temp = items.ToList();
                    var result = temp.Paging(model).Select(s => new GeneralCategoryModel(s)).ToList();

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        TotalRow = temp.Count
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

        private void SaveFileMedia(HttpFileCollection files, GeneralCategory entity)
        {
            if(files.Count > 0)
            {
                var postedFile = files[0];
                var path = $"/Files/MediaFile/{entity.UnitCode}/{entity.Code}";

                if (!Directory.Exists(HttpContext.Current.Server.MapPath(path)))
                {
                    Directory.CreateDirectory(HttpContext.Current.Server.MapPath(path));
                }

                entity.Value2 = postedFile.FileName;
                entity.Value = path;
                if (postedFile != null && postedFile.ContentLength > 0)
                {
                    string fullPath = Path.Combine(HttpContext.Current.Server.MapPath(path), postedFile.FileName);
                    entity.Value2 = postedFile.FileName;
                    postedFile.SaveAs(fullPath);
                }
            }
        }

        [HttpPost]
        public IHttpActionResult UpdateCategory()
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    using (var trans = context.Database.BeginTransaction())
                    {
                        var httpRequest = HttpContext.Current.Request;
                        var id = new Guid(HttpContext.Current.Request["Id"]);
                        var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                        var item = context.GeneralCategories.FirstOrDefault(s => s.Id == id && s.Status != StatusEnum.Deleted && s.UnitCode.ToLower() == currentUnitCode.ToLower());
                        if (item == null)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.DataNotEnough,
                                Message = "Tham số không tồn tại hoặc bị xoá"
                            });
                        }
                        
                        SaveFileMedia(httpRequest.Files, item);

                        context.Entry(item).State = EntityState.Modified;

                        context.SaveChanges();
                        
                        trans.Commit();
                    }
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success
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
        public IHttpActionResult Save(GeneralCategoryModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    using (var trans = context.Database.BeginTransaction())
                    {
                        var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                        if (currentUnitCode != "LDG" && model.UnitCode != currentUnitCode)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.DataNotEnough,
                                Message = "Tài khoản không có quyền chỉnh sửa thuộc tính này!"
                            });
                        }
                        if (model.Id.HasValue)
                        {
                            var id = model.Id;
                            var item =
                                context.GeneralCategories.FirstOrDefault(s => s.Id == id && s.Status != StatusEnum.Deleted);
                            if (item == null)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.DataNotEnough,
                                    Message = "Đơn vị không tồn tại hoặc bị xoá"
                                });
                            }
                            item.Value = model.Value;
                            item.Name = model.Name;
                            item.Name_En = model.Name_En;
                            item.Value2 = model.Value2;
                            item.ImageUrl = model.ImageUrl;
                            item.Description = model.Description;
                            item.Code = model.Code;
                            item.UnitCode = model.UnitCode;
                            context.Entry(item).State = EntityState.Modified;
                            context.SaveChanges();
                            //HistoryDal.Write(User.Identity.GetUserId(), "Fields", HistoryActionEnum.Edit, item.Id, oldModel, newModel, GetClientIp(), context: context);
                        }
                        else
                        {
                            // Check tồn tại hay chưa
                            if (model.Code == "NewsType")
                            {
                                var checkGeneralCategory = context.GeneralCategories.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.Code == model.Code && x.Value == model.Value && x.UnitCode == model.UnitCode);

                                if (checkGeneralCategory != null)
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.Duplication
                                    });
                                }
                            }

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
                                Name = model.Name,
                                Name_En = model.Name_En,
                                Value2 = model.Value2,
                                ImageUrl = model.ImageUrl,
                                Description = model.Description,
                                Code = model.Code,
                                UnitCode = model.UnitCode
                            };
                            context.GeneralCategories.Add(item);
                            context.SaveChanges();
                            //HistoryDal.Write(User.Identity.GetUserId(), "Fields", HistoryActionEnum.Add, item.Id, null, newModel, GetClientIp(), context: context);
                        }
                        trans.Commit();
                    }
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success
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
        public IHttpActionResult Delete(UnitModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var unit = context.GeneralCategories.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
                    if (unit == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "Đơn vị không tồn tại",
                            Result = null
                        });
                    }
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    if (currentUnitCode.ToLower() != "LDG".ToLower() && unit.UnitCode.ToLower() != currentUnitCode)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Bạn không có quyền xóa chức vụ này!"
                        });
                    }
                    unit.Status = StatusEnum.Deleted;
                    unit.UpdateDate = DateTime.Now;
                    unit.UpdateUserId = User.Identity.GetUserId();
                    context.Entry(unit).State = EntityState.Modified;
                    context.SaveChanges();
                    //HistoryDal.Write(User.Identity.GetUserId(), "Fields", HistoryActionEnum.Delete, unit.Id, null, newModel, GetClientIp());
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
