using System;
using System.Linq;
using System.Web.Http;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    public class GeneralController : BaseApiController
    {
        [HttpPost]
        public IHttpActionResult GeneralCategories(GeneralCategoryModel model)
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    var items = context.GeneralCategories.Where(s => s.Status != StatusEnum.Deleted && s.Code == model.Code && (string.IsNullOrEmpty(s.UnitCode) || s.UnitCode.ToLower() == "ldg" || s.UnitCode.ToLower() == model.UnitCode.ToLower()));
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
      
        
    }
}
