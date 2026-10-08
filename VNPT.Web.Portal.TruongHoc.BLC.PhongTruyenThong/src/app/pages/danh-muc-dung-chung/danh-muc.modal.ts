import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { MessageService } from "primeng/api";
import { ToastrService } from "ngx-toastr";
import { HttpService } from "src/app/services";
import moment from 'moment';
import { ResultCode, ResultModel } from "src/app/models";
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
    loading: boolean = false;
    parent: any = {};
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService
    ) {
        this.item = {

        };

        if (this.config.data.item != null) {
            this.item = this.config.data.item;
        }
        if (this.config.data.Code != null) {
            this.item.Code = this.config.data.Code;
        }
        this.parent = this.config.data.parent;
        for (let index = 0; index < this.parent.setting.length; index++) {
            const element = this.parent.setting[index];
            switch (element.Type) {
                case "Text":
                    break;
                case "MultiLine":
                    break;
                case "Int":
                    break;
                case "CkEditor":
                    break;
                case "File":
                    try {
                        this.item[element.Name] = JSON.parse(this.item[element.Name]);
                    } catch (error) {
                        this.item[element.Name] = null;
                    }
                    break;
                case "Decimal":
                    break;
                case "Boolean":
                    this.item[element.Name] = this.item[element.Name] === 'true' || this.item[element.Name] === true;
                    break;
                case "[0,1]":
                    this.item[element.Name] = this.item[element.Name] == 1;
                    break;
                case "Time":
                    this.item[element.Name] = this.item[element.Name] ? moment('01/01/2023 ' + this.item[element.Name], "DD/MM/YYYY HH:mm").toDate() : null;
                    break;
                case "Date":
                    this.item[element.Name] = this.item[element.Name] ? moment(this.item[element.Name], "DD/MM/YYYY").toDate() : null;
                    break;
                case "Combobox":
                    if (element.Setting.Api) {
                        element.Setting.Input = element.Setting.Input.replace(/'/g, '"');
                        this.http.post(
                            element.Setting.Api,
                            JSON.parse(element.Setting.Input),
                            (result: ResultModel) => {
                                if (result.Code == ResultCode.Success) {
                                    if (!element.Required) {
                                        result.Result.unshift({ Id: null, Name: "Chọn " + element.Label });
                                    } else if (!this.item[element.Name]) {
                                        this.item[element.Name] = result.Result[0][element.Setting.Id];
                                    }
                                    element["data"] = result.Result;
                                    element["id"] = element.Setting.Id;
                                    element["label"] = element.Setting.Label;
                                } else {
                                    this.toastr.error(result.Message, 'Cảnh báo', {
                                        timeOut: 3000,
                                    });
                                    element["data"] = [];
                                }
                                this.loading = false;
                            },
                            () => {
                                element["data"] = [];
                                this.toastr.error('Vui lòng kiểm tra Internet!', 'Cảnh báo', {
                                    timeOut: 3000,
                                });
                                this.loading = false;
                            }
                        );
                    } else {
                        element["data"] = [];
                    }
                    //this.item[element.Name] = this.item[element.Name] ? moment(this.item[element.Name], "DD/MM/YYYY").toDate() : null;
                    break;
            }
        }

    }

    ngOnInit() {
    }

    changeContent(event: any, item: any, colName: any) {
        item[colName] = event
    }
    cancel() {
        this.ref.close();
    }
    onKeyUp(event: any) {
        if (event.keyCode == 13) {
        }
    }
    openFileDilog(name: string) {
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
                        this.item[name] = element;
                    });
                }
            });
    }
    submit() {
        if (this.item.Name == null || this.item.Name == "") {
            this.toastr.error("Thiếu trường Tên", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }
        for (let index = 0; index < this.parent.setting.length; index++) {
            const element = this.parent.setting[index];
            if (element.Required) {
                if (!this.item[element.Name]) {
                    this.toastr.error("Thiếu trường " + element.Label, "Cảnh báo", {
                        timeOut: 3000,
                    });
                    return;
                }
            }
            switch (element.Type) {
                case "Text":
                    break;
                case "MultiLine":
                    break;
                case "Int":
                    break;
                case "Decimal":
                    break;
                case "CkEditor":
                    break;
                case "File":
                    this.item[element.Name] = JSON.stringify(this.item[element.Name]);
                    break;
                case "Boolean":
                    break;
                case "[0,1]":
                    this.item[element.Name] = this.item[element.Name] ? 1 : 0;
                    break;
                case "Time":
                    this.item[element.Name] = this.item[element.Name] ? moment(this.item[element.Name]).format('HH:mm') : null;
                    break;
                case "Date":
                    this.item[element.Name] = this.item[element.Name] ? moment(this.item[element.Name]).format('DD/MM/YYYY') : null;
                    break;
            }
        }
        this.loading = true;
        this.http.post(
            "GeneralCategory/save",
            this.item,
            (result: ResultModel) => {
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
            },
            () => {
                this.toastr.error('Vui lòng kiểm tra Internet!', 'Cảnh báo', {
                    timeOut: 3000,
                });
                this.loading = false;
            }
        );
    }
    clone() {
        if (this.item.Name == null || this.item.Name == "") {
            this.toastr.error("Thiếu trường Tên", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }
        for (let index = 0; index < this.parent.setting.length; index++) {
            const element = this.parent.setting[index];
            if (element.Required) {
                if (!this.item[element.Name]) {
                    this.toastr.error("Thiếu trường " + element.Label, "Cảnh báo", {
                        timeOut: 3000,
                    });
                    return;
                }
            }
            switch (element.Type) {
                case "Text":
                    break;
                case "MultiLine":
                    break;
                case "Int":
                    break;
                case "Decimal":
                    break;
                case "CkEditor":
                    break;
                case "Boolean":
                    break;
                case "File":
                    this.item[element.Name] = JSON.stringify(this.item[element.Name]);
                    break;
                case "[0,1]":
                    this.item[element.Name] = this.item[element.Name] ? 1 : 0;
                    break;
                case "Time":
                    this.item[element.Name] = this.item[element.Name] ? moment(this.item[element.Name]).format('HH:mm') : null;
                    break;
                case "Date":
                    this.item[element.Name] = this.item[element.Name] ? moment(this.item[element.Name]).format('DD/MM/YYYY') : null;
                    break;
            }
        }
        this.loading = true;
        var newItems = Object.assign({}, this.item);
        newItems.Id = null;
        this.http.post(
            "GeneralCategory/save",
            newItems,
            (result: ResultModel) => {
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
            },
            () => {
                this.toastr.error('Vui lòng kiểm tra Internet!', 'Cảnh báo', {
                    timeOut: 3000,
                });
                this.loading = false;
            }
        );
    }

}
