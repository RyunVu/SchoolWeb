import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { HttpService } from "src/app/services";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { ResultCode, ResultModel } from "src/app/models";

@Component({
    selector: "feedback-quatrinhxuly-modal",
    templateUrl: 'feedback-quatrinhxuly.modal.html',
    styleUrls: ['./feedback-quatrinhxuly.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class FeedbackQuaTrinhXuLyModal {
    events: any[] = [];
    item: any;

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
        this.loadData();
    }
    cancel() {
        this.ref.close();
    }

    loadData() {
        this.http.post("FeedbackAdmin/Processes", {
            "Id": this.item
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.events = result.Result;
                this.events.push({
                    Id: null
                })
            }
        }, () => {
        });
    }
}