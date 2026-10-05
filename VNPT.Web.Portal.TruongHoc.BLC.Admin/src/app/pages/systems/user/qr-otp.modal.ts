import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "qr-otp-modal",
    templateUrl: 'qr-otp.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./qr-otp.modal.scss']
})


export class QrOtpModal {
    item: any;
    imageUrl: any = "";
    keyQr: any = "";
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public httpService: HttpService,
        public toastr: ToastrService
    ) {
        this.item = this.config.data;
    }

    ngAfterViewInit(): void {

    }

    ngOnInit() {
        this.httpService.post("LoginV2/GetQrAuthorizationAdmin", this.item,
            (data: any) => {
                if (data.Code == 200) {
                    this.imageUrl = data.Result;
                    this.keyQr = data.Message;
                } else {
                    this.toastr.error(data.Message, "Thông báo");
                }
            },
            (error: any) => {
                this.toastr.error("Lỗi mạng. ", "Lỗi");
            });
    }

    cancel() {
        this.ref.close();
    }
}