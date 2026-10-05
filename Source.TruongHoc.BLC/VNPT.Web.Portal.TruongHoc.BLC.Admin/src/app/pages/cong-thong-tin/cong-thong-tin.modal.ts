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
    selector: "cong-thong-tin-modal",
    templateUrl: 'cong-thong-tin.modal.html',
    styleUrls: ['./cong-thong-tin.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})


export class CongThongTinModal {

    item: any;

    imageUrl: any;
    imageDisplay: any;

    quanTriViens: any[] = [];
    quanTriVien: any;
    chuDes: any[] = [];
    chuDe: any;
    trangChus: any[] = [];
    trangChu: any;
    units: any[] = [];
    unit: any;
    portals: any[] = [];
    portal: any;

    defaultTenCong: any;
    defaultTag: any;
    defaultTenMien: any;
    defaultMoTa: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService
    ) {
        if (this.config.data.item != null) {
            this.item = this.config.data.item;
        }

        if (!this.config.data.IsAdd) // edit
        {
            this.defaultTenCong = this.item.Name;
            this.defaultTag = this.item.Tag;
            this.defaultTenMien = this.item.Domain;
            this.defaultMoTa = this.item.Description;
            this.imageUrl = this.item.Logo;
        }

        this.loadQuanTriVien();
        this.loadChuDe();
        this.loadTrangChu();
        this.loadUnits();
        this.loadSysPortals();
    }

    ngOnInit() {

    }

    loadUnits() {
        this.http.post("user/Units", {

        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;
                this.units.unshift({ Id: null, Name: '--Chưa chọn đơn vị--' });

                if (!this.config.data.IsAdd) // edit
                {
                    this.unit = this.item.UnitCode;
                }
                else {
                    this.unit = null;
                }
            }
        }, () => {
        });
    }

    loadSysPortals() {
        this.http.post("SysPortal/GetListSysPortal",
        {
            PageIndex: 1,
            PageSize: 50,
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.portals = result.Result;
                this.portals.unshift({ Id: null, Name: '--Chưa chọn cổng--' });
                this.portal = null;
            }
        }, () => {
        });
    }

    loadQuanTriVien() {
        this.http.post(
            "SysPortal/GetListDefaultUser",
            {
                Role: "SuperAdminSystem"
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.quanTriViens = result.Result;
                    this.quanTriViens.unshift({ Id: null, Name: '--Chưa chọn Quản trị viên--' });

                    if (!this.config.data.IsAdd) // edit
                    {
                        this.quanTriVien = this.item.AdministratorId;
                    }
                    else {
                        this.quanTriVien = null;
                    }
                }
            },
            () => {
            }
        );
    }

    loadChuDe() {
        this.http.post(
            "SysPortal/GetListTheme",
            {

            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.chuDes = result.Result;
                    this.chuDes.unshift({ Id: null, Name: '--Chưa chọn Chủ đề--' });

                    if (!this.config.data.IsAdd) // edit
                    {
                        this.chuDe = this.item.ThemeId;
                    }
                    else {
                        this.chuDe = null;
                    }
                }
            },
            () => {
            }
        );
    }

    loadTrangChu() {
        this.http.post(
            "SysPortal/GetListSite",
            {
                Id: !this.config.data.IsAdd ? this.item.Id : null
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.trangChus = result.Result;
                    this.trangChus.unshift({ Id: null, Name: '--Chưa chọn Trang chủ--' });

                    if (!this.config.data.IsAdd) // edit
                    {
                        this.trangChu = this.item.HomeSiteId;
                    }
                    else {
                        this.trangChu = null;
                    }
                }
            },
            () => {
            }
        );
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

    changeMoTa(event: any) {
        this.defaultMoTa = event
    }

    openFileDilog() {
        const ref = this.dialogService
            .open(FileManagerModal, {
                data: {
                    filetype: "image",
                    multipleselect: false,
                },
                header: "Quản lý file",
                width: "70%",
            })
            .onClose.subscribe((data: any) => {
                if (data) {
                    var fileUrls = data.urls;
                    fileUrls.forEach((element: any) => {
                        this.imageUrl = element.Url;
                    });
                }
            });
    }

    isLoading: boolean = false;

    submit() {

        if (this.quanTriVien == undefined || this.quanTriVien == null) {
            this.toastr.warning("Vui lòng chọn quản trị viên", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.chuDe == undefined || this.chuDe == null) {
            this.toastr.warning("Vui lòng chọn chủ đề", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.unit == undefined || this.unit == null) {
            this.toastr.warning("Vui lòng chọn đơn vị", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.config.data.IsAdd && (this.portal == undefined || this.portal == null)) {
            this.toastr.warning("Vui lòng chọn Clone site Đơn vị", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.defaultTenCong == null || this.defaultTenCong == "") {
            this.toastr.warning("Vui lòng nhập tên cổng", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        this.isLoading = true;

        this.http.post(
            "SysPortal/Modify",
            {
                Id: !this.config.data.IsAdd ? this.item.Id : null,
                AdministratorId: this.quanTriVien,
                ThemeId: this.chuDe,
                HomeSiteId: this.trangChu,
                UnitCode: this.unit,
                Logo: this.imageUrl,
                Name: this.defaultTenCong,
                Tag: this.defaultTag,
                Domain: this.defaultTenMien,
                Description: this.defaultMoTa,
                UnitCodeClone: this.portal
            },
            (result: ResultModel) => {
                this.isLoading = false;
                if (result.Code == ResultCode.Success) {
                    this.ref.close({ confirm: "yes" });
                }
            },
            () => { 
                this.isLoading = false;
            }
        );
    }

    addUnit() {
        const ref = this.dialogService.open(UnitModal, {
            data: {
                IsAdd: true,
            },
            header: 'Thêm mới đơn vị',
            width: '70%'
        }).onClose.subscribe((data: any) => {
            if (data) {
                this.loadUnits();
            }
        });
    }

}