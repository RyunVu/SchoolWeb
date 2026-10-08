using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Hosting;
using VNPT.Core.Constants;
using VNPT.Web.Portal.Base;

namespace VNPT.Web.Portal.Api.Providers
{
    /// <summary>
    /// Đổi giao diện (theme) cho một cổng:
    /// - Thư mục Views/Shared/Portals/{UnitCode} chưa có: tạo mới rồi chép thư mục Default/{ThemeUrl} vào.
    /// - Đã có: sao lưu toàn bộ vào {UnitCode}/backup/{thời gian}_{theme cũ}, rồi chép Default/{ThemeUrl} đè lên.
    /// - Cập nhật SysPortals.ThemeId và SysSites.LayoutId của mọi trang trong cổng.
    /// </summary>
    public static class PortalThemeService
    {
        public const string BackupFolderName = "backup";

        private static readonly string[] ReservedFolders = { "Default", "Layouts", BackupFolderName };

        public class ChangeThemeResult
        {
            public string UnitFolder { get; set; }
            public string BackupFolder { get; set; }
            public bool CreatedUnitFolder { get; set; }
            public int SiteCount { get; set; }
        }

        private static string PortalsRoot => HostingEnvironment.MapPath("~/Views/Shared/Portals/");

        /// <summary>Đường dẫn tương đối (để hiển thị) của thư mục trong Views/Shared/Portals.</summary>
        public static string ToDisplayPath(string fullPath)
        {
            if (string.IsNullOrEmpty(fullPath)) return null;
            var root = PortalsRoot.TrimEnd('\\', '/');
            return "Views/Shared/Portals" + fullPath.Substring(root.Length).Replace('\\', '/');
        }

        /// <summary>
        /// Chép thư mục giao diện + đổi layout các trang. Chưa gọi SaveChanges để nơi gọi lưu cùng các thay đổi khác.
        /// Thao tác thư mục chạy trước: lỗi ở đây thì dữ liệu chưa bị đổi.
        /// </summary>
        public static ChangeThemeResult Apply(WebDbContext db, SysPortal portal, SysTheme theme)
        {
            if (portal == null) throw new ArgumentNullException(nameof(portal));
            if (theme == null) throw new InvalidOperationException("Chủ đề không tồn tại!");

            var unitCode = (portal.UnitCode ?? "").Trim();
            if (!Regex.IsMatch(unitCode, "^[A-Za-z0-9_-]+$") || ReservedFolders.Any(r => r.Equals(unitCode, StringComparison.OrdinalIgnoreCase)))
            {
                throw new InvalidOperationException($"Mã đơn vị \"{unitCode}\" không hợp lệ để tạo thư mục giao diện.");
            }

            var themeUrl = (theme.Url ?? "").Trim();
            if (!Regex.IsMatch(themeUrl, "^[A-Za-z0-9_-]+$"))
            {
                throw new InvalidOperationException($"Đường dẫn chủ đề \"{themeUrl}\" không hợp lệ.");
            }

            var layout = db.SysThemeLayout
                .Where(x => x.Status != StatusEnum.Deleted && x.ThemeId == theme.Id)
                .OrderBy(x => x.MenuOrder).FirstOrDefault();
            if (layout == null)
            {
                throw new InvalidOperationException($"Chủ đề \"{theme.Name}\" chưa có layout (SysThemeLayouts).");
            }

            var sourceDir = Path.Combine(PortalsRoot, "Default", themeUrl);
            if (!Directory.Exists(sourceDir))
            {
                throw new InvalidOperationException($"Chưa có thư mục giao diện mặc định Views/Shared/Portals/Default/{themeUrl}.");
            }

            var oldThemeUrl = portal.ThemeId.HasValue
                ? db.SysThemes.Where(x => x.Id == portal.ThemeId.Value).Select(x => x.Url).FirstOrDefault()
                : null;

            var result = new ChangeThemeResult { UnitFolder = Path.Combine(PortalsRoot, unitCode) };

            if (Directory.Exists(result.UnitFolder))
            {
                var stamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
                var suffix = Regex.IsMatch(oldThemeUrl ?? "", "^[A-Za-z0-9_-]+$") ? oldThemeUrl : "chua-ro";
                result.BackupFolder = Path.Combine(result.UnitFolder, BackupFolderName, $"{stamp}_{suffix}");
                CopyDirectory(result.UnitFolder, result.BackupFolder, BackupFolderName);
            }
            else
            {
                Directory.CreateDirectory(result.UnitFolder);
                result.CreatedUnitFolder = true;
            }

            CopyDirectory(sourceDir, result.UnitFolder, null);

            var sites = db.SysSites.Where(x => x.Status != StatusEnum.Deleted && x.PortalId == portal.Id).ToList();
            foreach (var site in sites)
            {
                site.LayoutId = layout.Id;
            }

            portal.ThemeId = theme.Id;
            result.SiteCount = sites.Count;
            return result;
        }

        /// <summary>
        /// Thay Id loại tin trong tham số menu theo bảng ánh xạ (Id cũ -> Id mới).
        /// Hỗ trợ dạng "thong-bao.{Id}" và nhiều mã cách nhau bằng ";" ("a.{Id1};b.{Id2}").
        /// </summary>
        public static string RemapCategoryIds(string parameter, System.Collections.Generic.IDictionary<string, string> idMap)
        {
            if (string.IsNullOrEmpty(parameter) || idMap == null || idMap.Count == 0)
            {
                return parameter;
            }

            return Regex.Replace(parameter, "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
                m => idMap.TryGetValue(m.Value, out var newId) ? newId : m.Value);
        }

        /// <summary>Chép đệ quy, ghi đè file trùng tên; bỏ qua thư mục con cấp 1 tên <paramref name="skipTopFolder"/>.</summary>
        private static void CopyDirectory(string sourceDir, string targetDir, string skipTopFolder)
        {
            Directory.CreateDirectory(targetDir);

            foreach (var file in Directory.GetFiles(sourceDir))
            {
                File.Copy(file, Path.Combine(targetDir, Path.GetFileName(file)), true);
            }

            foreach (var dir in Directory.GetDirectories(sourceDir))
            {
                var name = Path.GetFileName(dir);
                if (skipTopFolder != null && name.Equals(skipTopFolder, StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                CopyDirectory(dir, Path.Combine(targetDir, name), null);
            }
        }
    }
}
