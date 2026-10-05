import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService, ShowDialogService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import { Parameter } from "src/app/services/staticparameters.service";
import { CategoryMenuModal } from "./category-menu.modal";
import { NewsTypeMenuModal } from "./news-type-menu.modal";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";

@Component({
    selector: "client-menu-modal",
    templateUrl: 'client-menu.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./client-menu.modal.scss']
})


export class ClientMenuModal {
    item: any;
    isSaving: boolean = false;
    parent: any = "";
    menus: any[] = [];
    menuTypes: any[] = [];
    actions: any[] = [];
    newses: any[] = [];
    news: any = null;
    newsDetails: any[] = [];
    newsDetail: any = null;
    types: any[] = [];
    type: any = null;
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
        ,
        {
            Id: 5, Name: "Phòng truyền thống"
        }
    ];
    menuDocTypes: any[] = [];

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
            Id: 3, Name: "Danh sách hình ảnh dạng dọc"
        }, 
        
    ];

    imageUrl: any;
    imageUrl_Name: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public showDialogService: ShowDialogService,
        public dialogService: DialogService,
    ) {
        let clonedObject = { ...this.config.data };
        this.item = clonedObject;
        this.loadAction();

        if (this.config.data.IsEdit && this.item.MenuType == 5) // edit
        {
            this.imageUrl = this.item.Description;
        }
    }
    ngAfterViewInit(): void {

    }

    ngOnInit() {
        this.changeViTriMenu();
    }

    changeViTriMenu() {
        if (this.item.MenuPosition == 1 || this.item.MenuPosition == 5) {
            if (this.item.Parameter) {
                if (this.item.Parameter.indexOf(".")) {
                    var data = this.item.Parameter.split('.');
                    this.news = data[0];
                    if (this.item.Action == 'danh-sach-tin-tuc' && data.length > 1) {
                        this.type = data[1];
                    } else if (this.item.Action == 'chi-tiet-tin-tuc' && data.length > 1) {
                        this.newsDetail = data[1];
                    }
                } else {
                    this.news = this.item.Parameter;
                }
            }
        } else if (this.item.MenuPosition == 2) {
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
                {
                    Id: 3, Name: "Danh sách hình ảnh dạng dọc"
                },
                {
                    Id: 6, Name: "Hình ảnh 1 tin chạy"
                },
                {
                    Id: 7, Name: "Văn bản chạy"
                },
                {
                    Id: 8, Name: "Video 1 tin chạy"
                },
            ];
            if (this.item.Parameter) {
                if (this.item.Parameter.indexOf(".")) {
                    var data = this.item.Parameter.split('.');
                    this.news = data[0];
                    if (data.length > 1) {
                        this.type = data[1];
                    }
                } else {
                    this.news = this.item.Parameter;
                }
            }
        } else if (this.item.MenuPosition == 3) { // trang chủ
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
                    Id: 22, Name: "Tin tức 2"
                },
                {
                    Id: 3, Name: "Slide Hình ảnh"
                },
                {
                    Id: 4, Name: "Tin hình ảnh"
                },
                {
                    Id: 5, Name: "Hình ảnh"
                },
                {
                    Id: 6, Name: "Văn bản chỉ đạo điều hành"
                }
            ];
            if ((this.item.MenuType == 3 || this.item.MenuType == 4)) {
                if (this.item.Parameter.indexOf(".")) {
                    var data = this.item.Parameter.split('.');
                    this.news = data[0];
                    if (data.length > 1) {
                        this.type = data[1];
                    }
                } else {
                    this.news = this.item.Parameter;
                }
            } else if (this.item.MenuType == 2) {
                if (this.item.Title) {
                    var t = this.item.Title.split(';');
                    this.item.Title1 = t[0];
                    if (t.length > 0) {
                        this.item.Title2 = t[1];
                    }
                }
                if (this.item.Parameter) {
                    var t = this.item.Parameter.split(';');
                    if (t[0].indexOf(".")) {
                        var data = t[0].split('.');
                        this.item.News1 = data[0];
                        this.item.Type1 = data[1];
                    } else {
                        this.item.News1 = t[0];
                    }
                    if (t.length > 0) {
                        if (t[1].indexOf(".")) {
                            var data = t[1].split('.');
                            this.item.News2 = data[0];
                            this.item.Type2 = data[1];
                        } else {
                            this.item.News2 = t[1];
                        }
                    }
                }
            }
        }
        this.loadmenus();
    }

    loadmenus() {
        this.http.post("ClientMenu/menus", {
            menuPosition: this.item.MenuPosition
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
        this.ref.close(true);
    }

    submit() {
        this.item.ParentId = this.parent;
        this.isSaving = true;
        console.log(this.item.ParentId)
        if (this.item.MenuPosition == null || this.item.MenuPosition == 0) {
            this.toastr.warning("Vui lòng chọn vị trí menu", "Cảnh báo", {
                timeOut: 3000,
            });
            this.isSaving = false;
            return;
        }

        if (this.item.OrderNo == null || this.item.OrderNo == "") {
            this.toastr.warning("Vui lòng nhập thứ tự", "Cảnh báo", {
                timeOut: 3000,
            });
            this.isSaving = false;
            return;
        }
        if (this.item.MenuPosition == 1 || this.item.MenuPosition == 5) {
            if (this.item.Title == null || this.item.Title == "") {
                this.toastr.warning("Vui lòng nhập tiêu đề", "Cảnh báo", {
                    timeOut: 3000,
                });
                this.isSaving = false;
                return;
            }
            // if (!this.item.Action) {
            //     this.toastr.warning("Vui lòng chọn hành động", "Cảnh báo", {
            //         timeOut: 3000,
            //     });
            //     return;
            // }

            

            if (this.item.Action == 'danh-sach-tin-tuc') {
                if (this.news == null || this.news == "") {
                    this.toastr.warning("Vui lòng chọn danh mục", "Cảnh báo", {
                        timeOut: 3000,
                    });
                    this.isSaving = false;
                    return;
                }
                this.item.Parameter = this.news;
                if (this.type)
                    this.item.Parameter += "." + this.type;

            } else if (this.item.Action == 'chi-tiet-tin-tuc') {
                this.item.Parameter = this.news;
                if (this.news == null || this.news == "") {
                    this.toastr.warning("Vui lòng chọn danh mục", "Cảnh báo", {
                        timeOut: 3000,
                    });
                    this.isSaving = false;
                    return;
                }
                if (this.newsDetail)
                    this.item.Parameter += "." + this.newsDetail;
                else {
                    this.toastr.warning("Vui lòng chọn bài viết", "Cảnh báo", {
                        timeOut: 3000,
                    });
                    this.isSaving = false;
                    return;
                }
            } else if (this.item.Action == 'co-quan-nhiem-ky') { //coQuanNhiemKyModel

                debugger
                this.item.Parameter = this.coQuanNhiemKyModel;
                if (this.coQuanNhiemKyModel == null || this.coQuanNhiemKyModel == "") {
                    this.toastr.warning("Vui lòng chọn cơ quan", "Cảnh báo", {
                        timeOut: 3000,
                    });
                    this.isSaving = false;
                    return;
                }
            } else {
                this.news = null;
                this.type = null;
                this.newsDetail = null;
                this.item.Parameter = null;
            }
        } else if (this.item.MenuPosition == 2) {
            if (this.item.Title == null || this.item.Title == "") {
                this.toastr.warning("Vui lòng nhập tiêu đề", "Cảnh báo", {
                    timeOut: 3000,
                });
                this.isSaving = false;
                return;
            }
            if (this.news == null || this.news == "") {
                this.toastr.warning("Vui lòng chọn danh mục", "Cảnh báo", {
                    timeOut: 3000,
                });
                this.isSaving = false;
                return;
            }
            this.item.Parameter = this.news;
            if (this.type)
                this.item.Parameter += "." + this.type;
        } else if (this.item.MenuPosition == 3) {
            if (!this.item.MenuType) {
                this.toastr.warning("Vui lòng chọn loại menu", "Cảnh báo", {
                    timeOut: 3000,
                });
                this.isSaving = false;
                return;
            }
            if (this.item.MenuType == 3 || this.item.MenuType == 4) {
                if (this.item.Title == null || this.item.Title == "") {
                    this.toastr.warning("Vui lòng nhập tiêu đề", "Cảnh báo", {
                        timeOut: 3000,
                    });
                    this.isSaving = false;
                    return;
                }
                if (this.news == null || this.news == "") {
                    this.toastr.warning("Vui lòng chọn danh mục", "Cảnh báo", {
                        timeOut: 3000,
                    });
                    this.isSaving = false;
                    return;
                }
                this.item.Parameter = this.news;
                if (this.type)
                    this.item.Parameter += "." + this.type;
            } else if (this.item.MenuType == 1) {
                if (!this.item.Title) {
                    this.toastr.warning("Vui lòng nhập tiêu đề", "Cảnh báo", {
                        timeOut: 3000,
                    });
                    this.isSaving = false;
                    return;
                }
            } else if (this.item.MenuType == 2) {
                if (!this.item.Title1 && !this.item.Title2) {
                    this.toastr.warning("Vui lòng nhập tiêu đề", "Cảnh báo", {
                        timeOut: 3000,
                    });
                    this.isSaving = false;
                    return;
                }
                if (!this.item.News1 && !this.item.News2) {
                    this.toastr.warning("Vui lòng chọn danh mục", "Cảnh báo", {
                        timeOut: 3000,
                    });
                    this.isSaving = false;
                    return;
                }
                var titles: any[] = [];
                if (this.item.Title1)
                    titles.push(this.item.Title1);
                if (this.item.Title2)
                    titles.push(this.item.Title2);
                this.item.Title = titles.join(";");
                var parameters: any[] = [];
                if (this.item.Title1)
                    titles.push(this.item.Title1);
                for (let index = 1; index <= 2; index++) {
                    const element = this.item['News' + index];
                    if (element) {
                        var param = element;
                        if (this.item['Type' + index])
                            param += "." + this.item['Type' + index];
                        parameters.push(param);
                    }

                }
                this.item.Parameter = parameters.join(";");
            } else if (this.item.MenuType == 5) {
                this.item.Description = this.imageUrl;
            }
        }

        console.log(this.item);
        this.http.post("clientmenu/Save", this.item, (result: ResultModel) => {
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
            this.isSaving = false;
        }, () => {
            //this.message.add({key: "menuToast", severity: 'error', summary: 'Cảnh báo', detail: "Vui lòng kiểm tra Internet!" });
            this.toastr.error("Vui lòng kiểm tra Internet!", "Cảnh báo", {
                timeOut: 3000,
            });
            this.isSaving = false;
        });
    }
    loadAction() {
        this.http.post("General/GeneralCategories", {
            Code: "Action"
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.actions = result.Result;
                this.actions.unshift({ Id: null, Name: "Chọn hành động" });
                this.changeAction();
            }
        }, () => {
        });
    }
    loadNewses() {
        this.http.post("ClientMenu/News", {
            Code: "Action"
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.newses = result.Result;
                console.log(this.newses )
                this.newses.unshift({ Id: null, Name: "Chọn danh mục" });
                if (this.item.Parameter && this.item.Parameter.indexOf('.')) {
                    var item = this.newses.filter(s => s.Parameter == this.item.Parameter)[0];
                    if (item) {
                        this.news = this.item.Parameter;
                        this.type = this.item.Parameter.split(".")[1];
                    }
                }

            }
        }, () => {
        });
    }
    changeAction() {
        console.log(this.item.Action);
        if ((this.item.MenuPosition == 1 && (this.item.Action == 'danh-sach-tin-tuc' || this.item.Action == 'chi-tiet-tin-tuc'))
            || (this.item.MenuPosition == 5 && (this.item.Action == 'danh-sach-tin-tuc' || this.item.Action == 'chi-tiet-tin-tuc'))
            || this.item.MenuPosition == 2 || this.item.MenuPosition == 22
            || (this.item.MenuPosition == 3 && (this.item.MenuType == 2 || this.item.MenuType == 22 || this.item.MenuType == 3 || this.item.MenuType == 4))) {
            this.loadNewses();
            if (this.item.MenuPosition == 3 && this.item.MenuType == 2 && this.item.MenuType == 22) {
                this.changeNewsTrangChu(1, false);
                this.changeNewsTrangChu(2, false);
            } else {
                this.changeNews();
            }
        } else if (this.item.MenuPosition == 5 && this.item.Action == 'co-quan-nhiem-ky') { // cơ quan nhiệm kỳ
            this.loadCoQuanNhiemKy()
        }
    }

    coQuanNhiemKy: any = null;
    coQuanNhiemKys: any[] = [];
    coQuanNhiemKyModel: any = null;
    loadCoQuanNhiemKy() {
        this.http.post("GeneralCategory/Items", {
                "Code":"CoQuanNhiemKyPTT"
            }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.coQuanNhiemKys = result.Result;
                this.coQuanNhiemKys.unshift({ Id: null, Name: "Chọn cơ quan" });
            }
        }, () => {
        });
    }

    changeNewsTrangChu(no: number, isChange: boolean = true) {
        var news = no == 1 ? this.item.News1 : this.item.News2;
        if (isChange) {
            var newsInfo = this.newses.filter(s => s.Parameter == news)[0];
            if (newsInfo)
                this.item['Title' + no] = newsInfo.Title;
        }
        this.loadLoaiTinTuc(news, no);
    }

    loadLoaiTinTuc(news: any, no: any) {
        this.http.post("ClientMenu/ListLoaiTinTuc", {
            Value: news
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                if (no == 1) {
                    this.item.Types1 = result.Result;
                    if (this.item.Types1)
                        this.item.Types1.unshift({ Id: null, Name: "Chọn loại" });
                } else if (no == 2) {
                    this.item.Types2 = result.Result;
                    if (this.item.Types2)
                        this.item.Types2.unshift({ Id: null, Name: "Chọn loại" });
                } else if (no == 0) {
                    this.types = result.Result;
                    if (this.types)
                        this.types.unshift({ Id: null, Name: "Chọn loại" });
                }

            }
        }, () => {
        });
    }
    changeNews() {
        console.log(this.news)
        if (this.item.Action == 'chi-tiet-tin-tuc') {
            this.http.post("ClientMenu/GetNews", {
                Parameter: this.news
            }, (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.newsDetails = result.Result;
                    this.newsDetails.unshift({ Id: null, Name: "Chọn tin" });
                }
            }, () => {
            });
        } else if ((this.item.MenuPosition == 1 && this.item.Action == 'danh-sach-tin-tuc')
            || (this.item.MenuPosition == 5 && this.item.Action == 'danh-sach-tin-tuc')
            || this.item.MenuPosition == 2
            || (this.item.MenuPosition == 3 && (this.item.MenuType == 3 || this.item.MenuType == 4))) {
            this.loadLoaiTinTuc(this.news, 0);
        }
    }

    addDanhMuc() {
        this.showDialogService.showDialog(CategoryMenuModal, 'Thêm mới danh mục bài viết',
            {
                Id: "",
            }, (data: any) => {
                if (data) {
                    this.loadNewses();
                }
            }, "600px");
    }

    addNewsType(type: string, no: number) {
        this.showDialogService.showDialog(NewsTypeMenuModal, 'Thêm mới danh mục bài viết',
            {
                Id: "",
                Action: type
            }, (data: any) => {
                if (data) {
                    this.loadLoaiTinTuc(type, no);
                }
            }, "600px");
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