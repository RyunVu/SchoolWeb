import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { OTPCheckModal } from '../../systems/user/otpcheck.modal';
import { UserModal } from '../../systems/user/user.modal';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { QMSModal } from './qms.modal';

@Component({
    selector: 'app-qms',
    templateUrl: './qms.component.html',
    styleUrls: ['./qms.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QmsComponent extends BasePage {
   
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
    typePA: any;
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private toastr: ToastrService
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
            this.typePA = params['type'];
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
      
        this.http.post("QMSAdmin/Places", {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            sortOrder: this.sortOrder,
            sortField: this.sortField,
            filters: filters,
            keyword: this.keyword,
            Code: this.typePA
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
    syncPAMC(){
        this.loading = true;
        this.http.post("QMSAdmin/Sync", {
           
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.toastr.error('Đồng bộ thành công', 'Thông báo', {
                    timeOut: 3000,
                });
            }else{
                this.toastr.error('Đồng bộ thất bại', 'Thông báo', {
                    timeOut: 3000,
                });
            }
            this.loading = false;
        }, () => {
            this.toastr.error('Đồng bộ thất bại', 'Thông báo', {
                timeOut: 3000,
            });
            this.loading = false;
        });
    }

    detailItem(item: any) {
        window.open(`/#/qms/khu-vuc/${item.Id}`);
    }

    add() {
        const ref = this.dialogService.open(QMSModal, {
            data: {
                IsAdd: true,
            },
            header: 'Thêm mới địa điểm bóc số',
            width: '70%'
        }).onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
    edit(item: any) {
        const ref = this.dialogService.open(QMSModal, {
            data: {
                IsAdd: false,
                item: item,
            },
            header: 'Cập nhật địa điểm bóc số',
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
                this.http.post("QMSAdmin/DeletePlace",
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
