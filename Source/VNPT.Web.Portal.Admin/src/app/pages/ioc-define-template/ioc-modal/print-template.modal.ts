import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage, BaseService, HttpService, ShowDialogService } from 'src/app/services';
import { Router } from '@angular/router';
import * as fs from 'file-saver';
import * as Excel from 'exceljs';
import * as _ from "lodash";
import * as moment from 'moment';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";
declare var $: any;

@Component({
    selector: "print-template-modal",
    templateUrl: './print-template.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../ioc-list-template.component.scss']
})
export class PrintTemplateModal implements OnInit {
    fields: any = [];
    lengthDocument: any = 0;
    listDocument: any;
    listTongHopDocument: any = [];
    selectedDocument: any = [];
    listSelectedDocument: any = [];
    code: any = "";
    header: any = "";
    headerPrint: any = "";
    valid = 0;
    isDisabled: boolean = false;
    defaultField: any;
    scheduleTaskTypeId: any;
    frequencies: any[] = [];
    defaultType: any;
    times: any = [];
    defaultTime: any = [];
    defaultSelectTime: any;
    defaultFrequency: any;
    currentDate: any;
    currentYear: any;
    inputDate: any;
    selectedGroupProperty: boolean = false;
    indexList: boolean = false;
    selectedIsNotSingle: boolean = false;
    selectedAllDocument: boolean = false;
    selectedYear: boolean = false;
    workbook: any;
    organizations: any;
    defaultOrganization: any;

    showCustomDate: any = false;
    context: any;

    fromDate: any;
    toDate: any;
    inputYear: any;

    constructor(
        //nhan du lieu tu trang cha
        public http: HttpService,
        public formBuilder: FormBuilder,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public message: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.context = this.config.data;
        this.frequencies = [
            // { Id: 0, Name: "Phút" },
            // { Id: 1, Name: "Giờ" },
            { Id: 2, Name: "Ngày" },
            { Id: 6, Name: "Tuần" },
            //{ Id: 7, Name: "Giữa tháng" },
            { Id: 3, Name: "Tháng" },
            { Id: 4, Name: "Quý" },
            { Id: 5, Name: "Năm" }
        ]
        this.defaultFrequency = { Id: 3 }
        this.currentDate = new Date();
        this.currentYear = moment(this.currentDate, "DD/MM/YYYY").year();
        this.LoadThoiGian(moment(this.currentDate).format('DD/MM/YYYY'));
        this.workbook = new Excel.Workbook();

    }

    ngOnInit() {
        this.selectedGroupProperty = true;
        $(document).ready(function () {
            // $('#input-date').datetimepicker({
            //     format: 'YYYY',
            //     locale: 'vi',
            //     maxDate: new Date()
            // });
            // $('#FROM_DATE').datetimepicker({
            //     format: 'DD/MM/YYYY',
            //     locale: 'vi',
            // });

            // $('#TO_DATE').datetimepicker({
            //     format: 'DD/MM/YYYY',
            //     locale: 'vi',
            // });
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var firstDateString = moment(firstDay).format("DD/MM/YYYY");
            var lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            var lastDateString = moment(lastDay).format("DD/MM/YYYY");

            $("#FROM_DATE").on("dp.change", function (e: any) {
                $('#TO_DATE').data("DateTimePicker").minDate(e.date);
            });
            $("#TO_DATE").on("dp.change", function (e: any) {
                $('#FROM_DATE').data("DateTimePicker").maxDate(e.date);
            });

            $("#TO_DATE").val(lastDateString);
            $("#FROM_DATE").val(firstDateString);
        });

        var date = new Date();
        // $("#input-date").val(moment(date).format('YYYY'));
        this.inputYear = date;
        this.getIocFields();
        this.loadData();
        //this.loadSingleData();

        $(function () {
            var id = "#in-bieu-mau";
            var dialog = $(id).closest(".modal-dialog")[0];
            $(dialog).addClass("modal-dialog-9");
            // set chiều cao cho modal
            $(id).height(window.innerHeight - 270);
            window.onresize = () => {
                $(id).height(window.innerHeight - 270);
            };

            var idDanhSachBieuMau = "#danh-sach-bieu-mau";
            $(idDanhSachBieuMau).height(window.innerHeight - 340);
            window.onresize = () => {
                $(idDanhSachBieuMau).height(window.innerHeight - 340);
            };

            // var idDanhSachXemTruoc = "#danh-sach-xem-truoc";
            // $(idDanhSachXemTruoc).height(window.innerHeight - 300);
            // window.onresize = (e) => {
            //     $(idDanhSachXemTruoc).height(window.innerHeight - 300);
            // };
            //
            var idtable = "#ioc-input-modal";
            $(idtable).height(window.innerHeight - 305);
            window.onresize = () => {
                $(idtable).height(window.innerHeight - 305);
            };
        });
    }
    initScroll() {
        $(document).ready(function () {
            //todo
            // $("#tableContent").tableHeadFixer({ "head": false, "left": 1 });
        });

    }
    showCustom() {
        if (this.showCustomDate) {
            return {
                'display': 'block'
            };
        } else {
            return {
                'display': 'none'
            };

        }

    }

    setWidthPropertyCols() {
        if (this.listPropertyCols.length > 0) {
            var width = 100 / this.listPropertyCols.length;
            return {
                'width': width + '%'
            };
        }
        else {
            return {
                'width': '100%'
            };
        }
    }


