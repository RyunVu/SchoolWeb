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
  selector: 'app-report-quahan-chitiet-patht',
  templateUrl: './report-quahan-chitiet-patht.component.html',
  styleUrls: ['./report-quahan-chitiet-patht.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportQuaHanChiTietPAHTComponent extends BasePage {
    useQllt: any;

    item: any;
    dateStart: any;
    startDateInput: any;
    
    dateEnd: any;
    endDateInput: any;

    unit: any;
    unitInput: any;
    units: any[] = [];

    locationName: any;
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
            "Code": "patht",
            "UnitId": this.unit,
            "FieldId": this.field,
            "FromDate": moment(this.dateStart, "DD/MM/YYYY").format("DD/MM/YYYY"),
            "ToDate":  moment(this.dateEnd, "DD/MM/YYYY").format("DD/MM/YYYY"),
            "Status": 3,
            "UnitCode": this.location
        };

        this.http.post('FeedbackAdmin/Feedbacks', data,
            (res: any) => {
                if (res.Code === 200) {
                    this.item = res.Result;
                    console.log(this.item);
                    this.viewer = new Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
                    this.report = new Stimulsoft.Report.StiReport();
                    var lstData: any[] = [];
                    var lstitem = {CodeNo: '', Content: '', DateCreate:'', FieldName: '', TinhTrangXl: '', WardName: '', Phone: ''};
                    if(res.Result != null && res.Result.length > 0) {
                        res.Result.forEach((element: any) => {
                            var tt = "";
                            if(element.StatusName){
                                tt += element.StatusName + " "
                            }
                            if(element.DueDate){
                                tt += element.DueDate
                            }
                            lstitem = {CodeNo: element.No, Content: element.Content, DateCreate: element.CreateDate, FieldName: element.FieldName, 
                                TinhTrangXl: tt, WardName: element.UnitName, Phone: element.PhoneNo  }
                                lstData.push(lstitem);
                        });
                    }
                    
                    this.report.loadFile('assets/reports/ChiTietPATHTQuaHan.mrt');
                    
                    var dataSet = new Stimulsoft.System.Data.DataSet("Data");  
                    var dataj = JSON.stringify(lstData);
                    dataSet.readJson(dataj);
                    this.report.dictionary.databases.clear();
                    
                    this.report.dictionary.variables.getByName("All").valueObject = res.TotalRow;
                    this.report.dictionary.variables.getByName("header").valueObject = this.locationName.toUpperCase();

                    this.report.dictionary.variables.getByName("tungay").valueObject = moment(this.dateStart, "DD/MM/YYYY").format("DD/MM/YYYY");
                    this.report.dictionary.variables.getByName("denngay").valueObject = moment(this.dateEnd, "DD/MM/YYYY").format("DD/MM/YYYY");
                    this.report.dictionary.variables.getByName("title1").valueObject = "Đơn vị: ";
                    this.report.dictionary.variables.getByName("title2").valueObject = "Lĩnh vực";
                    this.report.dictionary.variables.getByName("TitleReport").valueObject = "BÁO CÁO CHI TIẾT PHẢN ÁNH TẠI HIỆN TRƯỜNG ĐÃ BỊ QUÁ HẠN XỬ LÝ";
                    this.report.dictionary.variables.getByName("nguoilap").valueObject = "";
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
    convertLocation(UnitCode: any) {
        var Name = ""
        switch (UnitCode) {
            case "DLT":
                return Name = "Thành phố Đà Lạt"
                break;
            case "BLC":
                return Name = "Thành phố Bảo Lộc"
                break;
            case "LHA":
                return Name = "Huyện Lâm Hà"
                break;
            case "DRG":
                return Name = "Huyện Đam Rông"
                break;
            case "DLH":
                return Name = "Huyện Di Linh"
                break;
            case "LDU":
                return Name = "Huyện Lạc Dương"
                break;
            case "BLM":
                return Name = "Huyện Bảo Lâm"
                break;
            case "DTH":
                return Name = "Huyện Đạ Tẻh"
                break;
            case "DHI":
                return Name = "Huyện Đạ Huoai"
                break;
            case "CTN":
                return Name = "Huyện Cát Tiên"
                break;
            case "DDG":
                return Name = "Huyện Đơn Dương"
                break;
            case "DTG":
                return Name = "Huyện Đức Trọng"
                break;
        }
        return Name;
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
                this.locationName = this.convertLocation(this.location);
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
        this.locationName = this.convertLocation(event.value);
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
