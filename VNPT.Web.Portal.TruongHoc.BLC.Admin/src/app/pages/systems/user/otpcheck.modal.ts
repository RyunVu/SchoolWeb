import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";

@Component({
    selector: "otpcheck-modal",
    templateUrl: 'otpcheck.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./otpcheck.modal.scss']
})


export class OTPCheckModal {
    item: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService
    ) {
        this.item = this.config.data;
    }
    
    ngAfterViewInit(): void {

    }

    ngOnInit() {

    }

    cancel() {
        this.ref.close();
    }
}