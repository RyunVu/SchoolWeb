using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EdXML102;
using VNPT.Core.Bkav;
using VNPT.Web.Portal.Api.Jobs;
using VPCPXRoadSdk;
using VPCPXRoadSdk.eDocument;
using VPCPXRoadSdk.eDocument.Model;
using ServiceType = VPCPXRoadSdk.ServiceType;

namespace VNPT.Web.Portal.Api.Providers
{
    public class TrucLienThongV2Service
    {
        private readonly DocumentService _service;
        private readonly string _tempDownloadPath; // Đường dẫn tạm để SDK và service này làm việc

        /// <summary>
        /// Khởi tạo service với cấu hình được cung cấp.
        /// </summary>
        /// <param name="config">Đối tượng cấu hình ClientConf của SDK.</param>
        public TrucLienThongV2Service(ClientConf config)
        {
            var vpcpClient = new VPCPXRoadSdkClient { type = ServiceType.eDoc };
            _service = (DocumentService)vpcpClient.CreateService(config);

            // SDK cần một đường dẫn tạm để lưu file .edxml
            _tempDownloadPath = config.StorePathDir;
            if (string.IsNullOrEmpty(_tempDownloadPath))
            {
                // Cung cấp một đường dẫn mặc định nếu trong config không có
                _tempDownloadPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", "EofficeV2_Temp");
            }
            Directory.CreateDirectory(_tempDownloadPath);
        }

        /// <summary>
        /// Lấy danh sách tất cả văn bản đến từ Trục
        /// </summary>
        public async Task<List<DocumentInfo>> GetReceivedDocumentsAsync()
        {
            return await Task.Run(() =>
            {
                var req = new jsonHeaderInfo();
                req.Add("servicetype", "eDoc");
                req.Add("messagetype", eDocType.ElectronicDocument);
                // Không thêm fromDate, toDate để lấy tất cả

                GetReceivedEdocListResponse res = _service.getReceivedEdocList(req.getJson());

                if (res.status == "OK" && res.data != null)
                {
                    // Sửa lỗi logic: Subject phải là d.subject
                    return res.data.Select(d => new DocumentInfo
                    {
                        DocId = d.DocId,
                        FromOrganId = d.from,
                        Subject = d.messagetype,
                        SentDate = d.created_time
                    }).ToList();
                }

                // Trả về danh sách rỗng nếu có lỗi hoặc không có dữ liệu
                if (res.status != "OK")
                {
                    // Ghi lại lỗi từ Trục để dễ debug
                    System.Diagnostics.Debug.WriteLine($"Lỗi khi gọi GetReceivedEdocList: {res.ErrorDesc}");
                }
                return new List<DocumentInfo>();
            });
        }

        /// <summary>
        /// Tải một văn bản từ Trục, giải nén và trả về đối tượng chứa đầy đủ thông tin.
        /// Các file đính kèm sẽ được lưu vào một thư mục tạm.
        /// </summary>
        /// <param name="docId">Mã văn bản trên Trục.</param>
        /// <returns>Đối tượng ResponceEOffice chứa thông tin và đường dẫn tạm tới các file đính kèm.</returns>
        public async Task<ResponceEOffice> DownloadAndExtractDocumentAsync(string docId)
        {
            // 1. Tải file .edxml từ Trục
            var req = new jsonHeaderInfo();
            req.Add("docId", docId);
            req.Add("filePath", _tempDownloadPath);

            GetEdocResponse res = await Task.Run(() => _service.getEdoc(req.getJson()));

            if (res.status != "OK")
            {
                throw new Exception($"Không thể tải văn bản {docId} từ Trục: {res.ErrorDesc}");
            }

            string downloadedEdxmlPath = res.data;
            if (!File.Exists(downloadedEdxmlPath))
            {
                throw new FileNotFoundException($"SDK báo tải thành công nhưng không tìm thấy tệp {docId}.", downloadedEdxmlPath);
            }

            // Dùng try...finally để đảm bảo file .edxml tạm luôn được xóa
            try
            {
                // 2. Dùng EdXML102 để đọc file vừa tải
                using (var edXmlDoc = new EdXml102())
                {
                    edXmlDoc.FromFile(downloadedEdxmlPath);

                    // Tạo một thư mục tạm duy nhất cho các file đính kèm của văn bản này
                    string tempAttachmentDir = Path.Combine(_tempDownloadPath, Guid.NewGuid().ToString());
                    Directory.CreateDirectory(tempAttachmentDir);

                    var officeResponse = new ResponceEOffice
                    {
                        DocumentId = docId,
                        Code = $"{edXmlDoc.Code.Number}/{edXmlDoc.Code.Notation}",
                        Subject = edXmlDoc.Subject.Value,
                        Date = edXmlDoc.Promulgation.Date,
                        SignerName = edXmlDoc.SignerInfo.FullName,
                        FromOrganzationName = edXmlDoc.From.OrganName,
                        DocumentType = edXmlDoc.Document.Name,
                        ResponceEOfficeFiles = new List<ResponceEOfficeFile>()
                    };

                    // 3. Lưu các tệp đính kèm vào thư mục tạm
                    if (edXmlDoc.FileAttachList != null && edXmlDoc.FileAttachList.Any())
                    {
                        foreach (var attachment in edXmlDoc.FileAttachList)
                        {
                            string tempFilePath = Path.Combine(tempAttachmentDir, SanitizeFileName(attachment.FileName));
                            attachment.WriteFile(tempFilePath); // SDK tự ghi file

                            officeResponse.ResponceEOfficeFiles.Add(new ResponceEOfficeFile
                            {
                                FileName = attachment.FileName,
                                FilePath = tempFilePath // Quan trọng: Đây là đường dẫn tạm
                            });
                        }
                    }

                    return officeResponse;
                }
            }
            finally
            {
                // 4. Dọn dẹp file edxml đã tải về
                if (File.Exists(downloadedEdxmlPath))
                {
                    File.Delete(downloadedEdxmlPath);
                }
            }
        }

