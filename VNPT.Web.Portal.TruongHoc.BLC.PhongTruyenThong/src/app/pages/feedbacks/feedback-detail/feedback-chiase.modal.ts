import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { HttpService } from "src/app/services";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { ResultCode, ResultModel } from "src/app/models";

@Component({
    standalone: false,
    selector: "feedback-chiase-modal",
    templateUrl: 'feedback-chiase.modal.html',
    styleUrls: ['./feedback-chiase.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class FeedbackChiaSeModal {
    items: any;
    item: any;

    command: any;

    locations: any[] = [];
    units: any[] = [];
    users: any[] = [];

    location: any;
    unit: any;
    user: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        public dialogService: DialogService,
        public httpClient: HttpClient,
        private toastr: ToastrService,
    ) {

    }

    ngOnInit() {
        this.item = this.config.data.items;
        this.loadLocations();
    }
    cancel() {
        this.ref.close();
    }

    loadLocations() {
        this.http.post("unit/districts", {

        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.locations = result.Result;
                this.location = this.locations[0].UnitCode;
                this.loadUnits();
            }
        }, () => {
        });
    }
    loadUnits() {
        this.http.post("FeedbackAdmin/units", {
            "UnitCode": this.location
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;
            }
        }, () => {
        });
    }
    loadUsers() {
        this.http.post("FeedbackAdmin/UserByUnits", {
            "Id": this.unit
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.users = result.Result;
            }
        }, () => {
        });
    }

    save() {
        if (this.command == null || this.command == "") {
            this.toastr.error('Thiếu trường nội dung chỉ đạo', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        this.http.post("FeedbackAdmin/SaveShare",
            {
                "ReceiveUserId": this.user,
                "Content": this.command
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.ref.close({ confirm: 'yes' });
                }
            }, () => {
            });
    }

    selectLocation(event: any) {
        this.unit = null;
        this.units = [];
        this.user = null;
        this.users = [];
        this.loadUnits();
    }
    selectUnit(event: any) {
        this.user = null;
        this.users = [];
        this.loadUsers();
    }
}