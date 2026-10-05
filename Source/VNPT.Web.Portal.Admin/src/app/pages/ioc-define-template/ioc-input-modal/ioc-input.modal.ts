import { Component, OnInit, AfterViewInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage, BaseService, HttpService, ShowDialogService } from 'src/app/services';
import { Router } from '@angular/router';

import * as _ from "lodash";
// import { IOCInputListModal } from "./ioc-input-list.modal";
import * as moment from 'moment';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { CookieService } from "ngx-cookie-service";
declare var $: any;

@Component({
    selector: "ioc-input-modal",
    templateUrl: 
    './ioc-input.modal.html',
    styleUrls: ['./ioc-input.component.scss']
})


export class InputModal implements OnInit {
    context: any;
    public formData: any;
    // fields: any;
    units: any = [];
    templates: any = [];
    values: any = [];
    listCol: any = [];
    valuesPast: any = [];
    listColPast: any = [];
    inputDate: any;
    frequencies: any = [];
    defaultFrequency: any;

    isDisabled: boolean = false;
    globalValue: any = {};

    nameTemplate: any;

    defaultHasIns: any;
    organizations: any;
    defaultOrganization: any;

    currentRole: any;
    hasPermision: any;
    hasAdminPermision: any;

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

        this.nameTemplate = this.context.item.NameTemplate;
        this.LoadKyTruoc(moment(new Date()).format('DD/MM/YYYY'));

