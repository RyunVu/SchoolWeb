import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { s } from "src/app/services/s.service";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";
import { UnitModal } from "../systems/units/units.modal";

@Component({
    standalone: false,
    selector: "chi-tiet-diem-modal",
    templateUrl: 'chi-tiet-diem.modal.html',
    styleUrls: ['./chi-tiet-diem.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ChiTietDiemModal {

    item: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService
    ) {
        if (this.config.data != null) {
            this.item = this.config.data;
        }
    }

    ngOnInit() {
        //console.log(this.item)
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

    isLoading: boolean = false;

    submit() {
        this.isLoading = true;
        this.http.upload("TraCuuDiem/ExportFile", this.item, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.message.add({ severity: 'success', summary: 'Thông báo', detail: "Export File thành công!" });
                this.ref.close({ url: result.Result });

            }
            else {
                this.message.add({ severity: 'error', summary: 'Cảnh báo', detail: result.Message });
            }
            this.isLoading = false;
        }, () => {
            this.isLoading = false;
        });

    }
}