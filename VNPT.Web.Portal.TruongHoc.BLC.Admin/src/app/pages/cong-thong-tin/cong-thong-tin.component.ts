import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { CongThongTinModal } from './cong-thong-tin.modal';
import { SysPortalAliasModal } from './sys-portal-alias.modal';
import { SysPortalSiteURLModal } from './sys-portal-site-url.modal';
import { UploadFileModal } from './upload-file.modal';
import { ChangeThemeModal } from './change-theme.modal';
import { ToastrService } from 'ngx-toastr';

@Component({
    standalone: false,
    selector: 'app-cong-thong-tin',
    templateUrl: './cong-thong-tin.component.html',
    styleUrls: ['./cong-thong-tin.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CongThongTinComponent extends BasePage {

    @ViewChild('dt', { static: false }) dt: any;

    items: any[] = [];
    pageSize: number = 20;
    pageIndex: number = 1;
    keyword: any;
    totalRow: number = 0;
    sortField: string = "";
    sortOrder: boolean = false;
    loading: boolean = false;
    filters: any = {};

    keywordInput: any;
    themes: any[] = [];
    themesMap: { [key: string]: string } = {};

    /** Lọc nhanh theo giao diện (trên trang đang hiển thị) */
    themeFilter: string | null = null;
    visibleItems: any[] = [];
    themeStats: { key: string, name: string, count: number }[] = [];

    private static readonly THEME_COLORS = ['#3c8dbc', '#8a1c2b', '#0b2e59', '#e08e0b', '#00a65a', '#605ca8', '#d81b60', '#39cccc'];

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private toastr: ToastrService
    ) {
        super(router, route, http, message);

    }

    onInit(): void {
        this.loadThemes();
    }

    add() {
        const ref = this.dialogService.open(CongThongTinModal, {
            data: {
                IsAdd: true,
            },
            header: 'Thêm mới cổng',
            width: '70%'
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
    edit(item: any) {
        const ref = this.dialogService.open(CongThongTinModal, {
            data: {
                IsAdd: false,
                item: item,
            },
            header: 'Cập nhật cổng',
            width: '70%',
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
    changeTheme(item: any) {
        this.dialogService.open(ChangeThemeModal, {
            data: { item: item },
            header: 'Đổi giao diện cổng',
            width: '760px',
            breakpoints: { '800px': '95vw' },
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
    /** Id cổng đang cập nhật template (để hiện vòng quay trên nút) */
    refreshingId: string | null = null;

    /**
     * Cập nhật lại template: chép lại Default/{giao diện} vào thư mục riêng của cổng (có sao lưu),
     * dùng khi template mặc định đã sửa nhưng website vẫn chạy bản cũ.
     */
    refreshTemplate(item: any) {
        if (!item.ThemeId) {
            this.toastr.warning("Cổng chưa chọn giao diện, vui lòng dùng Đổi giao diện.", "Chưa có giao diện");
            return;
        }
        this.confirmationService.confirm({
            header: 'Cập nhật lại template',
            message: `Chép lại template mặc định của giao diện <b>${item.ThemeName || ''}</b> vào thư mục riêng của cổng <b>${item.Name}</b> (Views/Shared/Portals/${item.UnitCode}).<br/><br/>`
                + 'Thư mục hiện tại sẽ được sao lưu vào <code>backup/</code> trước. Các chỉnh sửa riêng của cổng trên những file trùng tên sẽ bị thay bằng bản mặc định.<br/><br/>Tiếp tục?',
            acceptLabel: 'Cập nhật',
            rejectLabel: 'Huỷ',
            accept: () => {
                this.refreshingId = item.Id;
                this.http.post("SysPortal/RefreshTemplate", { Id: item.Id }, (result: ResultModel) => {
                    this.refreshingId = null;
                    if (result.Code == ResultCode.Success) {
                        const r = result.Result || {};
                        this.toastr.success(
                            (r.BackupFolder ? `Bản cũ đã sao lưu tại ${r.BackupFolder}` : 'Đã tạo mới thư mục template'),
                            `Đã cập nhật template "${r.ThemeName}" cho ${item.Name}`, { timeOut: 8000 });
                        this.loadData();
                    } else {
                        this.toastr.error(result.Message || "Cập nhật template không thành công", "Lỗi");
                    }
                }, () => { this.refreshingId = null; });
            }
        });
    }

    delete(item: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xoá cổng này không?',
            accept: () => {
                this.http.post("SysPortal/Delete",
                    {
                        Id: item.Id,
                    },
                    (result: ResultModel) => {
                        if (result.Code == ResultCode.Success) {
                            this.loadData();
                        }
                    }, () => {
                    });
            }
        });
    }
    loadPage(): void {

    }

    loadType() {

    }
    paginate(event: any) {

        this.pageSize = event.rows ?? 10;
        var first = event.first ?? 0;
        this.pageIndex = Math.floor(first / this.pageSize) + 1;

        this.sortOrder = event.sortOrder == 1 ? true : false;
        this.sortField = (event.sortField as string) ?? "";
        this.filters = event.filters;
        setTimeout(() => {
            this.loadData();
        }, 100);
    }
    loadData() {
        this.loading = true;
        this.http.post(
            "SysPortal/GetListSysPortal",
            {
                Keyword: this.keywordInput == "" ? null : this.keywordInput,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.items = result.Result || [];
                    this.totalRow = result.TotalRow;
                    this.mapThemeNames();
                }
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        );
    }

    loadThemes() {
        this.http.post("SysPortal/GetListTheme", {}, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.themes = result.Result || [];
                this.themesMap = {};
                this.themes.forEach((t: any) => {
                    if (t.Id) {
                        this.themesMap[(t.Id + '').toLowerCase()] = t.Name;
                    }
                });
                this.mapThemeNames();
            }
        }, () => {});
    }

    mapThemeNames() {
        if (this.items && this.items.length) {
            this.items.forEach((item: any) => {
                const idStr = (item.ThemeId + '').toLowerCase();
                // Ưu tiên tên hiển thị của danh sách giao diện (VD "Trường học - Hiện đại")
                if (item.ThemeId && this.themesMap[idStr]) {
                    item.ThemeName = this.themesMap[idStr];
                }
            });
        }
        this.buildThemeStats();
    }

    themeKey(item: any): string {
        return item?.ThemeId ? (item.ThemeId + '').toLowerCase() : 'none';
    }

    /** Màu cố định theo giao diện để dễ nhận ra cổng nào dùng giao diện nào */
    themeColor(key: string | null): string {
        if (!key || key === 'none') return '#adb5bd';
        const index = this.themes.findIndex(t => (t.Id + '').toLowerCase() === key);
        const colors = CongThongTinComponent.THEME_COLORS;
        if (index >= 0) return colors[index % colors.length];
        let hash = 0;
        for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
        return colors[hash % colors.length];
    }

    buildThemeStats() {
        const stats = new Map<string, { key: string, name: string, count: number }>();
        (this.items || []).forEach(item => {
            const key = this.themeKey(item);
            const stat = stats.get(key) || { key, name: item.ThemeName || 'Chưa chọn', count: 0 };
            stat.count++;
            stats.set(key, stat);
        });
        this.themeStats = Array.from(stats.values()).sort((a, b) => b.count - a.count);
        if (this.themeFilter && !stats.has(this.themeFilter)) {
            this.themeFilter = null;
        }
        this.applyThemeFilter();
    }

    setThemeFilter(key: string | null) {
        this.themeFilter = key;
        this.applyThemeFilter();
    }

    applyThemeFilter() {
        this.visibleItems = this.themeFilter
            ? (this.items || []).filter(item => this.themeKey(item) === this.themeFilter)
            : (this.items || []);
    }

    initials(name: string): string {
        const words = (name || '').replace(/^(Trường|Cổng thông tin)\s+/i, '').trim().split(/\s+/).filter(w => w);
        return words.slice(-2).map(w => w[0]).join('').toUpperCase() || '?';
    }

    mainUrl(item: any): string | null {
        const domains: any[] = item?.Domains || [];
        return (domains.find(d => d.IsMain) || domains[0])?.Url || null;
    }
    refresh() {
        if (this.dt) {
            this.dt.first = 0;
        }
    }
    search() {
        this.pageIndex = 1;
        this.keyword = this.keywordInput;
        this.refresh();
        this.loadData();
    }
    clearfilter() {
        this.pageIndex = 1;
        this.keyword = null;
        this.keywordInput = null;
        this.refresh();
        this.loadData();
    }
    history(item: any) {

    }

    addalias(item: any) {
        const ref = this.dialogService.open(SysPortalAliasModal, {
            data: {
                IsAdd: true,
                item: item
            },
            header: 'Quản lý tên miền',
            width: '100%'
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }

    addparameter(item: any) {
        // this.modal.open(SysPortalParameterModal,
        //   overlayConfigFactory({
        //     item: item,
        //     isAdd: true,
        //     code: "",
        //     //permission: this.checkPermission('EDIT')
        //   },
        //     BSModalContext))
        //   .then((resultPromise) => {
        //     resultPromise.result.then((result) => {
        //       this.loadData();
        //     }).catch(() => {

        //     })
        //   },
        //     () => { }
        //   );
    }

    addsiteurl(item: any) {
        const ref = this.dialogService.open(SysPortalSiteURLModal, {
            data: {
                IsAdd: true,
                item: item
            },
            header: 'Quản lý tên miền con',
            width: '100%'
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }

    uploadFile() {
        const ref = this.dialogService.open(UploadFileModal, {
            data: {
                
            },
            header: 'Upload File',
            width: '40%',
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
}
