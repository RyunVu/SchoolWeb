import { Component, OnInit, AfterViewInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage, BaseService, HttpService, ShowDialogService } from 'src/app/services';
import { Router } from '@angular/router';

import * as _ from "lodash";
// import { IOCInputListModal } from "./ioc-input-list.modal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import * as moment from 'moment';
import { CookieService } from "ngx-cookie-service";
declare var $: any;

@Component({
    selector: "ioc-input-grid-modal",
    templateUrl: './ioc-input-grid.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./ioc-input.component.scss']
})


export class InputGridModal implements OnInit {
    context: any;
    public formData: any;
    units: any = [];
    templates: any = [];
    values: any = [];
    listCol: any = [];
    listMonth: any = [];
    valuesPast: any = [];
    listColPast: any = [];
    inputDate: any;
    frequencies: any = [];
    defaultFrequency: any;

    isDisabled: boolean = false;
    globalValue: any = {};

    nameTemplate: any;

    currentMonth: any;
    currentYear: any;

    defaultHasIns: any;
    organizations: any;
    defaultOrganization: any;

    currentRole: any;
    hasPermision: any;
    hasAdminPermision: any;

    currentMulRoleLevel: any;
    hasPermisionDetail: any;

    isTongHop: any;

    customers: any;

    balanceFrozen: boolean = false;

    loadding: any = false;
    type: any = 3;

    ColName: any = "Tháng ";
    selectedYear = "2022";
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
        this.type = this.context.item.FrequencyTypeId;
        this.isTongHop = this.context.item.IsTongHop;

        this.currentRole =  this.cookieService.get("MulRole");
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

