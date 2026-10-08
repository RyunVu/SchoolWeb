using System;
using System.Collections.Generic;
using System.Linq;

namespace VNPT.Web.Portal.Api.Providers
{
    /// <summary>
    /// DANH MỤC THAM SỐ CẤU HÌNH WEBSITE (màn hình Admin "Cấu hình website" – #/cau-hinh-website).
    ///
    /// QUY TẮC: mọi tham số SystemParameters mà portal đọc (SystemParameterDto.GetParameter/GetParameters,
    /// SystemParameterDal, hoặc truy vấn context.SystemParameters) đều PHẢI được khai báo ở đây để người dùng
    /// cấu hình được bằng giao diện trực quan. API SiteConfig chỉ cho lưu các tham số có trong danh mục này.
    ///
    /// Cách lưu trong bảng SystemParameters: Id = "{IdKey}_{UnitCode}" (đơn vị LDG thì không có hậu tố),
    /// Code = Code. IdKey = null nghĩa là portal đọc theo Code (GetParameter(code, null, unit)).
    /// </summary>
    public static class SiteConfigRegistry
    {
        public static class FieldType
        {
            public const string Text = "text";
            public const string TextArea = "textarea";
            public const string Image = "image";
            public const string ImageList = "imageList";
            public const string Color = "color";
            public const string Number = "number";
            public const string Switch = "switch";
            public const string Url = "url";
            public const string Email = "email";
            public const string Phone = "phone";
            public const string MapEmbed = "mapEmbed";
            public const string Secret = "secret";
        }

        public class Field
        {
            /// <summary>Khoá duy nhất trên giao diện: "{Code}|{IdKey}|{ValueField}"</summary>
            public string Key => $"{Code}|{IdKey}|{ValueField}";
            public string Code { get; set; }
            /// <summary>Phần đầu của Id (không gồm _UnitCode); null = đọc theo Code. Với ImageList là tiền tố Id.</summary>
            public string IdKey { get; set; }
            /// <summary>Value | Value2 | Value3 | Value4 | Value5 | Value6 | Value7 | Description</summary>
            public string ValueField { get; set; }
            public string Type { get; set; }
            public string Label { get; set; }
            public string Hint { get; set; }
            public string Placeholder { get; set; }
            /// <summary>Đơn vị hiển thị sau ô số (px, ms...)</summary>
            public string Suffix { get; set; }
            /// <summary>Nhóm nhỏ trong một mục (tiêu đề phụ)</summary>
            public string Group { get; set; }
            /// <summary>Ô rộng toàn dòng</summary>
            public bool Wide { get; set; }
            /// <summary>Chỉ dùng cho một số giao diện/cổng: không tính vào tiến độ "đã nhập"</summary>
            public bool Optional { get; set; }
            /// <summary>Nơi dùng tham số (để người dùng biết chỉnh sẽ thay đổi chỗ nào)</summary>
            public string UsedIn { get; set; }
        }

        public class Section
        {
            public string Key { get; set; }
            public string Title { get; set; }
            public string Icon { get; set; }
            public string Description { get; set; }
            public string Color { get; set; }
            public List<Field> Fields { get; set; } = new List<Field>();
        }

