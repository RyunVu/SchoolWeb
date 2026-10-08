import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { ConfirmationService, MessageService } from "primeng/api";
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";

import moment from 'moment';
import { CaptionImageModel } from "./caption-image.modal";

@Component({
    standalone: false,
    selector: "danh-sach-tin-tuc-modal",
    templateUrl: "danh-sach-tin-tuc.modal.html",
    styleUrls: ["./danh-sach-tin-tuc.modal.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DanhSachTinTucModal {

    item: any;

    loaiTinTucs: any[] = [];
    loaiTinTuc: any;

    defaultCode: any;
    defaultNgay?: Date;
    defaultTitle: any = "";
    defaultAlias: any = "";
    defaultContent: any = "";
    shortContent: any = "";
    imageUrl: any;
    imageDisplay: any;
    readonlyText: boolean = false;
    images: any[] = [];
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService
    ) {
        if (this.config.data.item != null) {
            this.item = this.config.data.item;
        }
        if (this.config.data.Code != null) {
            this.defaultCode = this.config.data.Code;
        }

        //this.imageUrl = this.item.ImageUrl;

        //this.defaultNgay = moment(this.item.TuNgayString, "DD/MM/YYYY HH:mm:ss").toDate();

        if (!this.config.data.IsAdd) // edit
        {
            this.defaultTitle = this.item.Title;
            this.defaultAlias = this.item.Alias;
            this.defaultContent = this.item.Content;
            this.imageUrl = this.item.ImageUrl;
            this.shortContent = this.item.ShortContent;
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

        try {
            this.images = JSON.parse(this.item.Description);
        } catch {
            this.images = [];
        }
    }

    ngOnInit() {

    }
    editCaption(img: any) {
        const ref = this.dialogService
            .open(CaptionImageModel, {
                data: {
                    item: img,
                },
                header: "Tiêu đề ảnh",
                width: "50%",
            })!
            .onClose.subscribe((data: any) => {
                if (data) {
                    img.Caption = data;
                }
            });
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
                        this.loaiTinTuc = this.loaiTinTucs.length > 0 ? result.Result[0].Id : null
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
    deleteImage(img: any) {
        this.confirmationService.confirm({
            message: "Bạn có chắc chắn muốn xoá hình ảnh này không?",
            accept: () => {
                this.images = this.images.filter(s => s != img);
            },
        });
    }
    changeContent(event: any) {
        this.defaultContent = event
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

        if (this.defaultAlias == null || this.defaultAlias == "") {
            this.toastr.warning("Vui lòng nhập alias", "Cảnh báo", {
                timeOut: 3000,
            });
            return;
        }

        // if (this.defaultContent == null || this.defaultContent == "") {
        //     this.toastr.warning("Vui lòng nhập nội dung", "Cảnh báo", {
        //         timeOut: 3000,
        //     });
        //     return;
        // }

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
                ImageUrl: this.imageUrl,
                //Images: JSON.stringify(this.images),
                Description: JSON.stringify(this.images),//thay thế cho Images k có tro db, hình ảnh liên quan
                ShortContent: this.shortContent,
                //ShortContent: input.ShortContent,
                //Order: input.Order,
                StrCreateDate: this.defaultNgay != undefined && this.defaultNgay != null ? moment(this.defaultNgay).format('DD/MM/YYYY HH:mm:ss') : null,
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.ref.close({ confirm: "yes" });
                }
                if (result.Code == 414) {
                    this.toastr.error("Alias đã tồn tại!", "Cảnh báo", {
                        timeOut: 3000,
                    });
                    return;
                }
            },
            () => { }
        );
    }
    addImage() {
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
                        this.images.push(element);
                    });
                }
            });
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
