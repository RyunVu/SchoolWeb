import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage, HttpService } from 'src/app/services';
import { MessageService } from 'primeng/api';

import * as moment from 'moment';
import { ResultCode, ResultModel } from 'src/app/models';

declare var Stimulsoft: any;

@Component({
  selector: 'app-report-chitiet-pamc',
  templateUrl: './report-chitiet-pamc.component.html',
  styleUrls: ['./report-chitiet-pamc.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportChiTietPAMCComponent extends BasePage {
    useQllt: any;

    item: any;
    dateStart: any;
    startDateInput: any;
    
    dateEnd: any;
    endDateInput: any;

    unit: any;
    unitInput: any;
    units: any[] = [];

    location: any;
    locations: any[] = [];

    fields: any[] = [];
    field: any;
    fieldInput: any;

    statuses = [
        { Id: null, Name: 'Chọn tất cả'},
        { Id: 0, Name: 'Chưa xử lý'},
        { Id: 1, Name: 'Đang xử lý'},
        { Id: 2, Name: 'Đã kết thúc'},
        { Id: 3, Name: 'Quá hạn xử lý'},
        { Id: 4, Name: 'Không đúng'},
        { Id: 5, Name: 'Đã xử lý'},
        { Id: 6, Name: 'Đã phát hành'},
        { Id: 7, Name: 'Chờ duyệt phát hành'},
    ];
    statusInput: any;
    status: any;

    viewer: any = new Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
    report: any = new Stimulsoft.Report.StiReport();
    options = new Stimulsoft.Viewer.StiViewerOptions();
    constructor(
        public router: Router,
        public http: HttpService,
        public route: ActivatedRoute,
        public toastr: ToastrService,
        public formBuilder: FormBuilder,
        public message: MessageService,
    ) {
        super(router, route, http, message);
        
        this.viewer = new Stimulsoft.Viewer.StiViewer(this.options, 'StiViewer', false);
        this.startDateInput = moment().format("01/MM/YYYY");
        this.endDateInput = moment().format("DD/MM/YYYY");

    }
    onInit() {
    }

    loadPage() {
        this.loadLocations();
    }
   
    search(){
        this.dateStart = this.startDateInput;
        this.dateEnd = this.endDateInput;
        this.unit = this.unitInput;
        this.status = this.statusInput;
        this.field = this.fieldInput;
        this.loadData();
    }

    public loadData() {
        if (this.dateStart == null || this.dateStart == "") {
            this.toastr.error('Thiếu trường "Từ ngày"', 'Cảnh báo', {
              timeOut: 3000,
            });
            return;
        }
        if (this.dateEnd == null || this.dateEnd == "") {
            this.toastr.error('Thiếu trường "Đến ngày"', 'Cảnh báo', {
              timeOut: 3000,
            });
            return;
        }
        const data = {
            "Code": "pamc",
            // "UnitId": this.unit,
            // "FieldId": this.field,
            "UnitId": "",
            "FieldId": "",
            "FromDate": moment(this.dateStart, "DD/MM/YYYY").format("DD/MM/YYYY"),
            "ToDate":  moment(this.dateEnd, "DD/MM/YYYY").format("DD/MM/YYYY"),
            "Status": this.status,
            "UnitCode": this.location
        };

        this.http.post('Report/FeedbackMcs', data,
            (res: any) => {
                if (res.Code === 200) {
                    this.item = res.Result;
                    this.viewer = new Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
                    this.report = new Stimulsoft.Report.StiReport();
                    var lstData: any[] = [];
                    var lstitem = {CounterName: '', CodeNo: '', MaHoSo: '', TenNguoiNop: '', FieldName: '', Content: '', DateCreate: '', TinhTrangXl: ''};
                    if(res.Result != null && res.Result.Data != null && res.Result.Data.length > 0) {
                        res.Result.Data.forEach((element: any) => {
                            element.Feedbacks.forEach((element2: any) => {
                                lstitem = { CounterName: element.Name, CodeNo: element2.No, MaHoSo: element2.DocumentId, TenNguoiNop: element2.TenNguoiNop, FieldName: element2.FieldName, Content: element2.Content, DateCreate: element2.CreateDate, TinhTrangXl: element2.StatusName  }
                                lstData.push(lstitem);
                            });
                        });
                    }
                    
                    this.report.loadFile('assets/reports/BaoCaoChiTietPAMCQH.mrt');
                    
                    var dataSet = new Stimulsoft.System.Data.DataSet("Data");  
                    var dataj = JSON.stringify(lstData);
                    dataSet.readJson(dataj);
                    this.report.dictionary.databases.clear();
                    
                    this.report.dictionary.variables.getByName("header").valueObject = this.item.Infor.Header.toUpperCase();

                    this.report.dictionary.variables.getByName("tungay").valueObject = moment(this.dateStart, "DD/MM/YYYY").format("DD/MM/YYYY");
                    this.report.dictionary.variables.getByName("denngay").valueObject = moment(this.dateEnd, "DD/MM/YYYY").format("DD/MM/YYYY");
                    this.report.dictionary.variables.getByName("title1").valueObject = "Đơn vị: ";
                    this.report.dictionary.variables.getByName("title2").valueObject = "Lĩnh vực";
                    this.report.dictionary.variables.getByName("TitleReport").valueObject = "BÁO CÁO CHI TIẾT PHẢN ÁNH TẠI MỘT CỬA";
                    this.report.dictionary.variables.getByName("nguoilap").valueObject = this.item.Infor.UserName.toUpperCase();
                    this.report.regData("Data", "Data", dataSet);  
                    this.report.dictionary.synchronize(); 
                    this.viewer.report = this.report;
                    this.viewer.renderHtml('viewReport');
                } else {
                }
            },
            (error: any) => {
                this.toastr.error('Đã có lỗi xảy ra!', 'Lỗi');
            });
    }

    percentNumber(number: any) {
        return parseFloat((number*100).toFixed(1));
    }

    // detailReport(){
    //     var url = window.location.origin+"/#/bao-cao-chi-tiet-patht";
    //     window.open(url, '_blank');
    // }

    loadLocations() {
        this.http.post("unit/districts", {
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.locations = result.Result;
                this.location = this.locations[1].UnitCode;

                this.loadUnits();
                this.loadFields();
            }
        }, () => {
        });
    }

    selectLocation(event: any) {
        this.unit = null;
        this.units = [];
        this.loadUnits();
    }

    loadUnits() {
        this.http.post("FeedbackAdmin/units", {
            "UnitCode": this.location
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;

                this.units.unshift({
                    Id: null,
                    Name: "Tất cả"
                })
            }
        }, () => {
        });
    }

    loadFields() {
        this.http.post("FeedbackAdmin/Fields", {
            "UnitCode": this.location
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.fields = result.Result;

                this.fields.unshift({
                    Id: null,
                    Name: "Tất cả"
                })
            }
        }, () => {
        });
    }
}
