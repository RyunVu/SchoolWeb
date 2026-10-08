import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService } from "primeng/dynamicdialog";
import { ResultCode, ResultModel } from "src/app/models";
import { BasePage, BaseService, HttpService } from "src/app/services";
import { OTPCheckModal } from "../systems/user/otpcheck.modal";
import { UserModal } from "../systems/user/user.modal";

import moment from 'moment';
import { DuyetTinTucModal } from "./duyet-tin-tuc.modal";
import { ToastrService } from "ngx-toastr";

@Component({
    standalone: false,
    selector: "app-duyet-tin-tuc",
    templateUrl: "./duyet-tin-tuc.component.html",
    styleUrls: ["./duyet-tin-tuc.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DuyetTinTucComponent extends BasePage {
    @ViewChild("dt", { static: false }) dt: any;

    items: any[] = [];
    pageSize: number = 20;
    pageIndex: number = 1;
    totalRow: number = 0;
    sortField: string = "";
    sortOrder: boolean = false;
    loading: boolean = false;
    isDisableBack = true;
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
    status: any = 0;
    DenNgay: any;
    TuNgay: any;

    units: any[] = [];
    unit: any;
    isDuyetTin: boolean = false;
    isSuperAdminSystem: boolean = false;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private toastr: ToastrService,
        private baseService: BaseService
    ) {
        super(router, route, http, message);

        var mulRole = this.baseService.MulRole;
        if (mulRole != "" && mulRole != null && (mulRole.includes("SuperAdminSystem") || mulRole.includes("AdminTramYTe") || mulRole.includes("AdminPhongYTe"))) {
            this.isSuperAdminSystem = true;
        }

        this.TuNgay = null;
        this.DenNgay = null;

        this.loadUnits();
    }

    resetFilter() {
        this.keywordInput = "";
        this.status = 0;
        this.TuNgay = null;
        this.DenNgay = null;
        this.search();
    }
    override async getPermission() {
        var data2 = {
            Action: this.router.url
        };
        this.http.post("Menu/CheckPermission", data2,
            (kq2: ResultModel) => {
                if (kq2.Code == 200) {
                    this.permissions = kq2.Result.Permissions;
                    var action = this.router.url;
                    action = action.replace('duyet/', '');
                    var data = {
                        Action: action
                    };
                    this.http.post("Menu/CheckPermission", data,
                        (kq: ResultModel) => {
                            if (kq.Code == 200) {
                                this.parameter = kq.Result.Parameter;
                                this.title = "Duyệt " + kq.Result.Title;
                                this.menuInfo = kq.Result;
                                this.isNewsImage = kq.Result.IsNewsImage;
                                this.isOpenBlankPage = kq.Result.IsOpenBlankPage;
                                this.isOpenImageOnly = kq.Result.IsOpenImageOnly;
                                this.loadPage();
                                this.onInit();
            
                            } else {
                                this.message.add({ severity: 'error', summary: 'Error', detail: 'Phiên làm việc hết hạn hoặc bạn không có quyền truy cập!' });
                                this.router.navigate(['/login']);
                            }
                        },
                        (error: any) => {
                            this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng kiểm tra kết nối internet!" });
                            console.error(error);
                            //this.router.navigate(['/dang-nhap']);
                        });
                } else {
                    this.message.add({ severity: 'error', summary: 'Error', detail: 'Phiên làm việc hết hạn hoặc bạn không có quyền truy cập!' });
                    this.router.navigate(['/login']);
                }
            },
            (error: any) => {
                this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng kiểm tra kết nối internet!" });
                console.error(error);
                //this.router.navigate(['/dang-nhap']);
            });
     
       
        
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
    quaylai() {
        this.router.navigate(['/quan-ly-tin-tuc/' + this.parameter]);
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

    edit(item: any) {
        const ref = this.dialogService
            .open(DuyetTinTucModal, {
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

    changeStatus(item: any) {
        this.confirmationService.confirm({
            message: "Bạn có chắc chắn muốn " + (item.Status == 1 ? "bỏ duyệt" : "duyệt") + " tin tức này không?",
            accept: () => {
                this.http.post(
                    "News/DuyetTin",
                    {
                        Id: item.Id,
                    },
                    (result: ResultModel) => {
                        if (result.Code == ResultCode.Success) {
                            this.loadData();
                            this.toastr.success((item.Status == 1 ? "Bỏ duyệt" : "Duyệt") + " tin tức", "Thành công", {
                                timeOut: 3000,
                            });
                        } else {
                            this.toastr.error(result.Message, "Cảnh báo", {

                                timeOut: 3000,
                            });
                        }
                    },
                    () => {
                        this.toastr.error("Lỗi kết nối!", "Cảnh báo", {

                            timeOut: 3000,
                        });
                    }
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
        console.log({
            Code: this.parameter,
            UnitCode: this.unit,
            FromDate: this.TuNgay,
            ToDate: this.DenNgay,
            Keyword: this.keywordInput == "" ? null : this.keywordInput,
            PageIndex: this.pageIndex,
            PageSize: this.pageSize,
            Status: this.status
        })
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
                this.loading = false;
                this.isDisableBack = false;
            },
            () => {
                this.loading = false;
                this.isDisableBack = false;
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


}
