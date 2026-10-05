import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, LazyLoadEvent, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";

import { DanhMucModal } from "./danh-muc.modal";
import { BasePage, HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";

@Component({
    selector: "app-danh-muc",
    templateUrl: "./danh-muc.component.html",
    styleUrls: ["./danh-muc.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DanhMucComponent extends BasePage {
    @ViewChild("dt", { static: false }) dt: any;

    items: any[] = [];
    pageSize: number = 10;
    pageIndex: number = 1;
    totalRow: number = 0;
    sortField: string = "";
    sortOrder: boolean = false;
    loading: boolean = false;
    oldEvent: any;
    filters: any = {};
    keywordInput: any;
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService
    ) {
        super(router, route, http, message);
    }
    paginate(event: LazyLoadEvent) {
        if (this.oldEvent == null || event == this.oldEvent) {
            this.oldEvent = event;
            return;
        }
        this.oldEvent = event;
        this.pageSize = event.rows ?? 10;
        var first = event.first ?? 0;
        this.pageIndex = Math.floor(first / this.pageSize) + 1;

        this.sortOrder = event.sortOrder == 1 ? true : false;
        this.sortField = event.sortField ?? "";
        this.filters = event.filters;
        setTimeout(() => {
            this.loadData();
        }, 100);
    }
    onInit(): void {
        this.setting = this.setting.filter(s => s.Enabled);
        this.setting.sort((a, b) => a.Order - b.Order);
        if (this.setting) {
            for (var i = 0; i < this.setting.length; i++) {
                try {
                    this.setting[i].Setting = JSON.parse(this.setting[i].Setting);
                    if (!this.setting[i].Setting) {
                        this.setting[i].Setting = {
                            col: 6
                        }
                    }
                } catch (error) {
                    this.setting[i].Setting = {
                        col: 6
                    }
                }
            }
        }
    }

    add() {
        const ref = this.dialogService
            .open(DanhMucModal, {
                data: {
                    IsAdd: true,
                    Code: this.parameter,
                    parent: this
                },
                header: "Thêm mới danh mục " + this.titlePage,
                width: "50%",
            })
            .onClose.subscribe((data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }
    edit(item: any) {
        var newItem = Object.assign({}, item);
        const ref = this.dialogService
            .open(DanhMucModal, {
                data: {
                    IsAdd: false,
                    item: newItem,
                    Code: this.parameter,
                    parent: this
                },
                header: "Cập nhật danh mục: " + item.Name,
                width: "50%",
            })
            .onClose.subscribe((data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }
    getValue(item: any, col: any) {
        switch (col.Type) {
            case "Text":
            case "MultiLine":
                return item[col.Name];
            case "Int":
            case "Decimal":
                return item[col.Name];
            case "Boolean":
                var text = item[col.Name] == 'true' ? (col.Setting.true ? col.Setting.true : item[col.Name])
                    : (col.Setting.false ? col.Setting.false : item[col.Name]);
                return text;
            case "[0,1]":
                var text = item[col.Name] == '1' ? (col.Setting["V1"] ? col.Setting["V1"] : item[col.Name])
                    : (col.Setting["V0"] ? col.Setting["V0"] : item[col.Name]);
                return text;
            case "Time":
            case "Date":
                return item[col.Name];
            case "Combobox":
                if (!col.data) {
                    if(this.loading){
                        return item[col.Name];
                    }
                    this.loading = true;
                    var element = col;
                    if (element.Setting.Api) {
                        element.Setting.Input = element.Setting.Input.replace(/'/g, '"');
                        this.http.post(
                            element.Setting.Api,
                            JSON.parse(element.Setting.Input),
                            (result: ResultModel) => {
                                if (result.Code == ResultCode.Success) {
                                    if (!element.Required) {
                                        result.Result.unshift({ Id: null, Name: "Chọn " + element.Label });
                                    } else if (!item[element.Name]) {
                                        item[element.Name] = result.Result[0][element.Setting.Id];
                                    }
                                    element["data"] = result.Result;
                                    element["id"] = element.Setting.Id;
                                    element["label"] = element.Setting.Label;
                                } else {
                                    element["data"] = [];
                                }
                                this.loading = false;
                            },
                            () => {
                                element["data"] = [];
                                this.loading = false;
                            }
                        );
                    } else {
                        element["data"] = [];
                    }
                }
                try {
                    return col["data"].filter((s: any) => s[col["id"]] == item[col.Name])[0][col["label"]];
                } catch (error) {
                    return item[col.Name];
                }

        }
    }
    delete(item: any) {
        this.confirmationService.confirm({
            message: "Bạn có chắc chắn muốn xoá danh mục " + item.Name + "?",
            accept: () => {
                this.http.post(
                    "GeneralCategory/Delete",
                    {
                        Id: item.Id,
                    },
                    (result: ResultModel) => {
                        if (result.Code == ResultCode.Success) {
                            this.loadData();
                        }
                    },
                    () => { }
                );
            },
        });
    }
    loadPage(): void {
        this.pageIndex = 1;
        if (this.dt != null) {
            this.refresh();
        }
        this.loadData();
    }

    private loadData(): void {
        this.loading = true;

        var input = {};
        try {
            input = JSON.parse(this.otherRole);
        } catch {

        }
        var data = {
            Code: this.parameter,
            Keyword: this.keywordInput,
            PageSize: this.pageSize,
            PageIndex: this.pageIndex,
            IsPagination: true
        };
        if (input) {
            data = Object.assign({}, data, input);
        }
        this.http.post(
            "GeneralCategory/Items",
            data,
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.items = result.Result;
                    this.totalRow = result.TotalRow;
                }
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        );
    }
    clearfilter() {
        this.pageIndex = 1;
        this.keywordInput = null;
        this.refresh();
        this.loadData();
    }
    search() {
        this.pageIndex = 1;
        this.refresh();
        this.loadData();
    }

    refresh() {
        this.dt.first = 0;
    }

    openPopupImage(item: any) {
        // const ref = this.dialogService
        //     .open(PopupImageModal, {
        //         data: {
        //             items: item.ImageList,
        //         },
        //         header: "Slideshow",
        //         width: "70%",
        //     })
        //     .onClose.subscribe((data: any) => { });
    }
}
