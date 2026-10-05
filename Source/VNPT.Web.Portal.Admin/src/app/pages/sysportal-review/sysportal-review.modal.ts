import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { ConfirmationService, MessageService } from "primeng/api";
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";

import * as moment from 'moment';
import * as _ from "lodash";
declare var $: any;

@Component({
    selector: "sysportal-review-modal",
    templateUrl: "sysportal-review.modal.html",
    styleUrls: ["./sysportal-review.modal.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class SysPortalReviewModal {

    item: any;

    listItem: any[] = [];
    colors: Array<{ userName: string, color: string }> = [];
    oldStatus: any;

    defaultCode: any;
    defaultNgay?: Date;
    defaultTitle: any = "";
    defaultAlias: any = "";
    defaultContent: any = "";
    imageUrl: any;
    imageDisplay: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
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
            this.defaultTitle = this.item.Title
            this.defaultAlias = this.item.Alias
            this.defaultContent = this.item.Content
            this.imageUrl = this.item.ImageUrl

            if (this.item.CreateDateString != "" && this.item.CreateDateString != null)
                this.defaultNgay = moment(this.item.CreateDateString, "DD/MM/YYYY HH:mm:ss").toDate();
        }
        else {
            var currentDate = new Date();

            this.defaultNgay = currentDate;
        }

        this.loadData();
    }

    ngOnInit() {

    }

    public loadData() {
        this.http.post(
            "SysPortalReview/GetListChild",
            {
                PortalId: this.item.PortalId,
                ParentId: this.item.Id,
                IsPagination: false,
                UnitCode: this.item.UnitCode
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.listItem = result.Result;
                }
            },
            () => {
            }
        );

        //this.buildForm();
    }

    getColor(userName: any) {
        var color = _.filter(this.colors, row => row.userName == userName);
        if (color == null || color.length == 0) {
            var colorTemp = {
                userName: userName,
                color: this.getRandomColor()
            };
            this.colors.push(colorTemp);
            return colorTemp.color;
        } else {
            return color[0].color;
        }
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    showApprove(item: any, status: number, isMainTopic: boolean = false, unlock: boolean = false, old: number = 0) {
        var statusName = "";
        this.oldStatus = item.Status;
        if (unlock && old !== 2) {
            status = 99
        }
        switch (status) {
            case 99:
                item.Status = old;
                statusName = "mở lại";
                break;
            case 1:
            case 0:
                item.Status = 3;
                statusName = "khóa";
                break;
            case 2:
                item.Status = 2;
                statusName = "hoàn tất";
                break;
            case -1:
                item.Status = -1;
                statusName = "xóa";
                break;
            default:
                item.Status = 1;
                statusName = "mở";
                break;
        }

        this.confirmationService.confirm({
            message: "Bạn có muốn" + " " + statusName + " " + "dữ liệu này không ?",
            accept: () => {
                this.http.post(
                    "SysPortalReview/ChangeReviewStatus",
                    {
                        PortalId: item.PortalId,
                        Id: item.Id,
                        Status: item.Status
                    },
                    (result: ResultModel) => {
                        if (result.Code == ResultCode.Success) {
                            this.toastr.success("Thay đổi trạng thái " + statusName, "Thông báo", {
                                timeOut: 3000,
                            });
                            this.loadData();
                        }
                    },
                    () => { }
                );
            }
        });
    }

    cancel() {
        this.ref.close();
    }

    onKeyUp(event: any) {
        if (event.keyCode == 13) {
        }
    }

    changeContent(event: any) {
        this.defaultContent = event
    }

    submit() {
        if (this.config.data.IsAdd) {
            if (this.defaultContent == null || this.defaultContent == "") {
                this.toastr.warning("Vui lòng nhập câu trả lời", "Cảnh báo", {
                    timeOut: 3000,
                });
                return;
            }

            this.http.post(
                "SysPortalReview/Insert",
                {
                    Content: this.defaultContent,
                    Subject: this.item.Subject,
                    ReviewType: this.item.ReviewType,
                    PortalId: this.item.PortalId,
                    ParentId: this.item.Id,
                    Id: 0
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                        this.toastr.success("Trả lời thành công", "Thông báo", {
                            timeOut: 3000,
                        });
                        this.loadData();
                        this.defaultContent = "";
                        $('#reviewInput').animate({ scrollTop: $('#reviewInput').find('ul').height() }, 1000);
                    }
                },
                () => { }
            );
        }
    }
}
