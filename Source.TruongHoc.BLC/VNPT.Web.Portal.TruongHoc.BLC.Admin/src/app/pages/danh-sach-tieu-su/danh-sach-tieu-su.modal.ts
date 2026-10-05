import { Component, ViewEncapsulation } from '@angular/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { FileManagerModal } from 'src/app/components/file-manager/file-manager.component';

import * as moment from 'moment';
import { BaiVietTieuSuModal } from './bai-viet-tieu-su.modal';

@Component({
  selector: 'danh-sach-tieu-su-modal',
  templateUrl: 'danh-sach-tieu-su.modal.html',
  styleUrls: ['./danh-sach-tieu-su.modal.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DanhSachTieuSuModal {
  item: any;
  itemChucVus: any = [];
  itemDanTocs: any = [];
  itemTonGiaos: any = [];
  currentDate: any;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public http: HttpService,
    private message: MessageService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {
    this.item = {
      Id: null,
      LoaiChucVuId: null,
      HoTen: null,
      Alias: null,
      BiDanh: null,
      NgaySinh: null,
      NgaySinhString: null,
      QueQuan: null,
      NoiThuongTru: null,
      DanTocId: null,
      TonGiaoId: null,
      NgayVaoDang: null,
      NgayVaoDangString: null,
      NgayChinhThuc: null,
      NgayChinhThucString: null,
      KhenThuong: null,
      TrinhDoLyLuanChinhTri: null,
      TrinhDoChuyenMon: null,
      SDT: null,
      QTCTlst: [],
      HAHDlst: [],
      BPBlst: [],
      UrlAvt1: null,
      UrlAvt2: null,
      ChucVu: null,
      TuNgayDenNgay: null,
    };
    if (this.config.data.item != null) {
      this.item = JSON.parse(JSON.stringify(this.config.data.item));
    }
    if (!this.config.data.IsAdd) {
      if (this.item.NgaySinhString != '' && this.item.NgaySinhString != null)
        this.item.NgaySinh = moment(
          this.item.NgaySinhString,
          'DD/MM/YYYY'
        ).toDate();
      if (
        this.item.NgayVaoDangString != '' &&
        this.item.NgayVaoDangString != null
      )
        this.item.NgayVaoDang = moment(
          this.item.NgayVaoDangString,
          'DD/MM/YYYY'
        ).toDate();
      if (
        this.item.NgayChinhThucString != '' &&
        this.item.NgayChinhThucString != null
      )
        this.item.NgayChinhThuc = moment(
          this.item.NgayChinhThucString,
          'DD/MM/YYYY'
        ).toDate();
      for (let index = 0; index < this.item.QTCTlst.length; index++) {
        if (
          this.item.QTCTlst[index].TuNgayString != '' &&
          this.item.QTCTlst[index].TuNgayString != null
        ) {
          this.item.QTCTlst[index].TuNgay = moment(
            this.item.QTCTlst[index].TuNgayString,
            'MM/YYYY'
          ).toDate();
        }
        if (
          this.item.QTCTlst[index].DenNgayString != '' &&
          this.item.QTCTlst[index].DenNgayString != null
        ) {
          this.item.QTCTlst[index].DenNgay = moment(
            this.item.QTCTlst[index].DenNgayString,
            'MM/YYYY'
          ).toDate();
        }
      }
      for (let index = 0; index < this.item.BPBlst.length; index++) {
        this.item.BPBlst[index].NgayDangSaveString =
          this.item.BPBlst[index].NgayDangString;
      }
    } else {
      this.currentDate = new Date();
      this.item.NgaySinh = this.currentDate;
    }
    this.loadChucVu();
    this.loadTonGiao();
    this.loadDanToc();
  }
  loadChucVu() {
    this.http.post(
      'GeneralCategory/Items',
      { Code: 'ChucVuPtt' },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.itemChucVus = result.Result;
          if (this.config.data.IsAdd) {
            this.item.LoaiChucVuId =
              this.itemChucVus.length > 0 ? result.Result[0].Id : null;
          }
        }
      },
      () => {}
    );
  }
  loadDanToc() {
    this.http.post(
      'GeneralCategory/Items',
      { Code: 'DanToc' },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.itemDanTocs = result.Result;
          if (this.config.data.IsAdd) {
            this.item.DanTocId =
              this.itemDanTocs.length > 0 ? result.Result[0].Id : null;
          }
        }
      },
      () => {}
    );
  }
  loadTonGiao() {
    this.http.post(
      'GeneralCategory/Items',
      { Code: 'TonGiao' },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.itemTonGiaos = result.Result;
          if (this.config.data.IsAdd) {
            this.item.TonGiaoId =
              this.itemTonGiaos.length > 0 ? result.Result[0].Id : null;
          }
        }
      },
      () => {}
    );
  }
  ngOnInit() {}
  addQTCT() {
    this.item.QTCTlst.push({
      ThuTu: this.item.QTCTlst.length + 1,
      TuNgayDenNgay: null,
      NoiDung: '',
    });
  }
  addHAHD() {
    this.item.HAHDlst.push({});
  }
  addBPB() {
    const ref = this.dialogService
      .open(BaiVietTieuSuModal, {
        data: {
          IsAdd: true,
        },
        header: 'Thêm mới bài viết',
        width: '70%',
      })
      .onClose.subscribe((data: any) => {
        if (data) {
          this.item.BPBlst.push({
            NgayDang: data.data.NgayDang,
            NgayDangSaveString: data.data.NgayDangSaveString,
            TieuDe: data.data.TieuDe,
            MoTaNgan: data.data.MoTaNgan,
            NoiDung: data.data.NoiDung,
          });
        }
      });
  }
  editBPB(item: any) {
    const ref = this.dialogService
      .open(BaiVietTieuSuModal, {
        data: {
          IsAdd: false,
          item: item,
        },
        header: 'Chỉnh sửa bài viết',
        width: '70%',
      })
      .onClose.subscribe((data: any) => {
        if (data) {
          this.item.BPBlst.splice(this.item.BPBlst.indexOf(item), 1);
          this.item.BPBlst.push({
            NgayDang: data.data.NgayDang,
            NgayDangSaveString: data.data.NgayDangSaveString,
            TieuDe: data.data.TieuDe,
            MoTaNgan: data.data.MoTaNgan,
            NoiDung: data.data.NoiDung,
          });
        }
      });
  }
  minusBPB(item: any) {
    this.confirmationService.confirm({
      message:
        'Bạn có chắc chắn muốn xoá bài phát biểu ' + item.TieuDe + ' không?',
      accept: () => {
        this.item.BPBlst.splice(this.item.BPBlst.indexOf(item), 1);
      },
    });
  }
  minusHAHD(item: any) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xoá hình ảnh ' + item.TenHinh + ' không?',
      accept: () => {
        this.item.HAHDlst.splice(this.item.HAHDlst.indexOf(item), 1);
      },
    });
  }
  minusQTCT(item: any) {
    this.confirmationService.confirm({
      message:
        'Bạn có chắc chắn muốn xoá quá trình công tác ' +
        item.NoiDung +
        ' không?',
      accept: () => {
        this.item.QTCTlst.splice(this.item.QTCTlst.indexOf(item), 1);
      },
    });
  }
  openFileDilog(item: any) {
    const index: number = this.item.HAHDlst.indexOf(item);
    const ref = this.dialogService
      .open(FileManagerModal, {
        data: {
          filetype: 'image',
          multipleselect: false,
        },
        header: 'Quản lý file',
        width: '70%',
      })
      .onClose.subscribe((data: any) => {
        if (data) {
          var fileUrls = data.urls;
          fileUrls.forEach((element: any) => {
            this.item.HAHDlst[index].Url = element.Url;
          });
        }
      });
  }
  openFileDilogAvt(item: any) {
    const ref = this.dialogService
      .open(FileManagerModal, {
        data: {
          filetype: 'image',
          multipleselect: false,
        },
        header: 'Quản lý file',
        width: '70%',
      })
      .onClose.subscribe((data: any) => {
        if (data) {
          var fileUrls = data.urls;
          fileUrls.forEach((element: any) => {
            item == 'avt1'
              ? (this.item.UrlAvt1 = element.Url)
              : (this.item.UrlAvt2 = element.Url);
          });
        }
      });
  }
  deleteImage(img: any) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xoá hình ảnh này không?',
      accept: () => {
        img == 'avt1' ? (this.item.UrlAvt1 = null) : (this.item.UrlAvt2 = null);
      },
    });
  }
  cancel() {
    this.ref.close();
  }

  onKeyUp(event: any) {
    if (event.keyCode == 13) {
    }
  }
  submit() {
    if (this.item.HoTen == null || this.item.HoTen == '') {
      this.toastr.warning('Vui lòng nhập họ tên', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }
    this.item.NgaySinhSaveString = this.item.NgaySinh
      ? moment(this.item.NgaySinh).format('DD/MM/YYYY')
      : null;
    this.item.NgayVaoDangSaveString = this.item.NgayVaoDang
      ? moment(this.item.NgayVaoDang).format('DD/MM/YYYY')
      : null;
    this.item.NgayChinhThucSaveString = this.item.NgayChinhThuc
      ? moment(this.item.NgayChinhThuc).format('DD/MM/YYYY')
      : null;
    for (let index = 0; index < this.item.QTCTlst.length; index++) {
      const element = this.item.QTCTlst[index];
      if (
        element.NoiDung == '' ||
        element.NoiDung == null ||
        element.NoiDung == undefined
      ) {
        this.toastr.warning('Vui lòng nhập nội dung', 'Cảnh báo', {
          timeOut: 3000,
        });
        return;
      }
      // element.TuNgaySaveString = element.TuNgay
      //   ? moment(element.TuNgay).format('MM/YYYY')
      //   : null;
      // element.DenNgaySaveString = element.DenNgay
      //   ? moment(element.DenNgay).format('MM/YYYY')
      //   : null;
    }
    for (let index = 0; index < this.item.HAHDlst.length; index++) {
      const element = this.item.HAHDlst[index];
      if (
        element.Url == '' ||
        element.Url == null ||
        element.Url == undefined
      ) {
        this.toastr.warning('Vui lòng chọn hình ảnh', 'Cảnh báo', {
          timeOut: 3000,
        });
        return;
      }
    }
    for (let index = 0; index < this.item.BPBlst.length; index++) {
      const element = this.item.BPBlst[index];
      if (
        element.TieuDe == '' ||
        element.TieuDe == null ||
        element.TieuDe == undefined
      ) {
        this.toastr.warning('Vui lòng nhập tiêu đề', 'Cảnh báo', {
          timeOut: 3000,
        });
        return;
      }
      element.NgayDangSaveString = element.NgayDang
        ? moment(element.NgayDang).format('DD/MM/YYYY')
        : null;
    }
    this.http.post(
      'TieuSu/Save',
      {
        Id: !this.config.data.IsAdd ? this.item.Id : null,
        LoaiChucVuId: this.item.LoaiChucVuId,
        HoTen: this.item.HoTen,
        Alias: this.item.Alias,
        BiDanh: this.item.BiDanh,
        SDT: this.item.SDT,
        NgaySinhSaveString: this.item.NgaySinhSaveString,
        QueQuan: this.item.QueQuan,
        NoiThuongTru: this.item.NoiThuongTru,
        TonGiaoId: this.item.TonGiaoId,
        DanTocId: this.item.DanTocId,
        NgayVaoDangSaveString: this.item.NgayVaoDangSaveString,
        NgayChinhThucSaveString: this.item.NgayChinhThucSaveString,
        KhenThuong: this.item.KhenThuong,
        TrinhDoChuyenMon: this.item.TrinhDoChuyenMon,
        TrinhDoLyLuanChinhTri: this.item.TrinhDoLyLuanChinhTri,
        QTCTlst: this.item.QTCTlst,
        HAHDlst: this.item.HAHDlst,
        BPBlst: this.item.BPBlst,
        UrlAvt1: this.item.UrlAvt1,
        UrlAvt2: this.item.UrlAvt2,
        ChucVu: this.item.ChucVu,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.ref.close({ confirm: 'yes' });
          this.toastr.success('Lưu thông tin thành công!', 'Thành công', {
            timeOut: 3000,
          });
        } else {
          this.toastr.error(result.Message, 'Thất bại', {
            timeOut: 3000,
          });
        }
        if (result.Code == 414) {
          this.toastr.error('Lưu thông tin thất bại!', 'Cảnh báo', {
            timeOut: 3000,
          });
          return;
        }
      },
      () => {}
    );
  }
}
