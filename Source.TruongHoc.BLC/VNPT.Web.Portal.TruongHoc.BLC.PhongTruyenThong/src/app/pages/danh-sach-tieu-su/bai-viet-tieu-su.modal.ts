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
  selector: 'bai-viet-tieu-su-modal',
  templateUrl: 'bai-viet-tieu-su.modal.html',
  styleUrls: ['./bai-viet-tieu-su.modal.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BaiVietTieuSuModal {
  item: any;
  readonlyText: boolean = false;
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
        NgayDang: null,
        NgayDangString: null,
        TieuDe: null,
        MoTaNgan: null,
        NoiDung: null,
        NgayDangSaveString: null
    }
    if (!this.config.data.IsAdd) {
      this.item = JSON.parse(JSON.stringify(this.config.data.item));
      if (this.item.NgayDangString != '' && this.item.NgayDangString != null)
        this.item.NgayDang = moment(
          this.item.NgayDangString,
          'DD/MM/YYYY'
        ).toDate();
    } else {
      var currentDate = new Date();
      this.item.NgayDang = currentDate;
    }
  }

  ngOnInit() {}

  cancel() {
    this.ref.close();
  }

  onKeyUp(event: any) {
    if (event.keyCode == 13) {
    }
  }


  convertToUnsignChar(source: any) {
    source = source.toLowerCase();
    source = source.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    source = source.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    source = source.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    source = source.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    source = source.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    source = source.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    source = source.replace(/đ/g, 'd');
    source = source.replace(
      /!|@@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g,
      '-'
    );
    source = source.replace(/-+-/g, '-'); //thay thế nhiều dấu - thành 1 dấu -
    source = source.replace(/^\-+|\-+$/g, ''); //cắt bỏ ký tự - ở đầu và cuối chuỗi
    return source;
  }
  changeContent(event: any) {
    this.item.NoiDung = event;
  }
  submit() {
    if (this.item.TieuDe == null || this.item.TieuDe == '') {
      this.toastr.warning('Vui lòng nhập tiêu đề', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }
    this.item.NgayDangSaveString = this.item.NgayDang
      ? moment(this.item.NgayDang).format('DD/MM/YYYY')
      : null;
    this.ref.close({ data: this.item });
  }
}
