using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using FluentScheduler;
using Newtonsoft.Json;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Base;
using VNPT.Core.Bkav;
using VNPT.Core.Models;
using Microsoft.AspNet.Identity;
using System.Net.Http.Headers;

namespace VNPT.Web.Portal.Api.Jobs
{
    public class EOfficeJob : IJob
    {
        public async void Execute()
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    using (var client = new HttpClient())
                    {
                        string basePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Files", "Eoffice");

                        var result = "";
                        List<Unit> listUnit;
                        listUnit = context.Units.Where(s => s.Status != StatusEnum.Deleted && string.IsNullOrEmpty(s.UnitCode) && s.UnitCode != "LDG").ToList();

                        foreach (var unit in listUnit)
                        {
                            var paramId = "ADDRESS_" + unit.Code;

                            var param = context.SystemParameters.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Id == paramId);

                            if (param != null)
                            {
                                var orgnaztion = new OrganizationModel()
                                {
                                    Code = param.Value4,
                                    ServiceUrl = "http://lienthongvanban.lamdong.gov.vn:8084/services/eDoc",
                                    Password = param.Value6,
                                    SaveFilePath = basePath
                                };

                                var re = eOffice.GetDocuments(orgnaztion);
                                WriteLog($@"{param.Value4}:{param.Value2}:{((List<ResponceEOffice>)re.Result).Count}");
                                if (re.Code != ResultCode.Success || re.Result == null)
                                {
                                    result += $@"{param.Value4}:{param.Value2}:{re.Message}";
                                    WriteLog($@"{param.Value4}:{param.Value2}:{re.Message}");
                                    continue;
                                }

                                var resultDetail = "";
                                var successCount = 0;
                                foreach (var item in (List<ResponceEOffice>)re.Result)
                                {
                                    var resultTemp = CreateNewVanBan(context, item, unit.Code);

                                    if (resultTemp == 1 || resultTemp == 3)
                                    {
                                        if (resultTemp == 3)
                                        {
                                            WriteLog($@"{param.Value4}:{param.Value2}:{item.Code}: Trùng");
                                        }
                                        else
                                        {
                                            WriteLog($@"{param.Value4}:{param.Value2}:{item.Code}", "Success");
                                        }

                                        successCount++;
                                        var sss = eOffice.ConfirmReceived(orgnaztion, item.DocumentId);
                                    }
                                    else
                                    {
                                        WriteLog($@"{param.Value4}:{param.Value2}:{item.Code}: Thêm không thành công");

                                        resultDetail += $@"
                                    {orgnaztion.Code}:{item.Code} - Error";
                                    }

                                    foreach (var itemResponceEOfficeFile in item.ResponceEOfficeFiles)
                                    {
                                        try
                                        {
                                            File.Delete(itemResponceEOfficeFile.FilePath);
                                        }
                                        catch (Exception e)
                                        {
                                            Console.WriteLine(e);
                                        }
                                    }
                                }
                                WriteLog($@"{param.Value4}:{param.Value2}:{successCount}/{((List<ResponceEOffice>)re.Result).Count}");

                                if (!string.IsNullOrEmpty(resultDetail))
                                {
                                    result += $@"{param.Value4}:{param.Value2}:{re.Message}";
                                    result += resultDetail;
                                }

                            }
                        }
                    }
                }                
            }
            catch (Exception e)
            {
                
            }        
        }

        int CreateNewVanBan(WebDbContext context, ResponceEOffice item, string unitCode)
        {
            try
            {
                var documentid = item.DocumentId;
                var newpath = $@"/Files/Eoffice/" + unitCode + "/" + documentid;

                var fullnewPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory) + newpath;

                if (!Directory.Exists(fullnewPath))
                {
                    Directory.CreateDirectory(fullnewPath);
                    if (item.ResponceEOfficeFiles.Count > 0)
                    {
                        foreach (var itemResponceEOfficeFile in item.ResponceEOfficeFiles)
                        {
                            System.IO.File.Copy(itemResponceEOfficeFile.FilePath, fullnewPath + "/" + itemResponceEOfficeFile.FileName);
                        }
                    }
                }

                var checkEOffice = context.EOffices.FirstOrDefault(x => x.Status != StatusEnum.Deleted && x.SoKyHieu == item.Code && x.NgayBanHanh == item.Date && x.UnitCode == unitCode);

                if (checkEOffice == null)
                {
                    var eOffice = new EOffice()
                    {
                        Id = Guid.NewGuid(),
                        SoKyHieu = item.Code,
                        NgayBanHanh = item.Date,
                        NguoiKy = item.SignerName,
                        TrichYeu = item.Subject,
                        CoQuanBanHanh = item.FromOrganzationName,
                        LoaiVanBan = item.DocumentType,
                        DocumentId = item.DocumentId,
                        Status = StatusEnum.Used,
                        CreateDate = DateTime.Now,
                        UpdateDate = DateTime.Now,
                        UnitCode = unitCode,
                        DinhKemUrl = newpath
                    };

                    context.EOffices.Add(eOffice);
                    context.SaveChanges();

                    return 1;
                }

                return 3;
            }
            catch (Exception)
            {
                return 0;
            }
        }

        private void WriteLog(string data, string type = "Error")
        {
            try
            {
                var now = DateTime.Now;
                var path = $@"/Files/Eoffice/Log/{type}";

                var fullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory) + path;

                if (!Directory.Exists(fullPath))
                {
                    Directory.CreateDirectory(fullPath);
                }
                var fileName = $@"{fullPath}/{now:ddMMyyyy}.txt";
                var text = $@"
------------------------------------------------------------------------------------------------------
Date: {DateTime.Now:dd/MM/yyyy HH:mm:ss}
Message: {data}
------------------------------------------------------------------------------------------------------
";
                var currentContent = string.Empty;
                if (File.Exists(fileName)) currentContent = File.ReadAllText(fileName);
                File.WriteAllText(fileName, text + currentContent);

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }
    }
}