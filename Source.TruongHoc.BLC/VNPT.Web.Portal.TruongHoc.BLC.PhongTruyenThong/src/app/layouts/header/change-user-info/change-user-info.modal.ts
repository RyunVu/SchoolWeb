import { Component, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
declare var $: any;

@Component({
    selector: "change-user-info",
    templateUrl: './change-user-info.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./change-user-info.modal.scss']
})

export class ChangeUserInfoModal {

    item: any = {};
    constructor(
        public ref: DynamicDialogRef,
        public toastr: ToastrService,
        public httpService: HttpService
    ) {
    }

    save(): void {
        if (!this.item.OldPassword || this.item.OldPassword.length < 6) {
            this.toastr.warning('Mật khẩu cũ không được để trống và lớn hơn 6 kí tự', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (!this.item.NewPassword || this.item.NewPassword.length < 6) {
            this.toastr.warning('Mật khẩu mới không được để trống và lớn hơn 6 kí tự', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (!this.item.NewPassword2 || this.item.NewPassword2.length < 6) {
            this.toastr.warning('Nhập lại mật khẩu mới không được để trống và lớn hơn 6 kí tự', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        
        if (this.item.NewPassword == this.item.OldPassword) {
            this.toastr.warning('Mật khẩu mới không được giống mật khẩu cũ', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        if (this.item.NewPassword2 != this.item.NewPassword) {
            this.toastr.warning('Nhập lại mật khẩu mới không giống mật khẩu mới', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        this.httpService.post("user/ChangePassword", this.item, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.toastr.success('Đổi mật khẩu thành công', 'Thông báo', {
                    timeOut: 3000,
                });
                this.ref.close();
                return;
            } else {
                this.toastr.error(result.Message, 'Thông báo', {
                    timeOut: 3000,
                });
            }
        }, () => {
            this.toastr.error('Lỗi mạng', 'Thông báo', {
                timeOut: 3000,
            });
        });
    }
    cancel() {
        this.ref.close();
    }

}