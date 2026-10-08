import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { UploadFileDiemModal } from './upload-file.modal';
import { ChiTietDiemModal } from './chi-tiet-diem.modal';

@Component({
    standalone: false,
    selector: 'app-tra-cuu-diem',
    templateUrl: './tra-cuu-diem.component.html',
    styleUrls: ['./tra-cuu-diem.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TraCuuDiemComponent extends BasePage {

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

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService
    ) {
        super(router, route, http, message);

    }

    onInit(): void {
    }

    add() {

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
            "TraCuuDiem/GetList",
            {
                Keyword: this.keywordInput == "" ? null : this.keywordInput,
                PageIndex: this.pageIndex,
                PageSize: this.pageSize,
                IsPagination: true
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
    refresh() {
        //this.dt.first = 0;
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

    chiTiet(data: any) {
        this.loading = true;
        this.http.post(
            "TraCuuDiem/GetDetail",
            {
                MaVnedu: data.MaVnedu
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    const ref = this.dialogService.open(ChiTietDiemModal, {
                        data: result.Result,
                        header: 'Thông tin bảng điểm',
                        width: '60%',
                    })!.onClose.subscribe((data: any) => {
                        if(data) {
                            window.open(data.url)
                        }
                    });
                } else {
                    this.message.add({ severity: 'error', summary: 'Thông báo', detail: result.Message });
                }
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        );
        //
    }

    uploadFile() {
        const ref = this.dialogService.open(UploadFileDiemModal, {
            data: {

            },
            header: 'Import File',
            width: '40%',
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
}
