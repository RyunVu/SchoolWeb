using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web.Http;
using System.Web.UI.WebControls;
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
    public class TemplateController : BaseApiController
    {
        [HttpPost]
        public IHttpActionResult GetListTable(TemplateModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var userId = User.Identity.GetUserId();
                    var userUnitCode = User.Identity.UnitCode();
                    var user = context.Users.FirstOrDefault(d => d.Status != StatusEnum.Deleted && d.Id == userId);
                    var templates = context.TableTemplates.Where(s => s.Status == StatusEnum.Used);

                    if (!string.IsNullOrEmpty(model.Keyword))
                    {
                        templates = templates.Where(s => s.UnsignName.Contains(model.Keyword));
                    }

                    if (userUnitCode != "LDG")
                    {
                        model.UnitCode = userUnitCode;
                    }

                    if (!string.IsNullOrEmpty(model.UnitCode))
                    {
                        templates = templates.Where(t => t.UnitCode == model.UnitCode);
                    }

                    var temp = templates.OrderByDescending(s => s.CreateDate).OrderByDescending(s => s.UpdateDate).ToList();
                    var result = temp.Paging(model).Select(s => new
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Type = s.Type,
                        PeriodType = s.PeriodType
                    }).ToList();
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
        public IHttpActionResult GetTableValues(GetTableValuesDTO dto)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var userId = User.Identity.GetUserId();
                    var user = context.Users.FirstOrDefault(d => d.Status != StatusEnum.Deleted && d.Id == userId);
                    if (user == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Not found user"
                        });
                    }
                    var cols = context.TableColumns.Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == dto.TableTemplateId).ToList();
                    var cells = context.TableCells.Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == dto.TableTemplateId).ToList();
                    var values = context.TableValues.Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == dto.TableTemplateId && s.Period == dto.Period).ToList();

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = new
                        {
                            Columns = cols,
                            Cells = cells,
                            Values = values
                        }
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
        public IHttpActionResult GetTableTemplateDetail(TableTemplate model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var userId = User.Identity.GetUserId();
                    var user = context.Users.FirstOrDefault(d => d.Status != StatusEnum.Deleted && d.Id == userId);
                    if (user == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Not found user"
                        });
                    }
                    var tableTemplate = context.TableTemplates.Where(s => s.Status == StatusEnum.Used && s.Id == model.Id).FirstOrDefault();
                    var cols = context.TableColumns.Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == model.Id).ToList();
                    var cells = context.TableCells.Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == model.Id).ToList();

                    if (tableTemplate == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Not found table template"
                        });
                    }

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = new
                        {
                            TableTemplate = tableTemplate,
                            Columns = cols,
                            Cells = cells,
                        }
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
        public IHttpActionResult GetTableGroups()
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var userId = User.Identity.GetUserId();
                    var user = context.Users.FirstOrDefault(d => d.Status != StatusEnum.Deleted && d.Id == userId);
                    if (user == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Not found user"
                        });
                    }
                    var tableGroups = context.GroupTables
                                        .Where(s => s.Status == StatusEnum.Used)
                                        .Select(s => new
                                        {
                                            Id = s.Id,
                                            Name = s.Name
                                        })
                                        .ToList();

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Result = tableGroups
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
        public IHttpActionResult SaveTableValues(SaveTableValuesDTO dto)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var userId = User.Identity.GetUserId();
                    var user = context.Users.FirstOrDefault(d => d.Status != StatusEnum.Deleted && d.Id == userId);
                    if (user == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Not found user"
                        });
                    }

                    var tableTemp = context.TableTemplates.FirstOrDefault(t => t.Status == StatusEnum.Used && t.Id == dto.TableTemplateId);

                    if (tableTemp == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Not found table template"
                        });
                    }

                    var oldValues = context.TableValues.Where(s => s.Status == StatusEnum.Used && s.TableTemplateId == dto.TableTemplateId && s.Period == dto.Period).ToList();

                    dto.Values.ForEach(value =>
                    {
                        value.Id = Guid.NewGuid();
                        value.TableTemplateId = dto.TableTemplateId;
                        value.Period = dto.Period;
                        value.Status = StatusEnum.Used;
                        value.CreateDate = DateTime.Now;
                        value.CreateUserId = userId;
                        value.UpdateUserId = userId;
                        value.UpdateDate = DateTime.Now;
                    });

                    // Remove old rows
                    if (oldValues.Count > 0)
                    {
                        context.TableValues.DeleteRangeByKey(oldValues);
                    }
                    // Add new rows
                    context.TableValues.AddRange(dto.Values);

                    context.SaveChanges();

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Message = "Success"
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
        public IHttpActionResult CreateTableTemplate(TableTemplateDTO dto)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var userId = User.Identity.GetUserId();
                    var userUnitCode = User.Identity.UnitCode();
                    var user = context.Users.FirstOrDefault(d => d.Status != StatusEnum.Deleted && d.Id == userId);
                    if (user == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Not found user"
                        });
                    }

                    dto.Table.Id = Guid.NewGuid();
                    dto.Table.Status = StatusEnum.Used;
                    dto.Table.CreateDate = DateTime.Now;
                    dto.Table.CreateUserId = userId;

                    if (userUnitCode != "LDG")
                    {
                        dto.Table.UnitCode = userUnitCode;
                    }

                    // Add new table template
                    context.TableTemplates.Add(dto.Table);

                    dto.Columns.ForEach(value =>
                    {
                        value.TableTemplateId = dto.Table.Id;
                        value.Status = StatusEnum.Used;
                        value.CreateDate = DateTime.Now;
                        value.CreateUserId = userId;
                    });

                    // Add new columns
                    context.TableColumns.AddRange(dto.Columns);

                    dto.Cells.ForEach(cell =>
                    {
                        cell.TableTemplateId = dto.Table.Id;
                        cell.Status = StatusEnum.Used;
                        cell.CreateDate = DateTime.Now;
                        cell.CreateUserId = userId;
                    });

                    // Add new cells
                    context.TableCells.AddRange(dto.Cells);

                    context.SaveChanges();

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Message = "Success"
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
        public IHttpActionResult UpdateTableTemplate(TableTemplateDTO dto)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var userId = User.Identity.GetUserId();
                    var userUnitCode = User.Identity.UnitCode();
                    var user = context.Users.FirstOrDefault(d => d.Status != StatusEnum.Deleted && d.Id == userId);
                    if (user == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Not found user"
                        });
                    }

                    var tableTemplate = context.TableTemplates.FirstOrDefault(d => d.Status == StatusEnum.Used && d.Id == dto.Table.Id);
                    if (tableTemplate == null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Not found table template"
                        });
                    }

                    tableTemplate.Name = dto.Table.Name;
                    tableTemplate.UnsignName = dto.Table.UnsignName;
                    tableTemplate.Order = dto.Table.Order;
                    tableTemplate.Type = dto.Table.Type;
                    tableTemplate.GroupTableId = dto.Table.GroupTableId;
                    tableTemplate.PeriodType = dto.Table.PeriodType;
                    if (userUnitCode == "LDG")
                    {
                        tableTemplate.UnitCode = dto.Table.UnitCode;
                    }
                    tableTemplate.UpdateUserId = userId;
                    tableTemplate.UpdateDate = DateTime.Now;
                    context.Entry(tableTemplate).State = EntityState.Modified;

                    // Remove all old columns
                    var oldColumns = context.TableColumns.Where(col => col.TableTemplateId == tableTemplate.Id).ToList();
                    context.TableColumns.RemoveRange(oldColumns);

                    dto.Columns.ForEach(value =>
                    {
                        value.TableTemplateId = dto.Table.Id;
                        value.Status = StatusEnum.Used;
                        value.CreateDate = DateTime.Now;
                        value.CreateUserId = userId;
                    });

                    // Add new columns
                    context.TableColumns.AddRange(dto.Columns);

                    // Remove all old cells
                    var oldCells = context.TableCells.Where(col => col.TableTemplateId == tableTemplate.Id).ToList();
                    context.TableCells.RemoveRange(oldCells);

                    dto.Cells.ForEach(cell =>
                    {
                        cell.TableTemplateId = dto.Table.Id;
                        cell.Status = StatusEnum.Used;
                        cell.CreateDate = DateTime.Now;
                        cell.CreateUserId = userId;
                    });

                    // Add new cells
                    context.TableCells.AddRange(dto.Cells);

                    context.SaveChanges();

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.Success,
                        Message = "Success"
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
    }

    public class SaveTableValuesDTO
    {
        public Guid TableTemplateId { get; set; }
        public string Period { get; set; }

        public List<TableValue> Values { get; set; }
    }

    public class GetTableValuesDTO
    {
        public Guid TableTemplateId { get; set; }
        public string Period { get; set; }
    }
    public class TableTemplateDTO
    {
        public TableTemplate Table { get; set; }
        public List<TableColumn> Columns { get; set; }
        public List<Base.TableCell> Cells { get; set; }
    }
}