        public static readonly IReadOnlyList<Section> Sections = new List<Section>
        {
            new Section
            {
                Key = "header", Title = "Nhận diện & đầu trang", Icon = "fas fa-id-card", Color = "#3c8dbc",
                Description = "Logo, tên trường, màu chủ đạo và ảnh banner trên cùng của website.",
                Fields =
                {
                    new Field { Code = "FOOTER", IdKey = "LOGO", ValueField = "Value2", Type = FieldType.Image, Label = "Logo trường",
                        Hint = "Ảnh vuông, nền trong suốt (PNG) sẽ đẹp nhất.", UsedIn = "Đầu trang, chân trang, biểu tượng trên tab trình duyệt" },
                    new Field { Code = "FOOTER", IdKey = "NAME", ValueField = "Value2", Type = FieldType.Text, Label = "Tên trường hiển thị", Wide = true,
                        Placeholder = "VD: Trường THCS Rung Ré", UsedIn = "Đầu trang (giao diện mới), chân trang" },
                    new Field { Code = "COLOR", IdKey = "COLOR", ValueField = "Value2", Type = FieldType.Color, Label = "Màu chủ đạo",
                        Hint = "Áp dụng cho giao diện TruongHocTheme / MauGiaoTheme (menu, tiêu đề khối, chân trang). Giao diện Hiện đại / Trang nhã dùng bảng màu riêng.",
                        UsedIn = "Menu, tiêu đề các khối, chân trang" },
                    new Field { Code = "BANNER_HEADER", IdKey = "BANNER_HEADER", ValueField = "Value2", Type = FieldType.ImageList, Label = "Ảnh banner đầu trang", Wide = true,
                        Hint = "Có thể thêm nhiều ảnh, website tự chuyển ảnh. Nên dùng ảnh ngang, rộng ≥ 1200px.", UsedIn = "Dải banner trên cùng trang chủ" },
                    new Field { Optional = true, Group = "Riêng giao diện Mầm non (MauGiaoTheme)", Code = "BANNER_CENTER", IdKey = "BANNER_CENTER_LEFT", ValueField = "Value2", Type = FieldType.Image,
                        Label = "Ảnh trang trí bên trái", UsedIn = "Hai bên nền trang (giao diện Mầm non)" },
                    new Field { Optional = true, Group = "Riêng giao diện Mầm non (MauGiaoTheme)", Code = "BANNER_CENTER", IdKey = "BANNER_CENTER_RIGHT", ValueField = "Value2", Type = FieldType.Image,
                        Label = "Ảnh trang trí bên phải", UsedIn = "Hai bên nền trang (giao diện Mầm non)" },
                    new Field { Optional = true, Group = "Riêng cổng Phòng GD&ĐT", Code = "NAMEPORTANT", IdKey = "NAMEPORTANT", ValueField = "Value2", Type = FieldType.Text, Wide = true,
                        Label = "Dòng chữ chạy đầu trang", UsedIn = "Dòng chữ chạy dưới menu (giao diện Phòng GD&ĐT)" },
                }
            },
            new Section
            {
                Key = "footer", Title = "Chân trang & liên hệ", Icon = "fas fa-address-card", Color = "#00a65a",
                Description = "Địa chỉ, điện thoại, email, cơ quan chủ quản, bản đồ và chứng nhận Tín Nhiệm Mạng.",
                Fields =
                {
                    new Field { Group = "Thông tin liên hệ", Code = "FOOTER", IdKey = "ADDRESS", ValueField = "Value2", Type = FieldType.TextArea, Label = "Địa chỉ", Wide = true,
                        UsedIn = "Chân trang, dưới tên trường (giao diện Trang nhã)" },
                    new Field { Group = "Thông tin liên hệ", Code = "FOOTER", IdKey = "PHONE", ValueField = "Value2", Type = FieldType.Phone, Label = "Điện thoại",
                        UsedIn = "Chân trang, thanh trên cùng (giao diện Hiện đại)" },
                    new Field { Group = "Thông tin liên hệ", Code = "FOOTER", IdKey = "EMAIL", ValueField = "Value2", Type = FieldType.Email, Label = "Email",
                        UsedIn = "Chân trang, thanh trên cùng (giao diện Hiện đại)" },
                    new Field { Group = "Thông tin liên hệ", Code = "FOOTER", IdKey = "LINK_FACEBOOK", ValueField = "Value2", Type = FieldType.Url, Label = "Trang Facebook", Wide = true,
                        Placeholder = "https://www.facebook.com/...", UsedIn = "Chân trang (giao diện mới)" },
                    new Field { Group = "Dòng thông tin dưới chân trang", Code = "FOOTER", IdKey = "DESCRIPTION_1", ValueField = "Value2", Type = FieldType.Text, Label = "Dòng 1", Wide = true,
                        Placeholder = "VD: Cơ quan quản lý: UBND xã ...", UsedIn = "Chân trang" },
                    new Field { Group = "Dòng thông tin dưới chân trang", Code = "FOOTER", IdKey = "DESCRIPTION_2", ValueField = "Value2", Type = FieldType.Text, Label = "Dòng 2", Wide = true,
                        Placeholder = "VD: Chịu trách nhiệm chính: ...", UsedIn = "Chân trang" },
                    new Field { Group = "Dòng thông tin dưới chân trang", Code = "FOOTER", IdKey = "DESCRIPTION_3", ValueField = "Value2", Type = FieldType.Text, Label = "Dòng 3", Wide = true,
                        Placeholder = "VD: Ghi rõ nguồn khi phát hành lại thông tin từ website này", UsedIn = "Chân trang" },
                    new Field { Group = "Dòng thông tin dưới chân trang", Code = "FOOTER", IdKey = "LICENSE", ValueField = "Value2", Type = FieldType.Text, Label = "Giấy phép / bản quyền", Wide = true,
                        UsedIn = "Dòng cuối chân trang (giao diện mới)" },
                    new Field { Group = "Bản đồ", Code = "FOOTER", IdKey = "MAP", ValueField = "Value2", Type = FieldType.MapEmbed, Label = "Bản đồ Google Maps", Wide = true,
                        Hint = "Trên Google Maps: Chia sẻ → Nhúng bản đồ → Sao chép HTML rồi dán vào đây (hệ thống tự lấy đường dẫn).",
                        UsedIn = "Chân trang" },
                    new Field { Group = "Chứng nhận Tín Nhiệm Mạng", Code = "FOOTER", IdKey = "TINNHIEMMANG", ValueField = "Value2", Type = FieldType.Image, Label = "Ảnh logo Tín Nhiệm Mạng",
                        UsedIn = "Chân trang" },
                    new Field { Group = "Chứng nhận Tín Nhiệm Mạng", Code = "FOOTER", IdKey = "TINNHIEMMANG", ValueField = "Value4", Type = FieldType.Url, Label = "Link xác thực chứng nhận", Wide = true,
                        Placeholder = "https://tinnhiemmang.vn/danh-ba-tin-nhiem/...",
                        Hint = "Logo chỉ hiện khi có cả ảnh và link chứng nhận cụ thể (không phải trang chủ tinnhiemmang.vn).", UsedIn = "Chân trang" },
                }
            },
            new Section
            {
                Key = "home", Title = "Trang chủ & slide", Icon = "fas fa-images", Color = "#e08e0b",
                Description = "Chiều cao slide ảnh, tốc độ chuyển tin nổi bật, khối văn bản trên trang chủ.",
                Fields =
                {
                    new Field { Code = "SlideHinhAnh", IdKey = "ChieuCaoSlide", ValueField = "Value", Type = FieldType.Number, Label = "Chiều cao slide hình ảnh", Suffix = "px",
                        Placeholder = "400", Hint = "Để trống sẽ dùng 400px.", UsedIn = "Slide ảnh trên trang chủ (giao diện cũ)" },
                    new Field { Code = "SLICK", IdKey = "SLICK_PLAY_SPEED", ValueField = "Value", Type = FieldType.Number, Label = "Thời gian chuyển tin nổi bật", Suffix = "ms",
                        Placeholder = "3000", Hint = "1000 ms = 1 giây.", UsedIn = "Khối tin nổi bật chạy tự động (giao diện cũ)" },
                    new Field { Code = "DISPLAY", IdKey = "EOFFICE", ValueField = "Value5", Type = FieldType.Switch, Label = "Hiển thị khối tra cứu văn bản eOffice",
                        UsedIn = "Trang chủ, các trang văn bản" },
                }
            },
            new Section
            {
                Key = "news", Title = "Quy trình tin bài", Icon = "fas fa-clipboard-check", Color = "#605ca8",
                Description = "Bật/tắt bước duyệt trước khi tin được đăng lên website.",
                Fields =
                {
                    new Field { Code = "DuyetTin", IdKey = null, ValueField = "Value5", Type = FieldType.Switch, Label = "Tin phải được duyệt trước khi đăng",
                        Hint = "Bật: tin do người đăng tạo sẽ chờ người có quyền Duyệt tin duyệt.", UsedIn = "Admin > Tin tức" },
                    new Field { Code = "TinTucTuTruong_Duyet", IdKey = null, ValueField = "Value5", Type = FieldType.Switch, Label = "Duyệt tin gửi lên từ các trường",
                        UsedIn = "Admin > Tin tức từ trường (cổng Phòng GD&ĐT)" },
                }
            },
            new Section
            {
                Key = "integration", Title = "Tích hợp & bảo mật", Icon = "fas fa-plug", Color = "#d81b60",
                Description = "Google Analytics, Google Maps, reCAPTCHA chống spam, Zalo OA.",
                Fields =
                {
                    new Field { Group = "Thống kê & bản đồ", Code = "ANALYTICS", IdKey = null, ValueField = "Value2", Type = FieldType.Text, Label = "Mã Google Analytics",
                        Placeholder = "G-XXXXXXXXXX", UsedIn = "Mọi trang (thống kê truy cập Google)" },
                    new Field { Group = "Thống kê & bản đồ", Code = "GOOGLE_KEY_API", IdKey = null, ValueField = "Value2", Type = FieldType.Secret, Label = "Google Maps API key",
                        UsedIn = "Các trang có bản đồ" },
                    new Field { Group = "reCAPTCHA (chống spam form hỏi đáp, góp ý)", Code = "RECAPTCHA", IdKey = null, ValueField = "Value2", Type = FieldType.Text, Label = "Site key", Wide = true,
                        UsedIn = "Form gửi câu hỏi, đánh giá" },
                    new Field { Group = "reCAPTCHA (chống spam form hỏi đáp, góp ý)", Code = "RECAPTCHA", IdKey = null, ValueField = "Value4", Type = FieldType.Secret, Label = "Secret key", Wide = true,
                        UsedIn = "Kiểm tra reCAPTCHA phía máy chủ" },
                    new Field { Optional = true, Group = "Mạng xã hội", Code = "ZALOOAID", IdKey = null, ValueField = "Value2", Type = FieldType.Text, Label = "Zalo OA ID",
                        UsedIn = "Nút quan tâm Zalo trong chi tiết tin (cổng Phòng GD&ĐT)" },
                    new Field { Optional = true, Group = "Lấy tin từ cổng phường/xã", Code = "GETNEWSPHUONGXA", IdKey = "GETNEWSPHUONGXA", ValueField = "Value2", Type = FieldType.Text,
                        Label = "Mã đơn vị phường/xã", UsedIn = "Khối tin phường/xã trên trang chủ (một số trường có giao diện riêng)" },
                    new Field { Optional = true, Group = "Lấy tin từ cổng phường/xã", Code = "GETNEWSPHUONGXA", IdKey = "GETNEWSPHUONGXA", ValueField = "Value4", Type = FieldType.Url, Wide = true,
                        Label = "Địa chỉ API lấy tin", Placeholder = "https://...", UsedIn = "Khối tin phường/xã trên trang chủ" },
                    new Field { Optional = true, Group = "Lấy tin từ cổng phường/xã", Code = "GETNEWSPHUONGXA", IdKey = "GETNEWSPHUONGXA", ValueField = "Value6", Type = FieldType.Url, Wide = true,
                        Label = "Địa chỉ máy chủ ảnh", Placeholder = "https://...", UsedIn = "Ảnh của khối tin phường/xã" },
                }
            },
        };

