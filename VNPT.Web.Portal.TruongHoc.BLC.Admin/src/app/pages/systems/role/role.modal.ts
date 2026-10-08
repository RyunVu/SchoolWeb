import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import moment from 'moment';

@Component({
    standalone: false,
    selector: "role-modal",
    templateUrl: 'role.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./role.modal.scss']
})


export class RoleModal {
    item: any;

    parent: any = "";
    roles: any[] = [];

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService
    ) {
        this.item = this.config.data;

    }
    ngAfterViewInit(): void {

    }

    ngOnInit() {

        this.loadRoles();
    }

    loadRoles() {
        this.http.post("Role/Roles", {
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.roles = result.Result;
                this.roles.unshift({ Name: "", Id: "" })
                if (this.item.ParentId == "" || this.item.ParentId == null) {

                } else {
                    this.parent = this.item.ParentId;
                }
            }
        }, () => {
        });
    }

    cancel() {
        this.ref.close();
    }

    submit() {
        this.item.ParentId = this.parent;
        this.http.post("role/Save", this.item, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.message.add({ severity: 'success', summary: 'Thông báo', detail: "Cập nhật thành công!" });
                setTimeout(() => {
                    this.ref.close(true);
                }, 1000)
            } else {
                this.message.add({ severity: 'error', summary: 'Cảnh báo', detail: result.Message });
            }
        }, () => {
            this.message.add({ severity: 'error', summary: 'Cảnh báo', detail: "Vui lòng kiểm tra Internet!" });
        });
    }

}