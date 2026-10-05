using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
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
	public class EOfficeController : BaseApiController
	{
		[HttpPost]
		public IHttpActionResult GetList(EOfficeModel input)
		{
			try
			{
				using (var db = new WebDbContext())
				{
					string userId = userId = User.Identity.GetUserId();
					var user = db.Users.FirstOrDefault(s => s.Id == userId && s.Status == StatusEnum.Used);

					if (User.IsInRole(RoleCode.SuperAdminSystem))
					{
						user.UnitCode = input.UnitCode;
					}

					var cmd = db.Database.Connection.CreateCommand();

					cmd.CommandText = "[dbo].[Portal_EOffice_GetDocuments]";
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.Add(new SqlParameter("@p_unitcode", user.UnitCode ));
					cmd.Parameters.Add(new SqlParameter("@p_keyword", input.Keyword));
					cmd.Parameters.Add(new SqlParameter("@p_status", input.Status));
					cmd.Parameters.Add(new SqlParameter("@p_page_index", input.PageIndex ?? 1));
					cmd.Parameters.Add(new SqlParameter("@p_page_size", input.PageSize ?? 10));
					var connection = db.Database.Connection;
					if (connection.State != ConnectionState.Open)
						connection.Open();
					using (var reader = cmd.ExecuteReader())
					{
                        List<EOffice> resultTemp = ((IObjectContextAdapter)db).ObjectContext
                            .Translate<EOffice>(reader)
                            .ToList();
                        reader.NextResult();

                        var total = ((IObjectContextAdapter)db).ObjectContext
                            .Translate<int>(reader)
                            .FirstOrDefault();
                        connection.Close();
						return Json(new ResultModel
						{
							Code = ResultCode.Success,
							Result = resultTemp,
							TotalRow = total
						});
					}
				}
			}
			catch (Exception e)
			{
				return Json(new ResultModel
				{
					Code = ResultCode.Exception,
					Message = e.Message + "\n" + e.StackTrace,
					Result = null
				});
			}
		}
		[HttpPost]
		public IHttpActionResult ChangeStatus(EOfficeModel item)
		{
			try
			{
				using (var db = new WebDbContext())
				{
					var record = db.EOffices.FirstOrDefault(s => s.Id == item.Id && s.Status != item.Status);
					if (record != null)
					{
						var oldModel = record.Clone();

						record.Status = item.Status;
						db.Entry(record).State = EntityState.Modified;
						var result = db.SaveChanges();

						var newModel = record.Clone();
						HistoryDal.Write(User.Identity.GetUserId(), "EOffices", HistoryActionEnum.Edit, record.Id, oldModel, newModel, GetClientIp(), context: db);

						return Json(new ResultModel()
						{
							Code = result > 0 ? ResultCode.Success : ResultCode.Fail,
							Message = result > 0 ? ResultCode.Success.ToString() : ResultCode.Fail.ToString(),
							Result = item
						});
					}
				}
				return Json(new ResultModel()
				{
					Code = ResultCode.NotFoundData,
					Message = ResultCode.NotFoundData.ToString(),
					Result = item
				});
			}
			catch (Exception e)
			{
				return Json(new ResultModel()
				{
					Code = ResultCode.Fail,
					Result = null,
					Message = e.Message
				});
			}
		}	
	}
}