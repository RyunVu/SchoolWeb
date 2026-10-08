import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import moment from 'moment';
import { LocationModal } from "./location.modal";
import { ToastrService } from "ngx-toastr";

@Component({
    standalone: false,
    selector: "user-modal",
    templateUrl: 'user.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./user.modal.scss']
})


export class UserModal {
    item: any;
    dataTransfer: any;

    units: any[] = [];
    positions: any[] = [];
    unit: any;
    position: any;

    roles: any[] = [];
    fields: any[] = [];
    selectedRoles: any[] = [];
    selectedFields: any[] = [];

    locations: any[] = [];

    pwd: any = "";
    isUBND: any = "";
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        public dialogService: DialogService,
        public toastr: ToastrService
    ) {
        this.dataTransfer = this.config.data;
        this.isUBND = this.config.data.isUBND;
        this.item = {};
        this.fields = [];
    }
    ngAfterViewInit(): void {

    }

    ngOnInit() {
        this.loadUsers();
    }
    loadFields() {

    }
    loadUnits() {
        this.http.post("user/Units", {
            isUBND: this.isUBND
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;
                this.units.forEach(element => {
                    element.Id = element.Id.toLowerCase();
                });
                if (this.item.UnitId == "" || this.item.UnitId == null) {
                    this.unit = this.units[0]?.Id;
                } else {
                    this.unit = this.item.UnitId.toLowerCase();
                }

                this.loadFields();
            }
        }, () => {
        });
    }
    loadPositions() {
        this.http.post("user/Positions", {

        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.positions = result.Result;
                this.positions.forEach(element => {
                    element.Id = element.Id.toLowerCase();
                });
                if (this.item.PositionId == "" || this.item.PositionId == null) {
                    this.position = this.positions[0]?.Id;
                } else {
                    this.position = this.item.PositionId.toLowerCase();
                }
            }
        }, () => {
        });
    }
    loadRoles() {
        this.http.post("user/Roles", {
            IsFullName: true
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.roles = result.Result;
                if (this.item.RoleIds == null || this.item.RoleIds.length == 0) {
                    this.selectedRoles = [];
                } else {
                    this.selectedRoles = this.item.RoleIds;
                }
            }
        }, () => {
        });
    }

    loadLocations() {
        this.locations = this.item.UserLocations;
    }

    loadUsers() {
        if (this.dataTransfer.Id != null && this.dataTransfer.Id != "") {
            this.http.post("User/single", {
                Id: this.dataTransfer.Id
            }, (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.item = result.Result;
                    this.loadPositions();
                    this.loadUnits();
                    this.loadRoles();
                    this.loadLocations();
                }
            }, () => {
            });
        } else {
            this.loadPositions();
            this.loadUnits();
            this.loadRoles();
        }
    }

    selectUnit(event: any) {
        this.selectedFields = [];
        this.loadFields();
    }

    cancel() {
        this.ref.close();
    }
    loading: boolean = false;
    submit() {
        if (this.item.LastName == null || this.item.LastName == "") {
            this.toastr.error('Nhập họ cho tài khoản!', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (this.item.FirstName == null || this.item.FirstName == "") {
            this.toastr.error('Nhập tên cho tài khoản!', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (this.selectedRoles == null || this.selectedRoles.length == 0) {
            this.toastr.error('Chọn quyền cho tài khoản!', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (this.item.UserName == null || this.item.UserName == "") {
            this.toastr.error('Nhập tên đăng nhập cho tài khoản!', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        this.loading = true;
        var data = {
            "Id": this.item.Id,
            "FirstName": this.item.FirstName,
            "LastName": this.item.LastName,
            "UserName": this.item.UserName,
            "PhoneNumber": this.item.PhoneNumber,
            "OtherPositionName": this.item.OtherPositionName,
            "Email": this.item.Email,
            "PositionId": this.position,
            "UnitId": this.unit,
            "FieldIds": this.selectedFields,
            "RoleIds": this.selectedRoles,
            "UserLocations": this.locations,
            "Password": this.pwd
        };

        this.http.post("user/save", data, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.toastr.success('Cập nhật thành công!', 'Thông báo', {
                    timeOut: 3000,
                });
                this.ref.close(true);
            } else {
                this.toastr.error(result.Message, 'Cảnh báo', {
                    timeOut: 3000,
                });
            }
            this.loading = false;
        }, () => {
            this.loading = false;
            this.toastr.error('Vui lòng kiểm tra Internet!', 'Cảnh báo', {
                timeOut: 3000,
            });
        });
    }

    addUnit() {
        const ref = this.dialogService.open(LocationModal, {
            data: {
                Id: "",
                IsEdit: false
            },
            header: 'Khu vực quản lý',
            width: '30%'
        })!.onClose.subscribe((data: any) => {
            if (data) {
                var checExist = this.checkExist(data.ProvinceId, data.DistrictId, data.WardId);
                if (checExist >= 0) {

                } else {
                    this.locations.push(data);
                }
            }
        });
    }

    checkExist(pId: any, dId: any, wId: any) {
        var t = -1;
        this.locations.forEach((element, index) => {
            if (element.ProvinceId == pId && element.DistrictId == dId && element.WardId == wId) {
                t = index;
            }
        });
        return t;
    }

    removeUnit(item: any) {
        this.locations.splice(this.checkExist(item.ProvinceId, item.DistrictId, item.WardId), 1);
    }
}
