import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import { Parameter } from "src/app/services/staticparameters.service";

@Component({
    standalone: false,
    selector: "category-menu-modal",
    templateUrl: 'category-menu.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./category-menu.modal.scss']
})


export class CategoryMenuModal {
    item: any;
    isSaving: boolean = false;
    parent: any = "";
    menus: any[] = [];
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
    ) {
        let clonedObject = { ...this.config.data };
        this.item = clonedObject;
        this.loadmenus();
    }
    ngAfterViewInit(): void {

    }

    ngOnInit() {
    }

    loadmenus() {
        this.http.post("ClientMenu/News", {
            Code: "Action"
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


    changeTitle(event: any) {
        var newParameter = this.convertToUnsignChar(event.target.value);
        this.item.Parameter = newParameter;
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
        this.ref.close();
    }

    submit() {
        if (!this.item.Title) {
            this.toastr.warning("Vui lòng nhập tiêu đề", "Cảnh báo", {
                timeOut: 3000,
            });
            this.isSaving = false;
            return;
        }
        this.item.ParentId = this.parent;
        this.isSaving = true;
        this.http.post("clientmenu/SaveDanhMuc", this.item, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.toastr.success("Thêm thành công", "Thông báo", {
                    timeOut: 3000,
                });
                this.ref.close(true);
            } else {
                //this.message.add({key: "menuToast", severity: 'error', summary: 'Cảnh báo', detail: result.Message });
                this.toastr.error(result.Message, "Cảnh báo", {
                    timeOut: 3000,
                });
            }
            this.isSaving = false;
        }, () => {
            //this.message.add({key: "menuToast", severity: 'error', summary: 'Cảnh báo', detail: "Vui lòng kiểm tra Internet!" });
            this.toastr.error("Vui lòng kiểm tra Internet!", "Cảnh báo", {
                timeOut: 3000,
            });
            this.isSaving = false;
        });
    }

}