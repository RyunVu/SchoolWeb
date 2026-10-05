import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { s } from "src/app/services/s.service";
import { ToastrService } from "ngx-toastr";

declare var $: any;

@Component({
    selector: "fm-mini-window-modal",
    templateUrl: 'fm-mini-window.modal.html',
    styleUrls: ['./fm-mini-window.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class FMMiniWindowModal {
    item: any;
    objectType: any;
    folderId: any;
    filetype: any;
    file: any;
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService
    ) {
        this.item = {};

        this.objectType = config.data.objectType;
        this.folderId = config.data.folderId;

        this.filetype = config.data.type;
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

    uploadFile: any[] = [];
    changeImage(event: any) {
        this.uploadFile = event.target.files;
    }

    isLoading: boolean = false;

    submit() {
        if (this.objectType == 'file') {
            if (this.uploadFile == null || this.uploadFile.length == 0) {
                this.toastr.warning("Thông báo", "Vui lòng chọn file");
                return;
            }
            let form: FormData = new FormData();
            for (let i = 0; i < this.uploadFile.length; i++) {
                form.append('Files[]', this.uploadFile[i], this.uploadFile[i].name);
            }
            // form.append('Files', this.uploadFile[0], this.uploadFile[0].name);
            form.append("FolderId", this.folderId);
            form.append("FileType", this.filetype);
            form.append("HasThumb", "true");

            // Kích hoạt hiệu ứng xoay
            this.isLoading = true;

            this.http.upload("media/UploadFile", form, (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.ref.close({ confirm: 'yes' });
                }
                else {
                    this.toastr.warning(result.Message, "Cảnh báo", {
                        timeOut: 3000,
                    });
                    return;
                }
                setTimeout(() => {
                    this.isLoading = false;
                  }, 1000); // 1000ms tương ứng với thời gian hoàn thành của animation
            }, () => {
            });
        } else {
            var data = {
                Name: this.item.Name,
                ParentId: this.folderId
            };
            this.http.post("media/AddFolder", data, (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.ref.close({ confirm: 'yes' });
                }
                else {
                    this.toastr.warning("Thông báo", result.Message);
                    return;
                }
            }, () => {
            });
        }
    }

    selectType(event: any) {

    }
}