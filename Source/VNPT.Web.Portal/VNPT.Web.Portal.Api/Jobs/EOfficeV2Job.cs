using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using FluentScheduler;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using VNPT.Core.Bkav;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Api.Providers;
using VNPT.Web.Portal.Base;
using VPCPXRoadSdk;
using VPCPXRoadSdk.Execute;

namespace VNPT.Web.Portal.Api.Jobs
{
    public class EOfficeV2Job : IJob
    {
        public async void Execute()
        {
            WriteLog("===== Bắt đầu phiên làm việc EOfficeV2Job =====", "Info");
            try
            {
                using (var context = new WebDbContext())
                {
                    // Lấy các cấu hình chung từ Web.config
                    var endpoint = ConfigurationManager.AppSettings["EOfficeV2_Endpoint"] ?? "https://ltvb.lamdong.gov.vn";
                    var protocol = ConfigurationManager.AppSettings["EOfficeV2_Protocol"] ?? "HTTPS";
                    var tempStorePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", "EofficeV2_Temp");

                    var listUnit = context.Units.Where(s => s.Status != StatusEnum.Deleted).ToList();

                    foreach (var unit in listUnit)
                    {
                        WriteLog($"Bắt đầu xử lý cho đơn vị: {unit.Name} ({unit.Code})", "Info");
                        var paramId = $"EOFFICEV2_CONFIG_{unit.Code}";
                        var param = context.SystemParameters.FirstOrDefault(s => s.Status != StatusEnum.Deleted && s.Id == paramId);

                        if (param == null || string.IsNullOrWhiteSpace(param.Value2))
                        {
                            WriteLog($"Không tìm thấy hoặc cấu hình rỗng cho đơn vị {unit.Code}. Bỏ qua.", "Warning");
                            continue;
                        }

                        EofficeV2Config unitConfig;
                        try
                        {
                            unitConfig = JsonConvert.DeserializeObject<EofficeV2Config>(param.Value2);
                            if (string.IsNullOrEmpty(unitConfig.SystemId) || string.IsNullOrEmpty(unitConfig.SecretKey))
                            {
                                throw new Exception("SystemId hoặc SecretKey trong JSON rỗng.");
                            }
                        }
                        catch (Exception ex)
                        {
                            WriteLog($"Lỗi deserialize JSON cấu hình cho đơn vị {unit.Code}. Chi tiết: {ex.Message}", "Error");
                            continue;
                        }

                        // Tạo ClientConf cho SDK
                        var clientConf = new ClientConf
                        {
                            Endpoint = endpoint,
                            Protocol = protocol == "HTTPS" ? NetworkProtocol.HTTPS : NetworkProtocol.HTTP,
                            SystemId = unitConfig.SystemId,
                            SecretKey = unitConfig.SecretKey,
                            StorePathDir = tempStorePath, // Đường dẫn thư mục tạm
                            writelog = true,
                            HmacAlgorithm = "HMACSHA256"
                        };

                        TrucLienThongV2Service service = null;
                        try
                        {
                            service = new TrucLienThongV2Service(clientConf);
                            var documentList = await service.GetReceivedDocumentsAsync();

                            if (documentList.Count == 0)
                            {
                                WriteLog($"Không tìm thấy văn bản mới nào cho đơn vị {unit.Code}.", "Info");
                                continue;
                            }

                            WriteLog($"Tìm thấy {documentList.Count} văn bản cho đơn vị {unit.Code}. Bắt đầu xử lý chi tiết.", "Info");

                            int successCount = 0;
                            foreach (var docInfo in documentList)
                            {
                                // KIỂM TRA TRÙNG LẶP DỰA TRÊN DOCID
                                var isExist = context.EOffices.Any(e => e.DocumentId == docInfo.DocId && e.UnitCode == unit.Code);
                                if (isExist)
                                {
                                    WriteLog($"Văn bản có DocId {docInfo.DocId} đã tồn tại. Cập nhật trạng thái 'done' và bỏ qua.", "Debug");
                                    try
                                    {
                                        // Gọi cập nhật trạng thái 'done' về Trục
                                        await service.UpdateDoneStatusAsync(docInfo.DocId);
                                    }
                                    catch (Exception ex)
                                    {
                                        // Ghi log nếu việc cập nhật trạng thái thất bại, nhưng vẫn tiếp tục vòng lặp
                                        WriteLog($"Lỗi khi cập nhật trạng thái 'done' cho DocId {docInfo.DocId} đã tồn tại. Chi tiết: {ex.Message}", "Warning");
                                    }
                                    continue;
                                }

                                ResponceEOffice extractedDoc = null;
                                try
                                {
                                    extractedDoc = await service.DownloadAndExtractDocumentAsync(docInfo.DocId);
                                    var result = CreateNewVanBanV2(context, extractedDoc, unit.Code);

                                    if (result)
                                    {
                                        successCount++;
                                        WriteLog($"Lưu thành công văn bản {extractedDoc.Code} (DocId: {docInfo.DocId}) cho đơn vị {unit.Code}.", "Success");

                                        // Báo trạng thái 'done' về Trục
                                        try
                                        {
                                            await service.UpdateDoneStatusAsync(docInfo.DocId);
                                            WriteLog($"Cập nhật trạng thái 'done' thành công cho DocId {docInfo.DocId}.", "Info");
                                        }
                                        catch (Exception ex)
                                        {
                                            WriteLog($"Lưu văn bản thành công nhưng lỗi khi cập nhật trạng thái 'done' cho DocId {docInfo.DocId}. Chi tiết: {ex.Message}", "Warning");
                                        }
                                    }
                                    else
                                    {
                                        WriteLog($"Lỗi khi gọi CreateNewVanBanV2 cho văn bản {extractedDoc?.Code} (DocId: {docInfo.DocId}).", "Error");
                                    }
                                }
                                catch (Exception ex)
                                {
                                    WriteLog($"Lỗi nghiêm trọng khi tải hoặc xử lý DocId {docInfo.DocId} cho đơn vị {unit.Code}. Chi tiết: {ex.Message}", "Error");
                                }
                                finally
                                {
                                    // Dọn dẹp các file đính kèm tạm sau khi đã xử lý xong
                                    if (extractedDoc?.ResponceEOfficeFiles != null && extractedDoc.ResponceEOfficeFiles.Any())
                                    {
                                        var tempDir = Path.GetDirectoryName(extractedDoc.ResponceEOfficeFiles.First().FilePath);
                                        try
                                        {
                                            Directory.Delete(tempDir, true);
                                        }
                                        catch (Exception ex)
                                        {
                                            WriteLog($"Không thể xóa thư mục tạm {tempDir}. Chi tiết: {ex.Message}", "Warning");
                                        }
                                    }
                                }
                            }
                            WriteLog($"Hoàn tất xử lý cho đơn vị {unit.Code}. Lưu thành công {successCount}/{documentList.Count} văn bản mới.", "Info");
                        }
                        catch (Exception ex)
                        {
                            WriteLog($"Lỗi khởi tạo hoặc kết nối dịch vụ cho đơn vị {unit.Code}. Chi tiết: {ex.Message}", "Error");
                        }
                    }
                }
            }
            catch (Exception e)
            {
                WriteLog($"LỖI TOÀN CỤC TRONG EOfficeV2Job: {e.ToString()}", "Fatal");
            }
            WriteLog("===== Kết thúc phiên làm việc EOfficeV2Job =====", "Info");
        }

