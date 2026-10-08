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

export class UploadFileModal {

    units: any[] = [];
    unit: any[] = [];

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
        this.loadUnits();
    }

    ngOnInit() {

    }

    loadUnits() {
        this.http.post("user/Units", {

        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;
                // this.units.unshift({ Id: null, Name: '--Chưa chọn đơn vị--' });
                //this.unit = [];
            }
        }, () => {
        });
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

    submit() {
        if (this.unit == undefined || this.unit == null || this.unit.length == 0) {
            this.message.add({ severity: 'error', summary: 'Thông báo', detail: "Vui lòng chọn đơn vị!" });
            return;
        }

        if (this.uploadFile == null || this.uploadFile.length == 0) {
            this.message.add({ severity: 'error', summary: 'Thông báo', detail: "Vui lòng chọn File!" });
            return;
        }

        var listUnitCode = "";

        this.unit.forEach(element => {
            listUnitCode += element.Code + "|"
        });

        this.form = new FormData();
        for (let i = 0; i < this.uploadFile.length; i++) {
            this.form.append('Files[]', this.uploadFile[i], this.uploadFile[i].name);
        }

        this.form.append("UnitCode", listUnitCode);
        this.http.upload("SysPortal/UploadFile", this.form, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.message.add({ severity: 'success', summary: 'Thông báo', detail: "Upload File thành công!" });
            }
            else {
                this.message.add({ severity: 'error', summary: 'Cảnh báo', detail: result.Message });
            }
        }, () => {

        });
    }

}