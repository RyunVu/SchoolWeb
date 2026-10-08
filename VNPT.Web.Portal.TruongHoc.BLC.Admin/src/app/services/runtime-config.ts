/**
 * Cấu hình lấy từ API lúc khởi động (api/System/ClientConfig), nguồn là Web.config của API:
 * mỗi đơn vị chỉ cấu hình DomainMedia một chỗ (Web.{Mã}_{Tên}.config), Angular tự đi theo.
 * Gọi RuntimeConfig.load() trong main.ts trước khi bootstrap.
 */
export class RuntimeConfig {
    /** DomainMedia trong Web.config (luôn kết thúc bằng "/"), null nếu chưa lấy được */
    static mediaUrl: string | null = null;
    /** Mã vùng (Region) trong Web.config */
    static region: string | null = null;

    static async load(apiUrl: string, timeoutMs = 5000): Promise<void> {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const res = await fetch(`${apiUrl}api/System/ClientConfig`, { cache: 'no-store', signal: controller.signal });
            const json = await res.json();
            const result = json?.Result || {};
            RuntimeConfig.mediaUrl = result.MediaUrl || null;
            RuntimeConfig.region = result.Region || null;
        } catch (err) {
            // Không lấy được thì dùng mediaUrl trong environment để ứng dụng vẫn chạy
            console.warn('Không tải được cấu hình từ API, dùng giá trị trong environment.', err);
        } finally {
            clearTimeout(timer);
        }
    }
}
