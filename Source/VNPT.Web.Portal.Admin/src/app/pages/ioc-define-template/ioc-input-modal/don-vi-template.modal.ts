import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import * as _ from "lodash";
import { HttpService } from "src/app/services";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { CookieService } from "ngx-cookie-service";
declare var $: any;
@Component({
    selector: "don-vi-template-modal",
    templateUrl: './don-vi-template.modal.html',
    styleUrls: ['../ioc-list-template.component.scss']
})
export class DonViTemplateModal implements OnInit {
    context: any;
    public formData: any;
    // fields: any;
    listDocument: any;
    listTongHopDocument: any = [];
    selectedDocument: any = [];
    listSelectedDocument: any = [];
    code: any = "";
    header: any = "";
    valid = 0;
    isDisabled: boolean = false;
    constructor(
        //nhan du lieu tu trang cha
        public http: HttpService,
        public formBuilder: FormBuilder,
        private router: Router,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public message: MessageService,
        private confirmationService: ConfirmationService,
        private cookieService: CookieService,
    ) {
        this.context = this.config.data;
    }

    ngOnInit() {
        this.loadData();
        this.loadSingleData();
        this.formData = this.formBuilder.group({
            Template: "",
            Code: "",
            Header: "",
            Field: "",
        });

        $(function () {
            var id = "#tong-hop-template";
            var dialog = $(id).closest(".modal-dialog")[0];
            $(dialog).addClass("modal-dialog-9");
            // set chiều cao cho modal
            $(id).height(window.innerHeight - 170);
            window.onresize = (e: any) => {
                $(id).height(window.innerHeight - 170);
            };
        });
    }

    // getIocFields() {
    //     var data = {
    //     };
    //     this.http.post('IOC/GetListPropertyField', data, (kq) => {
    //         if (kq.Code == 200) {
    //             this.fields = kq.Result;
    //             if (this.fields.length > 0) {
    //                 this.data.FieldId = this.fields[0].Id;
    //             }
    //         }
    //     }, error => {
    //     }
    //     );
    // }

    public loadData() {

        //use dataSearch for packaging the data
        var dataSearch = {
            
        };

        this.http.post('IOC/GetListDonVi', dataSearch, (data1: any) => {
            if (data1.Code == 200) {
                this.listDocument = data1.Result;
            }
        }, () => {
        }
        );
    }

    loadSingleData() {
        var sendData = {
            DocumentTemplateId: this.context.item.Id,
            TrueFalse: this.context.item.IsTongHop
        }

        this.http.post('IOC/GetDonViTheoBieuMau', sendData, (data1: any) => {
            if (data1.Code == 200) {
                if (data1.Result != null) {
                    this.code = data1.Result.Code;
                    this.header = data1.Result.Header;
                    this.listTongHopDocument = data1.Result.ListOrganization;
                    this.listSelectedDocument = data1.Result.ListOrganization;
                }
            }
        }, () => {
        }
        );
    }

    cancel() {
        this.ref.close();
    }
    data: any = {};

    submit() {
        this.valid = 0;

        if (this.listTongHopDocument.length <= 0) {
            $('#listDocumentError').html('Vui lòng chọn đơn vị!');
            this.valid++;
        }
        else {
            $('#listDocumentError').html('');
            this.valid = this.valid > 0 ? this.valid : 0;
        }

        if (this.valid <= 0) {
            this.isDisabled = true;

            this.data.Id = this.context.item.Id;
            this.data.Code = $("#codeTongHopId").val();
            this.data.Header = $("#headerTongHopId").val();
            this.data.ListOrganization = this.listTongHopDocument;
            var sendData = {
                Json: JSON.stringify(this.data)
            }
            this.http.post('IOC/SaveDonViBieuMau', sendData, (data1: any) => {
                if (data1.Code == 200) {
                    this.isDisabled = false;
                    this.message.add({ severity: 'success', summary: 'Success', detail: "Thêm thành công!" });
                    this.ref.close();
                } else {
                    this.isDisabled = false;
                    this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra" });
                }
            }, () => {
                this.isDisabled = false;
                this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra" });
            }
            );
        }
    }

    getHeight() {
        return window.innerHeight - 170;
    }

    // onChangeField(value) {
    //     this.data.FieldId = value.value.Id;
    // }

    onChangeDocument(list: any) {
        this.listTongHopDocument = [];
        if (list.value != undefined && list.value.length > 0) {
            this.listTongHopDocument = list.value;
        }
    }

    removeLi(event: any, id: any) {
        this.listTongHopDocument = _.filter(this.listTongHopDocument, row => row.Id != id);
        this.listSelectedDocument = _.filter(this.listSelectedDocument, row => row.Id != id);
        event.target.closest("li").remove();
    }
}