    setMaxWidth() {
        if (this.listCol != null && (this.listCol.length + this.listPropertyCols.length + 2) > 5 && (this.listCol.length + this.listPropertyCols.length + 2) <= 10) {
            var maxW = 220 * (this.listCol.length + this.listPropertyCols.length);
            var hong = maxW + 'px';
            return {
                'width': hong, 'max-width': hong
                //'width': maxW +'px' hong dong 30/08/2021
            };
        } else if (this.listCol != null && (this.listCol.length + this.listPropertyCols.length + 2) > 10 && (this.listCol.length + this.listPropertyCols.length + 2) <= 20) {
            var maxW = 250 * (this.listCol.length + this.listPropertyCols.length);
            var hong = maxW + 'px';
            return {
                'width': hong, 'max-width': hong
                //'width': maxW +'px' hong dong 30/08/2021
            };
        } else if (this.listCol != null && (this.listCol.length + this.listPropertyCols.length + 2) > 20 && (this.listCol.length + this.listPropertyCols.length + 2) <= 30) {
            var maxW = 270 * (this.listCol.length + this.listPropertyCols.length);
            var hong = maxW + 'px';
            return {
                'width': hong, 'max-width': hong
                //'width': maxW +'px' hong dong 30/08/2021
            };
        }
        else if (this.listCol != null && (this.listCol.length + this.listPropertyCols.length + 2) > 30) {
            var maxW = 300 * (this.listCol.length + this.listPropertyCols.length);
            var hong = maxW + 'px';
            return {
                'width': hong, 'max-width': hong
                //'width': maxW +'px' hong dong 30/08/2021
            };
        }
        else {
            return {
                'max-width': '100%'
            };

        }
    }

