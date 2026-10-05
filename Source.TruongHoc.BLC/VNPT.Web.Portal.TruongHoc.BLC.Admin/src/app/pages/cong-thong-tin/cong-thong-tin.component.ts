import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { CongThongTinModal } from './cong-thong-tin.modal';
import { SysPortalAliasModal } from './sys-portal-alias.modal';
import { SysPortalSiteURLModal } from './sys-portal-site-url.modal';
import { UploadFileModal } from './upload-file.modal';

@Component({
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
        const ref = this.dialogService.open(CongThongTinModal, {
            data: {
                IsAdd: true,
            },
            header: 'Thêm mới cổng',
            width: '70%'
        }).onClose.subscribe((data: any) => {
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
        }).onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
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
        this.sortField = event.sortField ?? "";
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
        this.dt.first = 0;
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
        }).onClose.subscribe((data: any) => {
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
        }).onClose.subscribe((data: any) => {
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
        }).onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
}
