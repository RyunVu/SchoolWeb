import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { MessageService } from "primeng/api";
import { BaseService, HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";

import * as moment from 'moment';
import { MenuSidebarService } from "src/app/layouts/menu-sidebar/menu-sidebar.service";

@Component({
    selector: "danh-sach-tin-tuc-modal",
    templateUrl: "danh-sach-tin-tuc.modal.html",
    styleUrls: ["./danh-sach-tin-tuc.modal.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DanhSachTinTucModal {

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
    imageUrl: any;
    imageDisplay: any;
    readonlyText: boolean = false;

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
    }

    ngOnInit() {

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
                        
                        if(!this.loaiTinTuc){

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
        if (this.loaiTinTuc == null) {
            this.toastr.warning("Vui lòng chọn loại tin tức", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.defaultNgay == undefined || this.defaultNgay == null) {
            this.toastr.warning("Vui lòng nhập ngày đăng", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        if (this.defaultTitle == null || this.defaultTitle == "") {
            this.toastr.warning("Vui lòng nhập tiêu đề", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }
        if (this.parent.isNewsImage) {
            // if (this.defaultUrl == null || this.defaultUrl == "") {
            //     this.toastr.warning("Vui lòng nhập Url", "Cảnh báo", {
            //         timeOut: 3000,
            //     });
            //     return;
            // }
        } else {
            if (this.defaultAlias == null || this.defaultAlias == "") {
                this.toastr.warning("Vui lòng nhập Url", "Cảnh báo", {
                    timeOut: 3000,
                });
                return;
            }

            if (this.defaultContent == null || this.defaultContent == "") {
                this.toastr.warning("Vui lòng nhập nội dung", "Cảnh báo", {
                    timeOut: 3000,
                });
                return;
            }
        }



        var loaiTinTucTemp = this.loaiTinTucs.filter(s => s.Id == this.loaiTinTuc);

        if (loaiTinTucTemp.length == 0) {
            this.loaiTinTuc = this.loaiTinTucs[0].Id;
        }
        this.http.post(
            "News/Modify",
            {
                Id: !this.config.data.IsAdd ? this.item.Id : null,
                NewTypeId: this.loaiTinTuc,
                Code: this.defaultCode,
                Alias: this.defaultAlias,
                Title: this.defaultTitle,
                Content: this.defaultContent,
                Title_En: this.defaultTitle_En,
                Content_En: this.defaultContent_En,
                ImageUrl: this.imageUrl,
                OtherUrl: this.defaultUrl,
                isNewsImage: this.parent.isNewsImage,
                isOpenBlankPage: this.parent.isOpenBlankPage,
                isOpenImageOnly: this.parent.isOpenImageOnly,

                //ShortContent: input.ShortContent,
                //Order: input.Order,
                StrCreateDate: this.defaultNgay != undefined && this.defaultNgay != null ? moment(this.defaultNgay).format('DD/MM/YYYY HH:mm:ss') : null,
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {

                    if(this.isSuperAdminSystem || this.isUserDuyetTin)
                    {
                        this.menuSidebarService.reloadMenu();
                    }

                    this.ref.close({ confirm: "yes" });
                    this.toastr.success("Lưu tin tức", "Thành công", {
                        timeOut: 3000,
                    });
                }
                if (result.Code == 414) {
                    this.toastr.error("Alias đã tồn tại!", "Cảnh báo", {
                        timeOut: 3000,
                    });
                    return;
                }
                if (result.Code == 402) {
                    this.toastr.error("Tiêu đề hoặc bài viết chứa nội dung không hợp lệ. Vui lòng kiểm tra lại!", "Cảnh báo", {
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
            })
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
