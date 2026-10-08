import { Component, ViewEncapsulation } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { DialogService } from 'primeng/dynamicdialog';
import { hkdStatuses, loaiHinhs, traGiayPhepKDs } from 'src/app/shared/constants';

@Component({
    standalone: false,
    selector: 'danh-sach-co-so-modal',
    templateUrl: 'danh-sach-co-so.modal.html',
    styleUrls: ['./danh-sach-co-so.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DanhSachCoSoModal {
    hkdStatuses = hkdStatuses;
    loaiHinhs = loaiHinhs.filter(s => s.Id != 0);
    diaChi: any;
    item: any = {};
    linhvucs: any[] = [];
    province: any[] = [
        {
            Id: '53F8AAC4-D45E-4CD2-BD01-1A1DED2A30CA',
            Name: 'Lâm Đồng',
        },
    ];
    district: any[] = [
        {
            Id: '77E7C896-26DD-476B-8C1C-6E151D87D0A0',
            Name: 'Đà Lạt',
        },
    ];
    wards: any[] = [];
    streets: any[] = [];
    parent: any;
    traGiayPhepKds: any[] = traGiayPhepKDs;
    tinhTrangQuanLys: any[] = [
        // {
        //     Id: 0,
        //     Name: 'Đang quản lý',
        // },
        {
            Id: 1,
            Name: 'Không quản lý (Gp vay vốn,..)',
        },
        {
            Id: 2,
            Name: 'Thuộc địa bàn khác',
        },
    ];
    typesHoatDong: any[] = [
        {
            Id: 0,
            Name: 'Chọn tình trạng',
        },
        {
            Id: 1,
            Name: 'Đang hoạt động',
        },
        {
            Id: 2,
            Name: 'Đã đóng cửa',
        },
    ];
    type: any = 0;
    typesNopThue: any[] = [
        {
            Id: 0,
            Name: 'Chọn tình trạng',
        },
        {
            Id: 1,
            Name: 'Đã nộp thuế',
        },
        {
            Id: 2,
            Name: 'Chưa nộp thuế',
        },
    ];
    lyDoChuaMSTs: any[] =
        [
            // { Id: 0, Name: "Chưa phân loại" },
            { Id: 1, Name: "Chưa kinh doanh" },
            { Id: 2, Name: "Đang làm MST" },
            { Id: 3, Name: "Không tìm ra địa chỉ" },
            { Id: 4, Name: "Khác" },
            { Id: 5, Name: "Đã gởi GM" },
            { Id: 6, Name: "Chưa gởi GM" },
        ];
    trangThaiChuaKhoans: any[] =
        [
            // { Id: 0, Name: "Chưa phân loại" },
            { Id: 1, Name: "Chưa kinh doanh" },
            { Id: 2, Name: "Đã gởi GM" },
            { Id: 3, Name: "Đơn nghỉ KD (có thời hạn)" },
            { Id: 4, Name: "Đơn nghỉ KD luôn (trả giấy phép) " },
        ];
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        public dialogService: DialogService
    ) {
        this.item = {
            Id: null,
            TenHoKinhDoanh: '',
            SoGiayChungNhan: '',
            NgayCapGCN: null,
            TenBangHieu: '',
            DiaChi: '',
            Fax: '',
            Email: '',
            Website: '',
            PhoneNumber: '',
            VonKinhDoanh: '',
            HoTenChuHo: '',
            HoKhauChuHo: '',
            DiaChiChuHo: '',
            ToaDo: '',
            TinhTrangHoatDong: '',
            TinhTrangNopThue: '',
            MaSoThue: '',
            SoLanIn: 1,
            NgayIn: null,
            LocationWardId: '',
            LocationStreetId: '',
            linhvucselect: [],
        };

        if (this.config.data.item != null) {
            this.item = this.config.data.item;

            this.diaChi = this.item.DiaChi == null ? this.item.DCTSSoNha : this.item.DiaChi;

            if (this.item.NgayCapGCN != '' && this.item.NgayCapGCN != null) {
                this.item.NgayCapGCN = new Date(this.item.NgayCapGCN);
            }

            if (this.item.NgayCapMST != '' && this.item.NgayCapMST != null) {
                this.item.NgayCapMST = new Date(this.item.NgayCapMST);
            }
            this.item.NgayIn = new Date(this.item.NgayIn);
        }
        this.type = this.item.TypeGetList;
        this.parent = this.config.data.Parent;
    }
    ngOnInit() {
        this.linhVucs();
        this.loadWards();
        if (this.item.NgayCapGCN == '' || this.item.NgayCapGCN == null) {
            var today = moment().format('DD/MM/YYYY');
            this.item.NgayCapGCN = today;
        }

        if (this.item.NgayIn == '' || this.item.NgayIn == null) {
            var today = moment().format('DD/MM/YYYY');
            this.item.NgayIn = today;
        }

        if (this.item.TinhTrangQuanLy == null) {
            this.item.TinhTrangQuanLy = this.tinhTrangQuanLys[0].Id;
        }
        if (this.item.TrangThaiChuaCoMST == null) {
            this.item.TrangThaiChuaCoMST = this.trangThaiChuaKhoans[0].Id;
        }
        if (this.item.TrangThaiChuaKhoan == null) {
            this.item.TrangThaiChuaKhoan = this.trangThaiChuaKhoans[0].Id;
        }
    }
    clearValue(item: any) {
        this.item[item] = 0;
    }
    loadWards() {
        this.http.post(
            'Location/GetWards',
            {
                ParentId: '77e7c896-26dd-476b-8c1c-6e151d87d0a0',
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.wards = result.Result;
                    this.wards.unshift({ Id: null, Name: 'Tất cả' });
                    if (this.config.data.IsAdd || this.item.LocationWardId == null) {
                        this.item.LocationWardId = this.wards[0].Id;
                    }
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
                ParentId: this.item.LocationWardId,
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.streets = result.Result;
                    this.streets.unshift({ Id: null, Name: 'Tất cả' });
                    if (this.config.data.IsAdd || this.item.LocationStreetId == null) {
                        this.item.LocationStreetId = this.streets[0].Id;
                    }
                }
            },
            () => { }
        );
    }

    ChangeWard() {
        this.http.post(
            'Location/GetStreets',
            {
                ParentId: this.item.LocationWardId,
            },
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.streets = result.Result;
                    this.streets.unshift({ Id: null, Name: 'Tất cả' });
                    this.item.LocationStreetId = this.streets[0].Id;
                }
            },
            () => { }
        );
    }

    linhVucs() {
        this.http.post(
            'GeneralCategory/Items',
            {},
            (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.linhvucs = result.Result;
                    this.http.post(
                        'GeneralCategory/SearchLinhVuc',
                        {
                            Id: this.item.Id,
                        },
                        (result2: ResultModel) => {
                            if (result2.Code == ResultCode.Success) {
                                this.item.linhvucselect = result2.Result.map(
                                    (item: any) => item.Id
                                );
                            }
                        },
                        () => { }
                    );
                }
            },
            () => { }
        );
    }
    cancel() {
        this.ref.close();
    }
    onKeyUp(event: any) {
        if (event.keyCode == 13) {
        }
    }
    getMaps() {
        var myArray = [11.9374669, 108.4374414];
        var myArray1 = [];
        if (this.item.ToaDo == '' || this.item.ToaDo == null) {
        } else {
            myArray1 = this.item.ToaDo.split(',');
        }
        if (myArray1.length == 2) {
            myArray = myArray1;
        }
    
    }

    submit() {
        // if (this.item.LoaiHinhNopThue == null || this.item.LoaiHinhNopThue == 0) {
        //     this.toastr.error('Vui lòng chọn loại hình khai thuế!', 'Cảnh báo', {
        //         timeOut: 3000,
        //     });
        //     return;
        // }

        if (this.item.TenNguoiNopThue == null || this.item.TenNguoiNopThue == '') {
            this.toastr.error('Vui lòng nhập tên người nộp thuế!', 'Cảnh báo', {
                timeOut: 3000,
            });
            return;
        }

        var ngayCapGCN;
        var ngayCapMST;

        if (this.item.NgayCapGCN != '' && this.item.NgayCapGCN != null) {
            ngayCapGCN = moment(this.item.NgayCapGCN, "DD/MM/YYYY").toDate()
        }

        if (this.item.NgayCapMST != '' && this.item.NgayCapMST != null) {
            ngayCapMST = moment(this.item.NgayCapMST, "DD/MM/YYYY").toDate()
        }


        /** this.item.TinhTrangQuanLy = 0;
        this.item.LoaiHinhNopThue = 0;
        this.item.TrangThaiChuaCoMST = 0;
       // this.item.TrangThaiChuaKhoan = 0;
        this.item.TraGpKhongKD6Thang = 0; */
        if (this.item.MaSoThue) {
            this.item.TrangThaiChuaCoMST = 0;
            // this.item.TrangThaiChuaKhoan = 0;
            // this.item.TinhTrangQuanLy = 0;
            if (!ngayCapMST) {
                this.toastr.error('Vui lòng nhập ngày cấp MST!', 'Cảnh báo', {
                    timeOut: 3000,
                });
                return;
            }
        }
        // debugger
        if (!this.item.MaSoThue) {
            if (this.item.TinhTrangQuanLy == 0 && this.item.TrangThaiChuaCoMST == 0 && (this.item.TraGpKhongKD6Thang == 0 || this.item.TraGpKhongKD6Thang == null)) {
                this.toastr.error('Vui lòng chọn lý do chưa cấp MST!', 'Cảnh báo', {
                    timeOut: 3000,
                });
                return;
            }
        }
        if (ngayCapMST) {
            if (!this.item.MaSoThue) {
                this.toastr.error('Vui lòng nhập MST!', 'Cảnh báo', {
                    timeOut: 3000,
                });
                return;
            }
        }
        if (this.item.DoanhThuBQThang) {
            if (!this.item.LoaiHinhNopThue) {
                this.toastr.error('Vui lòng chọn loại hình khai thuế!', 'Cảnh báo', {
                    timeOut: 3000,
                });
                return;
            }
        }
        var trangThai = this.hkdStatuses.filter(x => { return x.value == this.item.TrangThaiDKTToChucRef });

        var tenTrangThai = trangThai.length > 0 ? trangThai[0].labelDBI : "";



        if (this.config.data.IsAdd) {
            //Add
            this.http.post(
                'HoKinhDoanhAdmin/ThemHoKinhDoanh',
                {
                    TenNguoiNopThue: this.item.TenNguoiNopThue,
                    TenHoKinhDoanh: this.item.TenHoKinhDoanh,
                    SoGiayChungNhan: this.item.SoGiayChungNhan,
                    NgayCapGCN: ngayCapGCN,
                    NgayCapMST: ngayCapMST,
                    TienPhatCapMSTTre: this.item.TienPhatCapMSTTre,
                    QuyetDinhPhatCapMSTTre: this.item.QuyetDinhPhatCapMSTTre,
                    TenBangHieu: this.item.TenBangHieu,
                    DiaChi: this.diaChi,
                    Fax: this.item.Fax,
                    Email: this.item.Email,
                    Website: this.item.Website,
                    PhoneNumber: this.item.PhoneNumber,
                    VonKinhDoanh: this.item.VonKinhDoanh,
                    HoTenChuHo: this.item.HoTenChuHo,
                    HoKhauChuHo: this.item.HoKhauChuHo,
                    DiaChiChuHo: this.item.DiaChiChuHo,
                    ToaDo: this.item.ToaDo,
                    TinhTrangHoatDong: this.item.TinhTrangHoatDong,
                    TinhTrangNopThue: this.item.TinhTrangNopThue,
                    DoanhThu: this.item.DoanhThu,
                    MaSoThue: this.item.MaSoThue,
                    SoLanIn: this.item.SoLanIn,
                    NgayIn: this.item.NgayIn,
                    LocationProvinceId: this.province[0].Id,
                    LocationDistrictId: this.district[0].Id,
                    LocationWardId: this.item.LocationWardId,
                    LocationStreetId: this.item.LocationStreetId,
                    LoaiHinhNopThue: this.item.LoaiHinhNopThue,
                    TrangThaiDKTToChucRef: this.item.TrangThaiDKTToChucRef,
                    TenTrangThaiDKTToChuc: tenTrangThai,
                    TinhTrangQuanLy: this.item.TinhTrangQuanLy,
                    TrangThaiChuaCoMST: this.item.TrangThaiChuaCoMST,
                    TrangThaiChuaKhoan: this.item.TrangThaiChuaKhoan,
                    DoanhThuBQThang: this.item.DoanhThuBQThang,
                    ThueGTGT: this.item.ThueGTGT,
                    ThueTNCN: this.item.ThueTNCN,
                    ThueMonBai: this.item.ThueMonBai,
                    ThueTTDB: this.item.ThueTTDB,
                    TraGpKhongKD6Thang: this.item.TraGpKhongKD6Thang,
                    ThueTNCNKeKhai: this.item.ThueTNCNKeKhai,
                    KyNopThueNam: this.item.KyNopThueNam,
                    KyNopThueQuy: this.item.KyNopThueQuy,
                    ThueGTGTKeKhai: this.item.ThueGTGTKeKhai,
                    DoanhThuTinhThueKeKhai: this.item.DoanhThuTinhThueKeKhai,
                    Description: this.item.Description
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                        this.toastr.success('Thành công', 'Thêm hộ kinh doanh', {
                            timeOut: 3000,
                        });
                        this.ref.close({ confirm: 'yes' });
                        this.item.Id = result.Message;
                        this.item.linhvucselect.forEach((e: any) => {
                            this.http.post(
                                'GeneralCategory/ThemLinhVuc',
                                {
                                    LinhVucId: e,
                                    HoKinhDoanhId: this.item.Id,
                                },
                                (result: ResultModel) => {
                                    if (result.Code == ResultCode.Success) {

                                    }
                                },
                                () => { }
                            );
                        });
                    } else {
                        this.toastr.error('Thất bại', result.Message,
                            {
                                timeOut: 3000,
                            }
                        );
                    }
                },
                () => { }
            );
        } else {
            //Edit
            this.http.post(
                'HoKinhDoanhAdmin/SuaHoKinhDoanh',
                {
                    Id: this.item.Id,
                    TenNguoiNopThue: this.item.TenNguoiNopThue,
                    TenHoKinhDoanh: this.item.TenHoKinhDoanh,
                    SoGiayChungNhan: this.item.SoGiayChungNhan,
                    NgayCapGCN: ngayCapGCN,
                    NgayCapMST: ngayCapMST,
                    TienPhatCapMSTTre: this.item.TienPhatCapMSTTre,
                    QuyetDinhPhatCapMSTTre: this.item.QuyetDinhPhatCapMSTTre,
                    TenBangHieu: this.item.TenBangHieu,
                    DiaChi: this.diaChi,
                    Fax: this.item.Fax,
                    Email: this.item.Email,
                    Website: this.item.Website,
                    PhoneNumber: this.item.PhoneNumber,
                    VonKinhDoanh: this.item.VonKinhDoanh,
                    HoTenChuHo: this.item.HoTenChuHo,
                    HoKhauChuHo: this.item.HoKhauChuHo,
                    DiaChiChuHo: this.item.DiaChiChuHo,
                    ToaDo: this.item.ToaDo,
                    TinhTrangHoatDong: this.item.TinhTrangHoatDong,
                    TinhTrangNopThue: this.item.TinhTrangNopThue,
                    CoHoaDon: this.item.CoHoaDon,
                    DoanhThu: this.item.DoanhThu,
                    NopThue: this.item.NopThue,
                    NoThue: this.item.NoThue,
                    MaSoThue: this.item.MaSoThue,
                    SoLanIn: this.item.SoLanIn,
                    NgayIn: this.item.NgayIn,
                    LocationProvinceId: this.province[0].Id,
                    LocationDistrictId: this.district[0].Id,
                    LocationWardId: this.item.LocationWardId,
                    LocationStreetId: this.item.LocationStreetId,
                    LoaiHinhNopThue: this.item.LoaiHinhNopThue,
                    TrangThaiDKTToChucRef: this.item.TrangThaiDKTToChucRef,
                    TenTrangThaiDKTToChuc: tenTrangThai,
                    TrangThaiChuaCoMST: this.item.TrangThaiChuaCoMST,
                    TrangThaiChuaKhoan: this.item.TrangThaiChuaKhoan,
                    TinhTrangQuanLy: this.item.TinhTrangQuanLy,
                    DoanhThuBQThang: this.item.DoanhThuBQThang,
                    ThueGTGT: this.item.ThueGTGT,
                    ThueTNCN: this.item.ThueTNCN,
                    ThueMonBai: this.item.ThueMonBai,
                    ThueTTDB: this.item.ThueTTDB,
                    TraGpKhongKD6Thang: this.item.TraGpKhongKD6Thang,
                    ThueTNCNKeKhai: this.item.ThueTNCNKeKhai,
                    KyNopThueNam: this.item.KyNopThueNam,
                    KyNopThueQuy: this.item.KyNopThueQuy,
                    ThueGTGTKeKhai: this.item.ThueGTGTKeKhai,
                    DoanhThuTinhThueKeKhai: this.item.DoanhThuTinhThueKeKhai,
                    Description: this.item.Description
                },
                (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                        this.toastr.success('Thành công', 'Sửa hộ kinh doanh',
                            {
                                timeOut: 3000,
                            }
                        );
                        this.http.post(
                            'GeneralCategory/XoaLinhVuc',
                            {
                                Id: this.item.Id,
                            },
                            (result: ResultModel) => {
                                if (result.Code == ResultCode.Success) {

                                    this.ref.close({ confirm: 'yes' });
                                    if (this.item.linhvucselect && this.item.linhvucselect.length > 0) {
                                        this.item.linhvucselect.forEach((e: any) => {
                                            this.http.post(
                                                'GeneralCategory/ThemLinhVuc',
                                                {
                                                    LinhVucId: e,
                                                    HoKinhDoanhId: this.item.Id,
                                                },
                                                (result: ResultModel) => {
                                                    if (result.Code == ResultCode.Success) {
                                                        this.ref.close({ confirm: 'yes' });

                                                    }
                                                },
                                                () => { }
                                            );
                                        });
                                    }
                                    //  else {
                                    //   this.ref.close({ confirm: 'yes' });
                                    //   this.toastr.success(
                                    //     'Thành công',
                                    //     'Sửa hộ kinh doanh',
                                    //     {
                                    //       timeOut: 3000,
                                    //     }
                                    //   );
                                    // }

                                }
                            },
                            () => { }
                        );
                    } else {
                        this.toastr.error('Thất bại', result.Message,
                            {
                                timeOut: 3000,
                            }
                        );
                    }
                },
                () => {
                }
            );
        }
    }
    selectedPlaceChange(event: any) { }
    validateCustomMaxlength(item: string, maxLength: number, name: string) {
        if (item.length > maxLength) {
            this.toastr.error(name + ' quá dài', 'Cảnh báo', {
                timeOut: 3000,
            });
            return true;
        }
        return false;
    }
    isEmail(str: string): boolean {
        var regexp = new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        return regexp.test(str);
    }
    isName(str: string): boolean {
        // str = str.toLowerCase();
        // str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        // str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        // str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        // str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        // str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        // str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        // str = str.replace(/đ/g, 'd');
        // var regexName = /^[a-zA-Z' ]{2,}$/g;
        // return regexName.test(str);
        return true;
    }

    getInfoBySo() {

        this.http.get(
            `HoKinhDoanhAdmin/GetInfoBySoGiayPhep/${this.item.SoGiayChungNhan}`,
            (result: ResultModel) => {
                this.item.TenNguoiNopThue = result.Result.HoTen;
                this.item.TenBangHieu = result.Result.TenBangHieu;
                this.item.NgayCapGCN = result.Result.NgayCap != null ? moment(result.Result.NgayCap).format("DD/MM/YYYY") : new Date();
                this.item.VonKinhDoanh = result.Result.VonKinhDoanh;
                this.item.MaSoThue = result.Result.MaSoThue;
                this.item.LocationWardId = result.Result.LocationWardId;
                // this.item.LocationStreetId = result.Result.LocationStreetId;
                this.diaChi = result.Result.DiaChi;
                this.item.PhoneNumber = result.Result.DienThoai;
                this.loadStreets();
            },
            () => {
            }
        );
    }
    changeTinhTrangQuanLy(event: any) {
        // this.item.TinhTrangQuanLy = 0;
        this.item.LoaiHinhNopThue = 0;
        this.item.TrangThaiChuaCoMST = 0;
        this.item.TrangThaiChuaKhoan = 0;
        this.item.TraGpKhongKD6Thang = 0;
    }
    changeLoaiHinh(event: any) {
        this.item.TinhTrangQuanLy = 0;
        // this.item.LoaiHinhNopThue = 0;
        this.item.TrangThaiChuaCoMST = 0;
        this.item.TrangThaiChuaKhoan = 0;
        this.item.TraGpKhongKD6Thang = 0;
    }
    changeTrangThaiChuaCoMST(event: any) {
        this.item.TinhTrangQuanLy = 0;
        this.item.LoaiHinhNopThue = 0;
        // this.item.TrangThaiChuaCoMST = 0;
        this.item.TrangThaiChuaKhoan = 0;
        this.item.TraGpKhongKD6Thang = 0;
    }
    changeTrangThaiChuaKhoan(event: any) {
        this.item.TinhTrangQuanLy = 0;
        this.item.LoaiHinhNopThue = 0;
        this.item.TrangThaiChuaCoMST = 0;
        // this.item.TrangThaiChuaKhoan = 0;
        this.item.TraGpKhongKD6Thang = 0;
    }
    changeTraGpKhongKD6Thang(event: any) {
        this.item.TinhTrangQuanLy = 0;
        this.item.LoaiHinhNopThue = 0;
        this.item.TrangThaiChuaCoMST = 0;
        this.item.TrangThaiChuaKhoan = 0;
        //this.item.TraGpKhongKD6Thang = 0;
    }
}
