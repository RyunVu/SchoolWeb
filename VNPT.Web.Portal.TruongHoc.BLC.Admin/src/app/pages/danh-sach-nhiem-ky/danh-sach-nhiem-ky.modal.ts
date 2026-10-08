import { Component, ViewEncapsulation } from '@angular/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { FileManagerModal } from 'src/app/components/file-manager/file-manager.component';

import moment from 'moment';

@Component({
  standalone: false,
  selector: 'danh-sach-nhiem-ky-modal',
  templateUrl: 'danh-sach-nhiem-ky.modal.html',
  styleUrls: ['./danh-sach-nhiem-ky.modal.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DanhSachNhiemKyModal {
  item: any;
  itemChucVus: any = [];
  itemLoaiNhiemKys: any = [];
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
      ThuTu: 1,
      Ten: null,
      TuNam: null,
      DenNam: null,
      CVNKlst: [],
      TypeId: null,
    };
    if (this.config.data.item != null) {
      this.item = JSON.parse(JSON.stringify(this.config.data.item));
    }
    this.loadChucVu();
    this.loadNhiemKy();
  }
  ngOnInit() {}

  loadChucVu() {
    this.http.post(
      'GeneralCategory/Items',
      { Code: 'ChucVuPTT' },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.itemChucVus = result.Result;
        }
      },
      () => {}
    );
  }
  
  loadNhiemKy() {
    this.http.post(
      'GeneralCategory/Items',
      { Code: 'CoQuanNhiemKyPTT' },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.itemLoaiNhiemKys = result.Result;
        }
      },
      () => {}
    );
  }
  addChucVu() {
    this.item.CVNKlst.push({ ThuTu: this.item.CVNKlst.length + 1 });
  }
  minusChucVu(item: any) {
    this.confirmationService.confirm({
      message:
        'Bạn có chắc chắn muốn xoá chức vụ ' + item.Name
          ? item.Name
          : 'thứ ' + item.ThuTu + ' không?',
      accept: () => {
        this.item.CVNKlst.splice(this.item.CVNKlst.indexOf(item), 1);
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
  checkExist(id: any, array: any[]) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (id == array[index]) {
        return true;
      }
    }
    return false;
  }
  submit() {
    if (this.item.ThuTu == null || this.item.ThuTu == '') {
      this.toastr.warning('Vui lòng nhập thứ tự', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }
    if (this.item.TypeId == null || this.item.TypeId == '') {
      this.toastr.warning('Vui lòng chọn loại nhiệm kỳ', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }
    if (this.item.TuNam == null || this.item.TuNam == '') {
      this.toastr.warning('Vui lòng nhập từ năm', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }
    if (this.item.CVNKlst.length > 0) {
      var arrayCheck = [];
      if (
        this.item.CVNKlst[0].ChucVuId == null ||
        this.item.CVNKlst[0].ChucVuId == undefined
      ) {
        this.toastr.warning('Vui lòng chọn chức vụ', 'Cảnh báo', {
          timeOut: 3000,
        });
        return;
      } else {
        arrayCheck.push(this.item.CVNKlst[0].ChucVuId);
      }
      for (let index = 1; index < this.item.CVNKlst.length; index++) {
        const elementCBCVNK = this.item.CVNKlst[index];
        if (
          elementCBCVNK.ChucVuId == undefined ||
          elementCBCVNK.ChucVuId == null
        ) {
          this.toastr.error('Vui lòng chọn cán bộ!', 'Cảnh báo', {
            timeOut: 3000,
          });
          return;
        }
        if (!this.checkExist(elementCBCVNK.ChucVuId, arrayCheck)) {
          arrayCheck.push(this.item.CVNKlst[index].ChucVuId);
        } else {
          this.toastr.error(
            'Không được chọn 2 chức vị giống nhau cho cùng 1 nhiệm kỳ!',
            'Cảnh báo',
            {
              timeOut: 3000,
            }
          );
          return;
        }
      }
    }
    this.http.post(
      'NhiemKy/Save',
      {
        Id: !this.config.data.IsAdd ? this.item.Id : null,
        ThuTu: this.item.ThuTu,
        Ten: this.item.Ten,
        TuNam: this.item.TuNam,
        DenNam: this.item.DenNam,
        CVNKlst: this.item.CVNKlst,
        TypeId: this.item.TypeId,
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
