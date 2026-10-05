import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { VersionAppModal } from './version-app.modal';

@Component({
    selector: 'app-version-app',
    templateUrl: './version-app.component.html',
    styleUrls: ['./version-app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VersionAppComponent extends BasePage {

    @ViewChild('dt', { static: false }) dt: any;

    items: any[] = [];
    pageSize: number = 10;
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
        const ref = this.dialogService.open(VersionAppModal, {
            data: {
                IsAdd: true,
            },
            header: 'Thêm mới phiên bản',
            width: '40%'
        }).onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
    edit(item: any) {
        const ref = this.dialogService.open(VersionAppModal, {
            data: {
                IsAdd: false,
                item: item,
            },
            header: 'Cập nhật phiên bản',
            width: '40%',
        }).onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
    delete(item: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xoá item ' + item.Name + '?',
            accept: () => {
                this.http.post("AppVersion/Delete",
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
        var filters = [];
        if (this.filters != null) {
            let entries: any = Object.entries(this.filters);

            for (var i = 0; i < entries.length; i++) {
                filters.push({
                    Name: entries[i][0],
                    Value: entries[i][1].value,
                    MatchMode: entries[i][1].matchMode,
                })
            }
        }

        this.http.post("AppVersion/List", {
            keyword: this.keyword,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            sortOrder: this.sortOrder,
            sortField: this.sortField,
            IsPagination: true,
            filters: filters
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.items = result.Result;
                this.totalRow = result.TotalRow
            }
            this.loading = false;
        }, () => {
            this.loading = false;
        });
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
}
