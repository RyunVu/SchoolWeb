import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseService, HttpService } from '../../services';
import { DatePipe } from '@angular/common';

declare var $: any;
import * as moment from 'moment';
declare var Stimulsoft: any;
@Component({
    selector: 'app-report-export',
    templateUrl: './report-export.component.html',
    styleUrls: ['./report-export.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ReportExportComponent implements OnInit {
    useQllt: any;
    public listItem: any; // biến này chưa danh sách lấy từ serve
    public listReport: any; // biến này chưa danh sách để hiển thị lên datatable sau khi search bằng từ khóa
    public formData: any;
    viewer: any = new Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
    report: any = new Stimulsoft.Report.StiReport();
    options = new Stimulsoft.Viewer.StiViewerOptions();


    code: any = "PATHT";
    choiceType: any = "";
    choiceWard: any = "";
    parentStartDate: any;
    parentEndDate: any;
    firstDateString: any;
    lastDateString: any;
    public DisplayName: any;
    UnitCode: any = "";
    PlaceId: any = "";
    UnitCounterId: any = "";
    listTang: any[] = [];
    wards: any[] = [];
    defaultWard: any;
    unitcode: any;
    constructor(
        public router: Router,
        public http: HttpService, // Muốn gọi api phải có cái này
        private route: ActivatedRoute,
        public notifications: ToastrService,
        public formBuilder: FormBuilder,
        private toastr: ToastrService,
    ) {
        this.viewer = new Stimulsoft.Viewer.StiViewer(this.options, 'StiViewer', false);
        this.UnitCode = localStorage.getItem('UnitCode');
        this.PlaceId = localStorage.getItem("PlaceId");
        if (this.UnitCode != "LDG") {
            this.UnitCounterId = localStorage.getItem("UnitCounterId");
        }

        var that = this;
        this.route.queryParams.subscribe((params: Params) => {
            that.parentStartDate = params['startdate'];
            that.parentEndDate = params['enddate'];
            that.cityId = params['cityId'];
            that.unitcode = params['unitcode'];
        });
        this.loadWard();


    }

    cityId: any;
    startDate: any;
    endDate: any;
    ngOnInit() {
        this.DisplayName = localStorage.getItem("DisplayName");
        if (this.parentStartDate != 0) {
            this.startDate = moment(this.parentStartDate).format("DD/MM/YYYY");

        } else {
            this.startDate = moment(new Date()).format("DD/MM/YYYY");
        }

        if (this.parentEndDate != 0) {
            this.endDate = moment(this.parentEndDate).format("DD/MM/YYYY");
        } else {
            this.endDate = moment(new Date()).format("DD/MM/YYYY");
        }

        this.choiceType = "f";
        const funcs = [];
        funcs.push(this.getTangs());
        Promise.all(funcs).then((rs: any[]) => {
            this.listTang = rs[0];
            this.listTang.unshift({ Id: "", Name: "Tất cả" })
            this.UnitCounterId = this.listTang[0];
            this.loadData();
        }).catch((err) => {
        });
    }

    getTangs() {
        return new Promise((resolve, reject) => {
            return this.http.post("Home/GetTangs", {
                UnitCode: this.unitcode
            }, (result: any) => {
                if (result.Code == 200) {
                    resolve(result.Result || []);
                }
                else {
                    reject(new Error(result.Message));
                }
            }, (error: any) => {
                reject(error);
            });
        });
    }

    search() {
        this.loadData();
    }
    public loadData() {

        var sDate = moment(this.startDate, "DD/MM/YYYY");
        var tDate = moment(this.endDate, "DD/MM/YYYY");
        const data = {
            StartDate: this.startDate ? sDate.format('yyyy-MM-DDTHH:mm:ss.000') + "Z" : null,
            EndDate: this.endDate ? tDate.format('yyyy-MM-DDTHH:mm:ss.000') + "Z" : null,
            Offline: 0,
            Online: 0,
            IsMobile: true,
            PlaceId: this.PlaceId,
            UnitId: this.UnitCounterId.Id,
            Function: "OfflineOnline",
            UnitCode: this.unitcode
        };

        this.http.post('Home/GetDataByFunc', data,
            (data1: any) => {
                if (data1.Code === 200) {
                    if (this.defaultWard != undefined && this.defaultWard.Id == null) {
                        this.report = new Stimulsoft.Report.StiReport();
                        this.report.loadFile("assets/reports/ThongKeTyLeBocSo.mrt");
                        var dataSet = new Stimulsoft.System.Data.DataSet("Data");
                        var dataj = JSON.stringify(data1.Result.Reports);
                        dataSet.readJson(dataj);
                        this.report.dictionary.databases.clear();
                        this.report.regData(dataSet.dataSetName, "Data", dataSet);

                        var ffDate = sDate.format('DD/MM/YYYY');
                        var ttDate = tDate.format('DD/MM/YYYY');
                        if (sDate == tDate) {
                            this.report.dictionary.variables.getByName("tungay").valueObject = "Ngày: " + ffDate;
                        } else {
                            this.report.dictionary.variables.getByName("tungay").valueObject = "Từ ngày: " + ffDate + " - Đến ngày: " + ttDate;
                        }

                        if (this.UnitCode == "LDG") {
                            this.report.dictionary.variables.getByName("header").valueObject = "THÀNH PHỐ ĐÀ LẠT";
                        } else if (this.UnitCode == "BLC") {
                            this.report.dictionary.variables.getByName("header").valueObject = "THÀNH PHỐ BẢO LỘC";
                        }
                        this.report.dictionary.variables.getByName("title1").valueObject = "Tại quầy";
                        this.report.dictionary.variables.getByName("title2").valueObject = "Qua mạng";
                        this.report.dictionary.variables.getByName("TitleReport").valueObject = "THỐNG KÊ TỶ LỆ BỐC SỐ TẠI QUẦY/ QUA MẠNG";
                        this.report.dictionary.variables.getByName("nguoilap").valueObject = this.DisplayName ? this.DisplayName : "";

                        this.viewer.report = this.report;
                        this.viewer.renderHtml('viewReport');
                        $('#viewReport2').css("display", "none");
                        $('#viewReport').css("display", "block");
                    } else {
                        $('#viewReport').css("display", "none");
                        $('#viewReport2').css("display", "block");
                    }

                } else {
                }
            },
            () => {
                this.toastr.error('Đã có lỗi xảy ra!', 'Lỗi');
            });
    }

    onChangeDate() {
        // this.startDate = moment(this.startDate).format("DD/MM/YYYY");
        // this.endDate = moment(this.endDate).format("DD/MM/YYYY");

        // this.loadData();
    }
    back() {
        this.router.navigate(['/home']);
    }
    loadWard() {

        this.wards = [];
        const data = {
            "Code": "wards",
            "ParentId": this.cityId
        };
        this.http.post(
            'Location/GetWards',
            data,
            (result: any) => {
                if (result.Code === 200) {
                    this.wards = result.Result;
                    this.wards.unshift({ Name: 'TP Đà Lạt', Id: null });
                    this.defaultWard = this.wards[0];
                    console.log(this.defaultWard);
                } else {
                    this.toastr.error('Đã có lỗi xảy ra!', 'Lỗi');
                }
            },
            () => {
                this.toastr.error('Đã có lỗi xảy ra!', 'Lỗi');
            }
        );
    }
    onChangeWard(event: any) {
        var id = event.value;
        this.defaultWard = id;
        console.log(this.defaultWard);
    }
}