        /// <summary>
        /// Lưu thông tin văn bản và file đính kèm vào DB và hệ thống file.
        /// Logic được điều chỉnh từ hàm CreateNewVanBan cũ.
        /// </summary>
        /// <returns>True nếu thành công, False nếu thất bại.</returns>
        bool CreateNewVanBanV2(WebDbContext context, ResponceEOffice item, string unitCode)
        {
            try
            {
                // Đường dẫn lưu trữ cuối cùng
                var newRelativePath = $"/Files/EofficeV2/{unitCode}/{item.DocumentId}";
                var fullNewPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, newRelativePath.TrimStart('/'));

                Directory.CreateDirectory(fullNewPath);

                // Copy file từ thư mục tạm sang thư mục lưu trữ cuối cùng
                if (item.ResponceEOfficeFiles.Any())
                {
                    foreach (var attachment in item.ResponceEOfficeFiles)
                    {
                        var destFile = Path.Combine(fullNewPath, Path.GetFileName(attachment.FilePath));
                        System.IO.File.Copy(attachment.FilePath, destFile, true);
                    }
                }

                // Tạo đối tượng EOffice để lưu vào DB
                var eOffice = new EOffice()
                {
                    Id = Guid.NewGuid(),
                    SoKyHieu = item.Code,
                    NgayBanHanh = item.Date,
                    NguoiKy = item.SignerName,
                    TrichYeu = item.Subject,
                    CoQuanBanHanh = item.FromOrganzationName,
                    LoaiVanBan = item.DocumentType,
                    DocumentId = item.DocumentId, // Quan trọng: Lưu lại DocId để kiểm tra trùng lặp
                    Status = StatusEnum.Used,
                    CreateDate = DateTime.Now,
                    UpdateDate = DateTime.Now,
                    UnitCode = unitCode,
                    DinhKemUrl = newRelativePath // Lưu đường dẫn tương đối
                };

                context.EOffices.Add(eOffice);
                context.SaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                WriteLog($"Lỗi trong hàm CreateNewVanBanV2 (DocId: {item.DocumentId}): {ex.ToString()}", "Error");
                return false;
            }
        }

        private void WriteLog(string data, string type = "Info")
        {
            try
            {
                var now = DateTime.Now;
                string basePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Files", "EofficeV2", "Log");
                string datePart = now.ToString("ddMMyyyy");

                // Tạo thư mục nếu chưa tồn tại
                if (!Directory.Exists(basePath))
                {
                    Directory.CreateDirectory(basePath);
                }

                // Đường dẫn file log tổng
                string allLogFile = Path.Combine(basePath, $"All_{datePart}.log");

                // Ghi nội dung log chung
                string logEntry = $@"[{now:yyyy-MM-dd HH:mm:ss}] [{type.ToUpper()}] {data}{Environment.NewLine}";
                File.AppendAllText(allLogFile, logEntry);

                // Nếu là lỗi thì ghi thêm vào file riêng cho lỗi
                if (type.Equals("Error", StringComparison.OrdinalIgnoreCase))
                {
                    string errorLogDir = Path.Combine(basePath, "Error");
                    if (!Directory.Exists(errorLogDir))
                    {
                        Directory.CreateDirectory(errorLogDir);
                    }

                    string errorLogFile = Path.Combine(errorLogDir, $"Error_{datePart}.log");
                    File.AppendAllText(errorLogFile, logEntry);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Logging failed: " + ex.Message);
            }
        }
    }

    public class EofficeV2Config
    {
        public string SystemId { get; set; }
        public string SecretKey { get; set; }
    }

    /// <summary>
    /// Lớp chứa thông tin tóm tắt của một văn bản trên Trục.
    /// </summary>
    public class DocumentInfo
    {
        public string DocId { get; set; } // Mã văn bản trên Trục
        public string FromOrganId { get; set; } // Mã đơn vị gửi
        public string Subject { get; set; } // Trích yếu
        public string SentDate { get; set; } // Ngày gửi
    }
}
