using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
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

    public class NhiemKyController : BaseApiController
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
                    items = items.OrderBy(s => s.OrderNo).ThenByDescending(s => s.UpdateDate).ThenByDescending(s => s.CreateDate);
                    var temp = items.ToList();
                    var result = temp.Paging(model).Select(s => new GeneralCategoryModel(s)).ToList().OrderBy(x => x.Name);

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
        public IHttpActionResult List(NhiemKyModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");

                    var loaiNK = context.GeneralCategories.FirstOrDefault(s => s.Code == "CoQuanNhiemKyPTT" && s.Value == model.Code && s.Status != StatusEnum.Deleted && s.UnitCode.ToLower() == currentUnitCode.ToLower());

                    var units = context.NhiemKys.Where(s => s.Status != StatusEnum.Deleted && s.TypeId == loaiNK.Id && s.UnitCode.ToLower() == currentUnitCode.ToLower());
                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        model.Keyword = model.Keyword.ToLower().Trim();
                        units = units.Where(s => s.Ten.ToLower().Contains(model.Keyword));
                    }
                    var resultTemp = units.OrderBy(s => s.ThuTu).ToList();
                    var result = resultTemp.Paging(model).Select(s => new NhiemKyModel()
                    {
                        Id = s.Id,
                        Ten = s.Ten,
                        TuNam = s.TuNam.ToString(),
                        DenNam = s.DenNam == 0 ? "" : s.DenNam.ToString(),
                        ThuTu = s.ThuTu.ToString(),
                        HinhAnh = s.HinhAnh,
                        TypeId = s.TypeId,
                    }).ToList();
                    foreach (NhiemKyModel nhiemKyModel in result)
                    {
                        var CVNKlst = context.ChucVuNhiemKys.Where(s => nhiemKyModel.Id == s.NhiemKyId).ToList();
                        var resultCVNKlst = CVNKlst.Select(s => new ChucVuNhiemKyModel()
                        {
                            Id = s.Id,
                            ChucVuId = s.ChucVuId,
                            NhiemKyId = s.NhiemKyId,
                            ThuTu = s.ThuTu.ToString(),
                        }).ToList();
                        for (int i = 0; i < resultCVNKlst.Count; i++)
                        {
                            Guid ChucVuId = (Guid)resultCVNKlst[i].ChucVuId;
                            var ChucVu = context.GeneralCategories.FirstOrDefault(s => ChucVuId == s.Id && s.Status != StatusEnum.Deleted && s.Code == "ChucVuPTT");
                            if (ChucVu != null)
                            {
                                resultCVNKlst[i].Name = ChucVu.Name;
                            }
                        }
                        resultCVNKlst = resultCVNKlst.OrderBy(s => s.ThuTu).ToList();
                        foreach (ChucVuNhiemKyModel chucVuNhiemKyModel in resultCVNKlst)
                        {
                            var CBCVNKlst = context.CanBoChucVuNhiemKys.Where(s => chucVuNhiemKyModel.Id == s.ChucVuNhiemKyId).ToList();
                            var resultCBCVNKlst = CBCVNKlst.Select(s => new CanBoChucVuNhiemKyModel()
                            {
                                ChucVuNhiemKyId = s.ChucVuNhiemKyId,
                                TieuSuId = s.TieuSuId,
                                ThuTu = s.ThuTu.ToString(),
                            }).ToList();
                            resultCBCVNKlst = resultCBCVNKlst.OrderBy(s => s.ThuTu).ToList();
                            chucVuNhiemKyModel.CBCVNKlst = resultCBCVNKlst;
                        }
                        nhiemKyModel.CVNKlst = resultCVNKlst;
                    }

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
        public IHttpActionResult ListFull(NhiemKyModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var loaiNK = context.GeneralCategories.FirstOrDefault(s => s.Code == "CoQuanNhiemKyPTT" && s.Value == model.Code && s.Status != StatusEnum.Deleted && s.UnitCode.ToLower() == model.UnitCode.ToLower() );
                    var units = context.NhiemKys.Where(s => s.Status != StatusEnum.Deleted && s.TypeId == loaiNK.Id);
                    var resultTemp = units.OrderByDescending(s => s.ThuTu).ToList();
                    var result = resultTemp.Select(s => new NhiemKyModel()
                    {
                        Id = s.Id,
                        Ten = s.Ten,
                        TuNam = s.TuNam.ToString(),
                        DenNam = s.DenNam == 0 ? "": s.DenNam.ToString(),
                        ThuTu = s.ThuTu.ToString(),
                        HinhAnh = s.HinhAnh,
                        TypeId = s.TypeId,
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
        public IHttpActionResult GetNhiemKy(NhiemKyModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    if (model.Id == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Không tìm được nhiệm kỳ!"
                        });
                    }

                    var units = context.NhiemKys.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Id == model.Id && s.UnitCode.ToLower() == model.UnitCode.ToLower());
                    if (units == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Không tìm được nhiệm kỳ!"
                        });
                    }

                    var result = new NhiemKyModel()
                    {
                        Id = units.Id,
                        Ten = units.Ten,
                        TuNam = units.TuNam.ToString(),
                        DenNam = units.DenNam == 0 ? "" : units.DenNam.ToString(),
                        HinhAnh = units.HinhAnh,
                        TypeId = units.TypeId,
                    };

                    var CVNKlst = context.ChucVuNhiemKys.Where(s => result.Id == s.NhiemKyId).ToList();
                    var resultCVNKlst = CVNKlst.Select(s => new ChucVuNhiemKyModel()
                    {
                        Id = s.Id,
                        ChucVuId = s.ChucVuId,
                        NhiemKyId = s.NhiemKyId,
                        ThuTu = s.ThuTu.ToString(),
                    }).ToList();
                    for (int i = 0; i < resultCVNKlst.Count; i++)
                    {
                        Guid ChucVuId = (Guid)resultCVNKlst[i].ChucVuId;
                        var ChucVu = context.GeneralCategories.FirstOrDefault(s => ChucVuId == s.Id && s.Status != StatusEnum.Deleted && s.Code == "ChucVuPTT");
                        if (ChucVu != null)
                        {
                            resultCVNKlst[i].Name = ChucVu.Name;
                        }
                    }
                    resultCVNKlst = resultCVNKlst.OrderBy(s => s.ThuTu).ToList();
                    foreach (ChucVuNhiemKyModel chucVuNhiemKyModel in resultCVNKlst)
                    {
                        var CBCVNKlst = context.CanBoChucVuNhiemKys.Where(s => chucVuNhiemKyModel.Id == s.ChucVuNhiemKyId).ToList();
                        var resultCBCVNKlst = CBCVNKlst.Select(s => new CanBoChucVuNhiemKyModel()
                        {
                            ChucVuNhiemKyId = s.ChucVuNhiemKyId,
                            TieuSuId = s.TieuSuId,
                            ThuTu = s.ThuTu.ToString(),
                        }).ToList();
                        for (int j = 0; j < resultCBCVNKlst.Count; j++)
                        {
                            Guid ChucVuId = (Guid)resultCBCVNKlst[j].TieuSuId;
                            var TieuSu = context.TieuSus.FirstOrDefault(s => ChucVuId == s.Id);
                            if (TieuSu != null)
                            {
                                resultCBCVNKlst[j].HoTen = TieuSu.HoTen;
                                resultCBCVNKlst[j].NgaySinh = TieuSu.NgaySinh;
                                resultCBCVNKlst[j].QueQuan = TieuSu.QueQuan;
                                resultCBCVNKlst[j].NoiThuongTru = TieuSu.NoiThuongTru;
                                resultCBCVNKlst[j].UrlAvt1 = TieuSu.UrlAvt1;
                            }
                        }
                        resultCBCVNKlst = resultCBCVNKlst.OrderBy(s => s.ThuTu).ToList();
                        chucVuNhiemKyModel.CBCVNKlst = resultCBCVNKlst;
                    }
                    result.CVNKlst = resultCVNKlst;


                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result,
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

        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult Delete(NhiemKyModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");

                    var unit = context.NhiemKys.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted && s.UnitCode.ToLower() == currentUnitCode.ToLower());

                    if (unit == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "Nhiệm kỳ không tồn tại",
                            Result = null
                        });
                    }

                    //if (currentUnitCode.ToLower() != "LDG".ToLower() && unit.UnitCode.ToLower() != currentUnitCode)
                    //{
                    //    return Json(new ResultModel()
                    //    {
                    //        Code = ResultCode.UnSuccess,
                    //        Message = @"Bạn không có quyền xóa chức vụ này!"
                    //    });
                    //}

                    var CVNKlst = context.ChucVuNhiemKys.Where(s => unit.Id == s.NhiemKyId).ToList();
                    foreach (ChucVuNhiemKy chucVuNhiemKy in CVNKlst)
                    {
                        var CBCVNKlst = context.CanBoChucVuNhiemKys.Where(s => chucVuNhiemKy.Id == s.ChucVuNhiemKyId).ToList();
                        foreach (CanBoChucVuNhiemKy canBoChucVuNhiemKy in CBCVNKlst)
                        {
                            context.CanBoChucVuNhiemKys.Remove(canBoChucVuNhiemKy);
                        }
                        context.ChucVuNhiemKys.Remove(chucVuNhiemKy);
                    }

                    unit.Status = StatusEnum.Deleted;
                    unit.UpdateDate = DateTime.Now;
                    unit.UpdateUserId = User.Identity.GetUserId();
                    context.Entry(unit).State = EntityState.Modified;
                    context.SaveChanges();
                    //var newModel = unit.Clone();
                    //HistoryDal.Write(User.Identity.GetUserId(), "TieuSus", HistoryActionEnum.Delete, unit.Id, null, newModel, GetClientIp());
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

        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult Save(NhiemKyModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    using (var trans = context.Database.BeginTransaction())
                    {
                        var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                       
                        int valueThuTu = -1;
                        if (!string.IsNullOrEmpty(model.ThuTu))
                        {
                            if (int.TryParse(model.ThuTu.Trim(), out int value))
                            {
                                valueThuTu = int.Parse(model.ThuTu.Trim());
                            }
                            else
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Thứ tự nhiệm kỳ phải là số!"
                                });
                            }
                        } else
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = @"Thứ tự nhiệm kỳ là bắt buộc!"
                            });
                        }
                            
                        int valueTuNam = 0;
                        if (!string.IsNullOrEmpty(model.TuNam))
                        {
                            if (int.TryParse(model.TuNam.Trim(), out int valueTN))
                            {
                                valueTuNam = int.Parse(model.TuNam.Trim());
                            }
                            else
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Từ năm nhiệm kỳ phải là số!"
                                });
                            }
                        } else
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = @"Vui lòng nhập Từ năm!"
                            });
                        }
                        int valueDenNam = 0;
                        bool denNamBool = false;
                        if (!string.IsNullOrEmpty(model.DenNam))
                        {
                            if (int.TryParse(model.DenNam.Trim(), out int valueDN))
                            {
                                valueDenNam = int.Parse(model.DenNam.Trim());
                                denNamBool = true;
                            }
                            else
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Đến năm nhiệm kỳ phải là số!"
                                });
                            }
                        }
                        if(model.TypeId == null)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = @"Vui lòng chọn loại nhiệm kỳ!"
                            });
                        }
                        Guid idRandom = Guid.NewGuid();
                        if (model.Id.HasValue)
                        {
                            idRandom = model.Id.Value;
                            var id = model.Id;
                            var item =
                                context.NhiemKys.FirstOrDefault(s => s.Id == id && s.Status != StatusEnum.Deleted);
                            if (item == null)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.DataNotEnough,
                                    Message = "Nhiệm kỳ không tồn tại hoặc bị xoá"
                                });
                            }
                            //if (currentUnitCode.ToLower() != "LDG".ToLower() && item.UnitCode.ToLower() != currentUnitCode)
                            //{
                            //    return Json(new ResultModel()
                            //    {
                            //        Code = ResultCode.UnSuccess,
                            //        Message = @"Bạn không có quyền chỉnh chức vụ này!"
                            //    });
                            //}
                            var oldModel = item.Clone();
                            item.Ten = !string.IsNullOrEmpty(model.Ten) ? model.Ten.Trim() : "";
                            item.ThuTu = valueThuTu;
                            item.TuNam = valueTuNam;
                            item.DenNam = denNamBool ? valueDenNam : (int?) null;
                            item.HinhAnh = model.HinhAnh;
                            item.TypeId = model.TypeId;
                            item.UpdateUserId = User.Identity.GetUserId();
                            item.UpdateDate = DateTime.Now;
                            context.Entry(item).State = EntityState.Modified;
                            context.SaveChanges();
                            var newModel = item.Clone();
                            HistoryDal.Write(User.Identity.GetUserId(), "NhiemKys", HistoryActionEnum.Edit, item.Id, oldModel, newModel, GetClientIp(), context: context);
                            var oldCVNKlst = context.ChucVuNhiemKys.Where(s => model.Id == s.NhiemKyId).ToList();
                            for (int i = 0; i < oldCVNKlst.Count; i++)
                            {
                                if (!CheckExistBefore(oldCVNKlst[i].ChucVuId, model.CVNKlst))
                                {
                                    Guid guidOldCVNKlst = oldCVNKlst[i].Id;
                                    var CBCVNKlst = context.CanBoChucVuNhiemKys.Where(s => guidOldCVNKlst == s.ChucVuNhiemKyId).ToList();
                                    foreach (CanBoChucVuNhiemKy canBoChucVuNhiemKy in CBCVNKlst)
                                    {
                                        context.CanBoChucVuNhiemKys.Remove(canBoChucVuNhiemKy);
                                        context.SaveChanges();
                                    }
                                    context.ChucVuNhiemKys.Remove(oldCVNKlst[i]);
                                    context.SaveChanges();
                                }
                            }
                            for (int i = 0; i < model.CVNKlst.Count; i++)
                            {
                                int valueThuTuCV = -1;
                                if (!string.IsNullOrEmpty(model.CVNKlst[i].ThuTu))
                                {
                                    if (int.TryParse(model.CVNKlst[i].ThuTu.Trim(), out int valueCV))
                                    {
                                        valueThuTuCV = int.Parse(model.CVNKlst[i].ThuTu.Trim());
                                    }
                                    else
                                    {
                                        return Json(new ResultModel()
                                        {
                                            Code = ResultCode.UnSuccess,
                                            Message = @"Thứ tự chức vụ phải là số!"
                                        });
                                    }
                                } else
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.UnSuccess,
                                        Message = @"Thứ tự chức vụ nhiệm kỳ là bắt buộc!"
                                    });
                                }
                                if(model.CVNKlst[i].ChucVuId == null)
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.UnSuccess,
                                        Message = @"Chức vụ nhiệm kỳ là bắt buộc!"
                                    });
                                }
                                if (!CheckExistAfter(model.CVNKlst[i].ChucVuId, oldCVNKlst))
                                {
                                    var itemCVNK = new ChucVuNhiemKy()
                                    {
                                        Id = Guid.NewGuid(),
                                        ThuTu = valueThuTuCV,
                                        ChucVuId = (Guid)model.CVNKlst[i].ChucVuId,
                                        NhiemKyId = (Guid)model.Id,
                                    };
                                    context.ChucVuNhiemKys.Add(itemCVNK);
                                    context.SaveChanges();
                                }
                                else
                                {
                                    for (int j = 0; j < oldCVNKlst.Count; j++)
                                    {
                                        if (model.CVNKlst[i].ChucVuId == oldCVNKlst[j].ChucVuId)
                                        {
                                            oldCVNKlst[j].ThuTu = valueThuTuCV;
                                            context.SaveChanges();
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            var item = new NhiemKy()
                            {
                                Ten = !string.IsNullOrEmpty(model.Ten) ? model.Ten.Trim() : "",
                                ThuTu = valueThuTu,
                                TuNam = valueTuNam,
                                DenNam = denNamBool ? valueDenNam : (int?)null,
                                HinhAnh = model.HinhAnh,
                                TypeId = model.TypeId,
                                CreateDate = DateTime.Now,
                                CreateUserId = User.Identity.GetUserId(),
                                Id = idRandom,
                                LanguageId = "vi",
                                Tag = "",
                                Status = StatusEnum.Used,
                                UpdateDate = DateTime.Now,
                                UpdateUserId = User.Identity.GetUserId(),
                                UnitCode = currentUnitCode,
                            };
                            context.NhiemKys.Add(item);
                            context.SaveChanges();
                            var newModel = item.Clone();
                            HistoryDal.Write(User.Identity.GetUserId(), "NhiemKys", HistoryActionEnum.Add, item.Id, null, newModel, GetClientIp(), context: context);
                            for (int i = 0; i < model.CVNKlst.Count; i++)
                            {
                                int valueThuTuCV = -1;
                                if (!string.IsNullOrEmpty(model.CVNKlst[i].ThuTu))
                                {
                                    if (int.TryParse(model.CVNKlst[i].ThuTu.Trim(), out int valueCV))
                                    {
                                        valueThuTuCV = int.Parse(model.CVNKlst[i].ThuTu.Trim());
                                    }
                                    else
                                    {
                                        return Json(new ResultModel()
                                        {
                                            Code = ResultCode.UnSuccess,
                                            Message = @"Thứ tự chức vụ phải là số!"
                                        });
                                    }
                                } else
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.UnSuccess,
                                        Message = @"Thứ tự chức vụ là bắt buộc!"
                                    });
                                }
                                if (model.CVNKlst[i].ChucVuId == null)
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.UnSuccess,
                                        Message = @"Chức vụ nhiệm kỳ là bắt buộc!"
                                    });
                                }
                                var itemCVNK = new ChucVuNhiemKy()
                                {
                                    Id = Guid.NewGuid(),
                                    ThuTu = valueThuTuCV,
                                    ChucVuId = (Guid)model.CVNKlst[i].ChucVuId,
                                    NhiemKyId = idRandom,
                                };
                                context.ChucVuNhiemKys.Add(itemCVNK);
                                context.SaveChanges();
                            }
                        }
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
        public static bool CheckExistBefore(Guid id, List<ChucVuNhiemKyModel> list)
        {
            for (int i = 0; i < list.Count; i++)
            {
                if (id == list[i].ChucVuId)
                {
                    return true;
                }
            }
            return false;
        }
        public static bool CheckExistAfter(Guid? id, List<ChucVuNhiemKy> list)
        {
            for (int i = 0; i < list.Count; i++)
            {
                if (id == list[i].ChucVuId)
                {
                    return true;
                }
            }
            return false;
        }
        [VnptAuthorization]
        [HttpPost]
        public IHttpActionResult SaveCBCVNK(NhiemKyModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    using (var trans = context.Database.BeginTransaction())
                    {
                        var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                        foreach (ChucVuNhiemKyModel itemCVNKmodel in model.CVNKlst)
                        {
                            var CVNKlst = context.ChucVuNhiemKys.FirstOrDefault(s => itemCVNKmodel.Id == s.Id);
                            if (CVNKlst == null)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Chức vụ nhiệm kỳ không tìm thấy!"
                                });
                            }
                            Guid itemCBCVNKmodelId = (Guid)itemCVNKmodel.Id;
                            var CBCVNKlst = context.CanBoChucVuNhiemKys.Where(s => itemCBCVNKmodelId == s.ChucVuNhiemKyId).ToList();
                            foreach (CanBoChucVuNhiemKy canBoChucVuNhiemKy in CBCVNKlst)
                            {
                                context.CanBoChucVuNhiemKys.Remove(canBoChucVuNhiemKy);
                                context.SaveChanges();
                            }
                            foreach (CanBoChucVuNhiemKyModel itemCBCVNKmodel in itemCVNKmodel.CBCVNKlst)
                            {
                                int valueThuTuCBNK = -1;
                                if (!string.IsNullOrEmpty(itemCBCVNKmodel.ThuTu))
                                {
                                    if (int.TryParse(itemCBCVNKmodel.ThuTu.Trim(), out int valueCBNK))
                                    {
                                        valueThuTuCBNK = int.Parse(itemCBCVNKmodel.ThuTu.Trim());
                                    }
                                    else
                                    {
                                        return Json(new ResultModel()
                                        {
                                            Code = ResultCode.UnSuccess,
                                            Message = @"Thứ tự cán bộ chức vụ nhiệm kỳ phải là số!"
                                        });
                                    }
                                } else
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.UnSuccess,
                                        Message = @"Thứ tự cán bộ chức vụ nhiệm kỳ là bắt buộc!"
                                    });
                                }
                                if (itemCBCVNKmodel.TieuSuId == null)
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.UnSuccess,
                                        Message = @"Cán bộ chức vụ nhiệm kỳ là bắt buộc!"
                                    });
                                }
                                var itemCBCVNK = new CanBoChucVuNhiemKy()
                                {
                                    ChucVuNhiemKyId = (Guid)CVNKlst.Id,
                                    TieuSuId = (Guid)itemCBCVNKmodel.TieuSuId,
                                    ThuTu = valueThuTuCBNK,
                                };
                                context.CanBoChucVuNhiemKys.Add(itemCBCVNK);
                                context.SaveChanges();
                            }
                            context.SaveChanges();
                        }
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


    }

}
