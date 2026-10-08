import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { HttpService } from "src/app/services";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { ResultCode, ResultModel } from "src/app/models";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";

@Component({
    standalone: false,
    selector: "feedback-baocao-modal",
    templateUrl: 'feedback-baocao.modal.html',
    styleUrls: ['./feedback-baocao.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class FeedbackBaoCaoModal {
    items: any;
    item: any;

    images: any[] = [];

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
        this.http.post("FeedbackAdmin/SaveReport",
        {
            "Type": 0, // 0 là báo cáo bình thường, 1 là báo cáo và kết thúc
            "FeedbackId": this.item,
            "Content": this.command,
            "Image": this.images
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.ref.close({ confirm: 'yes' });
            }
        }, () => {
        });
    }

    saveAndEnd() {
        if (this.command == null || this.command == "") {
            this.toastr.error('Thiếu trường nội dung chỉ đạo', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        this.http.post("FeedbackAdmin/SaveReport",
        {
            "Type": 1, // 0 là báo cáo bình thường, 1 là báo cáo và kết thúc
            "FeedbackId": this.item,
            "Content": this.command,
            "Image": this.images
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.ref.close({ confirm: 'yes' });
            }
        }, () => {
        });
    }

    openFileDialog() {
        const ref = this.dialogService.open(FileManagerModal, {
            data: {
                filetype: 'image',
                multipleselect: true,
                isGetFullImageInfo: true
            },
            header: 'Quản lý file',
            width: '70%',
        })!.onClose.subscribe((data: any) => {
            if (data) {
                var fileUrls = data.urls;
                fileUrls.forEach((element:any) => {
                    if(this.images.filter(a => { return a.Id == element.Id; }).length == 0) {
                        this.images.push(element);
                    }
                });
            }
        });
    }

    deleteImage(item: any) {
        var index = this.images.findIndex(a => { return a.Id == item.Id; });
        this.images.splice(index, 1);
    }
}