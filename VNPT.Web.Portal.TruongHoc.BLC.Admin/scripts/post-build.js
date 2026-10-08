const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../dist/igovconnect/index.html');

if (!fs.existsSync(indexPath)) {
  console.log(`[Post-build] Không tìm thấy file index.html tại: ${indexPath}`);
  process.exit(0);
}

try {
  let content = fs.readFileSync(indexPath, 'utf8');

  // 1. Cập nhật <base href="/admin/">
  content = content.replace(/<base\s+href="[^"]*">/i, '<base href="/admin/">');

  // 2. Thêm prefix /admin/ cho tất cả các đường dẫn tương đối (src="..." và href="...")
  // Không áp dụng với các URL đã có /admin/, URL tuyệt đối (http://, https://, //), anchor (#), hoặc data URI
  content = content.replace(/(src|href)="((?!(\/admin\/|https?:\/\/|\/\/|#|data:))[^"]+)"/g, (match, attr, url) => {
    const cleanUrl = url.replace(/^\/+/, '');
    return `${attr}="/admin/${cleanUrl}"`;
  });

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('[Post-build] -> Đã cập nhật thành công các đường dẫn trong dist/igovconnect/index.html sang tiền tố /admin/');
} catch (err) {
  console.error('[Post-build] Lỗi khi xử lý file index.html:', err);
}
