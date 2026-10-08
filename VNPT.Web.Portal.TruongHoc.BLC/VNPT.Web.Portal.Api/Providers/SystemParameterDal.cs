using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Api.Models;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Providers
{
    public class SystemParameterDal
    {
        public static void SaveParameter(string code, string id, decimal? value = null, string value2 = null, string unitCode = "LDG")
        {
            using (WebDbContext contex = new WebDbContext())
            {

                var param = contex.SystemParameters.FirstOrDefault(s => s.Code.ToLower() == code.ToLower() && s.Id.ToLower() == id.ToLower() && unitCode.ToLower() == s.UnitCode.ToLower());
                if (param == null)
                {
                    contex.SystemParameters.Add(new SystemParameter()
                    {
                        Code = code,
                        Id = id,
                        Value2 = value2,
                        Value = value,
                        Status = StatusEnum.Used,
                        CreateDate = DateTime.Now,
                        UnitCode = unitCode
                    });
                }
                else
                {
                    param.Value2 = value2;
                    param.Value = value;
                    contex.Entry(param).State = EntityState.Modified;
                }

                contex.SaveChanges();

            }
        }

        public static PortalParameterModel GetParameter(string code, string id = null, string unitCode = null, WebDbContext context = null)
        {
            if (context == null)
            {
                using (context = new WebDbContext())
                {

                    var param = context.SystemParameters.Where(s => s.Code.ToLower() == code.ToLower());
                    if (!string.IsNullOrEmpty(id))
                    {
                        param = param.Where(s => s.Id.ToLower() == id.ToLower());
                    }
                    if (!string.IsNullOrEmpty(unitCode))
                    {
                        param = param.Where(s => s.UnitCode.ToLower() == unitCode.ToLower());
                    }

                    return param.ToList().Select(s => new PortalParameterModel(s)).FirstOrDefault();
                }
            }
            else
            {
                var param = context.SystemParameters.Where(s => s.Code.ToLower() == code.ToLower());
                if (!string.IsNullOrEmpty(id))
                {
                    param = param.Where(s => s.Id.ToLower() == id.ToLower());
                }
                if (!string.IsNullOrEmpty(unitCode))
                {
                    param = param.Where(s => s.UnitCode.ToLower() == unitCode.ToLower());
                }

                return param.ToList().Select(s => new PortalParameterModel(s)).FirstOrDefault();
            }
        }

        public static List<PortalParameterModel> GetParameters(string code, string unitCode = null)
        {
            using (var contex = new WebDbContext())
            {
                var param = contex.SystemParameters.Where(s => s.Code.ToLower() == code.ToLower());
                if (!string.IsNullOrEmpty(unitCode))
                {
                    param = param.Where(s => s.UnitCode.ToLower() == unitCode.ToLower());
                }
                return param.ToList().Select(s => new PortalParameterModel(s)).ToList();
            }
        }

        public static bool CheckDuyetTin(string unitCode = null)
        {
            try
            {
                var code = "DuyetTin";
                var param = GetParameter(code, null, unitCode);
                return param?.Value5 ?? false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static bool CheckDuyetTinTuTruong(string unitCode = null)
        {
            try
            {
                var code = "TinTucTuTruong_Duyet";
                var param = GetParameter(code, null, unitCode);
                return param?.Value5 ?? false;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}