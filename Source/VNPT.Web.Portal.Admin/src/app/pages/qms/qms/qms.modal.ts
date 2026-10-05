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
    selector: "qms-modal",
    templateUrl: 'qms.modal.html',
    styleUrls: ['./qms.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})


export class QMSModal {
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
            "UnitCode": "",//combo box
            "Code": "",
            "Name": "",
            "Address": "",
            "PhoneNo": "",
            "Setting": "",//text area
            "Id": null,
            "LocationProvinceId": "",
            "LocationDistrictId": "",
            "LocationWardId": "",
        };
        this.provinces = Parameter.provinces;
        this.province = Parameter.province;
        if(this.config.data.item != null) {
            this.item = this.config.data.item;
            this.district = this.item.UnitCode;
        }

    }

    ngOnInit() {
        this.loadDistrics();
    }
    loadDistrics() {
        this.http.post("QMSAdmin/Districts", {
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.districts = result.Result;
                if(this.config.data.item != null) {
                    if(this.item.UnitCode == "LDG") {
                        this.district = this.districts[0];
                    } else {
                        this.district = this.districts.filter((a: any) => {return a.Id == this.item.LocationDistrictId})[0];
                    }
                    this.loadWards();
                } else {
                    this.district = this.districts[0];
                }
            }
        }, () => {
        });
    }
    loadWards() {
        this.http.post("location/getWards", {
            "ParentId": this.district.Id
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.wards = result.Result;
                this.wards.unshift({
                    Id: "-1",
                    Name: "Chọn tất cả"
                });
                if(this.config.data.item != null) {
                    this.ward = this.wards.filter((a: any) => {return a.Id == this.item.LocationWardId})[0];
                } else {
                    this.ward = this.wards[0];
                }
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
    submit() {
        if (this.item.Name == null || this.item.Name == "") {
            this.toastr.error('Thiếu trường Tên', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (this.province == null || this.province == "") {
            this.toastr.error('Thiếu trường Tỉnh', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (this.district == null || this.district == "") {
            this.toastr.error('Chọn đơn vị cấp thành phố/huyện', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        this.http.post("QMSAdmin/SavePlace",
        {
            "UnitCode": this.district.UnitCode,//combo box
            "Code": this.item.Code,
            "Name": this.item.Name,
            "Address": this.item.Address,
            "PhoneNo": this.item.PhoneNo,
            "Setting": this.item.Setting,//text area
            "Id": this.item.Id,
            "LocationProvinceId": this.province.Id,
            "LocationDistrictId": this.district.UnitCode != "LDG" ? this.district.Id : null,
            "LocationWardId": this.ward && this.ward.Id != "-1" ? this.ward.Id : null,
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.ref.close({ confirm: 'yes' });
            }
        }, () => {
            // console.log("Lỗi")
        });
    }

    selectDistrict(event: any) {
        if(this.district && this.district.UnitCode != "LDG") {
            this.ward = null;
            this.loadWards();
        } else {
            this.wards = [];
            this.ward = null;
        }
    }
}