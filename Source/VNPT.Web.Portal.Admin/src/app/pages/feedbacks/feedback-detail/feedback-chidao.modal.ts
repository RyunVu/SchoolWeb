import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { HttpService } from "src/app/services";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { ResultCode, ResultModel } from "src/app/models";

@Component({
    selector: "feedback-chidao-modal",
    templateUrl: 'feedback-chidao.modal.html',
    styleUrls: ['./feedback-chidao.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class FeedbackChiDaoModal {
    items: any;
    item: any;

    command: any;

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
    }
    cancel() {
        this.ref.close();
    }

    save() {
        if (this.command == null || this.command == "") {
            this.toastr.error('Thiếu trường nội dung chỉ đạo', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        this.http.post("FeedbackAdmin/SaveCommand",
            {
                "FeedbackId": this.item,
                "Command": this.command
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.ref.close({ confirm: 'yes' });
                }
            }, () => {
            });
    }
}