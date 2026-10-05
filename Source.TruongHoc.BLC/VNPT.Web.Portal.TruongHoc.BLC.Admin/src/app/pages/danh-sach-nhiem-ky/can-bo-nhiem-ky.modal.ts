import { Component, ViewEncapsulation } from '@angular/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { FileManagerModal } from 'src/app/components/file-manager/file-manager.component';

import * as moment from 'moment';

@Component({
  selector: 'can-bo-nhiem-ky-modal',
  templateUrl: 'can-bo-nhiem-ky.modal.html',
  styleUrls: ['./can-bo-nhiem-ky.modal.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CanBoNhiemKyModal {
  item: any;
  itemChucVus: any = [];
  itemCanBos: any = [];
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
      CVNKlst: [],
    };
    if (this.config.data.item != null) {
      this.item = JSON.parse(JSON.stringify(this.config.data.item));
    }
    this.loadCanBo();
  }
  searchToPos(id: any, array: any[]) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (id == element.ChucVuId) {
        return index;
      }
    }
    return -1;
  }
  loadCanBo() {
    this.http.post(
      'TieuSu/List',
      {},
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.itemCanBos = result.Result;
        }
      },
      () => {}
    );
  }
  ngOnInit() {}
  cancel() {
    this.ref.close();
  }

  onKeyUp(event: any) {
    if (event.keyCode == 13) {
    }
  }
  addTieuSu(item: any) {
    var posChucVuId = this.searchToPos(item, this.item.CVNKlst);
    if (posChucVuId != -1) {
      this.item.CVNKlst[posChucVuId].CBCVNKlst.push({
        ThuTu: this.item.CVNKlst[posChucVuId].CBCVNKlst.length + 1,
      });
    }
  }
  minusTieuSu(item: any, ChucVuId: any) {
    for (let index = 0; index < this.item.CVNKlst.length; index++) {
      const element = this.item.CVNKlst[index];
      if (element.ChucVuId == ChucVuId) {
        this.confirmationService.confirm({
          message:
            'Bạn có chắc chắn muốn xoá cán bộ thứ ' + item.ThuTu + ' không?',
          accept: () => {
            this.item.CVNKlst[index].CBCVNKlst.splice(
              this.item.CVNKlst[index].CBCVNKlst.indexOf(item),
              1
            );
          },
        });
      }
    }
  }
  checkExist(id: any, array: any[]) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (id == array[index].TieuSuId) {
        return true;
      }
    }
    return false;
  }
  submit() {
    for (let index = 0; index < this.item.CVNKlst.length; index++) {
      const element = this.item.CVNKlst[index];
      var arrayCheck = [];
      if (element.CBCVNKlst.length > 0) {
        if (
          element.CBCVNKlst[0].TieuSuId == null ||
          element.CBCVNKlst[0].TieuSuId == undefined
        ) {
          this.toastr.warning('Vui lòng chọn cán bộ', 'Cảnh báo', {
            timeOut: 3000,
          });
          return;
        } else {
          arrayCheck.push(element.CBCVNKlst[0]);
        }
      }
      for (let index = 1; index < element.CBCVNKlst.length; index++) {
        const elementCBCVNK = element.CBCVNKlst[index];
        if (
          elementCBCVNK.TieuSuId == undefined ||
          elementCBCVNK.TieuSuId == null
        ) {
          this.toastr.error('Vui lòng chọn cán bộ!', 'Cảnh báo', {
            timeOut: 3000,
          });
          return;
        }
        if (!this.checkExist(elementCBCVNK.TieuSuId, arrayCheck)) {
          arrayCheck.push(element.CBCVNKlst[index]);
        } else {
          this.toastr.error(
            'Không được chọn 2 người giống nhau cho cùng 1 chức vị!',
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
      'NhiemKy/SaveCBCVNK',
      {
        Id: this.item.Id,
        CVNKlst: this.item.CVNKlst,
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