    setPercentWidthSTT() {
        if (this.listCol != null && this.listCol.length > 5) {
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
        if (this.listCol != null && (this.listCol.length + this.listPropertyCols.length) > 5 && (this.listCol.length + this.listPropertyCols.length) <= 10) {
            return {
                'width': '10%' // hồng sửa ngày 30/08/2021 ban đầu là 15%
            };
        } else if (this.listCol != null && (this.listCol.length + this.listPropertyCols.length) > 10 && (this.listCol.length + this.listPropertyCols.length) <= 20) {
            return {
                'width': '8%' // hồng sửa ngày 30/08/2021 ban đầu là 15%
            };
        }
        else if (this.listCol != null && (this.listCol.length + this.listPropertyCols.length) > 20 && (this.listCol.length + this.listPropertyCols.length) <= 30) {
            return {
                'width': '8%' // hồng sửa ngày 30/08/2021 ban đầu là 15%
            };
        }
        else if (this.listCol != null && (this.listCol.length + this.listPropertyCols.length) > 30) {
            return {
                'width': '2%'
            };
        }
        else {
            return {
                'width': '20%' // hồng sửa ngày 30/08/2021 ban đầu là 30%
            };

        }
    }

    getIocFields() {
        var data = {
        };
        this.http.post('IOC/GetListPropertyField', data, (kq: any) => {
            if (kq.Code == 200) {
                this.fields = kq.Result;
                this.fields.unshift({ Name: '--Tất cả lĩnh vực--', Id: null });
            }
        }, () => {
        }
        );
    }

    onChangeField(value: { value: { Id: any; }; }) {
        this.defaultField = { Id: value.value.Id };
        this.loadData();
    }

    onChangeFrequency(value: any) {
        this.defaultFrequency = { Id: value.value.Id };

        if (this.defaultFrequency.Id == 5) {
            this.selectedYear = true;
        }
        else {
            this.selectedYear = false;
        }

        var date = moment(new Date()).format('DD/MM/YYYY');

        // if ($("#input-date").data("DateTimePicker").date() != undefined) {
        //     this.inputDate = $("#input-date").data("DateTimePicker").date().format('YYYY');
        //     if (this.inputDate < this.currentYear) {
        //         date = "31/12/" + this.inputDate;
        //     }
        // }

        this.defaultTime = [];

        this.LoadThoiGian(date);

        this.loadData();

        this.listTongHopDocument = [];
        this.listSelectedDocument = [];
        this.values = [];
        this.listCol = [];
        this.organizations = [];
    }

    onChangeSingle() {
        if (this.selectedIsNotSingle) {
            $("#viewAllDocument").css("display", "none");

            this.defaultFrequency = { Id: 3 }
            if (this.showCustomDate) {
                $("#customDiv").css("display", "block");
            } else {
                $("#customDiv").css("display", "none");
            }
            this.selectedYear = false;
        } else {
            $("#customDiv").css("display", "none");
            $("#viewAllDocument").css("display", "block");
        }

        this.listTongHopDocument = [];
        this.listSelectedDocument = [];
        this.header = "";
        this.headerPrint = "";
        this.values = [];
        this.listCol = [];
        this.defaultTime = [];

        var date = moment(new Date()).format('DD/MM/YYYY');

        if (this.inputYear) {
            this.inputDate = moment(this.inputYear).format('YYYY');
            if (this.inputDate < this.currentYear) {
                date = "31/12/" + this.inputDate;
            }
        }

        this.LoadThoiGian(date);
        this.addCustomDate()
        this.loadData();
    }

    onChangeViewAllDocument() {
        this.listTongHopDocument = [];
        this.listSelectedDocument = [];
        this.header = "";
        this.headerPrint = "";
        this.values = [];
        this.listCol = [];
        this.defaultTime = [];
        this.loadData();
    }

    onChangeDate() {
        var date = moment(new Date()).format('DD/MM/YYYY');

        // if ($("#input-date").data("DateTimePicker").date() != undefined) {
        //     this.inputDate = $("#input-date").data("DateTimePicker").date().format('YYYY');
        //     if (this.inputDate < this.currentYear) {
        //         date = "31/12/" + this.inputDate;
        //     }
        // }
        if (this.inputYear) {
            this.inputDate = moment(this.inputYear).format('YYYY');
            if (this.inputDate < this.currentYear) {
                date = "31/12/" + this.inputDate;
            }
        }
        this.defaultTime = [];
        this.LoadThoiGian(date);
        this.addCustomDate();
    }

    addCustomDate() {
        if (this.selectedIsNotSingle) {
            if (this.times.length > 0 && this.times[0].Id == -1) {
                this.times.splice(0, 1);
            } else {
                this.times.unshift({ Id: -1, Name: "Tùy chỉnh", FromDate: "", ToDate: "" });
            }
        } else {
            if (this.times.length > 0 && this.times[0].Id == -1) {
                this.times.splice(0, 1);
            }
        }
    }

    public loadData() {
        this.isDisabled = true;
        var isNotSingle = this.selectedIsNotSingle == undefined ? false : this.selectedIsNotSingle;
        var isAllDocument = this.selectedAllDocument == undefined ? false : this.selectedAllDocument;
        var fieldId = this.defaultField == undefined ? null : this.defaultField.Id;
        var frequencyId = this.defaultFrequency == undefined ? null : this.defaultFrequency.Id;
        //use dataSearch for packaging the data
        var dataSearch = {
            IsNotSingle: isNotSingle,
            IsAllDocument: isAllDocument,
            FieldId: fieldId,
            FrequencyTypeId: frequencyId,
            IsPagination: false
        };

        this.http.post('IOC/GetListDocumentTemplateByOrgaId_Print', dataSearch, (data1: { Code: number; Result: any; }) => {
            if (data1.Code == 200) {
                this.isDisabled = false;
                this.listDocument = data1.Result;
                this.lengthDocument = this.listDocument.length;
                this.initScroll();
            }
            else {
                this.isDisabled = false;
            }
        }, (error: any) => {
            this.isDisabled = false;
        }
        );
    }

    LoadThoiGian(date: moment.MomentInput) {
        if (this.defaultFrequency != null) {
            // { Id: 2, Name: "Ngày" },
            // { Id: 6, Name: "Tuần" },
            // { Id: 7, Name: "Giữa tháng" },
            // { Id: 3, Name: "Tháng" },
            // { Id: 4, Name: "Quý" },
            // { Id: 5, Name: "Năm" }
            //var date = moment(new Date()).format('DD/MM/YYYY');
            //var prevDate = "31/12/" + moment(date, "DD/MM/YYYY").add('years', -1).year();
            switch (this.defaultFrequency.Id) {
                case 2:
                    var mNumber = moment(date, "DD/MM/YYYY").date();
                    this.times = Array.from(Array(mNumber + 1).keys()).slice(1);
                    this.times = this.times.htcConvert(this.defaultFrequency.Id, date);
                    break;
                case 6:
                    var mNumber = moment(date, "DD/MM/YYYY").week();
                    if (mNumber == 1) {
                        var mNumber = moment(date, "DD/MM/YYYY").add(-7, 'days').week();
                    }
                    this.times = Array.from(Array(mNumber + 1).keys()).slice(1);
                    this.times = this.times.htcConvert(this.defaultFrequency.Id, date);

                    // mNumber = moment(prevDate, "DD/MM/YYYY").week();
                    // if (mNumber == 1) {
                    //     var mNumber = moment(prevDate, "DD/MM/YYYY").add(-7, 'days').week();
                    // }
                    // var prevArr = Array.from(Array(mNumber).keys()).slice(1);
                    // prevArr = prevArr.htcConvert(this.defaultFrequency.Id, prevDate);
                    // this.times = prevArr.concat(this.times);

                    break;
                case 7:
                    var mNumber = 0;
                    if (moment(date, "DD/MM/YYYY").date() > 16) {
                        mNumber = moment(date, "DD/MM/YYYY").month() + 2;
                    } else {
                        mNumber = moment(date, "DD/MM/YYYY").month() + 1;
                    }
                    this.times = Array.from(Array(mNumber + 1).keys()).slice(1);
                    this.times = this.times.htcConvert(this.defaultFrequency.Id, date);

                    // mNumber = 0;
                    // if (moment(prevDate, "DD/MM/YYYY").date() > 16) {
                    //     mNumber = moment(prevDate, "DD/MM/YYYY").month() + 2;
                    // } else {
                    //     mNumber = moment(prevDate, "DD/MM/YYYY").month() + 1;
                    // }
                    // var prevArr = Array.from(Array(mNumber).keys()).slice(1);
                    // prevArr = prevArr.htcConvert(this.defaultFrequency.Id, prevDate);
                    // this.times = prevArr.concat(this.times);
                    break;
                case 3:
                    var mNumber = moment(date, "DD/MM/YYYY").month() + 1;
                    this.times = Array.from(Array(mNumber + 1).keys()).slice(1);
                    this.times = this.times.htcConvert(this.defaultFrequency.Id, date);

                    // mNumber = moment(prevDate, "DD/MM/YYYY").month() + 1;
                    // var prevArr = Array.from(Array(mNumber + 1).keys()).slice(1);
                    // prevArr = prevArr.htcConvert(this.defaultFrequency.Id, prevDate);
                    // this.times = prevArr.concat(this.times);
                    break;
                case 4:
                    var mNumber = moment(date, "DD/MM/YYYY").quarter();
                    this.times = Array.from(Array(mNumber + 1).keys()).slice(1);
                    this.times = this.times.htcConvert(this.defaultFrequency.Id, date);

                    // mNumber = moment(prevDate, "DD/MM/YYYY").quarter();
                    // var prevArr = Array.from(Array(mNumber).keys()).slice(1);
                    // prevArr = prevArr.htcConvert(this.defaultFrequency.Id, prevDate);
                    // this.times = prevArr.concat(this.times);
                    break;
                case 5:
                    var mNumber = moment(date, "DD/MM/YYYY").year();
                    this.times = Array.from(Array(mNumber + 1).keys()).slice(2018);
                    this.times = this.times.htcConvert(this.defaultFrequency.Id, date);
                    break;
            }
            if (this.times && this.times.length > 0) {
                this.defaultSelectTime = this.times[this.times.length - 1];
            }
        }
    }

    // loadSingleData() {
    //     var sendData = {
    //         DocumentTemplateId: this.context.item.Id,
    //         TrueFalse: this.context.item.IsTongHop
    //     }

    //     this.http.post('IOC/GetSingleTongHop', sendData, (data1) => {
    //         if (data1.Code == 200) {
    //             if (data1.Result != null) {
    //                 this.code = data1.Result.Code;
    //                 this.header = data1.Result.Header;
    //                 this.listTongHopDocument = data1.Result.listTongHop;
    //                 this.listSelectedDocument = data1.Result.listTongHop;
    //                 this.LoadOrganizationsByDocumentTemplate(this.listTongHopDocument);
    //             }
    //         }
    //     }, error => {
    //     }
    //     );
    // }

    cancel() {
        this.ref.close();
    }
    data: any = {};

    submit() {
        this.valid = 0;

        if ($("#headerTongHopId").val() == "") {
            $('#headerTongHopIdError').html('Bắt buộc nhập!');
            this.valid++;
        }
        else {
            $('#headerTongHopIdError').html('');
            this.valid = this.valid > 0 ? this.valid : 0;
        }

        if (this.listTongHopDocument.length <= 0) {
            $('#listDocumentError').html('Vui lòng chọn biểu mẫu!');
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
                if (this.selectedIsNotSingle == false) {
                    for (var i = 0; i < list.value.length; i++) {
                        for (var j = 1; j < list.value.length; j++) {
                            if (list.value[i].FrequencyTypeId != list.value[j].FrequencyTypeId) {
                                this.message.add({ severity: 'warning', summary: 'Error', detail: "Mẫu vừa chọn không cùng loại!" });
                                if (intersection.length > 0)
                                    this.listSelectedDocument = intersection
                                return;
                            }
                        }
                    }
                }
                else {
                    this.message.add({ severity: 'warning', summary: 'Error', detail: "Chỉ được chọn 1 mẫu dùng chung!" });
                    if (intersection.length > 0)
                        this.listSelectedDocument = intersection
                    return;
                }
            }
            if (this.selectedIsNotSingle == true) {
                this.header = list.value[0].Name;
                this.headerPrint = list.value[0].Name;
            }
            this.scheduleTaskTypeId = list.value[0].FrequencyTypeId;
            this.listTongHopDocument = list.value;
            var listId = _.filter(this.listSelectedDocument, row => row.Id);
            if (this.selectedIsNotSingle == false) {
                this.LoadOrganizationsByDocumentTemplate(this.listTongHopDocument);
            }
        } else {
            this.listTongHopDocument = [];
            this.values = [];
            this.listCol = [];
            this.organizations = [];
        }
    }

