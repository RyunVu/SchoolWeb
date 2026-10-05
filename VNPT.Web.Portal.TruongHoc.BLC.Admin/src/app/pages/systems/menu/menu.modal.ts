import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";

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
    units: any[] = [];
    unit: any;
    menuPositions: any[] = [
        {
            Id: null, Name: "Chọn vị trí"
        },
        {
            Id: 1, Name: "Menu Ngang"
        },
        {
            Id: 2, Name: "Menu Dọc"
        },
        {
            Id: 3, Name: "Trang chủ"
        }
    ];
    menuDocTypes: any[] = [];
    changeLoaiMenu() {
        if (this.item.MenuPosition == 2) {
            this.menuDocTypes = [
                {
                    Id: null, Name: "Chọn loại"
                },
                {
                    Id: 1, Name: "Menu Tin tức"
                },
                {
                    Id: 2, Name: "Tin tức chạy"
                },
                // {
                //     Id: 3, Name: "Slide Hình ảnh dạng ngang"
                // },
                {
                    Id: 4, Name: "Danh sách hình ảnh dạng dọc"
                }
            ];
        } else if (this.item.MenuPosition == 3) {
            this.menuDocTypes = [
                {
                    Id: null, Name: "Chọn loại"
                },
                {
                    Id: 1, Name: "Tin tức mới nhất"
                },
                {
                    Id: 2, Name: "Tin tức"
                },
                {
                    Id: 3, Name: "Slide Hình ảnh"
                },
                {
                    Id: 4, Name: "Tin hình ảnh"
                }
            ];
        }
    }
    menuHomeTypes: any[] = [
        {
            Id: null, Name: "Chọn loại"
        },
        {
            Id: 1, Name: "Menu Tin tức"
        },
        {
            Id: 2, Name: "Tin tức chạy"
        },
        // {
        //     Id: 3, Name: "Slide Hình ảnh dạng ngang"
        // },
        {
            Id: 4, Name: "Danh sách hình ảnh dạng dọc"
        }
    ];
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
    ) {
        this.item = this.config.data;
        console.log(this.item);
        if (!this.item.Icon) {
            this.item.Icon = "fas fa-bars";
        }
        if (!this.config.data.IsEdit) // add
        {
            this.item.IsShowMenu = true;
        }

    }
    ngAfterViewInit(): void {

    }

    ngOnInit() {
        this.loadTypes();
        this.changeLoaiMenu();
    }

    loadUnits() {
        this.http.post("user/Units", {

        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;
                this.units.unshift({ Id: null, Name: '--Chưa chọn đơn vị--' });
                if (this.config.data.IsEdit) // edit
                {
                    this.unit = this.item.UnitCode;
                }
                else {
                    this.unit = this.units[1].Code;
                }
                this.loadmenus();
            }
        }, () => {
        });
    }

    loadmenus() {
        this.http.post("menu/menus", {
            Code: this.unit,
            MenuCode: this.type
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

        if (this.type == "PORTAL" && !this.config.data.IsEdit) {
            this.item.RoleLevel = 5;
            //this.item.Description = 1;
        }
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
            this.loadUnits();
        }, () => {
        });
    }

    changeTitle(event: any) {
        if (!this.config.data.IsEdit) // add
        {
            var newParameter = this.convertToUnsignChar(event.target.value);

            this.item.Parameter = newParameter;

            if (this.type == 'Web') {
                this.item.Action = "quan-ly-tin-tuc/" + newParameter;
            }
        }
    }

    convertToUnsignChar(source: any) {
        source = source.toLowerCase();
        source = source.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        source = source.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        source = source.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        source = source.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        source = source.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        source = source.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        source = source.replace(/đ/g, "d");
        source = source.replace(/!|@@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, "-");
        source = source.replace(/-+-/g, "-");		//thay thế nhiều dấu - thành 1 dấu -
        source = source.replace(/^\-+|\-+$/g, "");	//cắt bỏ ký tự - ở đầu và cuối chuỗi
        return source;
    }

    cancel() {
        this.ref.close(true);
    }

    submit() {
        this.item.ParentId = this.parent;
        this.item.MenuCode = this.type;
        this.item.Code = this.type;
        this.item.UnitCode = this.unit;

        if (this.item.UnitCode == null || this.item.UnitCode == "") {
            this.toastr.warning("Vui lòng chọn khu vực", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.item.MenuCode == null || this.item.MenuCode == "") {
            this.toastr.warning("Vui lòng chọn loại menu", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.item.OrderNo == null || this.item.OrderNo == "") {
            this.toastr.warning("Vui lòng nhập thứ tự", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.item.RoleLevel == null || this.item.RoleLevel == "") {
            this.toastr.warning("Vui lòng nhập Role Level", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        this.http.post("menu/Save", this.item, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                if (!this.config.data.IsEdit) // add
                {
                    this.toastr.success("Thêm thành công", "Thông báo", {
                        timeOut: 3000,
                    });
                    var descriptionTemp = this.item.Description;
                    this.loadmenus();
                    this.item.Title = "";
                    this.item.Title_En = "";
                    this.item.Description = descriptionTemp;
                }
                else {
                    this.message.add({ key: "menuToast", severity: 'success', summary: 'Thông báo', detail: "Cập nhật thành công!" });
                    setTimeout(() => {
                        this.ref.close(true);
                    }, 1000)
                }
            } else {
                //this.message.add({key: "menuToast", severity: 'error', summary: 'Cảnh báo', detail: result.Message });
                this.toastr.error(result.Message, "Cảnh báo", {
                    timeOut: 3000,
                });
            }
        }, () => {
            //this.message.add({key: "menuToast", severity: 'error', summary: 'Cảnh báo', detail: "Vui lòng kiểm tra Internet!" });
            this.toastr.error("Vui lòng kiểm tra Internet!", "Cảnh báo", {
                timeOut: 3000,
            });
        });
    }

}