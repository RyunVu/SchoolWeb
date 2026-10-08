import { Component, ViewEncapsulation } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastrService } from "ngx-toastr";
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";

/**
 * Đổi giao diện cho một cổng:
 * - Chưa có thư mục Views/Shared/Portals/{UnitCode}: tạo mới rồi chép Default/{Theme} vào.
 * - Đã có: sao lưu vào {UnitCode}/backup/{thời gian}_{theme cũ} rồi chép Default/{Theme} đè lên.
 */
@Component({
    standalone: false,
    selector: "change-theme-modal",
    templateUrl: 'change-theme.modal.html',
    styleUrls: ['./change-theme.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ChangeThemeModal {
    portal: any;
    themes: any[] = [];
    selectedThemeId: string | null = null;
    loading = false;
    saving = false;
    result: any = null;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private toastr: ToastrService,
    ) {
        this.portal = this.config.data.item;
        this.loadThemes();
    }

    get currentThemeId(): string {
        return (this.portal?.ThemeId || '').toLowerCase();
    }

    get selectedTheme(): any {
        return this.themes.find(t => this.sameId(t.Id, this.selectedThemeId));
    }

    /** Link trang chủ của cổng (tên miền chính) để xem thử giao diện trước khi áp dụng */
    get portalUrl(): string | null {
        const domains: any[] = this.portal?.Domains || [];
        const main = domains.find(d => d.IsMain) || domains[0];
        return main?.Url || null;
    }

    sameId(a: any, b: any): boolean {
        return !!a && !!b && (a + '').toLowerCase() === (b + '').toLowerCase();
    }

    isCurrent(theme: any): boolean {
        return this.sameId(theme.Id, this.currentThemeId);
    }

    loadThemes() {
        this.loading = true;
        this.http.post("SysPortal/GetListTheme", {}, (res: ResultModel) => {
            this.loading = false;
            if (res.Code == ResultCode.Success) {
                this.themes = res.Result || [];
            }
        }, () => { this.loading = false; });
    }

    select(theme: any) {
        if (!this.saving && !this.result) {
            this.selectedThemeId = theme.Id;
        }
    }

    previewUrl(theme: any): string | null {
        if (!this.portalUrl) return null;
        const sep = this.portalUrl.includes('?') ? '&' : '?';
        return `${this.portalUrl}${sep}giao-dien=${encodeURIComponent(theme.Url)}`;
    }

    apply() {
        const theme = this.selectedTheme;
        if (!theme) {
            this.toastr.warning("Vui lòng chọn giao diện", "Cảnh báo");
            return;
        }
        this.saving = true;
        this.http.post("SysPortal/ChangeTheme", { Id: this.portal.Id, ThemeId: theme.Id }, (res: ResultModel) => {
            this.saving = false;
            if (res.Code == ResultCode.Success) {
                this.result = res.Result;
                this.toastr.success(`Đã đổi giao diện "${theme.Name}"`, "Thành công");
            } else {
                this.toastr.error(res.Message || "Đổi giao diện không thành công", "Lỗi");
            }
        }, () => { this.saving = false; });
    }

    close() {
        this.ref.close(this.result ? { confirm: "yes" } : null);
    }
}
