import { Component, ViewEncapsulation } from "@angular/core";

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { s } from "src/app/services/s.service";
import { ToastrService } from "ngx-toastr";
import { HistoryModel } from "./history.model";
import * as moment from "moment";

@Component({
    selector: "history-modal",
    templateUrl: 'history.modal.html',
    styleUrls: ['./history.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})


export class HistoryModal {
    translate: HistoryModel;
    item: any;
    history: any;
    loading: boolean = false;
    changes: any[] = [];
    childChanges: any[] = [];
    childDesciption: any[] = [];
    igroneList: any[] = ["SortOrder","LanguageId","MaTinh","","","",""];
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService
    ) {
        this.translate = new HistoryModel();
        this.item = {
            ...this.config.data.item
        };
    }

    translater(attr: string): any {
        var value = (this.translate as any)[attr];
        if (!value)
            return attr;
        return value;
    }
    translaterValue(attr: string): any {
        if (Number(attr))
            return Number(attr).toLocaleString('vi-VN');
        
        if (moment(attr, moment.ISO_8601, true).isValid()) {
           return moment(attr, moment.ISO_8601).format("DD/MM/YYYY HH:mm:ss")
        }
        return attr;
    }
    getData(newVersion: any, oldVersion: any): any[] {
        var properties: Array<any> = [];
        
        var isOldNull = false;
        if (newVersion && newVersion != "null") {
            newVersion = JSON.parse(newVersion);
            properties = properties.concat(Object.getOwnPropertyNames(newVersion));
        } else {
            newVersion = {};
        }
        if (oldVersion && oldVersion != "null") {
            oldVersion = JSON.parse(oldVersion);
            properties = properties.concat(Object.getOwnPropertyNames(oldVersion));
        } else {
            oldVersion = {};
            isOldNull = true;
        }
        properties = properties.filter((v, i, a) => a.indexOf(v) === i);
        properties = properties.filter(item => !this.igroneList.includes(item));
        var result: any[] = [];
        for (var i = 0; i < properties.length; i++) {
            if (newVersion[properties[i]] != oldVersion[properties[i]]) {
                if (isOldNull == true &&
                    (
                        newVersion[properties[i]] == '00000000-0000-0000-0000-000000000000'
                        || newVersion[properties[i]] == ''
                        || newVersion[properties[i]] == null
                    )
                ) {
                    continue;
                }
                result.push({
                    Name: this.translater(properties[i]),
                    Old: this.translaterValue(oldVersion[properties[i]]),
                    New: this.translaterValue(newVersion[properties[i]]),
                    IsOldNull: isOldNull
                });
            }
        }
        return result;
    }

    ngOnInit() {
        this.loading = true;
        this.http.post("History/History", {
            "Id": this.item.Id
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.history = result.Result;
                this.changes = this.getData(this.history.NewVersion, this.history.OldVersion);
                this.childChanges = this.getData(this.history.ChildNewVersion, this.history.ChildOldVersion);
                this.childDesciption = this.getData(this.history.ChildDescription, null);
            }
            this.loading = false;
        }, () => {
            this.loading = false;
        });
    }

    cancel() {
        this.ref.close();
    }


}
