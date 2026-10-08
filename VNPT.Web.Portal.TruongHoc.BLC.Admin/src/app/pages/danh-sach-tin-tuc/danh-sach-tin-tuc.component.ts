import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService } from "primeng/dynamicdialog";
import { ResultCode, ResultModel } from "src/app/models";
import { BasePage, BaseService, HttpService } from "src/app/services";
import { OTPCheckModal } from "../systems/user/otpcheck.modal";
import { UserModal } from "../systems/user/user.modal";

import { DanhSachTinTucModal } from "./danh-sach-tin-tuc.modal";
import { NewsHistoryModal } from "./news-history.modal";
import { NewsPreviewModal } from "./news-preview.modal";
import { MenuSidebarService } from "src/app/layouts/menu-sidebar/menu-sidebar.service";
import { NewsLinkService, OpenNewsRequest } from "src/app/services/news-link.service";
import { Subscription } from "rxjs";

@Component({
    standalone: false,
    selector: "app-danh-sach-tin-tuc",
    templateUrl: "./danh-sach-tin-tuc.component.html",
    styleUrls: ["./danh-sach-tin-tuc.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DanhSachTinTucComponent extends BasePage {
    @ViewChild("dt", { static: false }) dt: any;

    items: any[] = [];
    selectedItems: any[] = [];
    pageSize: number = 20;
    pageIndex: number = 1;
    totalRow: number = 0;
    sortField: string = "";
    sortOrder: boolean = false;
    loading: boolean = false;
    oldEvent: any;
    filters: any = {};
    keywordInput: any;
    locations: any[] = [];
    location: any = null;
    statuses: any[] = [
        { Id: null, Name: "Tất cả" },
        { Id: 1, Name: "Đã duyệt" },
        { Id: 0, Name: "Chưa duyệt" },

    ];
    status: any = null;
    DenNgay: any;
    TuNgay: any;

    units: any[] = [];
    unit: any;
    isDuyetTin: boolean = false;
    isSuperAdminSystem: boolean = false;
    isUserDuyetTin: boolean = false;

    isUserDuyetTinFromTruong: boolean = false;
    isAddButtonVisible: boolean = false;
    /** Xem lịch sử dữ liệu bài viết: chỉ SuperAdminSystem */
    canViewHistory: boolean = false;

    /** Bài viết đang được tìm từ ô tìm kiếm trên header (để tô sáng dòng) */
    highlightNewsId: string | null = null;
    private newsLinkSub: Subscription;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private baseService: BaseService,
        public menuSidebarService: MenuSidebarService,
        private newsLink: NewsLinkService,
    ) {
        super(router, route, http, message);

        // Đang đứng sẵn ở trang chuyên mục này mà tìm bài khác cùng chuyên mục (component không bị tạo lại)
        this.newsLinkSub = this.newsLink.requested$.subscribe(() => {
            if (this.parameter) {
                const request = this.newsLink.take(this.parameter);
                if (request) {
                    this.openNewsFromLink(request);
                }
            }
        });

        var mulRole = this.baseService.MulRole;
        // if (mulRole != "" && mulRole != null && (mulRole.includes("SuperAdminSystem"))) {
        //     this.isSuperAdminSystem = true;
        // }

        if (mulRole != "" && mulRole != null && (mulRole.includes("DuyetTin"))) {
            this.isUserDuyetTin = true;
        }

        if (mulRole != "" && mulRole != null && mulRole.includes("SuperAdminSystem")) {
            this.canViewHistory = true;
        }

        if (mulRole != "" && mulRole != null && (mulRole.includes("TinTucTuTruong_Duyet"))) {
            this.isUserDuyetTinFromTruong = true;
        }

        this.setDefaultDates();

        this.loadUnits();
    }

    paginate(event: TableLazyLoadEvent) {
        if (this.oldEvent == null || event == this.oldEvent) {
            this.oldEvent = event;
            return;
        }
        this.oldEvent = event;
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

    onInit(): void {
        this.checkAddButtonVisibility();
    }

    checkAddButtonVisibility() {
        if (
            this.isSuperAdminSystem ||
            (this.title !== 'Giới thiệu/Hệ thống chính trị' && this.title !== 'Tin tức từ trường')
        ) {
            this.isAddButtonVisible = true;
        } else {
            this.isAddButtonVisible = false;
        }
    }
    duyetbai() {
        this.router.navigate(['/quan-ly-tin-tuc/duyet/' + this.parameter]);
    }

    duyetbaitutruong() {
        if (this.title == 'Tin tức từ trường') {
            this.router.navigate(['/quan-ly-tin-tuc/duyet/' + this.parameter]);
        } else {
            alert("Không thể truy cập url")
        }
    }

    loadDuyetTin() {
        this.isDuyetTin = false;
        this.http.post("news/CheckDuyetTin", {
            UnitCode: this.unit,
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.isDuyetTin = result.Result;
            }
        }, () => {
        });
    }

    loadUnits() {
        this.http.post("user/Units", {

        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;
                this.units.unshift({ Id: null, Name: "Tất cả đơn vị" });
                this.unit = null
            }
        }, () => {
        });
    }

    add() {
        const ref = this.dialogService
            .open(DanhSachTinTucModal, {
                data: {
                    IsAdd: true,
                    Code: this.parameter,
                    Parent: this
                },
                header: "Thêm mới tin tức",
                width: "100%",
            })!
            .onClose.subscribe((data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }

    edit(item: any) {
        const ref = this.dialogService
            .open(DanhSachTinTucModal, {
                data: {
                    IsAdd: false,
                    item: item,
                    Code: this.parameter,
                    Parent: this
                },
                header: "Cập nhật tin tức",
                width: "100%",
            })!
            .onClose.subscribe((data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }

    /** Mặc định không lọc theo thời gian */
    private setDefaultDates() {
        this.TuNgay = null;
        this.DenNgay = null;
    }

    resetFilter() {
        this.keywordInput = "";
        this.status = null;
        this.setDefaultDates();
        this.search();
    }

    preview(item: any) {
        this.dialogService.open(NewsPreviewModal, {
            data: { item: item },
            header: "Xem trước tin bài",
            width: "80%",
        });
    }

    viewDataHistory(item: any) {
        this.dialogService.open(NewsHistoryModal, {
            data: { item: item },
            header: "Lịch sử dữ liệu bài viết",
            width: "90%",
        });
    }

    delete(item: any) {
        this.confirmationService.confirm({
            message: "Bạn có chắc chắn muốn xoá tin tức này không?",
            accept: () => {
                this.http.post(
                    "News/Delete",
                    {
                        Id: item.Id,
                    },
                    (result: ResultModel) => {
                        if (result.Code == ResultCode.Success) {

                            if (this.isSuperAdminSystem || this.isUserDuyetTin) {
                                this.menuSidebarService.reloadMenu();
                            }

                            this.loadData();
                        }
                    },
                    () => { }
                );
            },
        });
    }

    deleteMultiple() {
        if (!this.selectedItems || this.selectedItems.length === 0) {
            return;
        }

        const count = this.selectedItems.length;
        this.confirmationService.confirm({
            message: `Bạn có chắc chắn muốn xoá ${count} tin tức đã chọn không?`,
            accept: () => {
                const ids = this.selectedItems.map((x: any) => x.Id);
                this.http.post(
                    "News/DeleteMultiple",
                    {
                        Ids: ids,
                    },
                    (result: ResultModel) => {
                        if (result.Code == ResultCode.Success) {
                            if (this.isSuperAdminSystem || this.isUserDuyetTin) {
                                this.menuSidebarService.reloadMenu();
                            }
                            this.selectedItems = [];
                            this.loadData();
                        }
                    },
                    () => { }
                );
            },
        });
    }

    changeStatus(item: any) {
        this.confirmationService.confirm({
            message: "Bạn có chắc chắn muốn " + (item.Status == '0' ? "hiển thị" : "không hiển thị") + " tin tức này không?",
            accept: () => {
                this.http.post(
                    "News/ChangeStatus",
                    {
                        Id: item.Id,
                    },
                    (result: ResultModel) => {
                        if (result.Code == ResultCode.Success) {
                            this.loadData();
                        }
                    },
                    () => { }
                );
            },
        });
    }

    loadPage(): void {
        this.pageIndex = 1;
        if (this.dt != null) {
            this.refresh();
        }
        const request = this.newsLink.take(this.parameter);
        if (request) {
            this.openNewsFromLink(request);
            return;
        }
        this.loadData();
    }

    override ngOnDestroy(): void {
        this.newsLinkSub?.unsubscribe();
        super.ngOnDestroy();
    }

    /** Lọc danh sách để bài viết hiện ra (theo tiêu đề, mọi thời gian) rồi mở form cập nhật bài đó */
    private openNewsFromLink(request: OpenNewsRequest): void {
        this.keywordInput = request.title;
        this.status = null;
        this.TuNgay = null;
        this.DenNgay = null;
        this.pageIndex = 1;
        this.highlightNewsId = request.id;
        if (this.dt != null) {
            this.refresh();
        }
        const previousUnit = this.unit;
        this.unit = request.unitCode;
        this.loadData(() => {
            this.unit = previousUnit;
            const item = this.items.find((x: any) => (x.Id + '').toLowerCase() === (request.id + '').toLowerCase());
            if (item) {
                this.edit(item);
            } else {
                this.message.add({ severity: 'warn', summary: 'Tìm bài viết', detail: 'Không tìm thấy bài viết trong chuyên mục này' });
            }
        });
    }

    private loadData(onLoaded?: () => void): void {
        this.loading = true;
        this.http.post(
            "News/GetList",
            {
                Code: this.parameter,
                UnitCode: this.unit,
                FromDate: this.TuNgay || null,
                ToDate: this.DenNgay || null,
                Keyword: this.keywordInput == "" ? null : this.keywordInput,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize,
                Status: this.status
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.items = result.Result;
                    this.totalRow = result.TotalRow;
                }
                this.loadDuyetTin();
                this.loading = false;
                onLoaded?.();
            },
            () => {
                this.loading = false;
            }
        );
    }

    search() {
        this.highlightNewsId = null;
        this.pageIndex = 1;
        this.refresh();
        this.loadData();
    }

    refresh() {
        this.dt.first = 0;
    }


}
