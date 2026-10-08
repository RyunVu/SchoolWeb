using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Core.Web;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    /// <summary>
    /// Màn hình "Cấu hình website": đọc/lưu các tham số khai báo trong <see cref="SiteConfigRegistry"/>.
    /// </summary>
    [VnptAuthorization]
    public class SiteConfigController : ApiController
    {
        public class ValueModel
        {
            public decimal? Value { get; set; }
            public string Value2 { get; set; }
            public decimal? Value3 { get; set; }
            public string Value4 { get; set; }
            public bool? Value5 { get; set; }
            public string Value6 { get; set; }
            public string Value7 { get; set; }
            public string Description { get; set; }
        }

        public class SaveFieldModel : ValueModel
        {
            public string Code { get; set; }
            public string IdKey { get; set; }
            public string ValueField { get; set; }
        }

        public class SaveListItemModel
        {
            public string Value2 { get; set; }
            public string Value4 { get; set; }
        }

        public class SaveListModel
        {
            public string Code { get; set; }
            public string IdKey { get; set; }
            public List<SaveListItemModel> Items { get; set; } = new List<SaveListItemModel>();
        }

        public class SaveModel
        {
            public string UnitCode { get; set; }
            public List<SaveFieldModel> Fields { get; set; } = new List<SaveFieldModel>();
            public List<SaveListModel> Lists { get; set; } = new List<SaveListModel>();
        }

        public class UnitInput
        {
            public string UnitCode { get; set; }
        }

        [HttpPost]
        public IHttpActionResult Schema()
        {
            return Json(new ResultModel
            {
                Code = ResultCode.Success,
                Result = SiteConfigRegistry.Sections.Select(s => new
                {
                    s.Key,
                    s.Title,
                    s.Icon,
                    s.Color,
                    s.Description,
                    Fields = s.Fields.Select(f => new
                    {
                        f.Key, f.Code, f.IdKey, f.ValueField, f.Type, f.Label, f.Hint, f.Placeholder, f.Suffix, f.Group, f.Wide, f.Optional, f.UsedIn
                    })
                })
            });
        }

        /// <summary>Giá trị hiện tại của mọi tham số trong danh mục + danh sách tham số khác (chưa có trên màn hình).</summary>
        [HttpPost]
        public IHttpActionResult Get(UnitInput input)
        {
            try
            {
                using (var db = new WebDbContext())
                {
                    var unitCode = (input?.UnitCode ?? "").Trim();
                    var denied = CheckUnit(db, unitCode);
                    if (denied != null) return Json(denied);

                    var rows = db.SystemParameters.Where(s => s.Status != StatusEnum.Deleted && s.UnitCode == unitCode).ToList();

                    var values = new Dictionary<string, object>();
                    var lists = new Dictionary<string, object>();
                    var usedRows = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                    foreach (var field in SiteConfigRegistry.AllFields)
                    {
                        if (field.Type == SiteConfigRegistry.FieldType.ImageList)
                        {
                            var items = rows.Where(r => SameCode(r.Code, field.Code)).OrderBy(r => r.Id).ToList();
                            items.ForEach(r => usedRows.Add(RowKey(r)));
                            lists[field.Key] = items.Select(r => new { r.Id, r.Value2, r.Value4 }).ToList();
                            continue;
                        }

                        var row = FindRow(rows, field.Code, field.IdKey, unitCode);
                        if (row == null) continue;
                        usedRows.Add(RowKey(row));
                        values[field.Key] = ReadValue(row, field.ValueField);
                    }

                    var others = rows.Where(r => !usedRows.Contains(RowKey(r)))
                        .OrderBy(r => r.Code).ThenBy(r => r.Id)
                        .Select(r => new { r.Code, r.Id, r.Description })
                        .ToList();

                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = new { UnitCode = unitCode, Values = values, Lists = lists, Others = others }
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel { Code = ResultCode.Exception, Message = e.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult Save(SaveModel input)
        {
            try
            {
                using (var db = new WebDbContext())
                {
                    var unitCode = (input?.UnitCode ?? "").Trim();
                    var denied = CheckUnit(db, unitCode);
                    if (denied != null) return Json(denied);

                    var userId = User.Identity.GetUserId();
                    var now = DateTime.Now;
                    var rows = db.SystemParameters.Where(s => s.UnitCode == unitCode).ToList();

                    foreach (var item in input.Fields ?? new List<SaveFieldModel>())
                    {
                        var field = SiteConfigRegistry.FindField(item.Code, item.IdKey, item.ValueField);
                        if (field == null || field.Type == SiteConfigRegistry.FieldType.ImageList)
                        {
                            return Json(new ResultModel { Code = ResultCode.UnSuccess, Message = $"Tham số {item.Code}/{item.IdKey}/{item.ValueField} không có trong danh mục cấu hình." });
                        }

                        var row = FindRow(rows.Where(r => r.Status != StatusEnum.Deleted).ToList(), field.Code, field.IdKey, unitCode);
                        if (row == null)
                        {
                            var id = SiteConfigRegistry.FullId(field.IdKey ?? field.Code, unitCode);
                            row = rows.FirstOrDefault(r => SameCode(r.Code, field.Code) && string.Equals(r.Id, id, StringComparison.OrdinalIgnoreCase));
                            if (row == null)
                            {
                                row = NewRow(field.Code, id, unitCode, userId, now);
                                db.SystemParameters.Add(row);
                                rows.Add(row);
                            }
                        }

                        WriteValue(row, field.ValueField, item);
                        row.Status = StatusEnum.Used;
                        row.UpdateDate = now;
                        row.UpdateUserId = userId;
                    }

                    foreach (var list in input.Lists ?? new List<SaveListModel>())
                    {
                        var field = SiteConfigRegistry.AllFields.FirstOrDefault(f => f.Type == SiteConfigRegistry.FieldType.ImageList
                            && SameCode(f.Code, list.Code) && string.Equals(f.IdKey, list.IdKey, StringComparison.OrdinalIgnoreCase));
                        if (field == null)
                        {
                            return Json(new ResultModel { Code = ResultCode.UnSuccess, Message = $"Danh sách {list.Code} không có trong danh mục cấu hình." });
                        }

                        // Ghi theo thứ tự: {IdKey}_01_{Unit}, {IdKey}_02_{Unit}... (portal đọc theo thứ tự Id)
                        var keepIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                        var items = (list.Items ?? new List<SaveListItemModel>()).Where(i => !string.IsNullOrWhiteSpace(i.Value2)).ToList();
                        for (var i = 0; i < items.Count; i++)
                        {
                            var id = SiteConfigRegistry.FullId($"{field.IdKey}_{i + 1:00}", unitCode);
                            keepIds.Add(id);
                            var row = rows.FirstOrDefault(r => SameCode(r.Code, field.Code) && string.Equals(r.Id, id, StringComparison.OrdinalIgnoreCase));
                            if (row == null)
                            {
                                row = NewRow(field.Code, id, unitCode, userId, now);
                                db.SystemParameters.Add(row);
                                rows.Add(row);
                            }
                            row.Value2 = items[i].Value2.Trim();
                            row.Value4 = string.IsNullOrWhiteSpace(items[i].Value4) ? null : items[i].Value4.Trim();
                            row.Status = StatusEnum.Used;
                            row.UpdateDate = now;
                            row.UpdateUserId = userId;
                        }

                        foreach (var old in rows.Where(r => SameCode(r.Code, field.Code) && r.Status != StatusEnum.Deleted && !keepIds.Contains(r.Id)))
                        {
                            old.Status = StatusEnum.Deleted;
                            old.UpdateDate = now;
                            old.UpdateUserId = userId;
                        }
                    }

                    db.SaveChanges();
                    return Json(new ResultModel { Code = ResultCode.Success, Message = "Đã lưu cấu hình" });
                }
            }
            catch (Exception e)
            {
                return Json(new ResultModel { Code = ResultCode.Exception, Message = e.Message });
            }
        }

        /// <summary>SuperAdmin cấu hình mọi đơn vị; người khác chỉ cấu hình đơn vị của mình hoặc cổng mình quản trị.</summary>
        private ResultModel CheckUnit(WebDbContext db, string unitCode)
        {
            if (string.IsNullOrEmpty(unitCode))
            {
                return new ResultModel { Code = ResultCode.DataNotEnough, Message = "Vui lòng chọn đơn vị cần cấu hình!" };
            }

            if (User.IsInRole(RoleCode.SuperAdminSystem))
            {
                return null;
            }

            var userId = User.Identity.GetUserId();
            var ownUnit = User.Identity.UnitCode();
            var allowed = string.Equals(ownUnit, unitCode, StringComparison.OrdinalIgnoreCase)
                || db.SysPortals.Any(p => p.Status != StatusEnum.Deleted && p.UnitCode == unitCode && p.AdministratorId == userId);

            return allowed ? null : new ResultModel { Code = ResultCode.UnSuccess, Message = "Bạn không có quyền cấu hình website của đơn vị này!" };
        }

        /// <summary>Tìm dòng giống cách portal đọc: theo Id đầy đủ, hoặc theo Code khi IdKey = null.</summary>
        private static SystemParameter FindRow(List<SystemParameter> rows, string code, string idKey, string unitCode)
        {
            if (idKey == null)
            {
                return rows.Where(r => SameCode(r.Code, code)).OrderBy(r => r.Id).FirstOrDefault();
            }

            var id = SiteConfigRegistry.FullId(idKey, unitCode);
            return rows.FirstOrDefault(r => SameCode(r.Code, code) && string.Equals(r.Id, id, StringComparison.OrdinalIgnoreCase));
        }

        private static bool SameCode(string a, string b) => string.Equals(a, b, StringComparison.OrdinalIgnoreCase);

        private static string RowKey(SystemParameter r) => r.Code + "|" + r.Id;

        private static SystemParameter NewRow(string code, string id, string unitCode, string userId, DateTime now)
        {
            return new SystemParameter
            {
                Id = id,
                Code = code,
                UnitCode = unitCode,
                Status = StatusEnum.Used,
                Tag = "",
                LanguageId = "",
                CreateDate = now,
                CreateUserId = userId,
            };
        }

        private static object ReadValue(SystemParameter row, string valueField)
        {
            switch (valueField)
            {
                case "Value": return row.Value;
                case "Value2": return row.Value2?.Trim();
                case "Value3": return row.Value3;
                case "Value4": return row.Value4;
                case "Value5": return row.Value5;
                case "Value6": return row.Value6;
                case "Value7": return row.Value7;
                case "Description": return row.Description;
                default: return null;
            }
        }

        private static string Clean(string value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

        private static void WriteValue(SystemParameter row, string valueField, ValueModel v)
        {
            switch (valueField)
            {
                case "Value": row.Value = v.Value; break;
                case "Value2": row.Value2 = Clean(v.Value2); break;
                case "Value3": row.Value3 = v.Value3; break;
                case "Value4": row.Value4 = Clean(v.Value4); break;
                case "Value5": row.Value5 = v.Value5 ?? false; break;
                case "Value6": row.Value6 = Clean(v.Value6); break;
                case "Value7": row.Value7 = Clean(v.Value7); break;
                case "Description": row.Description = Clean(v.Description); break;
            }
        }
    }
}
