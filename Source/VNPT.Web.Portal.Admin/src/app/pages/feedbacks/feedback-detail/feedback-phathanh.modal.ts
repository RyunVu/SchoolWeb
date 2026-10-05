import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { HttpService } from "src/app/services";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { ResultCode, ResultModel } from "src/app/models";

@Component({
    selector: "feedback-phathanh-modal",
    templateUrl: 'feedback-phathanh.modal.html',
    styleUrls: ['./feedback-phathanh.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class FeedbackPhatHanhModal {
    items: any;
    item: any;

    command: string;
    images: any;
    contentdefault: string = '<p style="margin-left:0in; margin-right:0in; text-align:center"><span style="font-size:14pt"><span style="font-family:&quot;Times New Roman&quot;,serif">ỦY BAN NH&Acirc;N D&Acirc;N TH&Agrave;NH PHỐ Đ&Agrave; LẠT</span></span></p>'
        + '<p style="margin-left:0in; margin-right:0in; text-align:justify"><span style="font-size:14pt"><span style="font-family:&quot;Times New Roman&quot;,serif">K&iacute;nh ch&agrave;o &Ocirc;ng/B&agrave;.</span></span></p>'
        + '<p style="margin-left:0in; margin-right:0in; text-align:justify"><span style="font-size:14pt"><span style="font-family:&quot;Times New Roman&quot;,serif">Về phản &aacute;nh của qu&yacute; &ocirc;ng/b&agrave;, UBND th&agrave;nh phố Đ&agrave; Lạt trả lời như sau:</span></span></p>'
        + '<p style="margin-left:0in; margin-right:0in; text-align:justify"><span style="font-size:14pt"><span style="font-family:&quot;Times New Roman&quot;,serif">..................................................................................................................</span></span></p>'
        + '<p style="margin-left:0in; margin-right:0in; text-align:justify"><span style="font-size:14pt"><span style="font-family:&quot;Times New Roman&quot;,serif">..................................................................................................................</span></span></p>'
        + '<p style="margin-left:0in; margin-right:0in; text-align:justify"><span style="font-size:14pt"><span style="font-family:&quot;Times New Roman&quot;,serif">..................................................................................................................</span></span></p>'
        + '<p style="margin-left:0in; margin-right:0in; text-align:justify"><span style="font-size:14pt"><span style="font-family:&quot;Times New Roman&quot;,serif">UBND th&agrave;nh phố Đ&agrave; Lạt c&aacute;m ơn &yacute; kiến phản &aacute;nh của &ocirc;ng/b&agrave; v&agrave; rất mong tiếp tục nhận được &yacute; kiến phản &aacute;nh trong thời gian tới.</span></span></p>';
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        public dialogService: DialogService,
        public httpClient: HttpClient,
        private toastr: ToastrService,
    ) {
        this.item = this.config.data.Id;
        this.command = this.config.data.LastHandleContent;
        if (!this.command) {
            this.command = this.contentdefault;
        }
    }

    ngOnInit() {
        this.http.post("FeedbackAdmin/Images",
        {
            Id: this.item,
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.images = {
                    Name: "Hình ảnh đã báo cáo",
                    Images: result.Result
                };
            }
        }, () => {
        });
    }
    cancel() {
        this.ref.close();
    }

    save() {
        if (this.command == null || this.command == "") {
            this.toastr.error('Thiếu trường nội dung trả lời', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        this.http.post("FeedbackAdmin/SavePublicContent",
            {
                "FeedbackId": this.item,
                "Content": this.command
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.ref.close({ confirm: 'yes' });
                }
            }, () => {
            });
    }
    changeContent(event: any) {
        this.command = event;
    }
}