import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { HistoryModal } from './history.modal';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HistoryComponent extends BasePage {

    items: any[] = [];
    pageSize: number = 10;
    pageIndex: number = 1;
    keyword: string = "";
    totalRow: number = 0;
    loading: boolean = false;
    fromDate: any;
    toDate: any;
    idRoute: any;
    

    actions: any[] = [
        {
            Id: null,
            Name: "Tất cả"
        },
        {
            Id: 1,
            Name: "Thêm mới"
        },
        {
            Id: 2,
            Name: "Chỉnh sửa"
        },
        {
            Id: 3,
            Name: "Xóa"
        },
        {
            Id: 4,
            Name: "Khác"
        },
        {
            Id: 5,
            Name: "Đăng nhập"
        },
        {
            Id: 6,
            Name: "Xem"
        }
    ];
    action: any = null;
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService
    ) {
        super(router, route, http, message);
        var date = new Date();
        this.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
        this.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    onInit(): void {
        this.route.params.subscribe(params => {
            this.items = [];
            this.pageSize = 10;
            this.pageIndex = 1;
            this.keyword = "";
            this.loading = false;
            this.idRoute = params['id'];
            this.loadData();
        });
    }
    search(){
        this.items = [];
        this.pageSize = 10;
        this.pageIndex = 1;
        this.keyword = "";
        this.loading = false;
        this.loadData();
    }
    view(item: any) {
        const ref = this.dialogService.open(HistoryModal, {
            data: {
                IsAdd: false,
                item: item,
            },
            header: 'Chi tiết thao tác',
            width: '50%',
        }).onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }

    loadPage(): void {

    }

    paginate(event: any) {
        if (!this.idRoute) {
            return;
        }
        this.pageSize = event.rows ?? 10;
        var first = event.first ?? 0;
        this.pageIndex = Math.floor(first / this.pageSize) + 1;

        setTimeout(() => {
            this.loadData();
        }, 100);
    }
    loadData() {
        this.loading = true;
        var filters = [];

        this.http.post("History/Histories", {
            keyword: this.keyword,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            ItemId: this.idRoute,
            IsPagination: true,
            StartDate: moment(this.fromDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
            EndDate: moment(this.toDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
            Action :  this.action
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

}
