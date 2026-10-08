import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { MessageService } from "primeng/api";
import { BaseService, HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";

import moment from 'moment';
import { MenuSidebarService } from "src/app/layouts/menu-sidebar/menu-sidebar.service";

@Component({
    standalone: false,
    selector: "duyet-tin-tuc-modal",
    templateUrl: "duyet-tin-tuc.modal.html",
    styleUrls: ["./duyet-tin-tuc.modal.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DuyetTinTucModal {

    item: any;
    parent: any;
    loaiTinTucs: any[] = [];
    loaiTinTuc: any;

    defaultCode: any;
    defaultNgay?: Date;
    defaultTitle: any = "";
    defaultAlias: any = "";
    defaultContent: any = "";
    defaultTitle_En: any = "";
    defaultContent_En: any = "";
    defaultUrl: any = "";
    defaultIsOpenBlankPage: boolean = false;
    imageUrl: any;
    imageDisplay: any;
    readonlyText: boolean = false;
    paramEnableLanguage: boolean = false;

    isSuperAdminSystem: boolean = false;
    isUserDuyetTin: boolean = false;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService,
        public menuSidebarService: MenuSidebarService,
        private baseService: BaseService
    ) {

        var mulRole = this.baseService.MulRole;
        if (mulRole != "" && mulRole != null && (mulRole.includes("SuperAdminSystem"))) {
            this.isSuperAdminSystem = true;
        }

        if (mulRole != "" && mulRole != null && (mulRole.includes("DuyetTin"))) {
            this.isUserDuyetTin = true;
        }

        if (this.config.data.item != null) {
            this.item = this.config.data.item;
        }
        if (this.config.data.Code != null) {
            this.defaultCode = this.config.data.Code;
        }
        this.parent = this.config.data.Parent;
        //this.imageUrl = this.item.ImageUrl;

        //this.defaultNgay = moment(this.item.TuNgayString, "DD/MM/YYYY HH:mm:ss").toDate();

        if (!this.config.data.IsAdd) // edit
        {
            this.defaultTitle = this.item.Title;
            this.defaultAlias = this.item.Alias;
            this.defaultContent = this.item.Content;
            this.defaultTitle_En = this.item.Title_En;
            this.defaultContent_En = this.item.Content_En;
            this.defaultUrl = this.item.OtherUrl;
            this.imageUrl = this.item.ImageUrl;
            this.defaultIsOpenBlankPage = this.item.IsOpenBlankPage;

            if (this.item.CreateDateString != "" && this.item.CreateDateString != null)
                this.defaultNgay = moment(this.item.CreateDateString, "DD/MM/YYYY HH:mm:ss").toDate();
        }
        else {
            var currentDate = new Date();

            this.defaultNgay = currentDate;
        }

        if (this.defaultCode == 'tin-tuc-khac') {
            this.loadGioiThieuHeThongChinhTri();
            this.readonlyText = true;
        }
        else {
            this.loadLoaiTinTuc();
            this.readonlyText = false;
        }

        this.GetEnableLanguage();
    }

    ngOnInit() {

    }

    GetEnableLanguage(): void {
        this.http.post(
            "SystemParameter/GetParameterByCode",
            {
                Code: "EnableLanguage",
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    var paramEnableLanguageTemp = result.Result;

                    if (paramEnableLanguageTemp.Value5) {
                        this.paramEnableLanguage = true;
                    }
                }
            },
            () => {
            }
        );
    }

    loadLoaiTinTuc(): void {
        this.http.post(
            "News/ListLoaiTinTuc",
            {
                Code: "NewsType",
                Value: this.defaultCode
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.loaiTinTucs = result.Result;
                    //this.loaiTinTucs.unshift({ Id: null, Name: '--Chưa chọn Loại tin tức--' });

                    if (!this.config.data.IsAdd) // edit
                    {

                        this.loaiTinTuc = this.item.NewTypeId;
                    }
                    else {
                        if (result.Message) {
                            var temp = this.loaiTinTucs.filter(s => s.TypeCode == result.Message)[0];
                            if (temp) {
                                this.loaiTinTuc = temp.Id;
                            }
                        }

                        if (!this.loaiTinTuc) {

                            this.loaiTinTuc = this.loaiTinTucs.length > 0 ? result.Result[0].Id : null
                        }
                    }
                }
            },
            () => {
            }
        );
    }

    loadGioiThieuHeThongChinhTri(): void {
        this.http.post(
            "News/ListGioiThieuHeThongChinhTri",
            null,
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.loaiTinTucs = result.Result;
                    this.loaiTinTucs.unshift({ Id: null, Name: '--Chưa chọn Loại tin tức--' });

                    if (!this.config.data.IsAdd) // edit
                    {
                        var loaiTinTucTemp = this.loaiTinTucs.filter(s => s.Parameter == this.item.Alias);
                        if (loaiTinTucTemp.length > 0) {
                            this.loaiTinTuc = loaiTinTucTemp[0].Id;
                        }
                    }
                    else {
                        this.loaiTinTuc = this.loaiTinTucs.length > 0 ? result.Result[0].Id : null
                    }
                }
            },
            () => {
            }
        );
    }

    changeLoaiTinTuc(value: any) {
        if (this.defaultCode == 'tin-tuc-khac') {
            if (value.value != null) {
                var loaiTinTucTemp = this.loaiTinTucs.filter(s => s.Id == value.value);

                if (loaiTinTucTemp.length > 0) {
                    this.defaultAlias = loaiTinTucTemp[0].Parameter;
                    this.defaultTitle = loaiTinTucTemp[0].Name;
                }
            }
            else {
                this.defaultAlias = "";
                this.defaultTitle = "";
            }
        }
    }

    cancel() {
        this.ref.close();
    }

    onKeyUp(event: any) {
        if (event.keyCode == 13) {
        }
    }

    changeAlias(event: any) {
        var newAlias = this.convertToUnsignChar(event.target.value);

        this.defaultAlias = newAlias;
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

    changeContent(event: any) {
        this.defaultContent = event
    }

    changeContent_En(event: any) {
        this.defaultContent_En = event
    }

    submit() {
        
        this.http.post(
            "News/DuyetTin",
            {
                Id: this.item.Id
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {

                    if(this.isSuperAdminSystem || this.isUserDuyetTin)
                    {
                        this.menuSidebarService.reloadMenu();
                    }

                    this.ref.close({ confirm: "yes" });
                    this.toastr.success((this.item.Status == 1 ? "Bỏ duyệt" : "Duyệt") + " tin tức", "Thành công", {
                        timeOut: 3000,
                    });
                } else {
                    this.toastr.error(result.Message, "Cảnh báo", {

                        timeOut: 3000,
                    });
                }
            },
            () => {
                this.toastr.error("Lỗi kết nối!", "Cảnh báo", {

                    timeOut: 3000,
                });
            }
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
