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
import { SysPortalReviewModal } from "./sysportal-review.modal";

declare var $: any;
@Component({
    selector: 'app-hoi-dap',
    templateUrl: './sysportal-review.component.html',
    styleUrls: ['./sysportal-review.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SysPortalReviewComponent extends BasePage {
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

    typeId: any = 0;
    types: any[] = [{ "Id": 0, "Name": "Tất cả" }, { "Id": 1, "Name": "Đã trả lời" }, { "Id": 2, "Name": "Chưa trả lời" }];

    statusId: any = 0;
    status: any[] = [{ "Id": 0, "Name": "Tất cả" }, { "Id": 5, "Name": "Đã công khai" }, { "Id": 6, "Name": "Chưa công khai" }];

    isSuperAdminSystem: boolean = false;

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


    onInit(): void {
    }

    loadPage(): void {
        this.pageIndex = 1;
        if (this.dt != null) {
            this.refresh();
        }
        this.loadData();
    }

    private loadData(): void {
        this.loading = true;
        this.http.post(
            "SysPortalReview/GetList",
            {
                PageIndex: this.pageIndex,
                PageSize: this.pageSize,
                Keyword: this.keywordInput == "" ? null : this.keywordInput,
                IsPagination: true,
                Tag: this.typeId ? this.typeId : null,
                Status: this.statusId ? this.statusId : null,
                UnitCode: this.unit
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

    onChangeType(event: any) {

        var id = event.target.value;
        this.typeId = id;
    }

    //get enter key search
    getSearch(event: any) {
        if (event == 13) {
            this.search();
        }
    }

    public(item: any) {
        this.confirmationService.confirm({
            message: "Bạn có chắc chắn muốn công khai phản ánh này không?",
            accept: () => {
                this.confirmpublic(item);
            },
        });
    }

    unpublic(item: any) {
        this.confirmationService.confirm({
            message: "Bạn có chắc chắn muốn thu hồi phản ánh này không?",
            accept: () => {
                this.confirmunpublic(item);
            },
        });
    }

    confirmpublic(item: any) {
        this.http.post(
            "SysPortalReview/ChangePublic",
            {
                Id: item.Id
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.toastr.success("Thành công!", "Thông báo", {
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

    confirmunpublic(item: any) {
        this.http.post(
            "SysPortalReview/ChangeUnPublic",
            {
                Id: item.Id
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.toastr.success("Thành công!", "Thông báo", {
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
            "SysPortalReview/Delete",
            {
                Id: item.Id
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

    showReply(item: any) {
        const ref = this.dialogService
        .open(SysPortalReviewModal, {
            data: {
                IsAdd: true,
                Code: this.parameter,
                item: item
            },
            header: "Trả lời hỏi đáp",
            width: "80%",
        })
        .onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
}
