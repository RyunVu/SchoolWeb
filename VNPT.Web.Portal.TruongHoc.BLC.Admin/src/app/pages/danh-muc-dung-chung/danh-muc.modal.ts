import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { MessageService } from "primeng/api";
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";

@Component({
    standalone: false,
    selector: "danh-muc-modal",
    templateUrl: "danh-muc.modal.html",
    styleUrls: ["./danh-muc.modal.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DanhMucModal {
    item: any;
    imageUrl: any;
    imageDisplay: any;
    units: any[] = [];
    unit: any;
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService
    ) {
        this.item = {
            Id: null,
            Value2: "",
            Value: "",
            Name: "",
            ImageUrl: "",
            Description: "",
            Code: "",
        };

        if (this.config.data.item != null) {
            this.item = this.config.data.item;
        }
        if (this.config.data.Code != null) {
            this.item.Code = this.config.data.Code;
        }
        this.imageUrl = this.item.ImageUrl;
    }

    ngOnInit() {
        this.loadUnits();
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

    cancel() {
        this.ref.close();
    }
    onKeyUp(event: any) {
        if (event.keyCode == 13) {
        }
    }
    submit() {
        if (this.item.Name == null || this.item.Name == "") {
            this.toastr.error("Thiếu trường Tên", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }
        this.http.post(
            "GeneralCategory/save",
            {
                Id: this.item.Id,
                Value: this.item.Value,
                Name: this.item.Name,
                Name_En: this.item.Name_En,
                Value2: this.item.Value2,
                Code: this.item.Code,
                ImageUrl: this.imageUrl,
                Description: this.item.Description,
                UnitCode: this.unit
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.ref.close({ confirm: "yes" });
                }
                else
                    if (result.Code == ResultCode.Duplication) {
                        this.toastr.error("Dữ liệu đã tồn tại", "Cảnh báo", {
                            timeOut: 3000,
                        });
                        return;
                    }
            },
            () => { }
        );
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
            })!
            .onClose.subscribe((data: any) => {
                if (data) {
                    var fileUrls = data.urls;
                    fileUrls.forEach((element: any) => {
                        this.imageUrl = element.Url;
                    });
                }
            });
    }
}
