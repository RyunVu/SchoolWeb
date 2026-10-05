import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { MessageService } from 'primeng/api';
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";

@Component({
    selector: "fields-modal",
    templateUrl: 'fields.modal.html',
    styleUrls: ['./fields.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})


export class FieldsModal {
    item: any;
    imageUrl: any;
    imageDisplay: any;
    types: any[] = [
        {
            Id: null,
            Name: "Loại thời gian xử lý"
        },
        {
            Id: 1,
            Name: "Ngày"
        },
        {
            Id: 2,
            Name: "Giờ"
        },
        {
            Id: 3,
            Name: "Phút"
        }
    ];
    type: any;
    units: any[] = [];
    unit: any = null;
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService,
    ) {
        this.item = {
            
        };

        if(this.config.data.item != null) {
            this.item = this.config.data.item;
        }

        this.type = this.item.TimeType;
        this.location = this.item.UnitCode;
        this.imageUrl = this.item.ImageUrl;
        this.unit = this.item.UnitId;
    }

    ngOnInit() {
        this.loadLocations();
    }
    loadLocations() {
        this.http.post("unit/districts", {

        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.locations = result.Result;
                this.loadUnits();
            }
        }, () => {
        });
    }
    selectUnit(event:any){
        this.loadUnits();
    }
    loadUnits() {
        this.http.post("field/units2", {
            UnitCode: this.location
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;
                this.units.unshift({
                    Id: null,
                    Name:"Chọn đơn vị"
                })
            }
        }, () => {
        });
    }
    locations: any[] = [];
    location: any;
    
    cancel() {
        this.ref.close();
    }
    onKeyUp(event: any) {
        if (event.keyCode == 13) {
        }
    }
    submit() {
        if (this.item.Name == null || this.item.Name == "") {
            this.toastr.error('Thiếu trường Tên', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }
        this.http.post("field/save",
        {
            "Id": this.item.Id,
            "UnitCode": this.location,
            "Code": this.item.Code,
            "Name": this.item.Name,
            "OrderNo": this.item.OrderNo,
            "ColorCode": this.item.ColorCode,
            "ImageUrl": this.imageUrl,
            "Time": this.item.Time,
            "TimeType": this.type,
            "Description": this.item.Description
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.ref.close({ confirm: 'yes' });
            }
        }, () => {
        });
    }

    openFileDilog() {
        const ref = this.dialogService.open(FileManagerModal, {
            data: {
                filetype: 'image',
                multipleselect: false
            },
            header: 'Quản lý file',
            width: '70%',
        }).onClose.subscribe((data: any) => {
            if (data) {
                var fileUrls = data.urls;
                fileUrls.forEach((element:any) => {
                   this.imageUrl = element.Url;
                });
            }
        });
    }

    selectType(event: any) {
        if(this.type == null) {
            this.item.Time = null;
        }
    }
}