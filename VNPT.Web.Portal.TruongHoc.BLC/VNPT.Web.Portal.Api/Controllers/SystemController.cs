using System;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Web.Http;

namespace VNPT.Web.Portal.Api.Controllers
{
    [AllowAnonymous]
    public class SystemController : ApiController
    {
        [HttpGet]
        [Route("api/System/Version")]
        public IHttpActionResult GetVersion()
        {
            try
            {
                var assembly = Assembly.GetExecutingAssembly();
                var asmVersion = assembly.GetName().Version?.ToString();
                var fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);

                // Lấy trực tiếp từ AssemblyInfo.cs: ưu tiên ProductVersion (InformationalVersion) -> FileVersion -> AssemblyVersion
                var version = !string.IsNullOrWhiteSpace(fileVersionInfo.ProductVersion)
                    ? fileVersionInfo.ProductVersion.Trim()
                    : (!string.IsNullOrWhiteSpace(fileVersionInfo.FileVersion)
                        ? fileVersionInfo.FileVersion.Trim()
                        : asmVersion);

                // Ngày giờ biên dịch DLL được lấy tự động trực tiếp từ file
                DateTime buildDate = File.GetLastWriteTime(assembly.Location);

                var data = new
                {
                    Version = version,
                    AssemblyVersion = asmVersion,
                    FileVersion = fileVersionInfo.FileVersion,
                    ProductVersion = fileVersionInfo.ProductVersion,
                    BuildDate = buildDate.ToString("dd/MM/yyyy HH:mm:ss"),
                    BuildNumber = buildDate.ToString("yyyyMMdd.HHmm"),
                    Environment = ".NET Framework " + System.Environment.Version,
                    Name = "VNPT Portal Truong Hoc API"
                };

                return Json(new
                {
                    Code = 200,
                    Message = "Lấy thông tin phiên bản API thành công",
                    Result = data
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    Code = 500,
                    Message = "Lỗi khi lấy thông tin phiên bản API: " + ex.Message
                });
            }
        }

        /// <summary>
        /// Cấu hình dùng chung cho các ứng dụng Angular (Admin, Phòng truyền thống), đọc từ Web.config
        /// để mỗi đơn vị chỉ cần cấu hình một chỗ (Web.{Mã}_{Tên}.config). Chỉ trả về giá trị công khai.
        /// </summary>
        [HttpGet]
        [Route("api/System/ClientConfig")]
        public IHttpActionResult GetClientConfig()
        {
            var mediaUrl = (ConfigurationManager.AppSettings["DomainMedia"] ?? "").Trim();
            if (mediaUrl.Length > 0 && !mediaUrl.EndsWith("/"))
            {
                mediaUrl += "/";
            }

            return Json(new
            {
                Code = 200,
                Result = new
                {
                    MediaUrl = mediaUrl,
                    Region = ConfigurationManager.AppSettings["Region"]
                }
            });
        }
    }
}