    removeLi(event: any, id: any) {
        this.listTongHopDocument = _.filter(this.listTongHopDocument, row => row.Id != id);
        this.listSelectedDocument = _.filter(this.listSelectedDocument, row => row.Id != id);
        event.target.closest("li").remove();
        if (this.selectedIsNotSingle == false) {
            this.LoadOrganizationsByDocumentTemplate(this.listTongHopDocument);
        }
    }

    values: any = [];
    listCol: any = [];
    listPropertyCols: any = [];

    LoadOrganizationsByDocumentTemplate(listMapValue: any) {
        var data = {
            Json: JSON.stringify(listMapValue)
        }

        this.http.post('IOC/LoadOrganizationsByDocumentTemplate', data, (kq: { Result: { ListIns: string | any[]; } | null; }) => {
            if (kq.Result != null) {
                // Load Đơn vị
                this.organizations = kq.Result.ListIns;
                if (kq.Result.ListIns.length > 0) {
                    this.defaultOrganization = { Id: kq.Result.ListIns[0].Id };
                }
            }
            else {

            }

        }, (error: any) => {

        }
        );
    }

    onChange(event: any) {
        this.defaultSelectTime = event.value;
        if (event != null && event.value.Id == -1) {

            this.showCustomDate = true;
        } else {
            this.showCustomDate = false;
        }
    }

