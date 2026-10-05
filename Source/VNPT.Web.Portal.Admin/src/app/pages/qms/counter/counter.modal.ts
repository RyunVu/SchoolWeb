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
    selector: "counter-modal",
    templateUrl: 'counter.modal.html',
    styleUrls: ['./counter.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})


export class CounterModal {
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
            "QMSAreaId": this.config.data.QMSAreaId,
            "Code": "",
            "CounterId": "",
            "ShortName": "",
            "Description ": "",
            "Id": null,// cho nhập kiểu số lớn 0
            "Name": "",
            "Sort": null
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
        if (this.config.data.QMSAreaId == null) {
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
        if (this.item.Id == null || this.item.Id == "") {
            this.toastr.error('Thiếu trường Id', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (this.item.CounterId == null || this.item.CounterId == "") {
            this.toastr.error('Thiếu trường Id quầy', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (this.item.Sort == null || this.item.Sort == "") {
            this.toastr.error('Thiếu trường tiền tố', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        var func = "QMSAdmin/SaveNewCounter";
        if(this.config.data.item != null) {
            func = "QMSAdmin/SaveEditCounter";
        }
        this.http.post(func,
            {
                "QMSAreaId": this.config.data.QMSAreaId,
                "Code": this.item.Code,
                "CounterId": this.item.CounterId,
                "ShortName": this.item.ShortName,
                "Id": this.item.Id,// cho nhập kiểu số lớn 0
                "Name": this.item.Name,
                "Sort": this.item.Sort
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