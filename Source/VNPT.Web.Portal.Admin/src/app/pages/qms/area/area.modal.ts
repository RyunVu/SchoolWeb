import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { s } from "src/app/services/s.service";
import { ToastrService } from "ngx-toastr";
import { Parameter } from "src/app/services/staticparameters.service";

@Component({
    selector: "area-modal",
    templateUrl: 'area.modal.html',
    styleUrls: ['./area.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})


export class AreaModal {
    item: any;
    provinces: any = [];
    province: any;
    districts: any = [];
    district: any;
    wards: any[] = [];
    ward: any;
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService
    ) {
        this.item = {
            "Code": "",
            "Description": "",
            "Name": "",
            "Address": "",
            "PhoneNo": "",
            "Setting": "",//text area
            "QMSPlaceId": this.config.data.QMSPlaceId,
            "Id": null
        };
        this.provinces = Parameter.provinces;
        this.province = Parameter.province;
        if(this.config.data.item != null) {
            this.item = this.config.data.item;
            this.district = this.item.UnitCode;
        }
    }

    ngOnInit() {
    }
    
    cancel() {
        this.ref.close();
    }
    onKeyUp(event: any) {
        if (event.keyCode == 13) {
        }
    }
    submit() {
        if (this.config.data.QMSPlaceId == null) {
            this.toastr.error('Tác vụ không xử lý được vui lòng mở lại popup', 'Cảnh báo', {
                timeOut: 3000,
            });
            this.cancel();
            return;
        }
        if (this.item.Name == null || this.item.Name == "") {
            this.toastr.error('Thiếu trường Tên', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        this.http.post("QMSAdmin/SaveArea",
        {
            "Code": this.item.Code,
            "Name": this.item.Name,
            "Address": this.item.Address,
            "PhoneNo": this.item.PhoneNo,
            "Setting": this.item.Setting,//text area
            "QMSPlaceId": this.config.data.QMSPlaceId,
            "Id": this.item.Id
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.ref.close({ confirm: 'yes' });
            }
        }, () => {
            // console.log("Lỗi")
        });
    }
}