        this.hasPermisionDetail = false;
        this.currentMulRoleLevel = this.cookieService.get("MulRoleLevel");
        if (this.currentMulRoleLevel != "" && this.currentMulRoleLevel != null) {
            if (this.currentMulRoleLevel.includes("2")) {
                this.hasPermisionDetail = true;
            }
        }


    }

    LoadKyTruoc() {
        if (this.context.item.FrequencyTypeId != null) {
            var date = moment(new Date()).format('DD/MM/YYYY');
            var prevDate = "01/01/2019";
            switch (this.context.item.FrequencyTypeId) {
                case 6:
                    var mNumber = moment(date, "DD/MM/YYYY").week();
                    if (mNumber == 1) {
                        var mNumber = moment(date, "DD/MM/YYYY").add(-7, 'days').week();
                    }
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);
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
                    break;
                case 3:
                    var mNumber = moment(date, "DD/MM/YYYY").month() + 1;
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);

                    var prevArr = Array.from(Array(13).keys()).slice(1);
                    prevArr = prevArr.htcConvert(this.context.item.FrequencyTypeId, prevDate);
                    this.frequencies = prevArr.concat(this.frequencies);
                    break;
                case 4:
                    var mNumber = moment(date, "DD/MM/YYYY").quarter();
                    this.frequencies = Array.from(Array(mNumber).keys()).slice(1);
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);
                    break;
                case 5:
                    var mNumber = moment(date, "DD/MM/YYYY").year();
                    this.frequencies = [mNumber - 2, mNumber - 1];
                    this.frequencies = this.frequencies.htcConvert(this.context.item.FrequencyTypeId, date);
                    break;
            }
        }
    }

    initScroll() {
        $(document).ready(function () {
            $("#fixTable").tableHeadFixer({ "head": true, "left": 2 });
        });

    }
    ngOnInit() {
        var that = this;
        $(document).ready(function () {

            $('body').tooltip({ selector: '[data-toggle="tooltip"]' })

            // $('#input-date').datetimepicker({
            //     format: 'YYYY',
            //     locale: 'vi',
            //     maxDate: new Date()
            // });
        });

        var date = new Date();

        this.currentMonth = this.type == 4 ? moment(date, "DD/MM/YYYY").quarter() : moment(date, "DD/MM/YYYY").month() + 1;
        this.currentYear = moment(date).format('YYYY');

        this.inputDate = date;
        this.selectedYear = moment(this.inputDate).format('YYYY');

        var that = this;
        $('#tableContent').on('change', '.numberInput', () => {
            var valueId = $(this).closest('div').attr('id');
            that.values.forEach((element: { MapValueId: any[]; }) => {
                element.MapValueId.forEach((element1: any) => {
                    if (element1.ValueMapId == valueId) {
                        element1.NumberValue = $('#numberInput').val();
                    }
                });
            });
        });
        $('#tableContent').on('change', '#textInput', () => {
            var valueId = $(this).closest('div').attr('id');
            that.values.forEach((element: { MapValueId: any[]; }) => {
                element.MapValueId.forEach((element1: { ValueMapId: any; NumberValue: any; }) => {
                    if (element1.ValueMapId == valueId) {
                        element1.NumberValue = $('#textInput').val();;
                    }
                });
            });
        });
        // $(function () {
        //     var id = "#ioc-input-modal";
        //     var dialog = $(id).closest(".modal-dialog")[0];
        //     $(dialog).addClass("modal-dialog-9");
        //     // set chiều cao cho modal
        //     $(id).height(window.innerHeight - 300);
        //     window.onresize = (e) => {
        //         $(id).height(window.innerHeight - 300);
        //     };
        // });

        this.getDetailTemplate(this.context.item.Id);
    }

    onBlurInput(value: any, randomIn: any) {
        var that = this;
        that.values.forEach((element: { ListMonth: any[]; IsDocumentTemplate: any }) => {
            if (!element.IsDocumentTemplate) {
                element.ListMonth.forEach(element1 => {
                    element1.ListMapValueId.forEach((element2: { RandomId: any; NumberValue: any; Edited: boolean; }) => {
                        if (element2.RandomId == randomIn) {
                            element2.NumberValue = value.target.value;
                            element2.Edited = true;
                        }
                    });


                });
            }

        });
    }

    getDetailTemplate(id: string) {
        var that = this;
        if (this.hasPermisionDetail) // Xem theo phòng --- GetPropertyValueByTemplateId_Phong --- Hồng kêu Phòng không lấy dữ liệu từ Phường nữa // NEW_PHUONG_HS - Thống kê hồ sơ một cửa (Tháng)
        {
            this.isDisabled = true;
            var data = {
                DocumentTemplateId: id,
                InputYear: moment(this.inputDate).format('YYYY'),
                SelectedOrganizationId: this.defaultOrganization == undefined ? null : this.defaultOrganization.Id
            };
            this.http.post('IOC/GetPropertyValueByTemplateId', data, (kq: any) => {
                if (kq.Code == 200) {
                    this.isDisabled = false;
                    if (kq.Result != null) {
                        this.listMonth = kq.Result.ListMonth;
                        if (this.type == 4) {
                            this.listMonth = kq.Result.ListQuarter;
                        }
                        this.values = kq.Result.PropertyIdsNew;

                        this.defaultHasIns = kq.Result.HasIns;
                        if (this.defaultHasIns) {
                            // Load Đơn vị
                            this.organizations = kq.Result.ListIns;
                        }
                        that.initScroll();
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
        else // Xem theo phường
        {
            this.isDisabled = true;
            var data = {
                DocumentTemplateId: id,
                InputYear: moment(this.inputDate).format('YYYY'),
                SelectedOrganizationId: this.defaultOrganization == undefined ? null : this.defaultOrganization.Id
            };
            this.http.post('IOC/GetPropertyValueByTemplateId', data, (kq: any) => {
                if (kq.Code == 200) {
                    this.isDisabled = false;
                    if (kq.Result != null) {
                        this.listMonth = kq.Result.ListMonth;
                        if (this.type == 4) {
                            this.listMonth = kq.Result.ListQuarter;
                            this.ColName = "Quý ";
                        }
                        this.values = kq.Result.PropertyIdsNew;

                        this.defaultHasIns = kq.Result.HasIns;
                        if (this.defaultHasIns) {
                            // Load Đơn vị
                            this.organizations = kq.Result.ListIns;
                        }
                        that.initScroll();
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


    }

    onChangeOrganizations(value: { value: { Id: any; }; }) {
        this.defaultOrganization = { Id: value.value.Id };
        this.getDetailTemplate(this.context.item.Id);
    }

    submit() {
        var id = "";
        if (this.context.item != null) {
            id = this.context.item.Id;
        }
        var listMapValue: any[] = [];
        var tempValues: any[] = [];
        this.loadding = true;
        this.values.forEach((el: any) => {
            if (!el.IsDocumentTemplate) {
                el.ListMonth.forEach((el1: any) => {
                    var month = el1.Month;
                    el1.ListMapValueId.forEach((el2: any) => {
                        if (el2.Edited == true) {
                        el2.Month = month;
                        el2.Quarter = month;
                        el2.Edited = true;
                        el2.Year = moment(this.inputDate).format('YYYY');
                        if (el2.DataType == 0) {
                            var nValue = $("#" + el2.RandomId).find("input").val();
                            el2.NumberValue = (nValue == undefined || nValue == "") ? 0 : $("#" + el2.RandomId).find("input").val();
                            el2.StringValue = "";
                        } else if (el2.DataType == 1) {
                            el2.StringValue = $("#" + el2.RandomId).find("input").val();
                            el2.NumberValue = 0;
                        }
                        listMapValue.push(el2);
                        tempValues.push(el2);
                        }
                    });

                });
            }
        });

        listMapValue.forEach(element1 => {
            // element1.InputDate =  moment(this.inputDate).format('YYYY');
            if (element1.DataType == 2 && element1.Recipe != null && element1.Recipe.indexOf("+")) {
                try {
                    var sum = 0;
                    var arrNo = element1.Recipe.split('+');
                    var month = element1.Month;
                    var year = element1.Year;
                    arrNo.forEach((arrN: string) => {
                        tempValues.forEach(element3 => {
                            if (element3.CodeId == arrN.trim() && element3.Month == month && element3.Year == year) {
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
                    this.message.add({ severity: 'success', summary: 'Success', detail: "Lưu thành công!" });
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

    onChangeDate() {
        // if ($("#input-date").data("DateTimePicker").date() != undefined) {
        //     this.inputDate = $("#input-date").data("DateTimePicker").date().format('YYYY');
        //     if (this.context.item != undefined && this.context.item.Id != null) {
        //         this.getDetailTemplate(this.context.item.Id);
        //     }
        // }

        if (this.inputDate) {
            this.selectedYear = moment(this.inputDate).format('YYYY');
            if (this.context.item != undefined && this.context.item.Id != null) {
                //this.LoadKyTruoc(this.inputDate);
                this.getDetailTemplate(this.context.item.Id);
            }
        }
    }

    setMaxWidth() {
        if (this.listMonth != null && this.listMonth.length > 1) {
            var maxW = (460 * this.listMonth.length) < 2000 ? 2000 : (460 * this.listMonth.length);
            return {
                'width': maxW + 'px'
            };
        } else {
            return {
                'max-width': '100%'
            };

        }
    }

    setPercentWidthSTT() {
        if (this.listMonth != null && this.listMonth.length > 3) {
            return {
                'width': '1%'
            };
        } else {
            return {
                'width': '5%'
            };

        }
    }

    setPercentWidthChiSo() {
        if (this.listMonth != null && this.listMonth.length > 3) {
            return {
                'width': '20%'
            };
        } else {
            return {
                'width': '40%'
            };

        }
    }

    setWidthColContent() {
        if (this.listMonth != null && this.listMonth.length > 1) {
            return {
                'width': '395px'
            };
        } else {
            return {
                'width': '30%'
            };

        }
    }

    setWidthContent() {
        if (this.listMonth != null && this.listMonth.length > 1) {
            return {
                'width': '200px'
            };
        } else {
            return {
                'width': '30%'
            };

        }
    }

    setColorButton(value: any) {
        if (!value) {
            return {
                'color': 'red'
            };
        }
        return {
            'color': 'black'
        };
    }

    iocInputList(randomId: any, propertyId: any, propertyName: any, property2Id: any, property2Name: any, dataType: any, unitId: any, month: string | number, year: string) {

        // var id = "";
        // if (this.context.item != null) {
        //     id = this.context.item.Id;
        // }

        // if (month < 10) {
        //     month = '0' + month;
        // }

        // this.modal.open(IOCInputListModal,
        //     overlayConfigFactory({
        //         item: {
        //             TemplateId: this.context.item.Id,
        //             InputDate: '01/' + month + '/' + year,
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
        //     .then((resultPromise: { result: Promise<any>; }) => {
        //         resultPromise.result.then((result: { Data: any; JsonDescription: any; }) => {
        //             var chooseValue = result.Data;
        //             this.values.forEach((element: { PropertyId: any; ListMonth: string | any[]; MapValueId: any[]; }) => {
        //                 if (element.PropertyId == chooseValue.PropertyId) {

        //                     for (var i = 0; i < element.ListMonth.length; i++) {
        //                         if (element.ListMonth[i].Month == month && element.ListMonth[i].Year == year) {
        //                             for (var j = 0; j < element.ListMonth[i].ListMapValueId.length; j++) {
        //                                 if (element.ListMonth[i].ListMapValueId[j].RandomId == randomId) {
        //                                     if (element.ListMonth[i].ListMapValueId[j].DataType == 1) {
        //                                         if (chooseValue.SValue[0] != undefined) {
        //                                             element.ListMonth[i].ListMapValueId[j].StringValue = chooseValue.SValue[0];
        //                                         }
        //                                     }
        //                                     else {
        //                                         if (chooseValue.NValue[0] != undefined) {
        //                                             element.ListMonth[i].ListMapValueId[j].NumberValue = chooseValue.NValue[0];
        //                                         }
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     }

        //                     element.MapValueId.forEach((element1: { IsChooseValue: boolean; JsonDescription: any; }) => {
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

    iocInputListDetail(documentTemplateId: any, randomId: any, propertyId: any, propertyName: any, property2Id: any, property2Name: any, dataType: any, unitId: any, month: string | number, year: string) {

        // var id = "";
        // if (this.context.item != null) {
        //     id = this.context.item.Id;
        // }

        // if (month < 10) {
        //     month = '0' + month;
        // }

        // this.modal.open(IOCInputListDetailModal,
        //     overlayConfigFactory({
        //         item: {
        //             DocumentTemplateId: documentTemplateId,
        //             TemplateId: this.context.item.Id,
        //             InputDate: '01/' + month + '/' + year,
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
        //     .then((resultPromise: { result: Promise<any>; }) => {
        //         resultPromise.result.then((result: any) => {
        //             this.getDetailTemplate(this.context.item.Id);

        //         }).catch(() => {

        //         })
        //     },
        //         () => { }
        //     );
    }

    cancel() {
        this.ref.close();
    }

    getToolTipData(mValue: { PropertyId: any; Property2Id: any; Property2Name: any; DataType: any; UnitId: any; PropertyName: any; }, abc: any): any {
        var value = {
            DocumentTemplateId: this.context.item.Id,
            InputDate: moment(this.inputDate).format('YYYY'),
            PropertyId: mValue.PropertyId,
            Property2Id: mValue.Property2Id,
            Property2Name: mValue.Property2Name,
            DataType: mValue.DataType,
            UnitId: mValue.UnitId,
            PropertyName: mValue.PropertyName
        };

        var data = {
            Json: JSON.stringify(value)
        };
        this.http.post('IOC/GetToolTipByPropertyId', data, (kq: { Code: number; }) => {
            if (kq.Code == 200) {

            }
            else {
            }
        }, (error: any) => {
        }
        );
    }

    over(mValue: any) {
        var abc = "";
        this.globalValue = mValue;
    }

    editValue(month: string, year: string) {

        this.confirmationService.confirm({
            message: "Bạn có chắc chắn sửa dữ liệu tháng " + month + " năm " + year + " ?",
            accept: () => {
                $('.' + month + '_' + year).removeAttr("readonly");
            }
        });
    }
}
