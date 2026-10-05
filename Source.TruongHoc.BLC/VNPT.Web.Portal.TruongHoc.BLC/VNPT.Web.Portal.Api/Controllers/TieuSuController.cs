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

    public class TieuSuController : BaseApiController
    {
        [HttpPost]
        public IHttpActionResult List(TieuSuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    var units = context.TieuSus.Where(s => s.Status != StatusEnum.Deleted && s.UnitCode.ToLower() == currentUnitCode.ToLower());
                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        model.Keyword = model.Keyword.ToLower().Trim();
                        units = units.Where(s => s.HoTen.ToLower().Contains(model.Keyword) || s.Alias.ToLower().Contains(model.Keyword));
                    }
                    var resultTemp = units.OrderByDescending(s => s.CreateDate).ThenBy(s => s.HoTen).ToList();
                    var result = resultTemp.Paging(model).Select(s => new TieuSuModel(s)).ToList();
                    foreach (TieuSuModel tieuSuModel in result)
                    {
                        var QTCTlst = context.QuaTrinhCongTacs.Where(s => tieuSuModel.Id == s.TieuSuId).ToList();
                        var resultQTCTlst = QTCTlst.Select(s => new QuaTrinhCongTacModel()
                        {
                            Id = s.Id,
                            TieuSuId = s.TieuSuId,
                            ThuTu = s.ThuTu.ToString(),
                            //TuNgay = s.TuNgay,
                            //DenNgay = s.DenNgay,
                            NoiDung = s.NoiDung,
                            TuNgayDenNgay = s.TuNgayDenNgay
                        }).ToList();
                        resultQTCTlst = resultQTCTlst.OrderBy(s => s.ThuTuInt).ToList();
                        tieuSuModel.QTCTlst = resultQTCTlst;

                        var HAHDlst = context.HinhAnhHoatDongs.Where(s => tieuSuModel.Id == s.TieuSuId).ToList();
                        var resultHAHDlst = HAHDlst.Select(s => new HinhAnhHoatDongModel()
                        {
                            Id = s.Id,
                            TieuSuId = s.TieuSuId,
                            Url = s.Url,
                            ThumbUrl = s.ThumbUrl,
                            TenHinh = s.TenHinh,
                            MoTa = s.MoTa,
                        }).ToList();
                        tieuSuModel.HAHDlst = resultHAHDlst;

                        var BPBlst = context.BaiPhatBieus.Where(s => s.Status != StatusEnum.Deleted && tieuSuModel.Id == s.TieuSuId).ToList();
                        var resultBPBlst = BPBlst.Select(s => new BaiPhatBieuModel()
                        {
                            Id = s.Id,
                            TieuSuId = s.TieuSuId,
                            NgayDang = s.NgayDang,
                            TieuDe = s.TieuDe,
                            MoTaNgan = s.MoTaNgan,
                            NoiDung = s.NoiDung,
                        }).ToList();
                        resultBPBlst = resultBPBlst.OrderBy(s => s.NgayDang).ToList();
                        tieuSuModel.BPBlst = resultBPBlst;

                        var ChucVu = context.GeneralCategories.FirstOrDefault(s => tieuSuModel.LoaiChucVuId == s.Id && s.Status != StatusEnum.Deleted && s.Code == "ChucVu");
                        if (ChucVu != null)
                        {
                            tieuSuModel.TenChucVu = ChucVu.Name;
                        }
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
        public IHttpActionResult GetTieuSu(TieuSuModel model)
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
                            Message = @"Không tìm được Tiểu sử!"
                        });
                    }
                    var units = context.TieuSus.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Id == model.Id);
                    if (units == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Không tìm được Tiểu sử!"
                        });
                    }
                    var result = new TieuSuModel()
                    {
                        Id = units.Id,
                        HoTen = units.HoTen,
                        LoaiChucVuId = units.LoaiChucVuId,
                        Alias = units.Alias,
                        BiDanh = units.BiDanh,
                        SDT = units.SDT,
                        NgaySinh = units.NgaySinh,
                        QueQuan = units.QueQuan,
                        NoiThuongTru = units.NoiThuongTru,
                        TonGiaoId = units.TonGiaoId,
                        DanTocId = units.DanTocId,
                        NgayVaoDang = units.NgayVaoDang,
                        NgayChinhThuc = units.NgayChinhThuc,
                        KhenThuong = units.KhenThuong,
                        TrinhDoChuyenMon = units.TrinhDoChuyenMon,
                        TrinhDoLyLuanChinhTri = units.TrinhDoLyLuanChinhTri,
                        ChucVu = units.ChucVu,
                        UrlAvt1 = units.UrlAvt1,
                        UrlAvt2 = units.UrlAvt2,
                    };
                    string[] stringSeparators = new string[] { "\n" };
                    if (!string.IsNullOrEmpty(result.KhenThuong) && result.KhenThuong != null)
                    {
                        string[] splitKhenThuong = result.KhenThuong.Split(stringSeparators, StringSplitOptions.None);
                        result.KhenThuongLst = splitKhenThuong;
                    }
                    if (!string.IsNullOrEmpty(result.ChucVu) && result.ChucVu != null)
                    {
                        string[] splitChucVu = result.ChucVu.Split(stringSeparators, StringSplitOptions.None);
                        result.ChucVuLst = splitChucVu;
                    }
                    var danToc = context.GeneralCategories.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Code == "DanToc" && s.Id == result.DanTocId);
                    if (danToc != null)
                    {
                        result.DanToc = danToc.Name;
                    }
                    var tonGiao = context.GeneralCategories.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Code == "TonGiao" && s.Id == result.TonGiaoId);
                    if (danToc != null)
                    {
                        result.TonGiao = tonGiao.Name;
                    }
                    var QTCTlst = context.QuaTrinhCongTacs.Where(s => result.Id == s.TieuSuId).ToList();
                    var resultQTCTlst = QTCTlst.Select(s => new QuaTrinhCongTacModel()
                    {
                        Id = s.Id,
                        TieuSuId = s.TieuSuId,
                        //TuNgay = s.TuNgay,
                        //DenNgay = s.DenNgay,
                        NoiDung = s.NoiDung,
                        TuNgayDenNgay = s.TuNgayDenNgay,
                        ThuTu = s.ThuTu.ToString(),
                    }).ToList();
                    resultQTCTlst = resultQTCTlst.OrderBy(s => s.ThuTuInt).ToList();
                    result.QTCTlst = resultQTCTlst;

                    var HAHDlst = context.HinhAnhHoatDongs.Where(s => result.Id == s.TieuSuId).ToList();
                    var resultHAHDlst = HAHDlst.Select(s => new HinhAnhHoatDongModel()
                    {
                        Id = s.Id,
                        TieuSuId = s.TieuSuId,
                        Url = s.Url,
                        ThumbUrl = s.ThumbUrl,
                        TenHinh = s.TenHinh,
                        MoTa = s.MoTa,
                    }).ToList();
                    result.HAHDlst = resultHAHDlst;

                    var BPBlst = context.BaiPhatBieus.Where(s => s.Status != StatusEnum.Deleted && result.Id == s.TieuSuId).ToList();
                    var resultBPBlst = BPBlst.Select(s => new BaiPhatBieuModel()
                    {
                        Id = s.Id,
                        TieuSuId = s.TieuSuId,
                        NgayDang = s.NgayDang,
                        TieuDe = s.TieuDe,
                        MoTaNgan = s.MoTaNgan,
                        NoiDung = s.NoiDung,
                    }).ToList();
                    resultBPBlst = resultBPBlst.OrderBy(s => s.NgayDang).ToList();
                    result.BPBlst = resultBPBlst;

                    var ChucVu = context.GeneralCategories.FirstOrDefault(s => result.LoaiChucVuId == s.Id && s.Status != StatusEnum.Deleted && s.Code == "ChucVu");
                    if (ChucVu != null)
                    {
                        result.TenChucVu = ChucVu.Name;
                    }

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        TotalRow = 1
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
        public IHttpActionResult GetBaiPhatBieu(BaiPhatBieuModel model)
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
                            Message = @"Không tìm được Bài phát biểu!"
                        });
                    }
                    var units = context.BaiPhatBieus.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Id == model.Id);
                    if (units == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Không tìm được Bài phát biểu!"
                        });
                    }
                    if (units.CountView == null)
                    {
                        units.CountView = 0;
                    }
                    units.CountView += 1;
                    context.SaveChanges();
                    var result = new BaiPhatBieuModel()
                    {
                        Id = units.Id,
                        NgayDang = units.NgayDang,
                        TieuDe = units.TieuDe,
                        MoTaNgan = units.MoTaNgan,
                        NoiDung = units.NoiDung,
                        CountView = units.CountView,
                    };
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = result,
                        TotalRow = 1
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
        public IHttpActionResult GetTieuSuLanhDao(TieuSuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    List<TieuSuModel> lstTieuSu = new List<TieuSuModel>();
                    List<GeneralCategory> chucVus = new List<GeneralCategory>();
                    GeneralCategory chucVuSearch = new GeneralCategory();
                    if (!string.IsNullOrEmpty(model.CodeChucVu))
                    {
                        if (model.CodeChucVu == "HIEUTRUONG")
                        {
                            chucVuSearch = context.GeneralCategories.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Value == "TRUONGTY" && s.Code == "ChucVuPTT" && s.UnitCode == model.UnitCode);
                            if (chucVuSearch != null)
                            {
                                chucVus.Add(chucVuSearch);
                            }
                            chucVuSearch = context.GeneralCategories.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Value == "PHUTRACHTY" && s.Code == "ChucVuPTT" && s.UnitCode == model.UnitCode);
                            if (chucVuSearch != null)
                            {
                                chucVus.Add(chucVuSearch);
                            }
                        }
                        else if (model.CodeChucVu == "PHOHIEUTRUONG")
                        {
                            chucVuSearch = context.GeneralCategories.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Value == "PHOTRUONGTY" && s.Code == "ChucVuPTT" && s.UnitCode == model.UnitCode);
                            if (chucVuSearch != null)
                            {
                                chucVus.Add(chucVuSearch);
                            }
                            chucVuSearch = context.GeneralCategories.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Value == "PHOPHUTRACHTY" && s.Code == "ChucVuPTT" && s.UnitCode == model.UnitCode);
                            if (chucVuSearch != null)
                            {
                                chucVus.Add(chucVuSearch);
                            }
                        }
                    }
                    chucVuSearch = context.GeneralCategories.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Value == model.CodeChucVu && s.Code == "ChucVuPTT" && s.UnitCode == model.UnitCode);
                    if (chucVuSearch == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.UnSuccess,
                            Message = @"Không tìm được Chức vụ!"
                        });
                    }
                    else
                    {
                        chucVus.Add(chucVuSearch);
                    }
                    foreach (GeneralCategory chucVu in chucVus)
                    {
                        var chucVuNhiemKy = context.ChucVuNhiemKys.Where(s => s.ChucVuId == chucVu.Id).ToList();
                        for (int i = 0; i < chucVuNhiemKy.Count; i++)
                        {
                            Guid idChucVuNhiemKy = chucVuNhiemKy[i].Id;
                            var canBoChucVuNhiemKy = context.CanBoChucVuNhiemKys.Where(s => s.ChucVuNhiemKyId == idChucVuNhiemKy).ToList();

                            NhiemKyModel nhiemKyLanhDao = new NhiemKyModel();
                            Guid idNhiemKy = chucVuNhiemKy[i].NhiemKyId;
                            var nhiemKy = context.NhiemKys.FirstOrDefault(s => s.Id == idNhiemKy && s.Status != StatusEnum.Deleted);
                            if (nhiemKy != null)
                            {
                                nhiemKyLanhDao = new NhiemKyModel()
                                {
                                    Ten = nhiemKy.Ten,
                                    TuNam = nhiemKy.TuNam.ToString(),
                                    DenNam = nhiemKy.DenNam.ToString(),
                                    ThuTu = nhiemKy.ThuTu.ToString(),
                                };
                            }
                            for (int j = 0; j < canBoChucVuNhiemKy.Count; j++)
                            {
                                Guid idCanBoChucVuNhiemKy = canBoChucVuNhiemKy[j].TieuSuId;
                                var tieuSu = context.TieuSus.FirstOrDefault(s => s.Id == idCanBoChucVuNhiemKy && s.Status != StatusEnum.Deleted);
                                if (tieuSu != null)
                                {
                                    lstTieuSu.Add(new TieuSuModel()
                                    {
                                        Id = tieuSu.Id,
                                        HoTen = tieuSu.HoTen,
                                        UrlAvt1 = tieuSu.UrlAvt1,
                                        UrlAvt2 = tieuSu.UrlAvt2,
                                        TenChucVu = chucVu.Name,
                                        NhiemKy = nhiemKyLanhDao,
                                    });
                                }
                            }
                        }
                    }
                    var resultTemp = lstTieuSu.OrderBy(s => s.NhiemKy.TuNam).ToList();
                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = resultTemp,
                        TotalRow = resultTemp.Count,
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
        public IHttpActionResult Delete(TieuSuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");
                    var unit = context.TieuSus.FirstOrDefault(s => s.Id == model.Id && s.Status != StatusEnum.Deleted && s.UnitCode.ToLower() == currentUnitCode.ToLower());

                    if (unit == null)
                    {
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Exception,
                            Message = "Tiểu sử không tồn tại",
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
        public IHttpActionResult Save(TieuSuModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    using (var trans = context.Database.BeginTransaction())
                    {
                        var currentUnitCode = User.Identity.GetValue(UserCode.UnitCode, "");

                        if (string.IsNullOrEmpty(model.HoTen))
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = @"Tên không được để trống!"
                            });
                        }
                        else if (model.HoTen.Trim().Length > 500)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = @"Tên không được dài quá 500 ký tự!"
                            });
                        }
                        if (!string.IsNullOrEmpty(model.Alias))
                        {
                            if (model.Alias.Trim().Length > 200)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Tên khác không được dài quá 200 ký tự!"
                                });
                            }
                        }
                        if (!string.IsNullOrEmpty(model.QueQuan))
                        {
                            if (model.QueQuan.Trim().Length > 500)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Que quán không được dài quá 500 ký tự!"
                                });
                            }
                        }
                        if (!string.IsNullOrEmpty(model.NoiThuongTru))
                        {
                            if (model.NoiThuongTru.Trim().Length > 500)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Nơi thường trú không được dài quá 500 ký tự!"
                                });
                            }
                        }
                        if (!string.IsNullOrEmpty(model.SDT))
                        {
                            if (model.SDT.Trim().Length > 500)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Số điện thoại không được dài quá 500 ký tự!"
                                });
                            }
                        }
                        if (!string.IsNullOrEmpty(model.UrlAvt1))
                        {
                            if (model.UrlAvt1.Trim().Length > 500)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Url avt 1 không được dài quá 500 ký tự!"
                                });
                            }
                        }
                        if (!string.IsNullOrEmpty(model.UrlAvt2))
                        {
                            if (model.UrlAvt2.Trim().Length > 500)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Url avt 2 không được dài quá 500 ký tự!"
                                });
                            }
                        }
                        if (model.LoaiChucVuId == null)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = @"Chức vụ không được để trống!"
                            });
                        }
                        if (model.DanTocId == null)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = @"Dân tộc không được để trống!"
                            });
                        }
                        if (model.TonGiaoId == null)
                        {
                            return Json(new ResultModel()
                            {
                                Code = ResultCode.UnSuccess,
                                Message = @"Tôn giáo không được để trống!"
                            });
                        }
                        Guid idRandom = Guid.NewGuid();
                        if (model.Id.HasValue)
                        {
                            idRandom = model.Id.Value;
                            var id = model.Id;
                            var item =
                                context.TieuSus.FirstOrDefault(s => s.Id == id && s.Status != StatusEnum.Deleted);
                            if (item == null)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.DataNotEnough,
                                    Message = "Tiểu sử không tồn tại hoặc bị xoá"
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
                            item.HoTen = !string.IsNullOrEmpty(model.HoTen) ? model.HoTen.Trim() : "";
                            item.LoaiChucVuId = (Guid)model.LoaiChucVuId;
                            item.Alias = !string.IsNullOrEmpty(model.Alias) ? model.Alias.Trim() : "";
                            item.BiDanh = !string.IsNullOrEmpty(model.BiDanh) ? model.BiDanh.Trim() : "";
                            item.SDT = !string.IsNullOrEmpty(model.SDT) ? model.SDT.Trim() : "";
                            item.NgaySinh = !string.IsNullOrEmpty(model.NgaySinhSaveString) ? model.NgaySinhSaveString.ParseDate("dd/MM/yyyy") : (DateTime?)null;
                            item.QueQuan = !string.IsNullOrEmpty(model.QueQuan) ? model.QueQuan.Trim() : "";
                            item.NoiThuongTru = !string.IsNullOrEmpty(model.NoiThuongTru) ? model.NoiThuongTru.Trim() : "";
                            item.TonGiaoId = (Guid)model.TonGiaoId;
                            item.DanTocId = (Guid)model.DanTocId;
                            item.NgayVaoDang = !string.IsNullOrEmpty(model.NgayVaoDangSaveString) ? model.NgayVaoDangSaveString.ParseDate("dd/MM/yyyy") : (DateTime?)null;
                            item.NgayChinhThuc = !string.IsNullOrEmpty(model.NgayChinhThucSaveString) ? model.NgayChinhThucSaveString.ParseDate("dd/MM/yyyy") : (DateTime?)null;
                            item.KhenThuong = !string.IsNullOrEmpty(model.KhenThuong) ? model.KhenThuong.Trim() : "";
                            item.TrinhDoChuyenMon = !string.IsNullOrEmpty(model.TrinhDoChuyenMon) ? model.TrinhDoChuyenMon.Trim() : "";
                            item.TrinhDoLyLuanChinhTri = !string.IsNullOrEmpty(model.TrinhDoLyLuanChinhTri) ? model.TrinhDoLyLuanChinhTri.Trim() : "";
                            item.UrlAvt1 = model.UrlAvt1;
                            item.UrlAvt2 = model.UrlAvt2;
                            item.ChucVu = !string.IsNullOrEmpty(model.ChucVu) ? model.ChucVu.Trim() : "";
                            item.UpdateUserId = User.Identity.GetUserId();
                            item.UpdateDate = DateTime.Now;
                            context.Entry(item).State = EntityState.Modified;
                            context.SaveChanges();
                            var newModel = item.Clone();
                            HistoryDal.Write(User.Identity.GetUserId(), "TieuSus", HistoryActionEnum.Edit, item.Id, oldModel, newModel, GetClientIp(), context: context);

                            var itemQTCTOldRemovelst =
                                context.QuaTrinhCongTacs.Where(s => s.TieuSuId == id).ToList();
                            for (int i = itemQTCTOldRemovelst.Count - 1; i >= 0; i--)
                            {
                                var itemDelete = itemQTCTOldRemovelst[i];
                                context.QuaTrinhCongTacs.Remove(itemQTCTOldRemovelst[i]);
                            }
                            var itemHAHDOldRemovelst =
                                context.HinhAnhHoatDongs.Where(s => s.TieuSuId == id).ToList();
                            for (int i = itemHAHDOldRemovelst.Count - 1; i >= 0; i--)
                            {
                                var itemDelete = itemHAHDOldRemovelst[i];
                                context.HinhAnhHoatDongs.Remove(itemHAHDOldRemovelst[i]);
                            }
                            var itemBPBOldRemovelst =
                                context.BaiPhatBieus.Where(s => s.TieuSuId == id && s.Status != StatusEnum.Deleted).ToList();
                            for (int i = itemBPBOldRemovelst.Count - 1; i >= 0; i--)
                            {
                                var itemDelete = itemBPBOldRemovelst[i];
                                context.BaiPhatBieus.Remove(itemBPBOldRemovelst[i]);
                            }
                            context.SaveChanges();
                        }
                        else
                        {
                            var item = new TieuSu()
                            {
                                HoTen = !string.IsNullOrEmpty(model.HoTen) ? model.HoTen.Trim() : "",
                                LoaiChucVuId = (Guid)model.LoaiChucVuId,
                                Alias = !string.IsNullOrEmpty(model.Alias) ? model.Alias.Trim() : "",
                                BiDanh = !string.IsNullOrEmpty(model.BiDanh) ? model.BiDanh.Trim() : "",
                                SDT = !string.IsNullOrEmpty(model.SDT) ? model.SDT.Trim() : "",
                                NgaySinh = string.IsNullOrEmpty(model.NgaySinhSaveString) != true ? model.NgaySinhSaveString.ParseDate("dd/MM/yyyy") : (DateTime?)null,
                                QueQuan = !string.IsNullOrEmpty(model.QueQuan) ? model.QueQuan.Trim() : "",
                                NoiThuongTru = !string.IsNullOrEmpty(model.NoiThuongTru) ? model.NoiThuongTru.Trim() : "",
                                TonGiaoId = (Guid)model.TonGiaoId,
                                DanTocId = (Guid)model.DanTocId,
                                NgayVaoDang = string.IsNullOrEmpty(model.NgayVaoDangSaveString) != true ? model.NgayVaoDangSaveString.ParseDate("dd/MM/yyyy") : (DateTime?)null,
                                NgayChinhThuc = string.IsNullOrEmpty(model.NgayChinhThucSaveString) != true ? model.NgayChinhThucSaveString.ParseDate("dd/MM/yyyy") : (DateTime?)null,
                                KhenThuong = !string.IsNullOrEmpty(model.KhenThuong) ? model.KhenThuong.Trim() : "",
                                TrinhDoChuyenMon = !string.IsNullOrEmpty(model.TrinhDoChuyenMon) ? model.TrinhDoChuyenMon.Trim() : "",
                                TrinhDoLyLuanChinhTri = !string.IsNullOrEmpty(model.TrinhDoLyLuanChinhTri) ? model.TrinhDoLyLuanChinhTri.Trim() : "",
                                UrlAvt1 = model.UrlAvt1,
                                UrlAvt2 = model.UrlAvt2,
                                ChucVu = !string.IsNullOrEmpty(model.ChucVu) ? model.ChucVu.Trim() : "",
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
                            context.TieuSus.Add(item);
                            context.SaveChanges();
                            var newModel = item.Clone();
                            HistoryDal.Write(User.Identity.GetUserId(), "TieuSus", HistoryActionEnum.Add, item.Id, null, newModel, GetClientIp(), context: context);
                        }
                        foreach (QuaTrinhCongTacModel itemQTCTmodel in model.QTCTlst)
                        {
                            int valueThuTu = -1;
                            if (!string.IsNullOrEmpty(itemQTCTmodel.ThuTu))
                            {
                                if (int.TryParse(itemQTCTmodel.ThuTu.Trim(), out int value))
                                {
                                    valueThuTu = int.Parse(itemQTCTmodel.ThuTu.Trim());
                                }
                                else
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.UnSuccess,
                                        Message = @"Thứ tự quá trình công tác phải là số!"
                                    });
                                }
                            }
                            else
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Thứ tự quá trình công tác là bắt buộc!"
                                });
                            }
                            if (string.IsNullOrEmpty(itemQTCTmodel.NoiDung))
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Nội dung không được rỗng!"
                                });
                            }
                            if (!string.IsNullOrEmpty(itemQTCTmodel.TuNgayDenNgay))
                            {
                                if (itemQTCTmodel.TuNgayDenNgay.Trim().Length > 1000)
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.UnSuccess,
                                        Message = @"Từ ngày đến ngày không được dài quá 1000 ký tự!"
                                    });
                                }
                            }
                            var itemQTCT = new QuaTrinhCongTac()
                            {
                                Id = Guid.NewGuid(),
                                TieuSuId = idRandom,
                                ThuTu = valueThuTu,
                                //TuNgay = string.IsNullOrEmpty(itemQTCTmodel.TuNgaySaveString) != true ? itemQTCTmodel.TuNgaySaveString.ParseDate("MM/yyyy") : (DateTime?)null,
                                //DenNgay = string.IsNullOrEmpty(itemQTCTmodel.DenNgaySaveString) != true ? itemQTCTmodel.DenNgaySaveString.ParseDate("MM/yyyy") : (DateTime?)null,
                                NoiDung = itemQTCTmodel.NoiDung.Trim(),
                                TuNgayDenNgay = !string.IsNullOrEmpty(itemQTCTmodel.TuNgayDenNgay) ? itemQTCTmodel.TuNgayDenNgay.Trim() : "",
                            };
                            context.QuaTrinhCongTacs.Add(itemQTCT);
                            context.SaveChanges();
                        }
                        foreach (HinhAnhHoatDongModel itemHAGDmodel in model.HAHDlst)
                        {
                            if (string.IsNullOrEmpty(itemHAGDmodel.Url))
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Hình ảnh là bắt buộc!"
                                });
                            }
                            else if (itemHAGDmodel.Url.Trim().Length > 1000)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Url hình ảnh không được dài quá 1000 ký tự!"
                                });
                            }
                            if (!string.IsNullOrEmpty(itemHAGDmodel.ThumbUrl))
                            {
                                if (itemHAGDmodel.ThumbUrl.Trim().Length > 1000)
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.UnSuccess,
                                        Message = @"ThumbUrl không được dài quá 1000 ký tự!"
                                    });
                                }
                            }
                            if (!string.IsNullOrEmpty(itemHAGDmodel.TenHinh))
                            {
                                if (itemHAGDmodel.TenHinh.Trim().Length > 1000)
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.UnSuccess,
                                        Message = @"Tên hình không được dài quá 1000 ký tự!"
                                    });
                                }
                            }
                            var itemHAHD = new HinhAnhHoatDong()
                            {
                                Id = Guid.NewGuid(),
                                TieuSuId = idRandom,
                                Url = itemHAGDmodel.Url,
                                ThumbUrl = itemHAGDmodel.ThumbUrl,
                                TenHinh = !string.IsNullOrEmpty(itemHAGDmodel.TenHinh) ? itemHAGDmodel.TenHinh.Trim() : "",
                                MoTa = !string.IsNullOrEmpty(itemHAGDmodel.MoTa) ? itemHAGDmodel.MoTa.Trim() : "",
                            };
                            context.HinhAnhHoatDongs.Add(itemHAHD);
                            context.SaveChanges();
                        }
                        foreach (BaiPhatBieuModel itemBPBmodel in model.BPBlst)
                        {
                            if (string.IsNullOrEmpty(itemBPBmodel.TieuDe))
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Tiêu đề là bắt buộc!"
                                });
                            } else if (itemBPBmodel.TieuDe.Trim().Length > 1000)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.UnSuccess,
                                    Message = @"Tiêu đề không được dài quá 1000 ký tự!"
                                });
                            }
                            if (!string.IsNullOrEmpty(itemBPBmodel.MoTaNgan))
                            {
                                if (itemBPBmodel.MoTaNgan.Trim().Length > 1000)
                                {
                                    return Json(new ResultModel()
                                    {
                                        Code = ResultCode.UnSuccess,
                                        Message = @"Mô tả ngắn không được dài quá 1000 ký tự!"
                                    });
                                }
                            }
                            var itemBPB = new BaiPhatBieu()
                            {
                                Id = Guid.NewGuid(),
                                TieuSuId = idRandom,
                                NgayDang = string.IsNullOrEmpty(itemBPBmodel.NgayDangSaveString) != true ? itemBPBmodel.NgayDangSaveString.ParseDate("dd/MM/yyyy") : (DateTime?)null,
                                TieuDe = itemBPBmodel.TieuDe.Trim(),
                                MoTaNgan = !string.IsNullOrEmpty(itemBPBmodel.MoTaNgan) ? itemBPBmodel.MoTaNgan.Trim() : "",
                                NoiDung = !string.IsNullOrEmpty(itemBPBmodel.NoiDung) ? itemBPBmodel.NoiDung.Trim() : "",
                                CreateDate = DateTime.Now,
                                CreateUserId = User.Identity.GetUserId(),
                                LanguageId = "vi",
                                Tag = "",
                                Status = StatusEnum.Used,
                                UpdateDate = DateTime.Now,
                                UpdateUserId = User.Identity.GetUserId(),
                                UnitCode = currentUnitCode,
                            };
                            context.BaiPhatBieus.Add(itemBPB);
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