        /// <summary>
        /// Cập nhật trạng thái cho một gói tin văn bản đã nhận.
        /// </summary>
        /// <param name="docId">Mã định danh của văn bản (document ID) nhận từ Trục.</param>
        /// <param name="status">Trạng thái cần cập nhật ("done", "fail", "processing").</param>
        /// <param name="description">Mô tả thêm, hữu ích khi trạng thái là "fail".</param>
        /// <exception cref="Exception">Ném ra khi API trả về lỗi.</exception>
        public async Task UpdateStatusAsync(string docId, string status, string description = "")
        {
            await Task.Run(() =>
            {
                // Tạo đối tượng JSON request, tham chiếu từ code mẫu
                var req = new jsonHeaderInfo();
                req.Add("docId", docId); // mã văn bản nhận
                req.Add("status", status); // trạng thái (done, fail, processing)

                // Thêm mô tả nếu có
                if (!string.IsNullOrEmpty(description))
                {
                    req.Add("description", description);
                }

                // Gọi SDK để gửi trạng thái gói tin văn bản
                UpdateStatusResponse res = _service.updateStatus(req.getJson());

                // Kiểm tra kết quả trả về
                if (res.status != "OK")
                {
                    string errorMessage = $"Cập nhật trạng thái '{status}' cho docId '{docId}' thất bại: {res.ErrorDesc}";
                    // Ném ra ngoại lệ để bên gọi xử lý
                    throw new Exception(errorMessage);
                }
            });
        }

        /// <summary>
        /// Hàm tiện ích để cập nhật trạng thái "done" cho một văn bản.
        /// </summary>
        /// <param name="docId">Mã định danh của văn bản (document ID).</param>
        public Task UpdateDoneStatusAsync(string docId)
        {
            // Gọi hàm gốc với trạng thái là "done"
            return UpdateStatusAsync(docId, "done");
        }

        private static string SanitizeFileName(string name)
        {
            // 1. Thay thế các ký tự không hợp lệ trong tên file bằng dấu "_"
            string sanitizedName = string.Join("_", name.Split(Path.GetInvalidFileNameChars()));

            // 2. Kiểm tra và rút ngắn độ dài tên file nếu cần thiết
            // MAX_FILENAME_LENGTH nên nhỏ hơn 260 trừ đi độ dài đường dẫn thư mục gốc của bạn.
            // Chọn một giá trị an toàn như 150 là hợp lý.
            const int MAX_FILENAME_LENGTH = 80;

            if (sanitizedName.Length > MAX_FILENAME_LENGTH)
            {
                // Lấy phần mở rộng của file (ví dụ: ".pdf", ".docx")
                string extension = Path.GetExtension(sanitizedName);

                // Lấy tên file không bao gồm phần mở rộng
                string nameWithoutExtension = Path.GetFileNameWithoutExtension(sanitizedName);

                // Tính toán độ dài tối đa cho phần tên file (trừ đi độ dài của phần mở rộng)
                int maxNameWithoutExtensionLength = MAX_FILENAME_LENGTH - extension.Length;
                if (maxNameWithoutExtensionLength <= 0)
                {
                    // Trường hợp hy hữu: phần mở rộng quá dài, chỉ lấy phần đầu của tên file
                    maxNameWithoutExtensionLength = MAX_FILENAME_LENGTH - 4; // Giữ chỗ cho ".ext"
                }

                // Cắt ngắn phần tên file
                string truncatedName = nameWithoutExtension.Substring(0, Math.Min(nameWithoutExtension.Length, maxNameWithoutExtensionLength));

                // Ghép lại tên file đã được rút ngắn với phần mở rộng
                sanitizedName = truncatedName.Trim() + extension;
            }

            return sanitizedName;
        }
    }
}
