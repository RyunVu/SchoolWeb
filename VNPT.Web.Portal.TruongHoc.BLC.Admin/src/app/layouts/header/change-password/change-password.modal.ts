import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { AuthService, BaseService, HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { s } from "src/app/services/s.service";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";

@Component({
    selector: "change-password-modal",
    templateUrl: 'change-password.modal.html',
    styleUrls: ['./change-password.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})


export class ChangePasswordModal {

    defaultPassword: any;
    defaultPasswordConfirm: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService,
        private authService: AuthService,
    ) {
        
    }

    ngOnInit() {

    }

    cancel() {
        this.ref.close();
    }
    
    submit() {
        if(this.defaultPassword == null || this.defaultPasswordConfirm == null || this.defaultPassword == "" || this.defaultPasswordConfirm == "") {
            this.toastr.warning("Vui lòng nhập đầy đủ thông tin", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.defaultPassword != this.defaultPasswordConfirm) {
            this.toastr.warning("Mật khẩu xác nhận không đúng", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if(this.defaultPassword.length <= 6 || this.defaultPasswordConfirm.length <= 6) {
            this.toastr.warning("Vui lòng nhập trên 6 ký tự", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        this.http.post(
            "User/ChangePassword",
            {
                Password: this.defaultPassword
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.ref.close();
                    this.toastr.success("Thay đổi mật khẩu thành công!", "Thông báo", {
                        timeOut: 3000,
                    });
                    this.logOff();
                }
            },
            () => { }
        );
    }

    logOff() {
        BaseService.removeLogin();
        this.authService.logoutUser();
    }
}