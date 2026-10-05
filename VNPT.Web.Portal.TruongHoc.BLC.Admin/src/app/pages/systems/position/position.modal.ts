import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { s } from "src/app/services/s.service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "position-modal",
    templateUrl: 'position.modal.html',
    styleUrls: ['./position.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})


export class PositionModal {
    item: any;

    types: any[] = [
        {
            Id: 0,
            Name: "Chọn loại"
        },
        {
            Id: 1,
            Name: "Tất cả lĩnh vực"
        },
        {
            Id: 2,
            Name: "Theo lĩnh vực"
        },
        {
            Id: 3,
            Name: "Theo phân công"
        }
    ];
    type: any = 0;
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService
    ) {
        this.item = {
          
        };

        if(this.config.data.item != null) {
            this.item = this.config.data.item;
        }

        this.type = this.item.TypeGetList;
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
        this.http.post("Position/Save",
        {
            "Id": this.item.Id,
            "Name": this.item.Name,
            "Code": this.item.Code,
            "Description": this.item.Description,
            "OrderNo": this.item.OrderNo,
            "TypeGetList": this.type
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.ref.close({ confirm: 'yes' });
            }
        }, () => {
            // console.log("Lỗi")
        });
    }

    selectedPlaceChange(event: any) {

    }
}