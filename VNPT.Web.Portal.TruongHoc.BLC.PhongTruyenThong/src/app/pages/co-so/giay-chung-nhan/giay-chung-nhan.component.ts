import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { GiayChungNhanModal } from './giay-chung-nhan.modal';
import { ToastrService } from 'ngx-toastr';
import { hkdStatuses, loaiHinhs, coGCN, loaiMaSoThue } from 'src/app/shared/constants';
import moment from 'moment';

import * as Excel from 'exceljs';
import * as fs from 'file-saver';

@Component({
    standalone: false,
    selector: 'app-giay-chung-nhan',
    templateUrl: './giay-chung-nhan.component.html',
    styleUrls: ['./giay-chung-nhan.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GiayChungNhanComponent extends BasePage {
    @ViewChild('dt', { static: false }) dt: any;
    hkdStatuses = hkdStatuses;
    loaiHinhs = loaiHinhs;
    coGCN = coGCN;
    items: any[] = [];
    pageSize: number = 10;
    pageIndex: number = 1;
    keyword: any;
    totalRow: number = 0;
    orderDirection: any;
    orderBy: any;
    loading: boolean = false;
    filters: any = {};
    keywordInput: any;
    wards: any[] = [];
    ward: any;
    cities: any[] = [];
    city: any;
    streets: any[] = [];
    street: any;
    nop: any;
    xay: any;
    linhVucs: any[] = [];
    linhVuc: any = null;
    trangThai: any = null;
    loaiHinh: any = null;
    loaiGCN: any = null;
    coMst: any = null;
    fromDate: any;
    toDate: any;
    xayStatus: any = [
        { Id: null, Name: 'Tất cả' },
        { Id: 'Đang hoạt động', Name: 'Đang hoạt động' },
        { Id: 'Đã đóng cửa', Name: 'Đã đóng cửa' },
    ];
    nopStatus: any = [
        { Id: null, Name: 'Tất cả' },
        { Id: 0, Name: 'Chưa thu' },
        { Id: 1, Name: 'Đang thu' },
        { Id: 2, Name: 'Đã thu' },
    ];
    loaiMaSoThue: any[] = loaiMaSoThue;
    isShow = false;

    constructor(
        public toastr: ToastrService,
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService
    ) {
        super(router, route, http, message);
        this.nop = this.nopStatus[0].Id;
        this.xay = this.xayStatus[0].Id;
        var date = new Date();
        date.setDate(date.getDate() - 7);
        this.fromDate = date
        this.toDate = new Date();
    }

    showHide() {
        this.isShow = !this.isShow;
    }

    onInit(): void {
        this.loadCities();
        this.loadLinhVucs();
    }

    loadLinhVucs() {
        //https://localhost:44370/api/GeneralCategory/Items
        this.http.post(
            'GeneralCategory/Items',
            { Code: 'LinhVucHKD' },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.linhVucs = result.Result;
                    this.linhVucs.unshift({ Id: null, Name: 'Tất cả' });
                    this.linhVuc = null;
                }
            },
            () => { }
        );
    }
    loadCities() {
        this.http.post(
            'Location/GetCities',
            { Code: 'DLT' },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.cities = result.Result;
                    this.cities.unshift({ Id: null, Name: 'Tất cả' });
                    this.city = null;
                    this.loadWards();
                }
            },
            () => { }
        );
    }
    loadWards() {
        this.http.post(
            'Location/GetWards',
            {
                ParentId: this.city,
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.wards = result.Result;
                    this.wards.unshift({ Id: null, Name: 'Tất cả' });
                    this.ward = null;
                    this.loadStreets();
                }
            },
            () => { }
        );
    }
    loadStreets() {
        this.http.post(
            'Location/GetStreets',
            {
                ParentId: this.ward,
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.streets = result.Result;
                    this.streets.unshift({ Id: null, Name: 'Tất cả' });
                    this.street = this.streets[0].Id;
                }
            },
            () => { }
        );
    }
    add() {
        const ref = this.dialogService
            .open(GiayChungNhanModal, {
                data: {
                    IsAdd: true,
                    Parent: this
                },
                header: 'Thêm mới cơ sở',
                width: '90%',
            })!
            .onClose.subscribe((data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }
    googleMap(item: any) {
        var url = 'https://www.google.com/maps/place/' + item.ToaDo;
        window.open(url, '_blank');
    }
    
    editTinhTrang(item: any) {
      
    }

    doanhThu(item: any) {
        
    }
    thueGiayChungNhan(item: any) {
       
    }
    edit(item: any) {
        const ref = this.dialogService
            .open(GiayChungNhanModal, {
                data: {
                    IsAdd: false,
                    item: item,
                    Parent: this
                },
                header: 'Cập nhật hộ kinh doanh',
                width: '90%',
            })!
            .onClose.subscribe((data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }
    delete(item: any) {
        this.confirmationService.confirm({
            message:
                'Bạn có chắc chắn muốn xoá ' +
                item.TenNguoiNopThue +
                ' - ' +
                item.MaSoThue +
                ' ?',
            accept: () => {
                this.http.post(
                    'GiayChungNhanAdmin/XoaGiayChungNhan',
                    {
                        Id: item.Id,
                    },
                    (result: ResultModel) => {
                        if (result.Code == ResultCode.Success) {
                            this.toastr.success('Thành công', 'Xóa hộ kinh doanh', {
                                timeOut: 3000,
                            });
                            this.loadData();
                        }
                    },
                    () => { }
                );
            },
        });
    }
    loadPage(): void { }
    paginate(event: any) {
        this.pageSize = event.rows ?? 10;
        var first = event.first ?? 0;
        this.pageIndex = Math.floor(first / this.pageSize) + 1;
        this.orderDirection = event.sortOrder === 1 ? 'asc' : 'desc';
        this.orderBy = event.sortField;
        this.filters = event.filters;
        setTimeout(() => {
            this.loadData();
        }, 100);
    }
    loadData() {
        this.loading = true;
        var filters = [];
        if (this.filters != null) {
            let entries: any = Object.entries(this.filters);

            for (var i = 0; i < entries.length; i++) {
                filters.push({
                    Name: entries[i][0],
                    Value: entries[i][1].value,
                    MatchMode: entries[i][1].matchMode,
                });
            }
        }

        this.http.post(
            'DoanhNghiep/List',
            {
                keyword: this.keyword,
                LocationDistrictId: this.city,
                LocationWardId: this.ward,
                LocationStreetId: this.street,
                TinhTrangNopThue: this.nop,
                TinhTrangHoatDong: this.xay, //0: chưa xây, 1: đang xây, 2: Đã xây
                LinhVucId: this.linhVuc,
                PageSize: this.pageSize,
                PageIndex: this.pageIndex,
                orderDirection: this.orderDirection,
                orderBy: this.orderBy,
                LoaiGCN: this.loaiGCN,
                LoaiHinhNopThue: this.loaiHinh,
                HKDStatus: this.trangThai,
                CoMST: this.coMst,
                FromDate: moment(this.fromDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                ToDate: moment(this.toDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.items = result.Result;
                    this.totalRow = result.TotalRow;
                }
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        );
    }
    refresh() {
        this.dt.first = 0;
    }
    getTinhTrang(tinhTrang: any) {
        if (tinhTrang == 1) return 'đang';
        else if (tinhTrang == 2) return 'đã';
        return 'chưa';
    }
    search() {
        this.pageIndex = 1;
        this.keyword = this.keywordInput;
        this.refresh();
        this.loadData();
    }
    clearfilter() {
        this.pageIndex = 1;
        this.keyword = null;
        this.keywordInput = null;
        this.refresh();
        this.loadData();
    }
    async exportCSV() {
        this.loading = true;
        this.http.post(
            'GiayChungNhanAdmin/Export',
            {
                keyword: this.keyword,
                LocationDistrictId: this.city,
                LocationWardId: this.ward,
                LocationStreetId: this.street,
                TinhTrangNopThue: this.nop,
                TinhTrangHoatDong: this.xay, //0: chưa xây, 1: đang xây, 2: Đã xây
                LinhVucId: this.linhVuc,
                PageSize: this.pageSize,
                PageIndex: this.pageIndex,
                orderDirection: this.orderDirection,
                orderBy: this.orderBy,
                LoaiGCN: this.loaiGCN,
                LoaiHinhNopThue: this.loaiHinh,
                HKDStatus: this.trangThai,
                CoMST: this.coMst,
                FromDate: moment(this.fromDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                ToDate: moment(this.toDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    const workbook = new Excel.Workbook();
                    let worksheet = workbook.addWorksheet("GiayChungNhan");
                    var rowStart = 1;
                    worksheet.addRow(["STT", "MST", 'Ngày cấp MST', 'Số giấy phép', 'Ngày cấp giấy phép', 'Tên người nộp thuế', 'Địa chỉ', 'Số điện thoại', 'Loại hình', 'Trạng thái hoạt động', 'Doanh Thu', 'Thuế GTGT', 'Thuế TNCN', 'Thuế môn bài', 'Thuế TTDB']);

                    result.Result.forEach((el: any, i: any) => {
                        var datarow: any[] = [i + 1, el.MaSoThue, el.NgayCapMST ? new Date(moment(el.NgayCapMST, "YYYY-MM-DD").format("YYYY-MM-DD")) : "", el.SoGiayChungNhan, el.NgayCapGCN ? new Date(moment(el.NgayCapGCN, "YYYY-MM-DD").format("YYYY-MM-DD")) : "", el.TenNguoiNopThue, (el.DiaChi ? el.DiaChi + ", " : "") + (el.WardName ? el.WardName + ", " : "") + (el.DistrictName ? el.DistrictName + ", " : "") + (el.ProvinceName ? el.ProvinceName : ""), el.PhoneNumber, el.LoaiHinhNopThueString, el.TinhTrangQuanLyString + "\n" + el.TrangThaiChuaKhoanString, el.DoanhThuBQThang, el.ThueGTGT, el.ThueTNCN, el.ThueMonBai, el.ThueTTDB];
                        worksheet.addRow(datarow);
                        rowStart++;
                    });

                    for (let index = 1; index <= rowStart; index++) {
                        for (let jndex = 1; jndex <= 15; jndex++) {
                            worksheet.getCell(index, jndex).border = {
                                top: { style: 'thin' },
                                left: { style: 'thin' },
                                bottom: { style: 'thin' },
                                right: { style: 'thin' }
                            };
                            worksheet.getRow(index).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
                            worksheet.getRow(index).font = { name: 'Times New Roman', size: 13, bold: index == 1 };
                        }
                        [6, 7].forEach((num: any) => {
                            worksheet.getCell(index, num).alignment = { wrapText: true, vertical: 'middle', horizontal: index != 1 ? 'left' : 'center' };
                            worksheet.getCell(index, num).font = { name: 'Times New Roman', size: 13, bold: index == 1 };
                        });
                        [11, 12, 13, 14, 15].forEach((num: any) => {
                            worksheet.getCell(index, num).numFmt = "#,##0";
                        });
                        worksheet.getRow(index).height = 65;
                    }

                    worksheet.getColumn(1).width = 7;
                    worksheet.getColumn(2).width = 25;
                    worksheet.getColumn(3).width = 25;
                    worksheet.getColumn(4).width = 25;
                    worksheet.getColumn(5).width = 25;
                    worksheet.getColumn(6).width = 40;
                    worksheet.getColumn(7).width = 45;
                    worksheet.getColumn(8).width = 20;
                    worksheet.getColumn(9).width = 25;
                    worksheet.getColumn(10).width = 30;
                    worksheet.getColumn(11).width = 25;
                    worksheet.getColumn(12).width = 25;
                    worksheet.getColumn(13).width = 25;
                    worksheet.getColumn(14).width = 25;
                    worksheet.getColumn(15).width = 25;

                    worksheet.views = [
                        { zoomScale: 67 }
                    ];
                    workbook.xlsx.writeBuffer().then((databuffer) => {
                        let blob = new Blob([databuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        fs.saveAs(blob, 'GiayChungNhan.xlsx');
                    });
                }
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        );
    }

    async exportCSVWithDetail() {
        this.loading = true;
        this.http.post(
            'GiayChungNhanAdmin/Export',
            {
                keyword: this.keyword,
                LocationDistrictId: this.city,
                LocationWardId: this.ward,
                LocationStreetId: this.street,
                TinhTrangNopThue: this.nop,
                TinhTrangHoatDong: this.xay, //0: chưa xây, 1: đang xây, 2: Đã xây
                LinhVucId: this.linhVuc,
                PageSize: this.pageSize,
                PageIndex: this.pageIndex,
                orderDirection: this.orderDirection,
                orderBy: this.orderBy,
                LoaiGCN: this.loaiGCN,
                LoaiHinhNopThue: this.loaiHinh,
                HKDStatus: this.trangThai,
                CoMST: this.coMst,
                FromDate: moment(this.fromDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                ToDate: moment(this.toDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    const workbook = new Excel.Workbook();
                    let worksheet = workbook.addWorksheet("GiayChungNhan");
                    var rowStart = 2;
                    worksheet.addRow(["STT", "MST", 'Ngày cấp MST', 'Số giấy phép', 'Ngày cấp giấy phép', 'Tên người nộp thuế', 'Tên biển hiệu', 'Địa chỉ', 'Số điện thoại', 'Trạng thái hoạt động', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Doanh Thu', 'Thuế GTGT', 'Thuế TNCN', 'Thuế môn bài', 'Thuế TTDB']);
                    worksheet.addRow(["", "", '', '', '', '', '', '', '', 'Không quản lý', 'Thuộc địa bàn khác', 'Hộ khoán', 'Hộ thu nhập thấp', 'Hộ kê khai', 'Chưa kinh doanh', 'Đã gửi GM', 'Đơn nghỉ KD (có thời hạn)', 'Đơn nghỉ KD (trả giấy phép)', 'Chưa thực hiện ĐKT', 'Không KD', 'Chưa kinh doanh', 'Đang làm MST', 'Không tìm ra địa chỉ', 'Khác', 'Đã gửi GM', 'Chưa gửi GM', 'Doanh Thu', 'Thuế GTGT', 'Thuế TNCN', 'Thuế môn bài', 'Thuế TTDB']);

                    result.Result.forEach((el: any, i: any) => {
                        var datarow: any[] = [i + 1, el.MaSoThue, el.NgayCapMST ? new Date(moment(el.NgayCapMST, "YYYY-MM-DD").format("YYYY-MM-DD")) : "", el.SoGiayChungNhan, el.NgayCapGCN ? new Date(moment(el.NgayCapGCN, "YYYY-MM-DD").format("YYYY-MM-DD")) : "", el.TenNguoiNopThue, el.TenBangHieu, (el.DiaChi ? el.DiaChi + ", " : "") + (el.WardName ? el.WardName + ", " : "") + (el.DistrictName ? el.DistrictName + ", " : "") + (el.ProvinceName ? el.ProvinceName : ""), el.PhoneNumber, 'TTQL1', 'TTQL2', 'LH1', 'LH2', 'LH3', 'LD1', 'LD2', 'LD3', 'LD4', 'DK1', 'DK2', 'CMST1', 'CMST2', 'CMST3', 'CMST4', 'CMST5', 'CMST6', el.DoanhThuBQThang, el.ThueGTGT, el.ThueTNCN, el.ThueMonBai, el.ThueTTDB];
                        //TTQL
                        datarow[9] = el.TinhTrangQuanLy == 1 ? 'X' : '';
                        datarow[10] = el.TinhTrangQuanLy == 2 ? 'X' : '';
                        //LH
                        datarow[11] = el.LoaiHinhNopThue == 1 ? 'X' : '';
                        datarow[12] = el.LoaiHinhNopThue == 2 ? 'X' : '';
                        datarow[13] = el.LoaiHinhNopThue == 3 ? 'X' : '';
                        //LD
                        datarow[14] = el.TrangThaiChuaKhoan == 1 ? 'X' : '';
                        datarow[15] = el.TrangThaiChuaKhoan == 2 ? 'X' : '';
                        datarow[16] = el.TrangThaiChuaKhoan == 3 ? 'X' : '';
                        datarow[17] = el.TrangThaiChuaKhoan == 4 ? 'X' : '';
                        //DKTGP=DK
                        datarow[18] = el.TraGpKhongKD6Thang == 1 ? 'X' : '';
                        datarow[19] = el.TraGpKhongKD6Thang == 2 ? 'X' : '';
                        //CMST
                        datarow[20] = el.TrangThaiChuaCoMST == 1 ? 'X' : '';
                        datarow[21] = el.TrangThaiChuaCoMST == 2 ? 'X' : '';
                        datarow[22] = el.TrangThaiChuaCoMST == 3 ? 'X' : '';
                        datarow[23] = el.TrangThaiChuaCoMST == 4 ? 'X' : '';
                        datarow[24] = el.TrangThaiChuaCoMST == 5 ? 'X' : '';
                        datarow[25] = el.TrangThaiChuaCoMST == 6 ? 'X' : '';
                        worksheet.addRow(datarow);
                        rowStart++;
                    });

                    for (let index = 1; index <= rowStart; index++) {
                        for (let jndex = 1; jndex <= 31; jndex++) {
                            worksheet.getCell(index, jndex).border = {
                                top: { style: 'thin' },
                                left: { style: 'thin' },
                                bottom: { style: 'thin' },
                                right: { style: 'thin' }
                            };
                            worksheet.getRow(index).alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
                            worksheet.getRow(index).font = { name: 'Times New Roman', size: 13, bold: index == 1 };
                        }
                        [6, 7].forEach((num: any) => {
                            worksheet.getCell(index, num).alignment = { wrapText: true, vertical: 'middle', horizontal: index != 1 ? 'left' : 'center' };
                            worksheet.getCell(index, num).font = { name: 'Times New Roman', size: 13, bold: index == 1 };
                        });
                        [27,28,29,30,31].forEach((num: any) => {
                            worksheet.getCell(index, num).numFmt = "#,##0";
                        });
                        worksheet.getRow(index).height = 65;
                    }

                    worksheet.mergeCells('A1:A2');
                    worksheet.mergeCells('B1:B2');
                    worksheet.mergeCells('C1:C2');
                    worksheet.mergeCells('D1:D2');
                    worksheet.mergeCells('E1:E2');
                    worksheet.mergeCells('F1:F2');
                    worksheet.mergeCells('G1:G2');
                    worksheet.mergeCells('H1:H2');
                    worksheet.mergeCells('I1:I2');
                    worksheet.mergeCells('AA1:AA2');
                    worksheet.mergeCells('AB1:AB2');
                    worksheet.mergeCells('AC1:AC2');
                    worksheet.mergeCells('AD1:AD2');
                    worksheet.mergeCells('AE1:AE2');
                    worksheet.mergeCells('J1:Z1');

                    worksheet.getColumn(1).width = 7;
                    worksheet.getColumn(2).width = 25;
                    worksheet.getColumn(3).width = 25;
                    worksheet.getColumn(4).width = 25;
                    worksheet.getColumn(5).width = 25;
                    worksheet.getColumn(6).width = 40;
                    worksheet.getColumn(7).width = 45;
                    worksheet.getColumn(8).width = 45;
                    worksheet.getColumn(9).width = 25;

                    //TTQL
                    worksheet.getColumn(10).width = 25;
                    worksheet.getColumn(11).width = 25;
                    //LH
                    worksheet.getColumn(12).width = 25;
                    worksheet.getColumn(13).width = 25;
                    worksheet.getColumn(14).width = 25;
                    //LD
                    worksheet.getColumn(15).width = 25;
                    worksheet.getColumn(16).width = 25;
                    worksheet.getColumn(17).width = 25;
                    worksheet.getColumn(18).width = 25;
                    //DK
                    worksheet.getColumn(19).width = 25;
                    worksheet.getColumn(20).width = 25;
                    //CMST
                    worksheet.getColumn(21).width = 25;
                    worksheet.getColumn(22).width = 25;
                    worksheet.getColumn(23).width = 25;
                    worksheet.getColumn(24).width = 25;
                    worksheet.getColumn(25).width = 25;
                    worksheet.getColumn(26).width = 25;

                    worksheet.getColumn(27).width = 25;
                    worksheet.getColumn(28).width = 25;
                    worksheet.getColumn(29).width = 25;
                    worksheet.getColumn(30).width = 25;
                    worksheet.getColumn(31).width = 25;

                    worksheet.views = [
                        { zoomScale: 70, state: 'frozen', ySplit: 2 }
                    ];
                    workbook.xlsx.writeBuffer().then((databuffer) => {
                        let blob = new Blob([databuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        fs.saveAs(blob, 'GiayChungNhanChitiet.xlsx');
                    });
                }
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        );
    }

    import(): void {
      
    }
    importTNT() {
        
    }
    importKK() {
      
    }
    importTTDB() {
        
    }
    importRevenue(): void {
        
    }
}
