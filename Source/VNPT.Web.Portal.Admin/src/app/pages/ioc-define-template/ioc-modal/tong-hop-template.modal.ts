import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage, BaseService, HttpService, ShowDialogService } from 'src/app/services';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";
declare var $: any;
@Component({
    selector: "tong-hop-template-modal",
    templateUrl: './tong-hop-template.modal.html',
    styleUrls: ['../ioc-list-template.component.scss']
})
export class TongHopTemplateModal implements OnInit {
    formData: any;
    fields: any = [];
    listDocument: any;
    listTongHopDocument: any = [];
    selectedDocument: any = [];
    listSelectedDocument: any = [];
    code: any = "";
    header: any = "";
    valid = 0;
    isDisabled: boolean = false;
    defaultField: any;
    scheduleTaskTypeId: any;
    context: any;
    constructor(
        //nhan du lieu tu trang cha
        public http: HttpService,
        public formBuilder: FormBuilder,
        private router: Router,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public message: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.context = this.config.data;
    }

    ngOnInit() {
        this.getIocFields();
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

    getIocFields() {
        var data = {
        };
        this.http.post('IOC/GetListPropertyField', data, (kq: { Code: number; Result: any; }) => {
            if (kq.Code == 200) {
                this.fields = kq.Result;
                this.fields.unshift({ Name: '--Tất cả lĩnh vực--', Id: null });
            }
        }, () => {
        }
        );
    }

    onChangeField(value: any) {
        this.defaultField = { Id: value.value.Id };
        this.loadData();
    }

    public loadData() {
        this.isDisabled = true;
        var fieldId = this.defaultField == undefined ? null : this.defaultField.Id;
        //use dataSearch for packaging the data
        var dataSearch = {
            FieldId: fieldId,
            IsPagination: false
        };

        this.http.post('IOC/GetListDocumentTemplateByOrgaId', dataSearch, (data1: any) => {
            if (data1.Code == 200) {
                this.isDisabled = false;
                this.listDocument = data1.Result;
            }
            else {
                this.isDisabled = false;
            }
        }, () => {
            this.isDisabled = false;
        }
        );
    }

    loadSingleData() {
        var sendData = {
            DocumentTemplateId: this.context.item.Id,
            TrueFalse: this.context.item.IsTongHop
        }

        this.http.post('IOC/GetSingleTongHop', sendData, (data1: any) => {
            if (data1.Code == 200) {
                if (data1.Result != null) {
                    this.code = data1.Result.Code;
                    this.header = data1.Result.Header;
                    this.listTongHopDocument = data1.Result.listTongHop;
                    this.listSelectedDocument = data1.Result.listTongHop;
                    this.getReviewTemplate(this.listTongHopDocument);
                }
            }
        }, (error: any) => {
        }
        );
    }

    cancel() {
        this.ref.close();
    }
    data: any = {};

    submit() {
        this.valid = 0;

        if ($("#codeTongHopId").val() == "") {
            $('#codeTongHopIdError').html('Bắt buộc nhập!');

            this.valid++;
        }
        else {
            $('#codeTongHopIdError').html('Bắt buộc nhập!');
            this.valid = this.valid > 0 ? this.valid : 0;
        }

        if ($("#headerTongHopId").val() == "") {
            $('#headerTongHopIdError').html('Bắt buộc nhập!');
            this.valid++;
        }
        else {
            $('#headerTongHopIdError').html('Bắt buộc nhập!');
            this.valid = this.valid > 0 ? this.valid : 0;
        }

        if (this.listTongHopDocument.length <= 0) {
            $('#listDocumentError').html('Bắt buộc nhập!');
            this.valid++;
        }
        else {
            $('#listDocumentError').html('Bắt buộc nhập!');
            this.valid = this.valid > 0 ? this.valid : 0;
        }

        if (this.valid <= 0) {
            this.isDisabled = true;

            this.data.Id = this.context.item.Id;
            this.data.Code = $("#codeTongHopId").val();
            this.data.Header = $("#headerTongHopId").val();
            this.data.ScheduleTaskTypeId = this.scheduleTaskTypeId;
            this.data.listTongHop = this.listTongHopDocument;
            var sendData = {
                Json: JSON.stringify(this.data)
            }
            this.http.post('IOC/SaveTongHop', sendData, (data1: { Code: number; }) => {
                if (data1.Code == 200) {
                    this.isDisabled = false;
                    this.message.add({ severity: 'success', summary: 'Error', detail: "Thêm thành công!" });
                    this.ref.close();
                } else {
                    this.isDisabled = false;
                    this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra" });
                }
            }, (error: any) => {
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
        let intersection = this.listTongHopDocument.filter((x: any) => list.value.includes(x));
        if (list.value != undefined && list.value.length > 0) {
            if (list.value.length > 1) {
                for (var i = 0; i < list.value.length; i++) {
                    for (var j = 1; j < list.value.length; j++) {
                        if (list.value[i].FrequencyTypeId != list.value[j].FrequencyTypeId) {
                            this.message.add({ severity: 'warn', summary: 'Error', detail: "Mẫu vừa chọn không cùng loại!" });
                            if (intersection.length > 0)
                                this.listSelectedDocument = intersection
                            return;
                        }
                    }
                }
            }
            this.scheduleTaskTypeId = list.value[0].FrequencyTypeId;
            this.listTongHopDocument = list.value;
            var listId = _.filter(this.listSelectedDocument, row => row.Id);
            this.getReviewTemplate(this.listTongHopDocument);
        } else {
            this.listTongHopDocument = [];
            this.values = [];
            this.listCol = [];
        }
    }

    removeLi(event: any, id: any) {
        this.listTongHopDocument = _.filter(this.listTongHopDocument, row => row.Id != id);
        this.listSelectedDocument = _.filter(this.listSelectedDocument, row => row.Id != id);
        event.target.closest("li").remove();
    }

    values: any = [];
    listCol: any = [];
    getReviewTemplate(listMapValue: any) {
        var data = {
            Json: JSON.stringify(listMapValue)
        }

        this.http.post('IOC/PreviewTemplate', data, (kq: any) => {
            if (kq.Result != null) {
                this.values = kq.Result.PropertyIdsNew;
                this.listCol = kq.Result.ListCols;
            }
            else {

            }

        }, (error: any) => {

        }
        );
    }

    iocInputList(randomId: any, propertyId: any, propertyName: any, property2Id: any, property2Name: any, dataType: any) {

    }
    over(mValue: any) {
        var abc = "";
    }
}
