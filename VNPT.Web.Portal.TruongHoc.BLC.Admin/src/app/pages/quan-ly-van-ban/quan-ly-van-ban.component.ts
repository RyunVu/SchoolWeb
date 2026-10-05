import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
    ConfirmationService,
    LazyLoadEvent,
    MessageService,
} from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { ResultCode, ResultModel } from "src/app/models";
import { BasePage, BaseService, HttpService } from "src/app/services";
import { QuanLyVanBanModal } from "./quan-ly-van-ban.modal";

declare var $: any;
@Component({
    selector: 'app-quan-ly-van-ban',
    templateUrl: './quan-ly-van-ban.component.html',
    styleUrls: ['./quan-ly-van-ban.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class QuanLyVanBanComponent extends BasePage {
    @ViewChild("dt", { static: false }) dt: any;

    items: any[] = [];
    pageSize: number = 20;
    pageIndex: number = 1;
    totalRow: number = 0;
    sortField: string = "";
    sortOrder: boolean = false;
    loading: boolean = false;
    oldEvent: any;
    filters: any = {};
    keywordInput: any;

    units: any[] = [];
    unit: any;

    statusId: any = 1;
    status: any[] = [{ "Id": 1, "Name": "Hiển thị" }, { "Id": -1, "Name": "Ẩn" }];

    typeId: any = "SOGDDT";
    types: any[] = [{ "Id": "SOGDDT", "Name": "Sở GDĐT" }, { "Id": "PHONGGDDT", "Name": "Phòng GDĐT" }, { "Id": "THONGBAOPHOBIEN", "Name": "Thông báo - Phổ biến" }];

    isSuperAdminSystem: boolean = false;

    // List
    docTypes: any[] = [];
    loaiVanBan: string = "";

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private baseService: BaseService,
        private toastr: ToastrService
    ) {
        super(router, route, http, message);

        var mulRole = this.baseService.MulRole;
        if (mulRole != "" && mulRole != null && (mulRole.includes("SuperAdminSystem") || mulRole.includes("AdminTramYTe") || mulRole.includes("AdminPhongYTe"))) {
            this.isSuperAdminSystem = true;
        }

        this.loadUnits();
        this.loadDocTypes();
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

    private loadDocTypes() {
        this.http.post(
            "GeneralCategory/SearchItems",
            {
                Code: "DocType",
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.docTypes = result.Result;
                }
            },
            () => { }
        );
    }


    onInit(): void {
    }

    loadPage(): void {
        this.pageIndex = 1;
        if (this.dt != null) {
            this.refresh();
        }
        this.loadData();
    }

    edit(rowData: any) {
        this.loading = true;
        this.http.post(
            "EOffice/GetDetailDoc",
            {
                Id: rowData.Id
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    const ref = this.dialogService
                        .open(QuanLyVanBanModal, {
                            data: {
                                IsAdd: false,
                                item: result.Result,
                            },
                            header: "Cập nhật",
                            width: "70%",
                        })
                        .onClose.subscribe((data: any) => {
                            if (data) {
                                this.loadData();
                            }
                        });
                }
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        );
    }

    add() {
        const ref = this.dialogService.open(QuanLyVanBanModal, {
            data: {
                IsAdd: true,
                UnitCode: this.unit
            },
            header: 'Thêm mới văn bản',
            width: '70%'
        }).onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }

    private loadData(): void {
        this.loading = true;
        this.http.post(
            "EOffice/GetList",
            {
                PageIndex: this.pageIndex,
                PageSize: this.pageSize,
                Keyword: this.keywordInput == "" ? null : this.keywordInput,
                IsPagination: true,
                Status: this.statusId ? this.statusId : null,
                UnitCode: this.unit,
                LoaiVanBan: this.loaiVanBan,
                // Tag: this.loaiVanBan,
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.items = result.Result;
                    this.totalRow = result.TotalRow;
                }
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        );
    }

    search() {
        this.pageIndex = 1;
        this.refresh();
        this.loadData();
    }

    refresh() {
        this.dt.first = 0;
    }

    paginate(event: LazyLoadEvent) {
        if (this.oldEvent == null || event == this.oldEvent) {
            this.oldEvent = event;
            return;
        }
        this.oldEvent = event;
        this.pageSize = event.rows ?? 10;
        var first = event.first ?? 0;
        this.pageIndex = Math.floor(first / this.pageSize) + 1;

        this.sortOrder = event.sortOrder == 1 ? true : false;
        this.sortField = event.sortField ?? "";
        this.filters = event.filters;
        setTimeout(() => {
            this.loadData();
        }, 100);
    }

    onChangeStatus(event: any) {
        var id = event.target.value;
        this.statusId = id;
    }

    //get enter key search
    getSearch(event: any) {
        if (event == 13) {
            this.search();
        }
    }

    delete(item: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn xóa dữ liệu này không?',
            accept: () => {
                this.deleteConfirmed(item);
            }
        });
    }

    deleteConfirmed(item: any) {
        this.http.post(
            "EOffice/ChangeStatus",
            {
                Id: item.Id,
                Status: -1
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.toastr.success("Xóa thành công!", "Thông báo", {
                        timeOut: 3000,
                    });
                    this.loadData();
                }
            },
            () => {
                this.toastr.error("Đã có lỗi xảy ra!", "Lỗi", {
                    timeOut: 3000,
                });
            }
        );
    }

    undelete(item: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn bỏ xóa dữ liệu này không?',
            accept: () => {
                this.undeleteConfirmed(item);
            }
        });
    }

    undeleteConfirmed(item: any) {
        this.http.post(
            "EOffice/ChangeStatus",
            {
                Id: item.Id,
                Status: 1
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.toastr.success("Bỏ xóa thành công!", "Thông báo", {
                        timeOut: 3000,
                    });
                    this.loadData();
                }
            },
            () => {
                this.toastr.error("Đã có lỗi xảy ra!", "Lỗi", {
                    timeOut: 3000,
                });
            }
        );
    }
}
