import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { Parameter } from "src/app/services/staticparameters.service";

@Component({
    selector: "location-modal",
    templateUrl: 'location.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./location.modal.scss']
})

export class LocationModal {
    item: any;

    provinces: any[] = [];
    province: any;

    districts: any[] = [];
    district: any;
    wards: any[] = [];
    ward: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService
    ) {

    }
    ngAfterViewInit(): void {

    }

    ngOnInit() {
        this.provinces = Parameter.provinces;
        this.province = Parameter.province;
        this.loadLocations();
    }

    loadLocations() {
        this.http.post("location/getcities", {
            "ParentId": this.province.Id
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.districts = result.Result;
                this.district = this.districts[0];
                this.selectDistrict(null);
            }
        }, () => {
        });
    }

    add() {
        this.ref.close({
            DistrictId: this.district != null ? this.district.Id : null,
            DistrictName: this.district != null ? this.district.Name : null,
            ProvinceId: this.province.Id,
            ProvinceName: this.province.Name,
            WardId: this.ward != null ? this.ward.Id : null,
            WardName: this.ward != null ? this.ward.Name : null
        });
    }

    cancel() {
        this.ref.close();
    }

    selectDistrict(event: any) {
        if (this.district != null) {
            this.ward = null;
            this.http.post("location/getWards", {
                "ParentId": this.district.Id
            }, (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.wards = result.Result;
                    // this.ward = result.Result[0];
                }
            }, () => {
            });
        }
    }
}
