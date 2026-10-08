import { Component, ViewEncapsulation } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { BaseService } from "src/app/services";

/** Xem trước tin bài như hiển thị ngoài website (dùng được cả với bài chưa duyệt) */
@Component({
    standalone: false,
    selector: "news-preview-modal",
    templateUrl: "news-preview.modal.html",
    styleUrls: ["news-preview.modal.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class NewsPreviewModal {
    item: any;
    content = '';
    showEnglish = false;
    hasEnglish = false;
    websiteUrl: string | null = null;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private baseService: BaseService
    ) {
        this.item = this.config.data.item || {};
        this.hasEnglish = !!(this.item.Title_En || this.item.Content_En);
        this.content = this.fixRelativeMedia(this.item.Content);

        // Link bài trên website: {portal}/{maCong}/chi-tiet-tin-tuc/?param={alias} (chỉ bài đã duyệt mới hiển thị ngoài web)
        if (this.item.Status == 1 && this.item.Alias && this.item.UnitCode) {
            const base = (this.baseService.apiUrl || '/').replace(/\/?$/, '/');
            this.websiteUrl = `${base}${String(this.item.UnitCode).toLowerCase()}/chi-tiet-tin-tuc/?param=${encodeURIComponent(this.item.Alias)}`;
        }
    }

    toggleLanguage() {
        this.showEnglish = !this.showEnglish;
        this.content = this.fixRelativeMedia(this.showEnglish ? this.item.Content_En : this.item.Content);
    }

    cancel() {
        this.ref.close();
    }

    /** Ảnh/tệp lưu dạng đường dẫn tương đối (/api/file/...) thì nối với server media */
    private fixRelativeMedia(html: string | null | undefined): string {
        if (!html) {
            return '';
        }
        const media = (this.baseService.mediaUrl || '').replace(/\/$/, '');
        return html.replace(/(<(?:img|source|video|audio)[^>]*?\ssrc=["'])(\/api\/file\/[^"']*)/gi, `$1${media}$2`);
    }
}
