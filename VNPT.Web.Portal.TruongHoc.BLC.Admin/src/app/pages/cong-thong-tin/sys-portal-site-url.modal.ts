import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import { SysPortalSiteURLAddModal } from "./sys-portal-site-url-add.modal";

@Component({
    standalone: false,
    selector: "sys-portal-site-url-modal",
    templateUrl: 'sys-portal-site-url.modal.html',
    styleUrls: ['./sys-portal-site-url.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class SysPortalSiteURLModal {

    @ViewChild('dt', { static: false }) dt: any;

    item: any;
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

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
    ) {
        if (this.config.data.item != null) {
            this.item = this.config.data.item;
        }

        this.loadData();
    }

    ngOnInit() {

    }

    paginate(event: any) {

        this.pageSize = event.rows ?? 20;
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
        this.http.post(
            "SysSite/GetList",
            {
                PageIndex: this.pageIndex,
                PageSize: this.pageSize,
                Keyword: this.keyword,
                PortalId: this.item.Id,
                IsPagination: true
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.items = result.Result;
                    this.totalRow = result.TotalRow;
                }
            },
            () => {
            }
        );
    }

    cancel() {
        this.ref.close();
    }

    add() {
        const ref = this.dialogService.open(SysPortalSiteURLAddModal, {
            data: {
                IsAdd: true,
                item: {
                    Id: "",
                    PortalId: this.item.Id
                },
            },
            header: 'Thêm mới tên miền con',
            width: '70%'
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }

    edit(item: any) {
        const ref = this.dialogService.open(SysPortalSiteURLAddModal, {
            data: {
                IsAdd: false,
                item: item,
            },
            header: 'Cập nhật tên miền con',
            width: '70%'
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });  
    }

    delete(item: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xoá tên miền này không?',
            accept: () => {
                this.http.post("SysSite/Delete", {
                    Id: item.Id,
                    UnitCode: this.item.UnitCode
                }, (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                        this.loadData();
                    }
                }, () => {
                });
            }
        });
    }
}