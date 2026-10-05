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
  selector: 'app-report-quahan-tonghop-paht',
  templateUrl: './report-quahan-tonghop-paht.component.html',
  styleUrls: ['./report-quahan-tonghop-paht.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportQuaHanTongHopPAHTComponent extends BasePage {
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
                    var lstitem = {UnitName: '', TotalCounter: 0, FieldName:'', All: 0, 
                                    QH_Handled: 0, QH_HandledPer: 0, DH_Handled: 0, DH_HandledPe: 0, 
                                    QH_Handling: 0, QH_HandlingPer: 0, DH_Handling: 0, DH_HandlingPer: 0,
                                    QH_NoHandling: 0, QH_NoHandlingPer: 0, DH_NoHandling: 0, DH_NoHandlingPer: 0,
                                    QH_EndHandling: 0, QH_EndHandlingPer: 0, DH_EndHandling: 0, DH_EndHandlingPer: 0,
                                    QH_ChoDuyetPhatHanh: 0, QH_ChoDuyetPhatHanhPer: 0, DH_ChoDuyetPhatHanh: 0, DH_ChoDuyetPhatHanhPer: 0,
                                    QH_DaPhatHanh: 0, QH_DaPhatHanhPer: 0, DH_DaPhatHanh: 0, DH_DaPhatHanhPer: 0,
                                    Incorrect: 0, IncorrectPer: 0,
                                    Duplicated: 0, DuplicatedPer: 0};
                    if(res.Result != null && res.Result.Data != null && res.Result.Data.length > 0) {
                        res.Result.Data.forEach((element: any, index: any) => {
                            element.Fields.forEach((element2: any) => {
                                lstitem = {UnitName: element.Name, TotalCounter: lstTotal[index], FieldName: element2.FieldName, All: element2.Sum,
                                            QH_Handled: element2.DaXuLy.QuaHan, QH_HandledPer: element2.Sum != 0 ? this.percentNumber(element2.DaXuLy.QuaHan/element2.DaXuLy.Sum) : 0,
                                            DH_Handled: element2.DaXuLy.TrongHan, DH_HandledPe: element2.Sum != 0 ? this.percentNumber(element2.DaXuLy.TrongHan/element2.DaXuLy.Sum) : 0,
                                            QH_Handling: element2.DangXuLy.QuaHan, QH_HandlingPer: element2.Sum != 0 ? this.percentNumber(element2.DangXuLy.QuaHan/element2.DangXuLy.Sum) : 0,
                                            DH_Handling: element2.DangXuLy.TrongHan, DH_HandlingPer: element2.Sum != 0 ? this.percentNumber(element2.DangXuLy.TrongHan/element2.DangXuLy.Sum) : 0,
                                            QH_NoHandling: element2.ChuaXuLy.QuaHan, QH_NoHandlingPer: element2.Sum != 0 ? this.percentNumber(element2.ChuaXuLy.QuaHan/element2.ChuaXuLy.Sum) : 0,
                                            DH_NoHandling: element2.ChuaXuLy.TrongHan, DH_NoHandlingPer: element2.Sum != 0 ? this.percentNumber(element2.ChuaXuLy.TrongHan/element2.ChuaXuLy.Sum) : 0,
                                            QH_EndHandling: element2.DaKetThuc.QuaHan, QH_EndHandlingPer: element2.Sum != 0 ? this.percentNumber(element2.DaKetThuc.QuaHan/element2.DaKetThuc.Sum) : 0,
                                            DH_EndHandling: element2.DaKetThuc.TrongHan, DH_EndHandlingPer: element2.Sum != 0 ? this.percentNumber(element2.DaKetThuc.TrongHan/element2.DaKetThuc.Sum) : 0,
                                            QH_ChoDuyetPhatHanh: element2.ChoDuyetPhatHanh.QuaHan, QH_ChoDuyetPhatHanhPer: element2.Sum != 0 ? this.percentNumber(element2.ChoDuyetPhatHanh.QuaHan/element2.ChoDuyetPhatHanh.Sum) : 0,
                                            DH_ChoDuyetPhatHanh: element2.ChoDuyetPhatHanh.TrongHan, DH_ChoDuyetPhatHanhPer: element2.Sum != 0 ? this.percentNumber(element2.ChoDuyetPhatHanh.TrongHan/element2.ChoDuyetPhatHanh.Sum) : 0,
                                            QH_DaPhatHanh: element2.DaPhatHanh.QuaHan, QH_DaPhatHanhPer: element2.Sum != 0 ? this.percentNumber(element2.DaPhatHanh.QuaHan/element2.DaPhatHanh.Sum) : 0,
                                            DH_DaPhatHanh: element2.DaPhatHanh.TrongHan, DH_DaPhatHanhPer: element2.Sum != 0 ? this.percentNumber(element2.DaPhatHanh.TrongHan/element2.DaPhatHanh.Sum) : 0,
                                            Incorrect: element2.KhongDung.Sum, IncorrectPer: element2.Sum != 0 ? this.percentNumber(element2.KhongDung.Sum/element2.Sum) : 0,
                                            Duplicated: element2.Trung.Sum, DuplicatedPer: element2.Sum != 0 ? this.percentNumber(element2.Trung.Sum/element2.Sum) : 0  }
                                lstData.push(lstitem);
                            });
                        });
                    }
                    console.log(lstData);
                    this.report.loadFile('assets/reports/TongHopPATHTQuaHan.mrt');
                    
                    var dataSet = new Stimulsoft.System.Data.DataSet("Data");  
                    var dataj = JSON.stringify(lstData);
                    dataSet.readJson(dataj);
                    this.report.dictionary.databases.clear();
                    
                    this.report.dictionary.variables.getByName("header").valueObject = this.item.Infor.Header.toUpperCase();

                    this.report.dictionary.variables.getByName("tungay").valueObject = moment(this.dateStart, "DD/MM/YYYY").format("DD/MM/YYYY");
                    this.report.dictionary.variables.getByName("denngay").valueObject = moment(this.dateEnd, "DD/MM/YYYY").format("DD/MM/YYYY");
                    this.report.dictionary.variables.getByName("title1").valueObject = "Đơn vị: ";
                    this.report.dictionary.variables.getByName("title2").valueObject = "Lĩnh vực";
                    this.report.dictionary.variables.getByName("TitleReport").valueObject = "BÁO CÁO TỔNG HỢP PHẢN ÁNH TẠI HIỆN TRƯỜNG ĐÃ BỊ QUÁ HẠN XỬ LÝ";
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
