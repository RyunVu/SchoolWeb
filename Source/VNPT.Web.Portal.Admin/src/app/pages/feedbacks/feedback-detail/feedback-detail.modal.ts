import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { HttpService } from "src/app/services";
import * as fs from 'file-saver';
// import * as request from 'request';
import { HttpClient } from "@angular/common/http";
import * as JSZip from 'jszip';
import * as moment from 'moment';

@Component({
    selector: "feedback-detail-modal",
    templateUrl: 'feedback-detail.modal.html',
    styleUrls: ['./feedback-detail.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class FeedbackDetailModal {
    items: any;
    item: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        public dialogService: DialogService,
        public httpClient: HttpClient
    ) {

    }

    ngOnInit() {
        this.item = this.config.data.items;
    }
    cancel() {
        this.ref.close();
    }
    
}