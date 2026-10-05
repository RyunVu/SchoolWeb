import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { OTPCheckModal } from '../../systems/user/otpcheck.modal';
import { UserModal } from '../../systems/user/user.modal';

import * as moment from 'moment';
import { AreaModal } from './area.modal';

@Component({
    selector: 'app-area',
    templateUrl: './area.component.html',
    styleUrls: ['./area.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AreaComponent extends BasePage {
   
    @ViewChild('dt', { static: false }) dt: any;

    items: any[] = [];
    pageSize: number = 10;
    pageIndex: number = 1;
    keyword: string = "";
    totalRow: number = 0;
    sortField: string = "";
    sortOrder: boolean = false;
    loading: boolean = false;
    oldEvent: any;
    filters: any = {};

    keywordInput: string = "";
    routeSub: any;
    PlaceId: any;
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
    ngOnDestroy() {
        if(this.routeSub != null) {
            this.routeSub.unsubscribe();
        }
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
    onInit(): void {
    }
    
    loadPage(): void {
        this.routeSub = this.route.params.subscribe(params => {
            this.PlaceId = params['id'];
            this.pageIndex = 1;
           
            this.keyword = "";
            this.keywordInput = "";
          
            if(this.dt != null) {
                this.refresh();
            }
            this.loadData();
        });
    }
    private loadData(): void {
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
      
        this.http.post("QMSAdmin/Areas", {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            sortOrder: this.sortOrder,
            sortField: this.sortField,
            filters: filters,
            keyword: this.keyword,
            PlaceId: this.PlaceId
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.items = result.Result;
                this.totalRow = result.TotalRow;
            }
            this.loading = false;
        }, () => {
            this.loading = false;
        });
    }


    clearfilter() {
        this.pageIndex = 1;
        this.keyword = "";
        this.keywordInput = "";
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

    openPopupImage(item:any) {
        
    }


    detailItem(item: any) {
        window.open(`/#/qms/quay/${item.Id}`);
    }

    add() {
        const ref = this.dialogService.open(AreaModal, {
            data: {
                IsAdd: true,
                QMSPlaceId: this.PlaceId
            },
            header: 'Thêm mới khu vực',
            width: '70%'
        }).onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
    edit(item: any) {
        const ref = this.dialogService.open(AreaModal, {
            data: {
                IsAdd: false,
                item: item,
                QMSPlaceId: this.PlaceId
            },
            header: 'Cập nhật khu vực',
            width: '70%'
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
                this.http.post("QMSAdmin/DeleteArea",
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
}
