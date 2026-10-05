import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";

@Component({
    selector: "menu-modal",
    templateUrl: 'menu.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./menu.modal.scss']
})


export class MenuModal {
    item: any;

    parent: any = "";
    menus: any[] = [];
    type: any = "";
    menuTypes: any[] = [];
    generalInfos: any[] = [];
    typeProperties: any[] = [
        { Id: "Text", setting: '{"col":6, "minLength": null, "maxLength": null}' },
        { Id: "MultiLine", setting: '{"col":12, "rows": 3}' },
        { Id: "Int", setting: '{"col":6, "min": null, "max": null}' },
        { Id: "Decimal", setting: '{"col":6, "digits":2, "min": null, "max": null}' },
        { Id: "Boolean", setting: '{"col":6, "true": null, "false": null}' },
        { Id: "[0,1]", setting: '{"col":6, "V1": null, "V0": null}' },
        { Id: "Time", setting: '{"col":6}' },
        { Id: "Date", setting: '{"col":6}' },
        { Id: "Combobox", setting: '{"col":6,"Api":"","Input":""}' },
        { Id: "CkEditor", setting: '{"col":12}' },
        { Id: "File", setting: '{"col":12}' },
        // { Id: "File" },
    ];
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService
    ) {
        this.item = this.config.data;
        if (!this.item.Icon) {
            this.item.Icon = "fas fa-bars";
        }
        if (!this.item.RoleLevel) {
            this.item.RoleLevel = 2;
        } this.loadGeneralInfo();
    }
    ngAfterViewInit(): void {

    }
    ontypeChange(item: any, defaultValue: boolean = false) {
        var setting = this.typeProperties.filter(s => s.Id == item.Type)[0];
        if (setting) {
            if (defaultValue && item.Setting) {

            } else {
                item.Setting = setting.setting + "";
            }
        }
    }
    changeAction() {
        this.loadGeneralInfo();
    }
    ngOnInit() {
        this.loadTypes();
        this.loadmenus();
    }
    loadGeneralInfo() {
        if (this.item.Action && this.item.Action.toLowerCase().startsWith("danh-muc/")) {
            try {
                if (this.item.Description) {
                    this.generalInfos = JSON.parse(this.item.Description);
                } else {
                    this.generalInfos = [];
                }
            } catch (error) {
                this.generalInfos = []
            }
            var temp: any[] = []
            this.http.post("menu/GetGeneralInfo", {
            }, (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    for (var i = 0; i < result.Result.length; i++) {
                        var old = this.generalInfos.filter(s => s.Name == result.Result[i])[0];
                        if (old) {
                            if (!old.Setting) {
                                old.Setting = null;
                            }
                            temp.push(old);
                        } else {
                            temp.push({
                                Name: result.Result[i],
                                Label: result.Result[i],
                                Order: i + 1,
                                Type: "Text",
                                Enabled: false,
                                Required: false,
                                Setting: null
                            })
                        }
                        this.ontypeChange(temp[temp.length - 1], true);
                    }
                    temp.sort((a, b) => {
                        if (a.Enabled < b.Enabled) {
                            return 1;
                        }
                        if (a.Enabled > b.Enabled) {
                            return -1;
                        }

                        // If Status is the same, compare by OrderNo
                        if (a.Order < b.Order) {
                            return -1;
                        }
                        if (a.Order > b.Order) {
                            return 1;
                        }

                        // If both Status and OrderNo are equal, no change in order
                        return 0;
                    });

                    for (let index = 0; index < temp.length; index++) {
                        const element = temp[index];
                        if (element.Name == element.Label)
                            switch (element.Name) {
                                case "OrderNo":
                                    element.Label = "Thứ tự";
                                    break;
                                case "Description":
                                    element.Label = "Mô tả";
                                    break;
                                case "ImageUrl":
                                    element.Label = "Hình ảnh";
                                    break;
                                case "Status":
                                    element.Label = "Trạng thái";
                                    break;
                                case "Tag":
                                    element.Label = "Thẻ";
                                    break;
                            }
                    }

                    this.generalInfos = temp;
                }
            }, () => {
            });
        } else {
            this.generalInfos = [];
        }
    }
    loadmenus() {
        this.http.post("menu/menus", {
            Code: this.type
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.menus = result.Result;
                this.menus.unshift({ Name: "", Id: "" })
                if (this.item.ParentId == "" || this.item.ParentId == null) {

                } else {
                    this.parent = this.item.ParentId;
                }
            }
        }, () => {
        });
    }
    loadTypes() {
        this.http.post("GeneralCategory/Items", {
            Code: "MenuType"
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.menuTypes = result.Result;
                if (this.item.MenuCode == "" || this.item.MenuCode == null) {
                    this.type = this.menuTypes[0]?.Value;
                } else {
                    this.type = this.item.MenuCode;
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
        this.item.MenuCode = this.type;
        this.item.Code = this.type;

        if (this.item.MenuCode == null || this.item.MenuCode == "") {
            this.message.add({ key: "menuToast", severity: 'error', summary: 'Cảnh báo', detail: "Phải chọn loại menu!" });
            return;
        }

        // if (this.item.OrderNo == null || this.item.OrderNo == "") {
        //     this.message.add({ key: "menuToast", severity: 'error', summary: 'Cảnh báo', detail: "Phải nhập thứ tự" });
        //     return;
        // }

        if (this.item.RoleLevel == null || this.item.RoleLevel == "") {
            this.message.add({ key: "menuToast", severity: 'error', summary: 'Cảnh báo', detail: "Phải nhập Role Level" });
            return;
        }
        if (this.generalInfos) {
            this.generalInfos.sort((a, b) => {
                if (a.Enabled < b.Enabled) {
                    return 1;
                }
                if (a.Enabled > b.Enabled) {
                    return -1;
                }

                // If Status is the same, compare by OrderNo
                if (a.Order < b.Order) {
                    return -1;
                }
                if (a.Order > b.Order) {
                    return 1;
                }

                // If both Status and OrderNo are equal, no change in order
                return 0;
            });
            this.item.Description = JSON.stringify(this.generalInfos);
        }

        this.http.post("menu/Save", this.item, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.message.add({ key: "menuToast", severity: 'success', summary: 'Thông báo', detail: "Cập nhật thành công!" });
                setTimeout(() => {
                    this.ref.close(true);
                }, 1000)
            } else {
                this.message.add({ key: "menuToast", severity: 'error', summary: 'Cảnh báo', detail: result.Message });
            }
        }, () => {
            this.message.add({ key: "menuToast", severity: 'error', summary: 'Cảnh báo', detail: "Vui lòng kiểm tra Internet!" });
        });
    }

}
