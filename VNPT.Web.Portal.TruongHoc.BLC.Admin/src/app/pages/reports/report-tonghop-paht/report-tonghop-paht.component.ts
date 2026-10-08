import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage, HttpService } from 'src/app/services';
import { MessageService } from 'primeng/api';

import moment from 'moment';
import { ResultCode, ResultModel } from 'src/app/models';

declare var Stimulsoft: any;

@Component({
  standalone: false,
  selector: 'app-report-tonghop-paht',
  templateUrl: './report-tonghop-paht.component.html',
  styleUrls: ['./report-tonghop-paht.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportTongHopPAHTComponent extends BasePage {
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
            "Code": "patht",
            "UnitId": this.unit,
            "FromDate": moment(this.dateStart, "DD/MM/YYYY").format("DD/MM/YYYY"),
            "ToDate": moment(this.dateEnd, "DD/MM/YYYY").format("DD/MM/YYYY"),
            "Status": null,
            "UnitCode": this.location
        };

        this.http.post('Report/Summary', data,
            (res: any) => {
                if (res.Code === 200) {
                    this.item = res.Result;
                    this.viewer = new Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
                    this.report = new Stimulsoft.Report.StiReport();
                    var total = 0;
                    var lstTotal: any[] = [];
                    if(res.Result != null && res.Result.Data != null && res.Result.Data.length > 0) {
                        res.Result.Data.forEach((element: any) => {
                            total = 0;
                            element.Fields.forEach((element2: any) => {
                                total += element2.Sum;
                            });
                            lstTotal.push(total);
                        });
                    }
                    var lstData:any[] = [];
                    var lstitem = {UnitName: '', TotalCounter: 0, FieldName:'', All: 0, Handled: 0, HandledPer: 0, Handling: 0, HandlingPer: 0, NoHandling: 0, NoHandlingPer: 0, EndHandling: 0, EndHandlingPer: 0, Incorrect: 0, IncorrectPer: 0};
                    if(res.Result != null && res.Result.Data != null && res.Result.Data.length > 0) {
                        res.Result.Data.forEach((element: any, index: any) => {
                            element.Fields.forEach((element2: any) => {
                                lstitem = {UnitName: element.Name, TotalCounter: lstTotal[index], FieldName: element2.FieldName, All: element2.Sum, Handled: element2.DaXuLy.Sum, HandledPer: element2.Sum != 0 ? this.percentNumber(element2.DaXuLy.Sum/element2.Sum) : 0, Handling: element2.DangXuLy.Sum, HandlingPer: element2.Sum != 0 ? this.percentNumber(element2.DangXuLy.Sum/element2.Sum) : 0, NoHandling: element2.ChuaXuLy.Sum, NoHandlingPer: element2.Sum != 0 ? this.percentNumber(element2.ChuaXuLy.Sum/element2.Sum) : 0, EndHandling: element2.DaKetThuc.Sum, EndHandlingPer: element2.Sum != 0 ? this.percentNumber(element2.DaKetThuc.Sum/element2.Sum) : 0, Incorrect: element2.KhongDung.Sum, IncorrectPer: element2.Sum != 0 ? this.percentNumber(element2.KhongDung.Sum/element2.Sum) : 0  }
                                lstData.push(lstitem);
                            });
                        });
                    }
                    
                    this.report.loadFile('assets/reports/ThongKeTyLePATHT.mrt');
                    
                    var dataSet = new Stimulsoft.System.Data.DataSet("Data");  
                    var dataj = JSON.stringify(lstData);
                    dataSet.readJson(dataj);
                    this.report.dictionary.databases.clear();
                    
                    this.report.dictionary.variables.getByName("header").valueObject = this.item.Infor.Header.toUpperCase();

                    this.report.dictionary.variables.getByName("tungay").valueObject = moment(this.dateStart, "DD/MM/YYYY").format("DD/MM/YYYY");
                    this.report.dictionary.variables.getByName("denngay").valueObject = moment(this.dateEnd, "DD/MM/YYYY").format("DD/MM/YYYY");
                    this.report.dictionary.variables.getByName("title1").valueObject = "Đơn vị: ";
                    this.report.dictionary.variables.getByName("title2").valueObject = "Lĩnh vực";
                    this.report.dictionary.variables.getByName("TitleReport").valueObject = "THỐNG KÊ TỶ LỆ PHẢN ÁNH TẠI HIỆN TRƯỜNG";
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
}
