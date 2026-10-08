import { Component, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";
import { ResultCode, ResultModel } from "src/app/models";
import { BasePage, HttpService } from "src/app/services";

/** Mô tả 1 ô cấu hình – lấy từ API SiteConfig/Schema (nguồn: SiteConfigRegistry.cs) */
interface ConfigField {
    Key: string;
    Code: string;
    IdKey: string | null;
    ValueField: string;
    Type: 'text' | 'textarea' | 'image' | 'imageList' | 'color' | 'number' | 'switch' | 'url' | 'email' | 'phone' | 'mapEmbed' | 'secret';
    Label: string;
    Hint?: string;
    Placeholder?: string;
    Suffix?: string;
    Group?: string;
    Wide?: boolean;
    /** Chỉ dùng cho một số giao diện/cổng – không tính vào tiến độ */
    Optional?: boolean;
    UsedIn?: string;
}

interface ConfigSection {
    Key: string;
    Title: string;
    Icon: string;
    Color: string;
    Description: string;
    Fields: ConfigField[];
}

interface ListItem { Value2: string; Value4?: string | null; }

const UNIT_STORAGE_KEY = 'siteConfig.unitCode';

/**
 * Màn hình "Cấu hình website": chọn đơn vị → các ô cấu hình (đầu trang, chân trang, trang chủ...)
 * → bấm vào ô để sửa trong khung bên phải. Danh sách tham số do API trả về (SiteConfigRegistry.cs).
 */
@Component({
    standalone: false,
    selector: "app-site-config",
    templateUrl: "./site-config.component.html",
    styleUrls: ["./site-config.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class SiteConfigComponent extends BasePage {
    portals: any[] = [];
    unitCode: string | null = null;
    sections: ConfigSection[] = [];

    values: { [key: string]: any } = {};
    lists: { [key: string]: ListItem[] } = {};
    others: any[] = [];
    loadingData = false;

    // Khung chỉnh sửa
    editing: ConfigSection | null = null;
    drawerVisible = false;
    draft: { [key: string]: any } = {};
    draftLists: { [key: string]: ListItem[] } = {};
    saving = false;
    showSecret: { [key: string]: boolean } = {};

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private toastr: ToastrService,
        private sanitizer: DomSanitizer,
    ) {
        super(router, route, http, message);
    }

    onInit(): void { }

    loadPage(): void {
        this.loadSchema();
        this.loadPortals();
    }

    // ---------------- Dữ liệu ----------------

    loadSchema() {
        this.http.post("SiteConfig/Schema", {}, (res: ResultModel) => {
            if (res.Code == ResultCode.Success) {
                this.sections = res.Result || [];
            }
        }, () => { });
    }

    loadPortals() {
        this.http.post("SysPortal/GetListSysPortal", { PageIndex: 1, PageSize: 1000 }, (res: ResultModel) => {
            if (res.Code != ResultCode.Success) return;
            this.portals = (res.Result || []).map((p: any) => ({ ...p, Label: `${p.Name} (${p.UnitCode})` }));
            let saved: string | null = null;
            try { saved = localStorage.getItem(UNIT_STORAGE_KEY); } catch { }
            const found = this.portals.find(p => p.UnitCode === saved) || (this.portals.length === 1 ? this.portals[0] : null);
            if (found) {
                this.selectUnit(found.UnitCode);
            }
        }, () => { });
    }

    selectUnit(unitCode: string | null) {
        this.unitCode = unitCode;
        this.values = {};
        this.lists = {};
        this.others = [];
        if (!unitCode) return;
        try { localStorage.setItem(UNIT_STORAGE_KEY, unitCode); } catch { }
        this.loadData();
    }

    loadData() {
        if (!this.unitCode) return;
        this.loadingData = true;
        this.http.post("SiteConfig/Get", { UnitCode: this.unitCode }, (res: ResultModel) => {
            this.loadingData = false;
            if (res.Code == ResultCode.Success) {
                this.values = res.Result.Values || {};
                const lists = res.Result.Lists || {};
                this.lists = {};
                Object.keys(lists).forEach(k => this.lists[k] = (lists[k] || []).map((i: any) => ({ Value2: i.Value2, Value4: i.Value4 })));
                this.others = res.Result.Others || [];
            } else {
                this.toastr.error(res.Message || "Không tải được cấu hình", "Lỗi");
            }
        }, () => { this.loadingData = false; });
    }

    get portal(): any {
        return this.portals.find(p => p.UnitCode === this.unitCode);
    }

    get portalUrl(): string | null {
        const domains: any[] = this.portal?.Domains || [];
        return (domains.find(d => d.IsMain) || domains[0])?.Url || null;
    }

    // ---------------- Tổng quan các ô ----------------

    hasValue(field: ConfigField, source: 'saved' | 'draft' = 'saved'): boolean {
        if (field.Type === 'imageList') {
            const list = source === 'saved' ? this.lists[field.Key] : this.draftLists[field.Key];
            return !!list && list.length > 0;
        }
        const v = source === 'saved' ? this.values[field.Key] : this.draft[field.Key];
        if (field.Type === 'switch') return v === true;
        return v !== null && v !== undefined && `${v}`.trim() !== '';
    }

    progress(section: ConfigSection): { done: number, total: number, percent: number } {
        const counted = section.Fields.filter(f => f.Type !== 'switch' && !f.Optional);
        const total = counted.length;
        const done = counted.filter(f => this.hasValue(f)).length;
        return { done, total, percent: total ? Math.round(done * 100 / total) : 100 };
    }

    switches(section: ConfigSection): ConfigField[] {
        return section.Fields.filter(f => f.Type === 'switch');
    }

    value(section: string, idKey: string, valueField = 'Value2'): any {
        const field = this.sections.find(s => s.Key === section)?.Fields.find(f => f.IdKey === idKey && f.ValueField === valueField);
        return field ? this.values[field.Key] : null;
    }

    firstBanner(): string | null {
        const field = this.sections.find(s => s.Key === 'header')?.Fields.find(f => f.Type === 'imageList');
        return field ? (this.lists[field.Key]?.[0]?.Value2 || null) : null;
    }

    /** Tóm tắt nhóm tham số chưa có trên màn hình (VD "LINK_MENU (12), BANNER_CENTER (2)") */
    get othersSummary(): string {
        const counts: { [code: string]: number } = {};
        this.others.forEach(o => counts[o.Code] = (counts[o.Code] || 0) + 1);
        return Object.keys(counts).map(c => counts[c] > 1 ? `${c} (${counts[c]})` : c).join(', ');
    }

    // ---------------- Khung chỉnh sửa ----------------

    openKey(key: string) {
        const section = this.sections.find(s => s.Key === key);
        if (section) this.open(section);
    }

    open(section: ConfigSection) {
        if (!this.unitCode) {
            this.toastr.warning("Vui lòng chọn đơn vị cần cấu hình", "Cảnh báo");
            return;
        }
        this.editing = section;
        this.draft = {};
        this.draftLists = {};
        section.Fields.forEach(f => {
            if (f.Type === 'imageList') {
                this.draftLists[f.Key] = (this.lists[f.Key] || []).map(i => ({ ...i }));
            } else {
                let v = this.values[f.Key];
                if (f.Type === 'color') v = this.normalizeColor(v);
                if (f.Type === 'switch') v = v === true;
                this.draft[f.Key] = v ?? (f.Type === 'switch' ? false : null);
            }
        });
        this.drawerVisible = true;
    }

    groups(section: ConfigSection): { name: string, fields: ConfigField[] }[] {
        const result: { name: string, fields: ConfigField[] }[] = [];
        section.Fields.forEach(f => {
            const name = f.Group || '';
            let g = result.find(x => x.name === name);
            if (!g) { g = { name, fields: [] }; result.push(g); }
            g.fields.push(f);
        });
        return result;
    }

    get dirty(): boolean {
        return !!this.editing && (this.changedFields().length > 0 || this.changedLists().length > 0);
    }

    private same(a: any, b: any): boolean {
        const na = a === undefined || a === '' ? null : a;
        const nb = b === undefined || b === '' ? null : b;
        return `${na ?? ''}`.trim() === `${nb ?? ''}`.trim();
    }

    private changedFields(): ConfigField[] {
        if (!this.editing) return [];
        return this.editing.Fields.filter(f => f.Type !== 'imageList' && !this.same(this.draft[f.Key],
            f.Type === 'switch' ? this.values[f.Key] === true : (f.Type === 'color' ? this.normalizeColor(this.values[f.Key]) : this.values[f.Key])));
    }

    private changedLists(): ConfigField[] {
        if (!this.editing) return [];
        return this.editing.Fields.filter(f => f.Type === 'imageList'
            && JSON.stringify(this.draftLists[f.Key] || []) !== JSON.stringify(this.lists[f.Key] || []));
    }

    requestClose() {
        if (this.dirty) {
            this.confirmationService.confirm({
                message: 'Bạn có thay đổi chưa lưu. Đóng và bỏ các thay đổi này?',
                accept: () => this.closeDrawer(),
            });
        } else {
            this.closeDrawer();
        }
    }

    closeDrawer() {
        this.drawerVisible = false;
        this.editing = null;
    }

    save() {
        if (!this.editing || !this.unitCode) return;
        const invalid = this.validate();
        if (invalid) {
            this.toastr.warning(invalid, "Kiểm tra lại");
            return;
        }
        const fields = this.changedFields().map(f => {
            const item: any = { Code: f.Code, IdKey: f.IdKey, ValueField: f.ValueField };
            let v = this.draft[f.Key];
            if (f.Type === 'number') v = v === null || v === '' || v === undefined ? null : Number(v);
            if (f.Type === 'switch') v = v === true;
            if (f.Type === 'color') v = this.normalizeColor(v);
            item[f.ValueField] = v;
            return item;
        });
        const lists = this.changedLists().map(f => ({ Code: f.Code, IdKey: f.IdKey, Items: this.draftLists[f.Key] || [] }));
        if (!fields.length && !lists.length) {
            this.closeDrawer();
            return;
        }

        this.saving = true;
        this.http.post("SiteConfig/Save", { UnitCode: this.unitCode, Fields: fields, Lists: lists }, (res: ResultModel) => {
            this.saving = false;
            if (res.Code == ResultCode.Success) {
                this.toastr.success(`Đã lưu "${this.editing?.Title}"`, "Thành công");
                this.closeDrawer();
                this.loadData();
            } else {
                this.toastr.error(res.Message || "Lưu không thành công", "Lỗi");
            }
        }, () => { this.saving = false; });
    }

    private validate(): string | null {
        for (const f of this.editing?.Fields || []) {
            const v = this.draft[f.Key];
            if (v === null || v === undefined || `${v}`.trim() === '') continue;
            const s = `${v}`.trim();
            if (f.Type === 'url' && !/^https?:\/\//i.test(s)) return `"${f.Label}" phải bắt đầu bằng http:// hoặc https://`;
            if (f.Type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return `"${f.Label}" không đúng định dạng email`;
            if (f.Type === 'number' && isNaN(Number(s))) return `"${f.Label}" phải là số`;
            if (f.Type === 'color' && !/^#[0-9A-F]{6}$/i.test(s)) return `"${f.Label}" phải là mã màu dạng #RRGGBB`;
            if (f.Type === 'mapEmbed' && !/^https?:\/\//i.test(s)) return `"${f.Label}": vui lòng dán mã nhúng hoặc đường dẫn bản đồ hợp lệ`;
        }
        return null;
    }

    // ---------------- Hỗ trợ từng loại ô ----------------

    normalizeColor(v: any): string | null {
        if (!v) return null;
        let s = `${v}`.trim();
        if (/^[0-9a-f]{6}$/i.test(s)) s = '#' + s;
        return /^#[0-9a-f]{6}$/i.test(s) ? s.toUpperCase() : s;
    }

    onColorText(field: ConfigField, text: string) {
        this.draft[field.Key] = this.normalizeColor(text);
    }

    /** Dán mã <iframe ...> của Google Maps → tự lấy src */
    onMapInput(field: ConfigField, text: string) {
        const m = (text || '').match(/src\s*=\s*["']([^"']+)["']/i);
        this.draft[field.Key] = m ? m[1].replace(/&amp;/g, '&') : (text || '').trim();
    }

    mapPreview(url: string | null): SafeResourceUrl | null {
        if (!url || !/^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/i.test(url)) return null;
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    pickImage(field: ConfigField) {
        this.dialogService.open(FileManagerModal, {
            data: { filetype: "image", multipleselect: field.Type === 'imageList' },
            header: "Chọn hình ảnh",
            width: "70%",
        })!.onClose.subscribe((data: any) => {
            const urls: string[] = (data?.urls || []).map((u: any) => u.Url).filter((u: string) => !!u);
            if (!urls.length) return;
            if (field.Type === 'imageList') {
                this.draftLists[field.Key] = [...(this.draftLists[field.Key] || []), ...urls.map(u => ({ Value2: u, Value4: null }))];
            } else {
                this.draft[field.Key] = urls[0];
            }
        });
    }

    clearValue(field: ConfigField) {
        this.draft[field.Key] = null;
    }

    moveItem(field: ConfigField, index: number, delta: number) {
        const list = this.draftLists[field.Key];
        const target = index + delta;
        if (!list || target < 0 || target >= list.length) return;
        [list[index], list[target]] = [list[target], list[index]];
        this.draftLists[field.Key] = [...list];
    }

    removeItem(field: ConfigField, index: number) {
        const list = [...(this.draftLists[field.Key] || [])];
        list.splice(index, 1);
        this.draftLists[field.Key] = list;
    }

    openOldParams() {
        this.router.navigate(['/tham-so-he-thong']);
    }
}
