import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { ConfirmationService, MessageService } from "primeng/api";
import { HttpService } from "src/app/services";
import { ToastrService } from "ngx-toastr";

@Component({
    standalone: false,
    selector: "caption-image-modal",
    templateUrl: "caption-image.modal.html",
    styleUrls: ["./caption-image.modal.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CaptionImageModel {

    item: any;
    caption:any = "";
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
        if(this.item.Caption){
            this.caption = this.item.Caption;
        }else{
            this.caption = this.item.Name;
        }
    }

    ngOnInit() {

    }
    cancel() {
        this.ref.close();
    }

    submit() {
        this.ref.close(this.caption);
    }
}
