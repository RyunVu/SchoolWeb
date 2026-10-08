import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService } from "primeng/dynamicdialog";
import { ResultCode, ResultModel } from "src/app/models";
import { BasePage, HttpService } from "src/app/services";
import { OTPCheckModal } from "../systems/user/otpcheck.modal";
import { UserModal } from "../systems/user/user.modal";

import moment from 'moment';
import { DanhMucModal } from "./danh-muc.modal";

@Component({
    standalone: false,
    selector: "app-danh-muc",
    templateUrl: "./danh-muc.component.html",
    styleUrls: ["./danh-muc.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DanhMucComponent extends BasePage {
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

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService
    ) {
        super(router, route, http, message);

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

    onInit(): void { }
    
    add() {
        const ref = this.dialogService
            .open(DanhMucModal, {
                data: {
                    IsAdd: true,
                    Code: this.parameter,
                },
                header: "Thêm mới danh mục",
                width: "50%",
            })!
            .onClose.subscribe((data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }

    edit(item: any) {
        const ref = this.dialogService
            .open(DanhMucModal, {
                data: {
                    IsAdd: false,
                    item: item,
                    Code: this.parameter,
                },
                header: "Cập nhật lĩnh vực: " + item.Name,
                width: "50%",
            })!
            .onClose.subscribe((data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }

    delete(item: any) {
        this.confirmationService.confirm({
            message: "Bạn có chắc chắn muốn xoá item " + item.Name + "?",
            accept: () => {
                this.http.post(
                    "GeneralCategory/Delete",
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
            "GeneralCategory/Items",
            {
                Code: this.parameter,
                Keyword: this.keywordInput,
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
    clearfilter() {
        this.pageIndex = 1;
        this.refresh();
        this.loadData();
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