    review() {
        this.valid = 0;
        if (this.listTongHopDocument.length <= 0) {
            $('#listDocumentError').html('Vui lòng chọn biểu mẫu!');
            this.valid++;
        }

        if (this.selectedIsNotSingle == false && this.defaultTime.length <= 0) {
            $('#timesError').html('Vui lòng chọn thời gian!');
            this.valid++;
        }

        if (this.valid <= 0) {
            $('#listDocumentError').html('');
            if (this.selectedIsNotSingle == false) {
                $('#timesError').html('');
            }
            else {
                $('#selectTimesError').html('');
            }

            var frequencyId = this.defaultFrequency == undefined ? null : this.defaultFrequency.Id;

            if (frequencyId == 4) // Quarter
            {
                this.review_Quarter(frequencyId);
            }
            else {
                if (frequencyId == 5) // Year
                {
                    this.review_Year(frequencyId);
                }
                else {
                    if (frequencyId == 2) // Date
                    {
                        this.review_Day(frequencyId);
                    }
                    else {
                        this.review_Month(frequencyId);
                    }
                }
            }
        }
    }

    review_Month(frequencyId: any) {

        var selectTime = this.defaultSelectTime;
        var listTime = this.defaultTime;
        var isGroup = this.selectedGroupProperty == undefined ? false : this.selectedGroupProperty;

        this.indexList = isGroup;

        var listMapValue = this.listTongHopDocument;

        var data;



        if (this.selectedIsNotSingle == false) {
            data = {
                OrganizationId: null,
                FrequencyTypeId: frequencyId,
                Year: moment(this.inputYear).format('YYYY'),
                JsonTime: JSON.stringify(listTime),
                IsGroup: isGroup,
                Json: JSON.stringify(listMapValue)
            }
            this.isDisabled = true;
            this.http.post('IOC/PrintPreviewTemplateSingle', data, (kq: { Result: { PropertyIdsNew: any; ListCols: any; ListPropertyCols: any; } | null; }) => {
                if (kq.Result != null) {
                    this.isDisabled = false;
                    this.values = kq.Result.PropertyIdsNew;
                    // if (kq.Result.PropertyIdsNew) {

                    //     // const ages = kq.Result.PropertyIdsNew.reduce((a, {PropertyName, age}) => (a[id] = (a[id] || 0) + +age, a), {});
                    //     var tmp = [];

                    //     kq.Result.PropertyIdsNew.forEach(element => {
                    //         kq.Result.PropertyIdsNew.forEach(element1 => {
                    //             if (element.PropertyName == element1.PropertyName) {
                    //                foreach
                    //             }
                    //         });


                    //     });
                    // }
                    this.listCol = kq.Result.ListCols;
                    this.listPropertyCols = kq.Result.ListPropertyCols;
                    this.initScroll();
                }
                else {
                    this.isDisabled = false;
                }

            }, (error: any) => {
                this.isDisabled = false;
            }
            );
        }
        else {
            if (this.showCustomDate) {
                selectTime = {
                    Id: -1,
                    FromDate: $("#FROM_DATE").val(),
                    ToDate: $("#TO_DATE").val()
                }
            }
            data = {
                FrequencyTypeId: frequencyId,
                Year: this.inputDate,
                JsonSelectTime: JSON.stringify(selectTime),
                IsGroup: isGroup,
                Json: JSON.stringify(listMapValue)
            }
            this.isDisabled = true;
            this.http.post('IOC/PrintPreviewTemplateNotSingle', data, (kq: { Result: { PropertyIdsNew: any; ListCols: any; ListPropertyCols: any; } | null; }) => {
                if (kq.Result != null) {
                    this.isDisabled = false;
                    this.values = kq.Result.PropertyIdsNew;
                    this.listCol = kq.Result.ListCols;
                    this.listPropertyCols = kq.Result.ListPropertyCols;
                    this.initScroll();
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

    review_Quarter(frequencyId: any) {
        var organizationId = this.defaultOrganization == undefined ? null : this.defaultOrganization.Id;

        if ($("#input-date").data("DateTimePicker").date() != undefined) {
            this.inputDate = $("#input-date").data("DateTimePicker").date().format('YYYY');
        }
        var selectTime = this.defaultSelectTime;
        var listTime = this.defaultTime;
        var isGroup = this.selectedGroupProperty == undefined ? false : this.selectedGroupProperty;

        this.indexList = isGroup;

        var listMapValue = this.listTongHopDocument;

        var data;

        if (this.selectedIsNotSingle == false) {
            data = {
                OrganizationId: organizationId,
                FrequencyTypeId: frequencyId,
                Year: this.inputDate,
                JsonTime: JSON.stringify(listTime),
                IsGroup: isGroup,
                Json: JSON.stringify(listMapValue)
            }
            this.isDisabled = true;
            this.http.post('IOC/PrintPreviewTemplateSingle_Quarter', data, (kq: { Result: { PropertyIdsNew: any; ListCols: any; ListPropertyCols: any; } | null; }) => {
                if (kq.Result != null) {
                    this.isDisabled = false;
                    this.values = kq.Result.PropertyIdsNew;
                    this.listCol = kq.Result.ListCols;
                    this.listPropertyCols = kq.Result.ListPropertyCols;
                    this.initScroll();
                }
                else {
                    this.isDisabled = false;
                }

            }, (error: any) => {
                this.isDisabled = false;
            }
            );
        }
        else {
            if (this.showCustomDate) {
                selectTime = {
                    Id: -1,
                    FromDate: $("#FROM_DATE").val(),
                    ToDate: $("#TO_DATE").val()
                }
            }
            data = {
                FrequencyTypeId: frequencyId,
                Year: this.inputDate,
                JsonSelectTime: JSON.stringify(selectTime),
                IsGroup: isGroup,
                Json: JSON.stringify(listMapValue)
            }
            this.isDisabled = true;
            this.http.post('IOC/PrintPreviewTemplateNotSingle_Quarter', data, (kq: { Result: { PropertyIdsNew: any; ListCols: any; ListPropertyCols: any; } | null; }) => {
                if (kq.Result != null) {
                    this.isDisabled = false;
                    this.values = kq.Result.PropertyIdsNew;
                    this.listCol = kq.Result.ListCols;
                    this.listPropertyCols = kq.Result.ListPropertyCols;
                    this.initScroll();
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

    review_Year(frequencyId: any) {
        var organizationId = this.defaultOrganization == undefined ? null : this.defaultOrganization.Id;

        if ($("#input-date").data("DateTimePicker").date() != undefined) {
            this.inputDate = $("#input-date").data("DateTimePicker").date().format('YYYY');
        }
        var selectTime = this.defaultSelectTime;
        var listTime = this.defaultTime;
        var isGroup = this.selectedGroupProperty == undefined ? false : this.selectedGroupProperty;

        this.indexList = isGroup;

        var listMapValue = this.listTongHopDocument;

        var data;

        if (this.selectedIsNotSingle == false) {
            data = {
                OrganizationId: organizationId,
                FrequencyTypeId: frequencyId,
                Year: this.inputDate,
                JsonTime: JSON.stringify(listTime),
                IsGroup: isGroup,
                Json: JSON.stringify(listMapValue)
            }
            this.isDisabled = true;
            this.http.post('IOC/PrintPreviewTemplateSingle_Year', data, (kq: { Result: { PropertyIdsNew: any; ListCols: any; ListPropertyCols: any; } | null; }) => {
                if (kq.Result != null) {
                    this.isDisabled = false;
                    this.values = kq.Result.PropertyIdsNew;
                    this.listCol = kq.Result.ListCols;
                    this.listPropertyCols = kq.Result.ListPropertyCols;
                    this.initScroll();
                }
                else {
                    this.isDisabled = false;
                }

            }, (error: any) => {
                this.isDisabled = false;
            }
            );
        }
        else {
            if (this.showCustomDate) {
                selectTime = {
                    Id: -1,
                    FromDate: $("#FROM_DATE").val(),
                    ToDate: $("#TO_DATE").val()
                }
            }
            data = {
                FrequencyTypeId: frequencyId,
                Year: this.inputDate,
                JsonSelectTime: JSON.stringify(selectTime),
                IsGroup: isGroup,
                Json: JSON.stringify(listMapValue)
            }
            this.isDisabled = true;
            this.http.post('IOC/PrintPreviewTemplateNotSingle_Year', data, (kq: { Result: { PropertyIdsNew: any; ListCols: any; ListPropertyCols: any; } | null; }) => {
                if (kq.Result != null) {
                    this.isDisabled = false;
                    this.values = kq.Result.PropertyIdsNew;
                    this.listCol = kq.Result.ListCols;
                    this.listPropertyCols = kq.Result.ListPropertyCols;
                    this.initScroll();
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

    review_Day(frequencyId: any) {
        var organizationId = this.defaultOrganization == undefined ? null : this.defaultOrganization.Id;

        if ($("#input-date").data("DateTimePicker").date() != undefined) {
            this.inputDate = $("#input-date").data("DateTimePicker").date().format('YYYY');
        }
        var selectTime = this.defaultSelectTime;
        var listTime = this.defaultTime;
        var isGroup = this.selectedGroupProperty == undefined ? false : this.selectedGroupProperty;

        this.indexList = isGroup;

        var listMapValue = this.listTongHopDocument;

        var data;

        if (this.selectedIsNotSingle == false) {
            data = {
                OrganizationId: organizationId,
                FrequencyTypeId: frequencyId,
                Year: this.inputDate,
                JsonTime: JSON.stringify(listTime),
                IsGroup: isGroup,
                Json: JSON.stringify(listMapValue)
            }
            this.isDisabled = true;
            this.http.post('IOC/PrintPreviewTemplateSingle_Day', data, (kq: { Result: { PropertyIdsNew: any; ListCols: any; ListPropertyCols: any; } | null; }) => {
                if (kq.Result != null) {
                    this.isDisabled = false;
                    this.values = kq.Result.PropertyIdsNew;
                    this.listCol = kq.Result.ListCols;
                    this.listPropertyCols = kq.Result.ListPropertyCols;
                    this.initScroll();
                }
                else {
                    this.isDisabled = false;
                }

            }, (error: any) => {
                this.isDisabled = false;
            }
            );
        }
        else {
            if (this.showCustomDate) {
                selectTime = {
                    Id: -1,
                    FromDate: $("#FROM_DATE").val(),
                    ToDate: $("#TO_DATE").val()
                }
            }
            data = {
                FrequencyTypeId: frequencyId,
                Year: this.inputDate,
                JsonSelectTime: JSON.stringify(selectTime),
                IsGroup: isGroup,
                Json: JSON.stringify(listMapValue)
            }
            this.isDisabled = true;
            this.http.post('IOC/PrintPreviewTemplateNotSingle_Day', data, (kq: { Result: { PropertyIdsNew: any; ListCols: any; ListPropertyCols: any; } | null; }) => {
                if (kq.Result != null) {
                    this.isDisabled = false;
                    this.values = kq.Result.PropertyIdsNew;
                    this.listCol = kq.Result.ListCols;
                    this.listPropertyCols = kq.Result.ListPropertyCols;
                    this.initScroll();
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

    // print() {
    //     $('#printSelector').printThis();
    // }

    generateExcel() {

        var fontName = "Arial";

        if (this.values.length <= 0) {
            this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng chọn biểu mẫu và nhấn xem trước khi in!" });
        }
        else {
            if (this.listPropertyCols.length > 1) {
                //Excel Title, Header, Data
                const title = this.headerPrint;
                const header = ["#", "Tên chỉ số", "Đơn vị"]

                for (var i = 0; i < this.listCol.length; i++) {
                    header.push(this.listCol[i]);
                    for (var j = 0; j < this.listPropertyCols.length - 1; j++) {
                        header.push("");
                    }
                }

                //Create workbook and worksheet
                // let workbook = new Excel.Workbook();
                let workbook = new Excel.Workbook();;


                let worksheet = workbook.addWorksheet('Report');
                //Add Row and formatting
                let titleRow = worksheet.addRow([title]);
                titleRow.font = { name: fontName, family: 4, size: 18, bold: true }
                titleRow.alignment = { horizontal: "center", vertical: "middle", wrapText: true }

                worksheet.addRow([]);
                // Cột cuối cùng
                let colTemp = worksheet.getColumn((this.listCol.length * this.listPropertyCols.length) + 3);
                // Merge Tiêu đề
                worksheet.mergeCells(`A1:${colTemp.letter}1`);

                //Blank Row 
                worksheet.addRow([]);
                //Add Header Row
                let headerRow = worksheet.addRow(header);
                headerRow.font = { name: fontName, family: 4, size: 13, bold: true }
                // Cell Style : Fill and Border
                headerRow.eachCell((cell: any, number: any) => {
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true }
                })

                const header_1 = ["", "", ""]

                for (var i = 0; i < this.listCol.length; i++) {
                    for (var j = 0; j < this.listPropertyCols.length; j++) {
                        header_1.push(this.listPropertyCols[j]);
                    }
                }

                //Add Header Row
                let headerRow_1 = worksheet.addRow(header_1);
                headerRow_1.font = { name: fontName, family: 4, size: 13, bold: true }
                // Cell Style : Fill and Border
                headerRow_1.eachCell((cell: any, number: any) => {
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true }
                })

                // Merge 2 tiêu đề
                worksheet.mergeCells(`A4:A5`);
                worksheet.mergeCells(`B4:B5`);
                worksheet.mergeCells(`C4:C5`);

                for (var i = 0; i < this.listCol.length; i++) {
                    // Số cột cần merge
                    var numberMerge = this.listPropertyCols.length;
                    // Cột Header
                    let colStartTemp = worksheet.getColumn(4 + (i * numberMerge));
                    let colEndTemp = worksheet.getColumn(4 + (i * numberMerge) + numberMerge - 1);
                    // Merge Tiêu đề
                    worksheet.mergeCells(`${colStartTemp.letter}4:${colEndTemp.letter}4`);
                }

                // DATA
                const data = [];

                for (var i = 0; i < this.values.length; i++) {
                    const temp = [];
                    if (this.values[i].IsDocumentTemplate) {
                        temp.push(this.values[i].DocumentTemplateName);
                    }
                    else {
                        if (this.selectedGroupProperty) {
                            temp.push(i + 1);
                        }
                        else {
                            temp.push(i);
                        }

                        temp.push(this.values[i].PropertyName);

                        temp.push(this.values[i].UnitName[0]);

                        for (var j = 0; j < this.values[i].ListMonth.length; j++) {
                            for (var k = 0; k < this.values[i].ListMonth[j].ListMapValueId.length; k++) {
                                if (this.values[i].ListMonth[j].ListMapValueId[k].NumberValue == null) {
                                    temp.push("");
                                }
                                else {
                                    temp.push(this.values[i].ListMonth[j].ListMapValueId[k].NumberValue);
                                }
                            }
                        }

                        for (var j = 0; j < this.values[i].TotalValueLuyKe.length; j++) {
                            if (this.values[i].TotalValueLuyKe[j].TotalValue == null) {
                                temp.push("");
                            }
                            else {
                                temp.push(this.values[i].TotalValueLuyKe[j].TotalValue);
                            }
                        }

                    }

                    data.push(temp);
                }

                // Add Data and Conditional Formatting
                data.forEach(d => {
                    let row = worksheet.addRow(d);

                    if (d.length == 1) {

                        row.eachCell((cell: any, number: any) => {
                            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            cell.font = { name: fontName, family: 4, size: 12, bold: true }
                        })

                        worksheet.mergeCells(`A${row.number}:${colTemp.letter}${row.number}`);
                    }
                    else {
                        row.eachCell((cell: any, number: number) => {
                            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            cell.font = { name: fontName, family: 4, size: 12, bold: false }
                            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                            if (number == 2) {
                                cell.alignment = { vertical: 'middle', wrapText: true };
                            }
                        })

                    }
                }
                );

                // Set lại độ rộng các cột
                worksheet.columns[0].width = 5;

                for (let i = 1; i < worksheet.columns.length; i += 1) {
                    // let dataMax = 0;
                    // const column = worksheet.columns[i];
                    // if(column != null && column != undefined){
                    //     for (let j = 1; j < column.values.length; j += 1) {
                    //         if (column.values[j] != undefined) {
                    //             const columnLength = column.values[j].length;
                    //             if (columnLength > dataMax) {
                    //                 dataMax = columnLength;
                    //             }
                    //         }
                    //     }
                    //     // Cột tiêu chí
                    //     if (i == 1) {
                    //         dataMax = dataMax > 40 ? 40 : dataMax;
                    //         column.width = dataMax < 20 ? 20 : dataMax;
                    //     }
                    //     else // Các cột dữ liệu
                    //     {
                    //         dataMax = dataMax > 15 ? 15 : dataMax;
                    //         column.width = dataMax < 10 ? 10 : dataMax;
                    //     }
                    // }

                }

                worksheet.addRow([]);

                //Generate Excel File with given name
                workbook.xlsx.writeBuffer().then((data: BlobPart) => {
                    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    fs.saveAs(blob, 'Report.xlsx');
                })
            }
            else {
                //Excel Title, Header, Data
                const title = this.headerPrint;
                const header = ["#", "Tên chỉ số", "Đơn vị"]

                for (var i = 0; i < this.listCol.length; i++) {
                    header.push(this.listCol[i]);
                }

                const data = [];

                for (var i = 0; i < this.values.length; i++) {
                    const temp = [];
                    if (this.values[i].IsDocumentTemplate) {
                        temp.push(this.values[i].DocumentTemplateName);
                    }
                    else {
                        if (this.selectedGroupProperty) {
                            temp.push(i + 1);
                        }
                        else {
                            for (var l = 0; l < this.values[i].CodeId.length; l++) {
                                temp.push(this.values[i].CodeId[l]);
                            }
                        }

                        temp.push(this.values[i].PropertyName);

                        for (var m = 0; m < this.values[i].UnitName.length; m++) {
                            temp.push(this.values[i].UnitName[m]);
                        }


                        for (var j = 0; j < this.values[i].ListMonth.length; j++) {
                            for (var k = 0; k < this.values[i].ListMonth[j].ListMapValueId.length; k++) {
                                if (this.values[i].ListMonth[j].ListMapValueId[k].NumberValue == null) {
                                    temp.push("");
                                }
                                else {
                                    temp.push(this.values[i].ListMonth[j].ListMapValueId[k].NumberValue);
                                }
                            }
                        }
                        temp.push(this.values[i].TotalValue);
                    }

                    data.push(temp);
                }

                //Create workbook and worksheet
                let workbook = new Excel.Workbook();
                let worksheet = workbook.addWorksheet('Report');
                //Add Row and formatting
                let titleRow = worksheet.addRow([title]);
                titleRow.font = { name: fontName, family: 4, size: 18, bold: true }
                titleRow.alignment = { horizontal: "center", vertical: "middle", wrapText: true }

                worksheet.addRow([]);
                // Cột cuối cùng
                let colTemp = worksheet.getColumn(this.listCol.length + 3);
                // Merge Tiêu đề
                worksheet.mergeCells(`A1:${colTemp.letter}1`);

                //Blank Row 
                worksheet.addRow([]);
                //Add Header Row
                let headerRow = worksheet.addRow(header);
                headerRow.font = { name: fontName, family: 4, size: 13, bold: true }
                // Cell Style : Fill and Border
                headerRow.eachCell((cell: any, number: any) => {
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true }
                })

                // Add Data and Conditional Formatting
                data.forEach(d => {
                    let row = worksheet.addRow(d);

                    if (d.length == 1) {

                        row.eachCell((cell: any, number: any) => {
                            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            cell.font = { name: fontName, family: 4, size: 12, bold: true }
                        })

                        worksheet.mergeCells(`A${row.number}:${colTemp.letter}${row.number}`);
                    }
                    else {
                        row.eachCell((cell: any, number: any) => {
                            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            cell.font = { name: fontName, family: 4, size: 12, bold: false }
                            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                            if (number == 2) {
                                cell.alignment = { vertical: 'middle', wrapText: true };
                            }
                        })
                    }
                }
                );

                // Set lại độ rộng các cột
                worksheet.columns[0].width = 5;

                for (let i = 1; i < worksheet.columns.length; i += 1) {
                    let dataMax = 0;
                    const column = worksheet.columns[i];
                    if (column && column.values && column.values.length > 0) {
                        for (let j = 1; j < column.values.length; j += 1) {
                            const columnLength = _.get(column, `values[${j}].length`);
                            if (columnLength > dataMax) {
                                dataMax = columnLength;
                            }
                        }
                        // Cột tiêu chí
                        if (i == 1) {
                            dataMax = dataMax > 40 ? 40 : dataMax;
                            column.width = dataMax < 20 ? 20 : dataMax;
                        }
                        else // Các cột dữ liệu
                        {
                            dataMax = dataMax > 15 ? 15 : dataMax;
                            column.width = dataMax < 10 ? 10 : dataMax;
                        }
                    }

                }

                worksheet.addRow([]);

                //Generate Excel File with given name
                workbook.xlsx.writeBuffer().then((data: any) => {
                    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    fs.saveAs(blob, 'Report.xlsx');
                })
            }
        }
    }

    changeHeader() {
        this.headerPrint = this.header;
    }

    onChangeOrganizations(value: { value: { Id: any; }; }) {
        this.defaultOrganization = { Id: value.value.Id };
    }
    onChangeCustomFromDate() {

    }
    onChangeCustomToDate() {

    }
}
