import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { s } from "src/app/services/s.service";
import { ToastrService } from "ngx-toastr";

@Component({
    standalone: false,
    selector: "units-modal",
    templateUrl: 'units.modal.html',
    styleUrls: ['./units.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})


export class UnitModal {
    item: any;
    locations: any[] = [];
    wards: any[] = [];

    location: any;
    ward: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService
    ) {
        this.item = {
            "Id": null,
            "Name": "",
            "UnitCode": "",
            "DistrictId": "",
            "WardId": "",
            "Code": "",
            "Description": "",
            "SortNo": null
        };
        
        if(this.config.data.item != null) {
            this.item = this.config.data.item;
        }
        
        console.log(this.item);
    }

    ngOnInit() {
        this.loadLocations();
    }
    loadLocations() {
        this.http.post("unit/districts", {

        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.locations = result.Result;
                this.locations.forEach(element => {
                    element.Id = element.Id.toLowerCase();
                });
                if (this.item.DistrictId == "" || this.item.DistrictId == null) {
                    //this.location = this.locations[0]?.Id;
                    if(this.item.UnitCode == "LDG") {
                        this.location = this.locations.filter(a => { return a.UnitCode == "LDG"; })[0];
                    }
                } else {
                    var location_id = this.item.DistrictId.toLowerCase();
                    if(location_id != null) {
                        this.location = this.locations.filter(a => { return a.Id == location_id; })[0];
                    }
                }

                if(this.location != null) {
                    this.loadWards();
                }
            }
        }, () => {
        });
    }
    loadWards() {
        this.http.post("unit/Wards", {
            "ParentId": this.location.Id
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.wards = result.Result;
                this.wards.forEach(element => {
                    element.Id = element.Id.toLowerCase();
                });
                if (this.item.WardId == "" || this.item.WardId == null) {
                    // this.ward = this.wards[0]?.Id;
                } else {
                    var ward_id = this.item.WardId.toLowerCase();
                    if(ward_id != null) {
                        this.ward = this.wards.filter(a => { return a.Id == ward_id; })[0];
                    }
                }
            }
        }, () => {
        });
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
            this.toastr.error('Vui lòng nhập Tên', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (this.item.Code == null || this.item.Code == "") {
            this.toastr.error('Vui lòng nhập Mã đơn vị', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (this.location == null) {
            this.toastr.error('Vui lòng chọn Huyện/Thành phố', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        this.http.post("Unit/Save",
        {
            "Id": this.item.Id,
            "Name": this.item.Name,
            "UnitCode": this.location.UnitCode,
            "DistrictId": this.location.UnitCode == "LDG" ? null : this.location.Id,
            "WardId": this.ward != null ? this.ward.Id : null,
            "Code": this.item.Code,
            "Description": this.item.Description,
            "SortNo": this.item.SortNo
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.ref.close({ confirm: 'yes' });
            }
        }, () => {
            // console.log("Lỗi")
        });
    }

    selectLocation(event: any) {
        this.ward = null;
        this.wards = [];
        this.loadWards();
    }
}