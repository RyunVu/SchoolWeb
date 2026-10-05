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
using System.Data.Entity;

namespace VNPT.Web.Portal.Api.Jobs
{
    public class FixNewsJob : IJob
    {
        public async void Execute()
        {
            try
            {
                using (var context = new WebDbContext())
                {
                    // Loại tin tức
                    var listGeneralCategory = context.GeneralCategories.Where(x => x.Status != StatusEnum.Deleted && x.Code == "NewsType" && x.UnitCode != null).ToList().OrderBy(x => x.UnitCode).ToList();

                    foreach (var itemGeneralCategory in listGeneralCategory)
                    {
                        if (!string.IsNullOrEmpty(itemGeneralCategory.UnitCode) && string.IsNullOrEmpty(itemGeneralCategory.Value2))
                        {
                            // Cập nhật News
                            var listNewsClone = context.News.Where(x => x.Status != StatusEnum.Deleted && x.Code == itemGeneralCategory.Value && x.UnitCode == itemGeneralCategory.UnitCode).ToList();

                            foreach (var itemNews in listNewsClone)
                            {
                                if (itemNews.NewTypeId != itemGeneralCategory.Id)
                                {
                                    itemNews.NewTypeId = itemGeneralCategory.Id;

                                    context.Entry(itemNews).State = EntityState.Modified;
                                    var result = context.SaveChanges();
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