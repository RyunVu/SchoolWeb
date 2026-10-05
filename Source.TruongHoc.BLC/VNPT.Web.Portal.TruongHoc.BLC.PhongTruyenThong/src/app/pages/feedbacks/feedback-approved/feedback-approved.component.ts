import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { OTPCheckModal } from '../../systems/user/otpcheck.modal';
import { UserModal } from '../../systems/user/user.modal';

import * as moment from 'moment';
import { PopupImageModal } from '../feedback/popupImage.modal';

@Component({
    selector: 'app-feedback-approved',
    templateUrl: './feedback-approved.component.html',
    styleUrls: ['./feedback-approved.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FeedbackApprovedComponent extends BasePage {

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

    units: any[] = [];
    unit: any;
    unitInput: any;
    keywordInput: string = "";

    fields: any[] = [];
    field: any;
    fieldInput: any;

    statuses = [
        { Id: 6, Name: 'Đã phát hành' },
        { Id: 7, Name: 'Chờ duyệt phát hành' },
    ];
    statusInput: any = 7
    status: any = 7;

    startDateInput: any;
    startDate: any;
    endDateInput: any;
    endDate: any;
    routeSub: any;

    unitCodes: any[] = [];
    unitCode: any;

    typePA: any;
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService
    ) {
        super(router, route, http, message);
        this.startDateInput = moment().format("01/MM/YYYY");
        this.endDateInput = moment().format("DD/MM/YYYY");

    }
    ngOnDestroy() {
        if (this.routeSub != null) {
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
        this.loadCodes();
        this.routeSub = this.route.params.subscribe(params => {
            this.typePA = params['type'];
            this.pageIndex = 1;
            this.unit = null;
            this.unitInput = null;
            this.field = null;
            this.fieldInput = null;
            this.keyword = "";
            this.keywordInput = "";
            this.status = 7;
            this.statusInput = 7;
            this.startDate = null;
            this.startDateInput = moment().format("01/MM/YYYY");;
            this.endDate = null;
            this.endDateInput = moment().format("DD/MM/YYYY");
            if (this.dt != null) {
                this.refresh();
            }
            this.loadData();
        });
    }
    private loadData(): void {
        this.loading = true;

        this.http.post("FeedbackAdmin/Feedbacks", {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            keyword: this.keyword,
            UnitId: this.unit,
            FieldId: this.field,
            FromDate: this.startDate != null ? moment(this.startDate, "DD/MM/YYYY").format("DD/MM/YYYY") : null,
            ToDate: this.startDate != null ? moment(this.endDate, "DD/MM/YYYY").format("DD/MM/YYYY") : null,
            Status: this.status,
            Code: this.typePA,
            UnitCode: this.unitCode
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
    loadCodes() {
        this.http.post("Unit/districts", {
            "IsPagination": false,
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.unitCodes = result.Result;
                this.unitCode = result.Result[0].UnitCode;
                this.loadUnits();
                this.loadFields();
            }
        }, () => {
        });
    }
    loadUnits() {
        this.http.post("FeedbackAdmin/Units", {
            UnitCode: this.unitCode,
            Code: this.typePA,
            "IsPagination": false,
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;
            }
        }, () => {
        });
    }

    changeUnitCode() {
        this.loadUnits();
        this.loadFields();
    }
    loadFields() {
        this.http.post("FeedbackAdmin/Fields", {
            UnitCode: this.unitCode,
            Code: this.typePA,
            "IsPagination": false,
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.fields = result.Result;
            }
        }, () => {
        });
    }

    clearfilter() {
        this.pageIndex = 1;
        this.unit = null;
        this.unitInput = null;
        this.field = null;
        this.fieldInput = null;
        this.keyword = "";
        this.keywordInput = "";
        this.status = null;
        this.statusInput = null;
        this.startDate = null;
        this.startDateInput = null;
        this.endDate = null;
        this.endDateInput = null;
        this.refresh();
        this.loadData();
    }

    search() {
        this.pageIndex = 1;
        this.unit = this.unitInput;
        this.field = this.fieldInput;
        this.keyword = this.keywordInput;
        this.status = this.statusInput;
        this.startDate = this.startDateInput;
        this.endDate = this.endDateInput;
        this.refresh();
        this.loadData();
    }

    refresh() {
        this.dt.first = 0;
    }

    openPopupImage(item: any) {
        const ref = this.dialogService.open(PopupImageModal, {
            data: {
                items: item.ImageList
            },
            header: 'Slideshow',
            width: '70%'
        }).onClose.subscribe((data: any) => {

        });
    }

    setStatus(statusNumber: any) {
        this.status = statusNumber;
        this.statusInput = statusNumber;
        this.loadData();
    }
    approved(item: any) {

    }
    detailItem(item: any) {
        window.open(`/#/phan-anh/chi-tiet/${item.Id}`);
    }

    shareList() {
        window.open(`/#/phan-anh/chia-se`, '_blank');
    }
    recommendedList() {
        window.open(`/#/phan-anh/quan-tam`, '_blank');
    }
}
