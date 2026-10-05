using System;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;
using Newtonsoft.Json;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    [VnptAuthorization]
    public class HistoryController : ApiController
    {
        [HttpPost]
        public IHttpActionResult Histories(HistoryInputModel model)
        {
            try
            {
                //todo: 7. Clone procude từ \Source.CucThongKe\VNPT.Web.Portal\VNPT.Web.Portal.Api\Files\Histories.sql
                using (var context = new WebDbContext())
                {
                    var menu = context.SystemMenus.FirstOrDefault(s =>
                        s.Action == "system/lich-su-nguoi-dung" && s.Status != StatusEnum.Deleted);
                    if (menu == null)
                    {
                        menu = new SystemMenu
                        {
                            Status = StatusEnum.Used,
                            CreateDate = DateTime.Now,
                            Id = Guid.NewGuid(),
                            MenuCode = "Web",
                            Icon = "fas fa-history",
                            Action = "system/lich-su-nguoi-dung",
                            Title = "Lịch sử theo người dùng",
                            SortNo = 10,
                            RoleLevel = 0,
                            IsShowMenu = false,
                            IsUseParameterUrl = true,
                        };
                        context.SystemMenus.Add(menu);
                        context.SaveChanges();
                    }
                    menu = context.SystemMenus.FirstOrDefault(s =>
                        s.Action == "system/lich-su" && s.Status != StatusEnum.Deleted);
                    if (menu == null)
                    {
                        menu = new SystemMenu
                        {
                            Status = StatusEnum.Used,
                            CreateDate = DateTime.Now,
                            Id = Guid.NewGuid(),
                            MenuCode = "Web",
                            Icon = "fas fa-history",
                            Action = "system/lich-su",
                            Title = "Lịch sử thay đổi",
                            SortNo = 11,
                            RoleLevel = 0,
                            IsShowMenu = false,
                            IsUseParameterUrl = true,
                        };
                        context.SystemMenus.Add(menu);
                        context.SaveChanges();
                    }
                    model.PageIndex = model.PageIndex ?? 1;
                    model.PageSize = model.PageSize ?? 10;

                    var cmd = context.Database.Connection.CreateCommand();
                    cmd.CommandText = "[dbo].[Histories_list]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_item_id", model.ItemId));
                    cmd.Parameters.Add(new SqlParameter("@p_user_id", model.UserId));
                    cmd.Parameters.Add(new SqlParameter("@p_fromdate", string.IsNullOrEmpty(model.StartDate) ? (DateTime?)null : $@"{model.StartDate} 00:00:00".ParseDate("dd/MM/yyyy HH:mm:ss")));
                    cmd.Parameters.Add(new SqlParameter("@p_todate", string.IsNullOrEmpty(model.EndDate) ? (DateTime?)null : $@"{model.EndDate} 23:59:59".ParseDate("dd/MM/yyyy HH:mm:ss"))); //model.EndDate));
                    cmd.Parameters.Add(new SqlParameter("@p_page_index", model.PageIndex));
                    cmd.Parameters.Add(new SqlParameter("@p_page_size", model.PageSize));
                    cmd.Parameters.Add(new SqlParameter("@p_action", model.Action));

                    var connection = context.Database.Connection;
                    if (connection.State != ConnectionState.Open)
                        connection.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        var resultTemp = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<HistoryModel>(reader)
                            .ToList(); reader.NextResult();


                        var total = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<int>(reader)
                            .ToList();
                        connection.Close();

                        return Json(new ResultModel
                        {
                            Code = ResultCode.Success,
                            Message = ResultCode.Success.ToString(),
                            Result = resultTemp,
                            TotalRow = total.DefaultIfEmpty(0).FirstOrDefault()
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
        public IHttpActionResult History(HistoryInputModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    model.PageIndex = model.PageIndex ?? 1;
                    model.PageSize = model.PageSize ?? 10;


                    var cmd = context.Database.Connection.CreateCommand();
                    cmd.CommandText = "[dbo].[Get_History]";
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@p_id", model.Id));
                    var connection = context.Database.Connection;
                    connection.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        var resultTemp = ((IObjectContextAdapter)context).ObjectContext
                            .Translate<HistoryModel>(reader)
                            .ToList();
                        connection.Close();

                        if (resultTemp.Count == 0)
                        {
                            return Json(new ResultModel
                            {
                                Code = ResultCode.UnSuccess,
                                Message = "Không tìm thấy lịch sử",
                            });
                        }
                        return Json(new ResultModel
                        {
                            Code = ResultCode.Success,
                            Message = ResultCode.Success.ToString(),
                            Result = resultTemp.FirstOrDefault(),
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

    }


    public class HistoryInputModel : PagingModel
    {
        public Guid? ItemId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string UserId { get; set; }
        public Guid? Id { get; set; }
        public int? Action { get; set; }
    }

    public class HistoryModel
    {
        public Guid Id { get; set; }
        public Guid ItemId { get; set; }

         public string TableName { get; set; }

        public HistoryActionEnum Action { get; set; }

        public string OldVersion { get; set; }

        public Guid? ParentId { get; set; }

        public string NewVersion { get; set; }

       public string CurrentIp { get; set; }
       public string UserName { get; set; }
       public string Description { get; set; }
       public OtherFromHistory Note
       {
           get
           {
               try
               {
                  return JsonConvert.DeserializeObject<OtherFromHistory>(Description);
               }
               catch (Exception e)
               {
                Console.Write(e.Message);
                   return new OtherFromHistory();
               }
           }
       }

       public string ActionName
       {
           get
           {
               switch (Action)
               {
                   case HistoryActionEnum.Add:
                      return "Thêm mới";
                   case HistoryActionEnum.Edit:
                       return "Chỉnh sửa";
                    case HistoryActionEnum.Delete:
                        return "Xóa";
                    case HistoryActionEnum.Other:
                        return "Khác";
                    case HistoryActionEnum.Login:
                        return "Đăng nhập";
                    case HistoryActionEnum.View:
                        return "Xem";
                    default:
                       return Action.ToString();
               }
           }
       }

       public DateTime CreateDate { get; set; }
       public string CreateDateString => CreateDate.ToString("dd/MM/yyyy HH:mm:ss");
    }

}