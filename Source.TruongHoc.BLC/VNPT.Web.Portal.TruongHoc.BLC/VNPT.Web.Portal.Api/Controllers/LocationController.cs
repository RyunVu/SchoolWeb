using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;
using VNPT.Core.Constants;
using VNPT.Core.Extentions;
using VNPT.Core.Models;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Controllers
{
    public class LatLongModel
    {
        public decimal lat { get; set; }
        public decimal lng { get; set; }
        public Guid CityId { get; set; }
    }

    public class FindWardModel : ResultModel
    {
        public new string Result { get; set; }
    }
    [AllowAnonymous]
    public class LocationController : BaseApiController
    {
        [HttpPost]
        public async Task<IHttpActionResult> FindWardByLatLong(LatLongModel model)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://quyhoach.dalat.vn/");
                client.DefaultRequestHeaders.Accept.Clear();
                HttpContent content = new StringContent(JsonConvert.SerializeObject(model), Encoding.UTF8, "application/json");
                //POST Method  
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var response = await client.PostAsync("api/quyhoach/FindWardByLatLong", content);
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsAsync<FindWardModel>();
                    if (result.TotalRow > 0 && !string.IsNullOrEmpty(result.Result))
                    {
                        using (var context = new WebDbContext())
                        {
                            var ward = context.LocationWards.FirstOrDefault(s => s.ParentId == model.CityId
                                 && (s.Tag.ToLower().Contains(result.Result.ToLower()) || s.Name.ToLower() == result.Result.ToLower() ));
                            if (ward != null)
                            {
                                return Json(new ResultModel()
                                {
                                    Code = ResultCode.Success,
                                    Message = "Bạn chắc chắn muốn báo phản ánh này về " + ward.Name + " không?",
                                    Result = new LocationModel()
                                    {
                                        Id = ward.Id,
                                        Name = ward.Name,
                                        HasOtp = ward.HasOtp
                                    }
                                });
                            }

                        }


                        return Json(new ResultModel()
                        {
                            Code = ResultCode.NotFoundData,
                            Message = "Không thể xác định được vị trí phản ánh. Bạn vui lòng chọn phường!",
                        });
                    }

                    return Json(new ResultModel()
                    {
                        Code = ResultCode.NotFoundData,
                        Message = "Không thể xác định được vị trí phản ánh. Bạn vui lòng chọn phường!",
                    });
                }
                return Json(new ResultModel()
                {
                    Code = ResultCode.UnSuccess,
                    Message = "Không thể xác định được vị trí phản ánh. Bạn vui lòng chọn phường!",
                });
            }
        }


        [HttpPost]
        public IHttpActionResult GetProvinces(LocationInput input)
        {
            try
            {
                input.Code = input.Code?.ToUpper() ?? "";
                using (var context = new WebDbContext())
                {
                    var types = context.LocationProvinces.Where(s => s.Status == StatusEnum.Used);

                    if (!string.IsNullOrEmpty(input.Keyword))
                    {
                        input.Keyword = input.Keyword.RemoveUnicode().ToLower();
                        types = types.ToList().Where(s => s.Name.ToLower().RemoveUnicode().Contains(input.Keyword)).AsQueryable();
                    }

                    var result = types.ToList().OrderBy(s=>s.OrderNo).ThenBy(s=>s.Name).Select(s => new LocationModel(s)).ToList();
                    var paging = result.Paging(input);
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = paging,
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
        public IHttpActionResult GetCities(LocationInput input)
        {
            try
            {
                input.Code = input.Code?.ToUpper() ?? "";
                using (var context = new WebDbContext())
                {
                    var types = context.LocationDistricts.Where(s => s.Status == StatusEnum.Used && s.ParentId == input.ParentId);

                    if (!string.IsNullOrEmpty(input.Keyword))
                    {
                        input.Keyword = input.Keyword.RemoveUnicode().ToLower();
                        types = types.ToList().Where(s => s.Name.ToLower().RemoveUnicode().Contains(input.Keyword)).AsQueryable();
                    }

                    var result = types.OrderBy(s => s.OrderNo).ThenBy(s => s.Name).ToList().Select(s => new LocationItem(s)).ToList();
                    var paging = result.Paging(input);
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = paging,
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
        public IHttpActionResult GetWards(LocationInput input)
        {
            try
            {
                input.Code = input.Code?.ToUpper() ?? "";
                using (var context = new WebDbContext())
                {
                    var types = context.LocationWards.Where(s => s.Status == StatusEnum.Used && s.ParentId == input.ParentId);

                    if (!string.IsNullOrEmpty(input.Keyword))
                    {
                        input.Keyword = input.Keyword.RemoveUnicode().ToLower();
                        types = types.ToList().Where(s => s.Name.ToLower().RemoveUnicode().Contains(input.Keyword)).AsQueryable();
                    }

                    var result = types.OrderBy(s => s.OrderNo).ThenBy(s => s.Name).ToList().OrderBy(s => s.CreateDate).Select(s => new LocationModel(s)).ToList();
                    var paging = result.Paging(input);
                    return Json(new ResultModel
                    {
                        Code = ResultCode.Success,
                        Result = paging,
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

    }
}
