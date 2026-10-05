using System;
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
    public class SystemParameterController : BaseApiController
    {
        [HttpPost]
        public IHttpActionResult GetParameterByCode(SystemParameter model)
        {
            try
            {
                using (WebDbContext contex = new WebDbContext())
                {
                    if (string.IsNullOrEmpty(model.UnitCode))
                    {
                        model.UnitCode = "LDG";
                    }

                    var param = contex.SystemParameters.FirstOrDefault(s => s.Code.ToLower() == model.Code.ToLower() && s.Status != StatusEnum.Deleted && s.UnitCode == model.UnitCode);

                    if (param != null)
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.Success,
                            Result = new
                            {
                                Value = param.Value,
                                Value2 = param.Value2,
                                Value3 = param.Value3,
                                Value4 = param.Value4,
                                Value5 = param.Value5,
                            },
                        });
                    }
                    else
                    {
                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Result = param,
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
    }
}
