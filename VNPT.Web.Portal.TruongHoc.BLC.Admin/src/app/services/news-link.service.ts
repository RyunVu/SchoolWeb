import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

/** Yêu cầu mở một bài viết trong trang quản lý tin (/quan-ly-tin-tuc/:code) */
export interface OpenNewsRequest {
    code: string;       // News.Code = Parameter của menu quản trị
    id: string;         // Id bài viết
    title: string;      // dùng làm từ khoá để bài hiện trong danh sách
    unitCode: string;   // đơn vị của bài viết
}

/** Kết quả phân tích link ngoài portal */
export interface PortalLink {
    portalCode: string | null;  // mã cổng trong đường dẫn (VD: thcsrungredilinh), null nếu portal chạy theo domain
    site: string;               // VD: chi-tiet-tin-tuc, danh-sach-tin-tuc
    param: string | null;       // giá trị ?param=
}

const NEWS_DETAIL_SITE = "chi-tiet-tin-tuc";
const NEWS_LIST_SITE = "danh-sach-tin-tuc";

/**
 * Chuyển yêu cầu "mở bài viết" từ ô tìm kiếm trên header sang trang quản lý tin.
 * Không dùng query string vì Menu/CheckPermission so khớp chính xác đường dẫn của menu.
 */
@Injectable({ providedIn: "root" })
export class NewsLinkService {
    readonly requested$ = new Subject<OpenNewsRequest>();
    private pending: OpenNewsRequest | null = null;

    readonly detailSite = NEWS_DETAIL_SITE;
    readonly listSite = NEWS_LIST_SITE;

    request(request: OpenNewsRequest) {
        this.pending = request;
        this.requested$.next(request);
    }

    /** Lấy (và xoá) yêu cầu đang chờ nếu thuộc chuyên mục code */
    take(code: string | null | undefined): OpenNewsRequest | null {
        const normalized = (code || "").split(".")[0].toLowerCase();
        if (this.pending && this.pending.code.toLowerCase() === normalized) {
            const request = this.pending;
            this.pending = null;
            return request;
        }
        return null;
    }

    /**
     * Phân tích link portal, hỗ trợ:
     *  - https://host/{maCong}/chi-tiet-tin-tuc/?param={alias}
     *  - https://host/chi-tiet-tin-tuc/?param={alias}   (portal chạy theo domain riêng)
     *  - https://host/{maCong}/danh-sach-tin-tuc/?param={maChuyenMuc}.{loaiTin}
     *  - chỉ nhập alias bài viết
     */
    parse(input: string): PortalLink | null {
        const text = (input || "").trim();
        if (!text) {
            return null;
        }
        if (!/[\/?=]/.test(text)) {
            return { portalCode: null, site: NEWS_DETAIL_SITE, param: text };
        }

        let url: URL;
        try {
            url = new URL(/^https?:\/\//i.test(text) ? text : "http://localhost/" + text.replace(/^\/+/, ""));
        } catch {
            return null;
        }

        const segments = url.pathname.split("/").map(s => decodeURIComponent(s).trim()).filter(Boolean);
        const param = url.searchParams.get("param");
        const knownSites = [NEWS_DETAIL_SITE, NEWS_LIST_SITE];
        const siteIndex = segments.findIndex(s => knownSites.includes(s.toLowerCase()));
        if (siteIndex < 0) {
            return null;
        }
        return {
            portalCode: siteIndex > 0 ? segments[siteIndex - 1] : null,
            site: segments[siteIndex].toLowerCase(),
            param: param ? param.trim() : null
        };
    }
}
