using System;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Helper
{
    /// <summary>
    /// Hàm dùng chung cho các theme TruongHocHienDai / TruongHocTrangNha (link, ảnh, mô tả ngắn của tin).
    /// </summary>
    public static class ThemeHelper
    {
        public const string NoImage = "/Images/noimage.png";

        /// <summary>Link của tin: tin dạng ảnh/link ngoài thì đi thẳng tới đó, còn lại tới trang chi tiết.</summary>
        public static string NewsLink(this UrlHelper url, News item)
        {
            if (item.IsNewsImage)
            {
                if (item.IsOpenImageOnly && !string.IsNullOrEmpty(item.ImageUrl))
                {
                    return url.Image(item.ImageUrl).ToString();
                }

                if (!string.IsNullOrEmpty(item.OtherUrl))
                {
                    return item.OtherUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase)
                        ? item.OtherUrl
                        : url.Site(item.OtherUrl).ToString();
                }
            }

            return url.Site("chi-tiet-tin-tuc", parameter: new { param = item.Alias }).ToString();
        }

        public static string NewsImage(this UrlHelper url, News item)
        {
            return string.IsNullOrEmpty(item.ImageUrl) ? NoImage : url.Image(item.ImageUrl).ToString();
        }

        /// <summary>Mô tả ngắn dạng text thuần (bỏ thẻ HTML), cắt theo số ký tự gần nhất ở ranh giới từ.</summary>
        public static string Excerpt(News item, int maxLength = 180)
        {
            var source = !string.IsNullOrWhiteSpace(item.ShortContent) ? item.ShortContent : item.Content;
            if (string.IsNullOrWhiteSpace(source))
            {
                return "";
            }

            var text = HttpUtility.HtmlDecode(Regex.Replace(source, "<[^>]+>", " "));
            text = Regex.Replace(text, @"\s+", " ").Trim();
            if (text.Length <= maxLength)
            {
                return text;
            }

            var cut = text.LastIndexOf(' ', maxLength);
            return text.Substring(0, cut > maxLength / 2 ? cut : maxLength).TrimEnd(',', '.', ';', ':') + "…";
        }

        public static string ShortDate(News item)
        {
            return item.CreateDate.ToString("dd/MM/yyyy");
        }

        /// <summary>
        /// Đơn vị đã có chứng nhận Tín Nhiệm Mạng chưa: phải có ảnh (Value2) và link xác thực (Value4) trỏ tới
        /// trang chứng nhận cụ thể. Link trống hoặc chỉ là trang chủ (VD "https://tinnhiemmang.vn/#") coi như chưa có.
        /// </summary>
        public static bool HasTinNhiemMang(string imageUrl, string verifyUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl) || string.IsNullOrWhiteSpace(verifyUrl))
            {
                return false;
            }

            if (!Uri.TryCreate(verifyUrl.Trim(), UriKind.Absolute, out var uri))
            {
                return false;
            }

            var path = uri.AbsolutePath.Trim('/');
            return path.Length > 0 || uri.Query.Trim('?').Length > 0;
        }

        /// <summary>Thuộc tính target cho tin mở trang mới.</summary>
        public static IHtmlString Target(News item)
        {
            return new HtmlString(item.IsOpenBlankPage ? "target=\"_blank\" rel=\"noopener\"" : "");
        }
    }
}
