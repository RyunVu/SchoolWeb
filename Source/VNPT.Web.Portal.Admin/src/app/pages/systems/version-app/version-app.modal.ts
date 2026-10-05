import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { s } from "src/app/services/s.service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "version-app-modal",
    templateUrl: 'version-app.modal.html',
    styleUrls: ['./version-app.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})


export class VersionAppModal {
    item: any;
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService
    ) {
        this.item = {

        };

        if (this.config.data.item != null) {
            this.item = this.config.data.item;
        }

    }

    ngOnInit() {

    }
    loadTypes() {

    }
    loadGroupIds(keyword: string = "") {

    }
    completeMethod(event: any) {

    }
    cancel() {
        this.ref.close();
    }
    onKeyUp(event: any) {
        if (event.keyCode == 13) {
        }
    }
    submit() {
        if (this.item.Name == null || this.item.Name == "") {
            this.toastr.error('Thiếu trường Tên', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (this.item.Code == null || this.item.Code == "") {
            this.toastr.error('Thiếu trường Code', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        this.http.post("AppVersion/Save",
            this.item,
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.ref.close({ confirm: 'yes' });
                }
            }, () => {
                // console.log("Lỗi")
            });
    }

}