import { Component, ViewChild, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { s } from "src/app/services/s.service";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    standalone: false,
    selector: "sys-portal-alias-add-modal",
    templateUrl: 'sys-portal-alias-add.modal.html',
    styleUrls: ['./sys-portal-alias-add.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})


export class SysPortalAliasAddModal {

    item: any;

    defaultTenMien: any;

    giaoThucs: any[] = [];
    giaoThuc: any;

    donVis: any[] = [];
    donVi: any;

    defaultTrangChinh: boolean = false;

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

        this.giaoThucs = [{ Id: "http", Name: "http" }, { Id: "https", Name: "https" }];

        this.donVis = [{ Id: "LDG", Name: "LDG" }];

        if (!this.config.data.IsAdd) // edit
        {
            this.defaultTenMien = this.item.Domain
            this.defaultTrangChinh = this.item.IsMain
            this.giaoThuc = this.item.ProtocolName;
            this.donVi = this.item.UnitCode;
        }
        else {
            this.giaoThuc = "http";
            this.donVi = "LDG";
        }
    }

    ngOnInit() {

    }

    cancel() {
        this.ref.close();
    }

    submit() {
        if (!this.checkDomain(this.defaultTenMien)) {
            this.toastr.error("Tên miền không hợp lệ!", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        } else {
            this.http.post(
                "SysPortalAlias/Modify",
                {
                    ID: !this.config.data.IsAdd ? this.item.Id : null,
                    PORTALID: this.item.PortalId,
                    DOMAIN: this.defaultTenMien,
                    PROTOCOL: this.giaoThuc,
                    ISMAIN: this.defaultTrangChinh,
                    UNITCODE: this.donVi
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                        this.ref.close({ confirm: "yes" });
                    }
                },
                () => { }
            );
        }
    }

    checkDomain(domain: any) {
        var flag = false;
        if (domain != '') {
            // Domain name regular expression
            var regex = new RegExp("^([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
            if (regex.test(domain)) {
                flag = true;
            } else {
                flag = false;
            }
        }
        return flag;
    }
}