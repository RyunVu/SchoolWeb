using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;
using VNPT.Web.Portal.Base.Dal;

namespace VNPT.Web.Portal.Api.Controllers
{
    public class PositionController : BaseApiController
    {
        [HttpPost]
        public IHttpActionResult List(UserSearchModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var units = context.Positions.Where(s => s.Status != StatusEnum.Deleted);
                  

                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        model.Keyword = model.Keyword.ToLower().Trim();
                        units = units.Where(s => s.Name.ToLower().Contains(model.Keyword) || s.Code.ToLower().Contains(model.Keyword));
                    }
                    var resultTemp = units.OrderByDescending(s => s.CreateDate).ThenBy(s => s.Name).ToList();
                    var result = resultTemp.Paging(model).Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Code,
                        s.Description,
                        s.OrderNo
                    }).ToList();
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        TotalRow = resultTemp.Count
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
        public IHttpActionResult Delete(UnitModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var unit = context.Positions.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);

                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");

                    if (unit == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "Chức vụ không tồn tại",
                            Result = null
                        });
                    }

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
                    var newModel = unit.Clone();
                    HistoryDal.Write(User.Identity.GetUserId(), "Positions", HistoryActionEnum.Delete, unit.Id, null, newModel, GetClientIp());
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
        public IHttpActionResult Save(PositionModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    using (var trans = context.Database.BeginTransaction())
                    {
                        var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");

                        if (string.IsNullOrEmpty(model.Name))
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = @"Tên không được để trống!"
                            });
                        }


                        if (model.Id.HasValue)
                        {
                            var id = model.Id;
                            var item =
                                context.Positions.FirstOrDefault(s => s.Id == id && s.Status != StatusEnum.Deleted);
                            if (item == null)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.DataNotEnough,
                                    Message = "Chức vụ không tồn tại hoặc bị xoá"
                                });
                            }
                            if (currentUnitCode.ToLower() != "LDG".ToLower() && item.UnitCode.ToLower() != currentUnitCode)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Bạn không có quyền chỉnh chức vụ này!"
                                });
                            }

                            var oldModel = item.Clone();
                            item.Name = model.Name;
                            item.Code = model.Code;
                            //item.UnitCode = currentUnitCode;
                            item.OrderNo = model.OrderNo;
                            item.UpdateUserId = User.Identity.GetUserId();
                            item.UpdateDate = DateTime.Now;
                            item.Description = model.Description;
                            context.Entry(item).State = EntityState.Modified;
                            context.SaveChanges();
                            var newModel = item.Clone();
                            HistoryDal.Write(User.Identity.GetUserId(), "Positions", HistoryActionEnum.Edit, item.Id, oldModel, newModel, GetClientIp(), context: context);
                        }
                        else
                        {

                            var item = new Position()
                            {
                                Code = model.Code,
                                CreateDate = DateTime.Now,
                                CreateUserId = User.Identity.GetUserId(),
                                Description = model.Description,
                                Id = Guid.NewGuid(),
                                LanguageId = "vi",
                                Tag = "",
                                Status = StatusEnum.Used,
                                UpdateDate = DateTime.Now,
                                UpdateUserId = User.Identity.GetUserId(),
                                UnitCode = currentUnitCode,
                                ImportId = "",
                                Name = model.Name,
                                OrderNo = model.OrderNo,
                            };

                            context.Positions.Add(item);
                            context.SaveChanges();
                            var newModel = item.Clone();
                            HistoryDal.Write(User.Identity.GetUserId(), "Positions", HistoryActionEnum.Add, item.Id, null, newModel, GetClientIp(), context: context);
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

    }
}
