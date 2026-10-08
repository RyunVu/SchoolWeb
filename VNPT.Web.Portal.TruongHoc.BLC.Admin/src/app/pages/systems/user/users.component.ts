import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { OTPCheckModal } from './otpcheck.modal';
import { UserModal } from './user.modal';
import { QrOtpModal } from './qr-otp.modal';

@Component({
    standalone: false,
    selector: 'app-user',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserComponent extends BasePage {

    @ViewChild('dt', { static: false }) dt: any;

    items: any[] = [];
    pageSize: number = 20;
    pageIndex: number = 1;
    keyword: string = "";
    totalRow: number = 0;
    sortField: string = "";
    sortOrder: boolean = false;
    loading: boolean = false;
    oldEvent: any;
    filters: any = {};

    units: any[] = [];
    unit: any;
    unitInput: any;
    keywordInput: string = "";

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
        //
        //event.first = Index of the first record
        //event.rows = Number of rows to display in new page
        //event.page = Index of the new page
        //event.pageCount = Total number of pages
    }
    onInit(): void {
    }
    edit(item: any){
        item.IsEdit = true;
        const ref = this.dialogService.open(UserModal, {
            data: item,
            header: 'Cập nhật tài khoản',
            width: '50%'
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
    add(){
        const ref = this.dialogService.open(UserModal, {
            data: {
                Id: "",
                IsEdit : false
            },
            header: 'Thêm mới người dùng',
            width: '50%'
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }
    viewOtpQr(item:any){
        const ref = this.dialogService.open(QrOtpModal, {
            data: item,
            header: 'Xem mã xác mình 2 bước',
            width: '500px'
        })!.onClose.subscribe((data: any) => {

        });
    }
    loadPage(): void {
        this.loadData();
        this.loadUnits();
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
        console.log(this.keyword, this.pageIndex);
        this.http.post("User/users", {
            keyword: this.keyword,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            sortOrder: this.sortOrder,
            sortField: this.sortField,
            filters: filters,
            UnitId: this.unit
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

    resetpwd(item: any) {
        this.http.post("User/ResetPassword",
        {
            Id: item.Id,
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.loading = true;
                this.loadData();
            }
        }, () => {
        });
    }

    turnOnOtp(item: any) {
        this.http.post("User/ChangeOtpStatus",
        {
            Id: item.Id,
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.loading = true;
                this.loadData();
            }
        }, () => {
        });
    }

    turnOffOtp(item: any) {
        this.turnOnOtp(item);
    }

    delete(item: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xoá item ' + item.UserName + '?',
            accept: () => {
                this.http.post("User/Deleteuser",
                {
                    Id: item.Id,
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                        this.loading = true;
                        this.loadData();
                    }
                }, () => {
                });
            }
        });
    }

    loadUnits() {
        this.http.post("user/Units", {
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;
                this.units.unshift({ Id: null, Name: "Tất cả" })
            }
        }, () => {
        });
    }

    clearfilter() {
        this.pageIndex = 1;
        this.unit = null;
        this.keyword = "";
        this.unitInput = null;
        this.keywordInput = "";
        this.refresh();
        this.loadData();
    }

    search() {
        this.pageIndex = 1;
        this.unit = this.unitInput;
        this.keyword = this.keywordInput;
        this.refresh();
        this.loadData();
    }
    
    refresh() {
        this.dt.first = 0;
    }

    viewOtp(item: any) {
        this.http.post("User/GetNewOtp",
        {
            Id: item.Id,
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                const ref = this.dialogService.open(OTPCheckModal, {
                    data: {
                        OTP: result.Result
                    },
                    header: 'Mã OTP hiện tại',
                    width: '260px'
                })!.onClose.subscribe((data: any) => {
                    
                });
            }
        }, () => {
        });
        
    }
}
