# Quy tắc code – VNPT Portal Trường học

## Tham số website (SystemParameters) phải có trên màn hình "Cấu hình website"

Mọi tham số mà portal đọc từ bảng `SystemParameters` – qua `SystemParameterDto.GetParameter/GetParameters`,
`SystemParameterDal`, hay truy vấn `context.SystemParameters` – đều phải được khai báo trong
`VNPT.Web.Portal.TruongHoc.BLC/VNPT.Web.Portal.Api/Providers/SiteConfigRegistry.cs`:

- **`Sections`**: tham số người dùng cần chỉnh → tự hiện trên màn hình Admin **Cấu hình website** (`#/cau-hinh-website`).
  Khai báo: `Code`, `IdKey` (phần đầu Id, `null` nếu portal đọc theo Code), `ValueField`, `Type`
  (text, textarea, image, imageList, color, number, switch, url, email, phone, mapEmbed, secret), `Label`, `Hint`, `UsedIn`.
- **`Excluded`**: tham số cố ý không đưa lên màn hình (dùng chung toàn hệ thống, đã tắt...) – bắt buộc ghi lý do.

API `SiteConfig/Save` chỉ cho lưu tham số có trong `Sections`, nên thiếu khai báo thì người dùng không cấu hình được.

**Khi thêm/đổi code có đọc tham số mới:** khai báo vào danh mục trên trong cùng thay đổi, chạy kiểm tra và
**nhắc người dùng** rằng tham số đã xuất hiện (hoặc vì sao bị loại) trên màn hình Cấu hình website:

```bash
node docs/tools/check-site-config.js
```

Lệnh báo lỗi (exit code 1) nếu có mã tham số đang được đọc mà chưa nằm trong `Sections` hoặc `Excluded`.

## File .cshtml / .css có tiếng Việt lưu UTF-8 có BOM

Các view Razor trong `VNPT.Web.Portal.Api` lưu dạng **UTF-8 with BOM** để thống nhất với file sẵn có
(Web.config đã đặt `globalization fileEncoding="utf-8"` để đọc đúng cả khi lỡ mất BOM).
