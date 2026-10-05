import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
    ConfirmationService,
    LazyLoadEvent,
    MessageService,
} from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { ResultCode, ResultModel } from "src/app/models";
import { BasePage, BaseService, HttpService } from "src/app/services";
import { OTPCheckModal } from "../systems/user/otpcheck.modal";
import { UserModal } from "../systems/user/user.modal";
//import { PopupImageModal } from "../feedbacks/feedback/popupImage.modal";

import * as moment from "moment";
import { DanhSachTinTucModal } from "./danh-sach-tin-tuc.modal";
import { DanhSachTinTucModal as DanhSachTinTucModal1 } from "../danh-sach-tin-tuc/danh-sach-tin-tuc.modal";


@Component({
    selector: "app-danh-sach-tin-tuc",
    templateUrl: "./danh-sach-tin-tuc.component.html",
    styleUrls: ["./danh-sach-tin-tuc.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DanhSachTinTucComponent extends BasePage {
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
    locations: any[] = [];
    location: any = null;

    DenNgay: any;
    TuNgay: any;

    units: any[] = [];
    unit: any;

    // isSuperAdminSystem: boolean = false;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private baseService: BaseService
    ) {
        super(router, route, http, message);

        // var mulRole = this.baseService.MulRole;
        // if (mulRole != "" && mulRole != null && (mulRole.includes("SuperAdminSystem") || mulRole.includes("AdminTramYTe") || mulRole.includes("AdminPhongYTe"))) {
        //     this.isSuperAdminSystem = true;
        // }

        var currentDate = new Date();

        this.TuNgay = moment("01/" + "01/" + currentDate.getFullYear, "DD/MM/YYYY").toDate();

        this.DenNgay = moment().toDate();

        this.loadUnits();


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

    onInit(): void { }

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
        if (this.parameter == 'videoptt') {
            const ref = this.dialogService
                .open(DanhSachTinTucModal1, {
                    data: {
                        IsAdd: true,
                        Code: this.parameter,
                        Parent: this
                    },
                    header: "Thêm mới tin tức",
                    width: "100%",
                })
                .onClose.subscribe((data: any) => {
                    if (data) {
                        this.loadData();
                    }
                });
        } else {
            const ref = this.dialogService
                .open(DanhSachTinTucModal, {
                    data: {
                        IsAdd: true,
                        Code: this.parameter,
                    },
                    header: "Thêm mới tin tức",
                    width: "100%",
                })
                .onClose.subscribe((data: any) => {
                    if (data) {
                        this.loadData();
                    }
                });
        }
    }

    edit(item: any) {

        if (this.parameter == 'videoptt') {
            const ref = this.dialogService
                .open(DanhSachTinTucModal1, {
                    data: {
                        IsAdd: false,
                        item: item,
                        Code: this.parameter,
                        Parent: this
                    },
                    header: "Cập nhật tin tức",
                    width: "100%",
                })
                .onClose.subscribe((data: any) => {
                    if (data) {
                        this.loadData();
                    }
                });
        } else {
            const ref = this.dialogService
                .open(DanhSachTinTucModal, {
                    data: {
                        IsAdd: false,
                        item: item,
                        Code: this.parameter,
                    },
                    header: "Cập nhật tin tức",
                    width: "100%",
                })
                .onClose.subscribe((data: any) => {
                    if (data) {
                        this.loadData();
                    }
                });
        }


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
        this.loadData();
    }

    private loadData(): void {
        this.loading = true;

        this.http.post(
            "News/GetList",
            {
                Code: this.parameter,
                UnitCode: this.unit,
                FromDate: this.TuNgay,
                ToDate: this.DenNgay,
                Keyword: this.keywordInput == "" ? null : this.keywordInput,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize
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

    clearfilter() {
        this.pageIndex = 1;
        var currentDate = new Date();
        this.TuNgay = moment("01/" + "01/" + currentDate.getFullYear, "DD/MM/YYYY").toDate();
        this.DenNgay = moment().toDate();
        this.keywordInput = null;
        this.refresh();
        this.loadData();
    }

    refresh() {
        this.dt.first = 0;
    }

    // openPopupImage(item: any) {
    //     const ref = this.dialogService
    //         .open(PopupImageModal, {
    //             data: {
    //                 items: item.ImageList,
    //             },
    //             header: "Slideshow",
    //             width: "70%",
    //         })
    //         .onClose.subscribe((data: any) => { });
    // }
}
