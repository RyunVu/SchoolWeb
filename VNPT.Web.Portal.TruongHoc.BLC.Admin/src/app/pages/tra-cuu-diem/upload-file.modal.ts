import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { s } from "src/app/services/s.service";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";

declare var $: any;

@Component({
    standalone: false,
    selector: "upload-file-modal",
    templateUrl: 'upload-file.modal.html',
    styleUrls: ['./upload-file.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class UploadFileDiemModal {

    years: any[] = [];
    year: any;

    uploadFile: any[] = [];
    defaultFileName: any;

    form: FormData = new FormData();

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService
    ) {
        this.loadYear();
    }

    ngOnInit() {

    }

    loadYear() {
        const currentYear = new Date().getFullYear();
        this.years = [];

        for (let year = currentYear; year >= 2020; year--) {
            this.years.push({ Name: year, Code: year });
        }
    }

    cancel() {
        this.ref.close();
    }

    onKeyUp(event: any) {
        if (event.keyCode == 13) {
        }
    }

    chooseFile(event: any) {
        this.uploadFile = event.target.files;

        if (event.target.files && event.target.files[0]) {

            this.defaultFileName = event.target.files[0].name;
            var nameLength = event.target.files[0].name.length;

            var reader = new FileReader();
            reader.onload = (event: any) => {
                var localUrl = event.target.result;
            }

            reader.readAsDataURL(event.target.files[0]);
        }
    }

    isLoading: boolean = false;

    submit() {
        if (this.uploadFile == null || this.uploadFile.length == 0) {
            this.message.add({ severity: 'error', summary: 'Thông báo', detail: "Vui lòng chọn File!" });
            return;
        }

        this.form = new FormData();
        for (let i = 0; i < this.uploadFile.length; i++) {
            this.form.append('file', this.uploadFile[i], this.uploadFile[i].name);
        }

        this.isLoading = true;
        this.http.upload("TraCuuDiem/ImportFile", this.form, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.message.add({ severity: 'success', summary: 'Thông báo', detail: "Import File thành công!" });
            }
            else {
                this.message.add({ severity: 'error', summary: 'Cảnh báo', detail: result.Message });
            }
            this.ref.close({ confirm: "yes" });
            this.isLoading = false;
        }, () => {
            this.isLoading = false;
        });
    }

}