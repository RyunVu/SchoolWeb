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
    selector: "sys-portal-site-url-add-modal",
    templateUrl: 'sys-portal-site-url-add.modal.html',
    styleUrls: ['./sys-portal-site-url-add.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class SysPortalSiteURLAddModal {

    item: any;

    defaultName: any;
    defaultSubdomain: any;
    defaultSiteUrl: any;

    chuDes: any[] = [];
    chuDe: any;

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

        this.loadChuDe();

        if (!this.config.data.IsAdd) // edit
        {
            this.defaultName = this.item.Name
            this.defaultSubdomain = this.item.Subdomain
            this.defaultSiteUrl = this.item.SiteUrl
        }
    }

    loadChuDe() {
        this.http.post(
            "SysSite/GetListThemeLayout",
            {

            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.chuDes = result.Result;
                    this.chuDes.unshift({ Id: null, Name: '--Chưa chọn Chủ đề--' });

                    if (!this.config.data.IsAdd) // edit
                    {
                        this.chuDe = this.item.LayoutId;
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

    ngOnInit() {

    }

    cancel() {
        this.ref.close();
    }

    submit() {
        if (this.defaultName == null || this.defaultName == "") {
            this.toastr.warning("Vui lòng nhập Tên", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.defaultSubdomain == null || this.defaultSubdomain == "") {
            this.toastr.warning("Vui lòng nhập Subdomain", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.defaultSiteUrl == null || this.defaultSiteUrl == "") {
            this.toastr.warning("Vui lòng nhập Tên file .cshtml", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.chuDe == undefined || this.chuDe == null) {
            this.toastr.error("Vui lòng chọn chủ đề", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        this.http.post(
            "SysSite/Modify",
            {
                ID: !this.config.data.IsAdd ? this.item.Id : null,
                PORTALID: this.item.PortalId,
                Name: this.defaultName,
                Subdomain: this.defaultSubdomain,
                SiteUrl: this.defaultSiteUrl,
                LayoutId: this.chuDe
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