        this.currentRole = this.cookieService.get("MulRole");
        this.hasPermision = false;
        this.hasAdminPermision = false;
        if (this.currentRole != "" && this.currentRole != null) {
            if (!this.currentRole.includes("NhapLieuIOC") && !this.currentRole.includes("AdminNhapLieuIOC")) {
                this.hasPermision = true;
            }
            if (this.currentRole.includes("AdminIOC")) {
                this.hasAdminPermision = true;
            }
        }
    }

    LoadKyTruoc(date: moment.MomentInput) {
        if (this.context.item.FrequencyTypeId != null) {
            // { Id: 2, Name: "Ngày" },
            // { Id: 6, Name: "Tuần" },
            // { Id: 7, Name: "Giữa tháng" },
            // { Id: 3, Name: "Tháng" },
            // { Id: 4, Name: "Quý" },
            // { Id: 5, Name: "Năm" }
            //var date = moment(new Date()).format('DD/MM/YYYY');
            var prevDate = "31/12/" + moment(date, "DD/MM/YYYY").add('years', -1).year();
            switch (this.context.item.FrequencyTypeId) {
                case 2:
                    var mNumber = moment(date, "DD/MM/YYYY").date();
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);

                    // mNumber = moment(prevDate, "DD/MM/YYYY").month() + 1;
                    // var prevArr = Array.from(Array(mNumber + 1).keys()).slice(1);
                    // prevArr = prevArr.htcConvert(this.context.item.FrequencyTypeId, prevDate);
                    // this.frequencies = prevArr.concat(this.frequencies);
                    break;
                case 6:
                    var mNumber = moment(date, "DD/MM/YYYY").week();
                    if (mNumber == 1) {
                        var mNumber = moment(date, "DD/MM/YYYY").add(-7, 'days').week();
                    }
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);

                    mNumber = moment(prevDate, "DD/MM/YYYY").week();
                    if (mNumber == 1) {
                        var mNumber = moment(prevDate, "DD/MM/YYYY").add(-7, 'days').week();
                    }
                    var prevArr = Array.from(Array(mNumber).keys()).slice(1);
                    prevArr = prevArr.htcConvert(this.context.item.FrequencyTypeId, prevDate);
                    this.frequencies = prevArr.concat(this.frequencies);

                    break;
                case 7:
                    var mNumber = 0;
                    if (moment(date, "DD/MM/YYYY").date() > 16) {
                        mNumber = moment(date, "DD/MM/YYYY").month() + 2;
                    } else {
                        mNumber = moment(date, "DD/MM/YYYY").month() + 1;
                    }
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);

                    mNumber = 0;
                    if (moment(prevDate, "DD/MM/YYYY").date() > 16) {
                        mNumber = moment(prevDate, "DD/MM/YYYY").month() + 2;
                    } else {
                        mNumber = moment(prevDate, "DD/MM/YYYY").month() + 1;
                    }
                    var prevArr = Array.from(Array(mNumber).keys()).slice(1);
                    prevArr = prevArr.htcConvert(this.context.item.FrequencyTypeId, prevDate);
                    this.frequencies = prevArr.concat(this.frequencies);
                    break;
                case 3:
                    var mNumber = moment(date, "DD/MM/YYYY").month() + 1;
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);

                    mNumber = moment(prevDate, "DD/MM/YYYY").month() + 1;
                    var prevArr = Array.from(Array(mNumber + 1).keys()).slice(1);
                    prevArr = prevArr.htcConvert(this.context.item.FrequencyTypeId, prevDate);
                    this.frequencies = prevArr.concat(this.frequencies);
                    break;
                case 4:
                    var mNumber = moment(date, "DD/MM/YYYY").quarter();
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);

                    mNumber = moment(prevDate, "DD/MM/YYYY").quarter();
                    var prevArr = Array.from(Array(mNumber).keys()).slice(1);
                    prevArr = prevArr.htcConvert(this.context.item.FrequencyTypeId, prevDate);
                    this.frequencies = prevArr.concat(this.frequencies);
                    break;
                case 5:
                    var mNumber = moment(date, "DD/MM/YYYY").year();
                    this.frequencies = [mNumber - 2, mNumber - 1];
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);
                    break;
            }

            if (this.frequencies.length > 0) {
                this.defaultFrequency = this.frequencies[this.frequencies.length - 1];
                var documentTemplateId = this.context.item.Id;
                var valueFrequency = this.defaultFrequency;
                var frequencyTypeId = this.context.item.FrequencyTypeId;

                if (this.context.item != undefined && this.context.item.Id != null) {
                    this.getDetailTemplatePast(documentTemplateId, valueFrequency, frequencyTypeId);
                }
            }
        }
    }

    //  convertArrOjb(this){
    //     return this.map(function (e) {
    //         var obj = { Id: e, Name: e };
    //         return obj;
    //     });
    // }
    ngOnInit() {
        var that = this;
        // $(document).ready(function () {

        //     $('body').tooltip({ selector: '[data-toggle="tooltip"]' })

        //     $('#input-date').datetimepicker({
        //         format: 'DD/MM/YYYY',
        //         locale: 'vi',
        //     });
        // });

        // $("#input-date").val(moment(date).format('DD/MM/YYYY'));
        let today = new Date();
        this.inputDate = today.getDate() + '/' + (today.getMonth() + 1 ) + '/' + today.getFullYear();
        var that = this;
        $('#tableContent').on('change', '#numberInput',  () => {
            var valueId = $(this).closest('div').attr('id');
            that.values.forEach((element: any) => {
                element.MapValueId.forEach((element1: any) => {
                    if (element1.ValueMapId == valueId) {
                        element1.NumberValue = $('#numberInput').val();
                    }
                });
            });
        });
        $('#tableContent').on('change', '#textInput', () => {
            var valueId = $(this).closest('div').attr('id');
            that.values.forEach((element: any) => {
                element.MapValueId.forEach((element1: { ValueMapId: any; NumberValue: any; }) => {
                    if (element1.ValueMapId == valueId) {
                        element1.NumberValue = $('#textInput').val();
                    }
                });
            });
        });
        $(function () {
            var id = "#ioc-input-modal";
            var dialog = $(id).closest(".modal-dialog")[0];
            $(dialog).addClass("modal-dialog-9");
            // set chiều cao cho modal
            $(id).height(window.innerHeight - 300);
            window.onresize = (e: any) => {
                $(id).height(window.innerHeight - 300);
            };
        });
        this.getDetailTemplate(this.context.item.Id);
    }

    getDetailTemplate(id: string) {
        this.isDisabled = true;
        var data = {
            DocumentTemplateId: id,
            InputDate: moment(this.inputDate).format('DD/MM/YYYY'),
            SelectedOrganizationId: this.defaultOrganization == undefined ? null : this.defaultOrganization.Id
        };
        this.http.post('IOC/GetPropertyValueByTemplateId', data, (kq: { Code: number; Result: { ListCol: any; PropertyIdsNew: any; HasIns: any; ListIns: any; } | null; }) => {
            if (kq.Code == 200) {
                this.isDisabled = false;
                if (kq.Result != null) {
                    this.listCol = kq.Result.ListCol;
                    this.values = kq.Result.PropertyIdsNew;

                    this.defaultHasIns = kq.Result.HasIns;
                    if (this.defaultHasIns) {
                        // Load Đơn vị
                        this.organizations = kq.Result.ListIns;
                    }
                }
            }
            else {
                this.isDisabled = false;
            }
        }, (error: any) => {
            this.isDisabled = false;
        }
        );
    }

    onChangeOrganizations(value: { value: { Id: any; }; }) {
        this.defaultOrganization = { Id: value.value.Id };
        this.getDetailTemplate(this.context.item.Id);
        this.getDetailTemplatePast(this.context.item.Id, this.defaultFrequency, this.context.item.FrequencyTypeId);
    }

    getDetailTemplatePast(documentTemplateId: any, valueFrequency: { FromDate: any; ToDate: any; }, frequencyTypeId: any) {

        var data = {
            DocumentTemplateId: documentTemplateId,
            FrequencyTypeId: frequencyTypeId,
            FromDate: valueFrequency.FromDate,
            ToDate: valueFrequency.ToDate,
            SelectedOrganizationId: this.defaultOrganization == undefined ? null : this.defaultOrganization.Id
        };
        this.http.post('IOC/GetPastPropertyValueByTemplateId', data, (kq: { Code: number; Result: { ListCol: any; PropertyIdsNew: any; } | null; }) => {
            if (kq.Code == 200) {

                if (kq.Result != null) {
                    this.listColPast = kq.Result.ListCol;
                    this.valuesPast = kq.Result.PropertyIdsNew;
                }
            }
            else {

            }
        }, (error: any) => {

        }
        );
    }

    submit() {
        var id = "";
        if (this.context.item != null) {
            id = this.context.item.Id;
        }
        var listMapValue: any[] = [];
        var tempValues: any[] = [];
        this.values.forEach((element: { MapValueId: any[]; }) => {
            // var value = $("#" + element.RandomId).find("input").val();
            element.MapValueId.forEach((element1: { RandomId: string; DataType: number; NumberValue: number; StringValue: string; }) => {
                var value = $("#" + element1.RandomId).find("input").val();
                if (element1.DataType == 0) {
                    element1.NumberValue = value;
                    element1.StringValue = "";
                } else if (element1.DataType == 1) {
                    element1.StringValue = value;
                    element1.NumberValue = 0;
                }
                listMapValue.push(element1);
                tempValues.push(element1);
            });
        });

        listMapValue.forEach(element1 => {
            element1.InputDate = moment(this.inputDate).format('DD/MM/YYYY');
            if (element1.DataType == 2 && element1.Recipe.indexOf("+")) {
                try {
                    var sum = 0;
                    var arrNo = element1.Recipe.split('+');
                    arrNo.forEach((arrN: string) => {
                        tempValues.forEach(element3 => {
                            if (element3.CodeId == arrN.trim()) {
                                sum += parseFloat(element3.NumberValue);
                            }
                        });
                    });
                    element1.NumberValue = sum;
                    element1.StringValue = element1.Recipe;
                } catch {
                    element1.NumberValue = 0;
                }
            }
        });

        var data = {
            DocumentTemplateId: id,
            Json: JSON.stringify(listMapValue)
        }

        this.isDisabled = true;

        this.http.post('IOC/SaveInputDocumentTemplate', data, (kq: { Result: { Code: number; } | null; }) => {
            if (kq.Result == null) {
                this.isDisabled = false;
                this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra" });
            }
            else {
                if (kq.Result.Code == 200) {
                    this.isDisabled = false;
                    this.message.add({ severity: 'success', summary: 'Error', detail: "Thêm thành công!" });
                    this.getDetailTemplate(id);
                } else {
                    this.isDisabled = false;
                    this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra" });
                }
            }

        }, (error: any) => {
            this.isDisabled = false;
            this.message.add({ severity: 'error', summary: 'Error', detail: "Đã có lỗi xảy ra" });
        }
        );
    }
    // inputDate: any;
    onChangeDate() {
        if (this.inputDate) {
            var ddDate = moment(this.inputDate).format('DD/MM/YYYY');
            if (this.context.item != undefined && this.context.item.Id != null) {
                //this.LoadKyTruoc(this.inputDate);
                this.getDetailTemplate(this.context.item.Id);
            }
        }

        
    }

    setMaxWidth() {
        if (this.listCol != null && this.listCol.length > 3) {
            var maxW = 460 * this.listCol.length;
            return {
                'width': maxW + 'px'
            };
        } else {
            return {
                'max-width': '100%'
            };

        }
    }

    iocInputList(propertyId: any, propertyName: any, property2Id: any, property2Name: any, dataType: any, unitId: any) {

        // var id = "";
        // if (this.context.item != null) {
        //     id = this.context.item.Id;
        // }

        // this.modal.open(IOCInputListModal,
        //     overlayConfigFactory({
        //         item: {
        //             TemplateId: this.context.item.Id,
        //             InputDate: moment(this.inputDate).format('DD/MM/YYYY'),
        //             PropertyId: propertyId,
        //             Property2Id: property2Id,
        //             Property2Name: property2Name,
        //             DataType: dataType,
        //             UnitId: unitId,
        //             PropertyName: propertyName
        //         },
        //         isAdd: true,
        //         code: ""
        //     },
        //         BSModalContext))
        //     .then((resultPromise) => {
        //         resultPromise.result.then((result) => {
        //             var chooseValue = result.Data;
        //             this.values.forEach(element => {
        //                 if (element.PropertyId == chooseValue.PropertyId) {
        //                     for (var i = 0; i < element.NValue.length; i++) {
        //                         if (element.DataType[i] == 1) {
        //                             if (chooseValue.SValue[i] != undefined) {
        //                                 element.SValue[i] = chooseValue.SValue[i];
        //                             }
        //                         }
        //                         else {
        //                             if (chooseValue.NValue[i] != undefined) {
        //                                 element.NValue[i] = chooseValue.NValue[i];
        //                             }
        //                         }
        //                     }
        //                     element.MapValueId.forEach(element1 => {
        //                         element1.IsChooseValue = true;
        //                         element1.JsonDescription = result.JsonDescription;
        //                     });
        //                 }
        //             });

        //         }).catch(() => {

        //         })
        //     },
        //         () => { }
        //     );
    }
    cancel() {
        this.ref.close();
    }

    onChange(event: { value: any; }) {
        var documentTemplateId = this.context.item.Id;
        var valueFrequency = event.value;
        var frequencyTypeId = this.context.item.FrequencyTypeId;

        if (this.context.item != undefined && this.context.item.Id != null) {
            this.getDetailTemplatePast(documentTemplateId, valueFrequency, frequencyTypeId);
        }
    }

    over(mValue: any) {
        var abc = "";
        this.globalValue = mValue;
    }
}