        /// <summary>
        /// Tham số portal có đọc nhưng CỐ Ý không đưa lên màn hình (kèm lý do). Công cụ docs/tools/check-site-config.js
        /// dùng danh sách này: Code nào portal đọc mà không nằm trong Sections hoặc ở đây sẽ bị báo thiếu.
        /// </summary>
        public static readonly IReadOnlyDictionary<string, string> Excluded = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["MEDIAURL"] = "Link media lấy theo DomainMedia trong Web.config",
            ["SOLOGAN2"] = "Chỉ nằm trong khối HTML đã comment, không hiển thị",
            ["BANNER_CENTER3"] = "Có đọc nhưng không hiển thị ở giao diện nào",
            ["XUAT_XU"] = "Dùng cho hàm lấy văn bản đã tắt (getVanBan)",
            ["BieuNgu"] = "Slide biểu ngữ (MainCarousel) đã tắt trên các giao diện",
            ["ThumbFacebook"] = "Tham số chung toàn hệ thống (Id không theo đơn vị)",
            ["CheckLoginOTP"] = "Cấu hình đăng nhập toàn hệ thống, không theo website",
            ["SensitiveWords"] = "Danh sách từ nhạy cảm dùng chung mọi website (đọc không theo đơn vị) – sửa tại Tham số hệ thống",
            ["PortalRapidSecretKey"] = "Khoá hệ thống",
            ["SuperRapidSecretKey"] = "Khoá hệ thống",
        };

        public static IEnumerable<Field> AllFields => Sections.SelectMany(s => s.Fields);

        public static Field FindField(string code, string idKey, string valueField)
        {
            return AllFields.FirstOrDefault(f =>
                string.Equals(f.Code, code, StringComparison.OrdinalIgnoreCase)
                && string.Equals(f.IdKey ?? "", idKey ?? "", StringComparison.OrdinalIgnoreCase)
                && string.Equals(f.ValueField, valueField, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>Id đầy đủ trong bảng SystemParameters (giống SystemParameterDto.GetParameter).</summary>
        public static string FullId(string idKey, string unitCode)
        {
            return string.Equals(unitCode, "LDG", StringComparison.OrdinalIgnoreCase) ? idKey : $"{idKey}_{unitCode}";
        }
    }
}
