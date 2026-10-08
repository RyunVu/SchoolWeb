const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Đọc package.json
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 2. Tự động tăng patch version nếu có cờ --bump (khi chạy lệnh build)
const shouldBump = process.argv.includes('--bump');
if (shouldBump) {
  const versionParts = (packageJson.version || '1.0.0').split('.');
  if (versionParts.length >= 3) {
    versionParts[versionParts.length - 1] = parseInt(versionParts[versionParts.length - 1] || 0, 10) + 1;
  } else {
    while (versionParts.length < 3) {
      versionParts.push('0');
    }
    versionParts[2] = parseInt(versionParts[2], 10) + 1;
  }
  const oldVersion = packageJson.version;
  packageJson.version = versionParts.join('.');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n', 'utf8');
  console.log(`[Version Generator] -> Đã tăng version trong package.json: ${oldVersion} -> ${packageJson.version}`);
}

// 3. Lấy Git commit hash (nếu dự án dùng Git)
let gitHash = '';
try {
  gitHash = execSync('git rev-parse --short HEAD', { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
} catch (e) {
  gitHash = '';
}

// 4. Format ngày giờ build định dạng dd/MM/yyyy HH:mm:ss
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const day = pad(now.getDate());
const month = pad(now.getMonth() + 1);
const year = now.getFullYear();
const hours = pad(now.getHours());
const minutes = pad(now.getMinutes());
const seconds = pad(now.getSeconds());

const buildDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
const buildNumber = `${year}${month}${day}.${hours}${minutes}`;
const displayVersion = `${packageJson.version} (Build: ${day}/${month}/${year} ${hours}:${minutes}${gitHash ? ' - ' + gitHash : ''})`;

// 5. Nội dung file version.ts sinh tự động
const content = `// File này được tạo tự động khi chạy build, vui lòng không sửa thủ công.
export const APP_VERSION = {
  version: '${packageJson.version}',
  buildDate: '${buildDate}',
  buildNumber: '${buildNumber}',
  gitHash: '${gitHash}',
  displayVersion: '${displayVersion}',
  timestamp: ${now.getTime()}
};
`;

const targetDir = path.resolve(__dirname, '../src/environments');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetFile = path.join(targetDir, 'version.ts');
fs.writeFileSync(targetFile, content, { encoding: 'utf8' });

console.log(`[Version Generator] -> Đã cập nhật file: ${targetFile}`);
console.log(`[Version Generator] -> Phiên bản hiện tại: ${displayVersion}`);
