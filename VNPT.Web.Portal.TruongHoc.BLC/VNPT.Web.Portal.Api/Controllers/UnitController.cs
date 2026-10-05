using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
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
    public class UnitController : BaseApiController
    {
        [HttpPost]
        public IHttpActionResult List(UserSearchModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {


                    var units = context.Units.Where(s => s.Status != StatusEnum.Deleted);
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    if (currentUnitCode == "LDG")
                    {

                    }
                    else
                    {
                        units = units.Where(s => s.UnitCode.ToLower() == currentUnitCode.ToLower());
                    }

                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        model.Keyword = model.Keyword.ToLower().Trim();
                        units = units.Where(s => s.Name.ToLower().Contains(model.Keyword));
                    }
                    if (!string.IsNullOrEmpty(model.UnitCode))
                    {
                        units = units.Where(s => s.UnitCode.ToLower() == model.UnitCode.ToLower());
                    }
                    if (!string.IsNullOrEmpty(model.Type))
                    {
                        units = units.Where(s => s.Tag.ToLower().Contains(model.Type.ToLower()));
                    }
                    var resultTemp = units.OrderByDescending(s => s.Tag).ThenByDescending(s => s.UpdateDate).ThenBy(s => s.Name).ToList();
                    var result = resultTemp.Paging(model).Select(s =>
                    {
                        var ward = context.LocationWards.FirstOrDefault(w => w.Id == s.LocationWardId);

                        var district = context.LocationDistricts.FirstOrDefault(w => w.Id == s.LocationDistrictId);

                        return new
                        {
                            s.Id,
                            s.Name,
                            WardName = ward?.Name,
                            WardId = ward?.Id,
                            DistrictId = district?.Id,
                            DistristName = district?.Name,
                            s.Code,
                            s.Description,
                            s.UnitCode,
                            s.SortNo,
                            s.Tag,
                            IsPrimary = s.IsPrimary ?? false,
                            s.UnitFeedbackType,
                            s.UnitFeedbackTypeName
                        };
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
                    var unit = context.Units.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted);
                    if (unit == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "Đơn vị không tồn tại",
                            Result = null
                        });
                    }
                    //var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    //if (currentUnitCode.ToLower() != "LDG".ToLower() && unit.UnitCode.ToLower() != currentUnitCode)
                    //{
                    //    return Json(new ResultModel()
                    //    {
                    //        Code = ResultCode.UnSuccess,
                    //        Message = @"Bạn không có quyền xóa chức vụ này!"
                    //    });
                    //}
                    unit.Status = StatusEnum.Deleted;
                    unit.UpdateDate = DateTime.Now;
                    unit.UpdateUserId = User.Identity.GetUserId();
                    context.Entry(unit).State = EntityState.Modified;
                    context.SaveChanges();
                    var newModel = unit.Clone();
                    HistoryDal.Write(User.Identity.GetUserId(), "Units", HistoryActionEnum.Delete, unit.Id, null, newModel, GetClientIp());
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
        public IHttpActionResult Save(UnitModel model)
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

                        if (currentUnitCode.ToLower() == "LDG".ToLower() && !model.DistrictId.HasValue)
                        {
                            var province = context.LocationProvinces.First(s =>
                                s.UnitCode.ToLower() == currentUnitCode.ToLower());

                            model.ProvinceId = province.Id;
                            model.UnitCode = province.UnitCode;
                            model.IsProvinceUnit = true;
                        }
                        else
                        {
                            if (!model.DistrictId.HasValue)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Huyện/Thành phố không được để trống!"
                                });
                            }
                            var district = context.LocationDistricts.FirstOrDefault(s => s.Id == model.DistrictId && s.Status != StatusEnum.Deleted);
                            if (district == null)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Huyện/thành phố không còn tồn tại!"
                                });
                            }
                            if (currentUnitCode.ToLower() != "LDG".ToLower() && district.UnitCode.ToLower() != currentUnitCode)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Bạn không có quyền tạo đơn vị cho huyện/thành phố này!"
                                });
                            }

                            model.DistrictId = district.Id;
                            model.ProvinceId = district.LocationProvince.Id;
                            model.UnitCode = district.UnitCode;
                            model.IsProvinceUnit = false;
                        }

                        if (model.Id.HasValue)
                        {
                            var id = model.Id;
                            var item =
                                context.Units.FirstOrDefault(s => s.Id == id && s.Status != StatusEnum.Deleted);
                            if (item == null)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.DataNotEnough,
                                    Message = "Đơn vị không tồn tại hoặc bị xoá"
                                });
                            }
                            var oldModel = item.Clone();
                            item.Name = model.Name;
                            item.UnitCode = model.UnitCode;
                            item.Code = model.Code;
                            item.UpdateUserId = User.Identity.GetUserId();
                            item.UpdateDate = DateTime.Now;
                            item.Description = model.Description;
                            item.SortNo = model.SortNo ?? 0;
                            item.LocationWardId = model.WardId;
                            item.LocationDistrictId = model.DistrictId;
                            item.LocationProvinceId = model.ProvinceId;
                            item.IsProvinceUnit = model.IsProvinceUnit;

                            if (item.IsProvinceUnit == true)
                            {
                                item.LocationWardId = null;
                                item.LocationDistrictId = null;
                            }
                            context.Entry(item).State = EntityState.Modified;
                            context.SaveChanges();
                            var newModel = item.Clone();
                            HistoryDal.Write(User.Identity.GetUserId(), "Units", HistoryActionEnum.Edit, item.Id, oldModel, newModel, GetClientIp(), context: context);
                        }
                        else
                        {

                            // Check trùng mã
                            var checkItem = context.Units.FirstOrDefault(s => s.Code == model.Code && s.Status != StatusEnum.Deleted);

                            if (checkItem != null)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = "Mã đơn vị đã tồn tại. Vui lòng nhập mã khác!"
                                });
                            }

                            var item = new Unit()
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
                                UnitCode = model.UnitCode,
                                ImportId = "",
                                IsNotPublic = false,
                                LocationDistrictId = model.DistrictId,
                                LocationProvinceId = model.ProvinceId,
                                LocationWardId = model.WardId,
                                Name = model.Name,
                                SortNo = model.SortNo ?? 0,
                                IsProvinceUnit = model.IsProvinceUnit,
                            };
                            if (item.IsProvinceUnit == true)
                            {
                                item.LocationWardId = null;
                                item.LocationDistrictId = null;
                            }
                            context.Units.Add(item);
                            context.SaveChanges();
                            var newModel = item.Clone();
                            HistoryDal.Write(User.Identity.GetUserId(), "Units", HistoryActionEnum.Add, item.Id, null, newModel, GetClientIp(), context: context);
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
        public IHttpActionResult Districts(LocationInput input)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var types = context.LocationDistricts.Where(s => s.Status == StatusEnum.Used);
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    if (currentUnitCode == "LDG")
                    {
                        types = types.Where(s => s.LocationProvince.UnitCode.ToLower() == currentUnitCode.ToLower());
                    }
                    else
                    {
                        types = types.Where(s => s.UnitCode.ToLower() == currentUnitCode.ToLower());
                    }

                    var resultTemp = types.OrderBy(s => s.OrderNo).ThenBy(s => s.Name).ToList().Select(s => new LocationItem(s)).ToList();
                    var result = new List<LocationItem>();
                    if (currentUnitCode == "LDG")
                    {
                        result.Add(new LocationItem()
                        {
                            CodeId = "LDG",
                            Id = Guid.Empty,
                            Name = "Đơn vị thuộc tỉnh",
                            UnitCode = "LDG"
                        });
                    }
                    result.AddRange(resultTemp);
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        TotalRow = result.Count
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Exception,
                    Message = ex.Message,
                    Result = null
                });
            }
        }
        [HttpPost]
        public IHttpActionResult Wards(LocationInput input)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var types = context.LocationWards.Where(s => s.Status == StatusEnum.Used);
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    if (currentUnitCode == "LDG")
                    {
                        types = types.Where(s => s.ParentId == input.ParentId);
                    }
                    else
                    {
                        types = types.Where(s => s.ParentId == input.ParentId && s.LocationDistrict.UnitCode.ToLower() == currentUnitCode.ToLower());
                    }

                    var result = types.OrderBy(s => s.OrderNo).ThenBy(s => s.Name).ToList().Select(s => new LocationItem(s)).ToList();
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        TotalRow = result.Count
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Exception,
                    Message = ex.Message,
                    Result = null
                });
            }
        }

        [HttpPost]
        public IHttpActionResult ListSelector()
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var units = context.Units
                        .Where(u => u.Status != StatusEnum.Deleted && u.Code != "LDG")
                        .Select(u => new
                        {
                            u.Id,
                            u.Code,
                            u.Name,
                        })
                        .ToList();

                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = units,
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new ResultModel
                {
                    Code = ResultCode.Exception,
                    Message = ex.Message,
                    Result = null
                });
            }
        }
    }
}
