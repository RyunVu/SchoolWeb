import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SearchEntity } from 'src/app/shared';
import { PermitPageService } from '../../services';
import { HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';
import { ViewAnswerModal } from './view-answer.modal';

@Component({
  standalone: false,
  // tslint:disable-next-line: component-selector
  selector: 'feedback-tax-page',
  templateUrl: './feedback-tax-page.component.html',
  styleUrls: ['./feedback-tax-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackTaxPageComponent implements OnInit {
  keywordInput: any;
  item: any = {};
  pageSize: number = 10;
  pageIndex: number = 1;
  keyword: any;
  totalRow: number = 0;
  sortField: string = '';
  sortOrder: boolean = false;
  loading: boolean = false;
  filters: any = {};
  answers: any = [];
  district: any[] = [
    {
      Id: '77E7C896-26DD-476B-8C1C-6E151D87D0A0',
      Name: 'Đà Lạt',
    },
  ];
  city: any;
  wards: any[] = [];
  ward: any;
  constructor(
    private messageService: MessageService,
    private permitService: PermitPageService,
    public http: HttpService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
  ) {
    this.item = {
      Id: null,
      LocationWardId: '',
      LocationDistrictId: '',
      Content: '',
      TaxCode: '',
      FullName: '',
      PhoneNumber: '',
      DiaChi: '',
    };
    this.item.LocationDistrictId = this.district[0].Id
  }

  ngOnInit(): void {
    this.loadWards();
  }
  loadWards() {
    this.http.post(
      'Location/GetWards',
      {
        ParentId: this.item.LocationDistrictId,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.wards = result.Result;
          this.wards.unshift({ Id: null, Name: 'Tất cả' });
          this.item.LocationWardId = this.wards[0].Id;
        }
      },
      () => {}
    );
  }
  submit() {
    if (this.item.TaxCode == null || this.item.TaxCode == '') {
      this.toastr.error('Thiếu trường Mã số thuế', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    } else if (
      this.validateCustomMaxlength(this.item.TaxCode, 20, 'Mã số thuế')
    ) {
      this.toastr.error('Mã số thuế quá dài', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }
    if (this.item.PhoneNumber == null || this.item.PhoneNumber == '') {
      this.toastr.error('Thiếu trường Số điện thoại', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    } else  if (
      this.validateCustomMaxlength(this.item.PhoneNumber, 12, 'Số điện thoại')
    ) {
      this.toastr.error('Số điện thoại quá dài', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }
    if (this.item.LocationDistrictId == null || this.item.LocationDistrictId == '') {
      this.toastr.error('Thiếu trường Thành phố/huyện', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }if (this.item.LocationWardId == null || this.item.LocationWardId == '') {
      this.toastr.error('Thiếu trường Phường/xã', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }
    if (this.item.Content == null || this.item.Content == '') {
      this.toastr.error('Thiếu trường Nội dung', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    } else if (
      this.validateCustomMaxlength(this.item.Content, 4000, 'Nội dung')
    ) {
      this.toastr.error('Nội dung quá dài', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }
    this.http.post(
      'Feedback/ThemFeedback',
      {
        PhoneNumber: this.item.PhoneNumber,
        Content: this.item.Content,
        TaxCode: this.item.TaxCode,
        FullName: this.item.FullName,
        Description: this.item.DiaChi,
        LocationDistrictId: this.item.LocationDistrictId,
        LocationWardId: this.item.LocationWardId,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.toastr.success('Thành công', 'Thêm ý kiến phản hổi', {
            timeOut: 3000,
          });
          this.loadData();
          this.item.TaxCode =
            this.item.FullName =
            this.item.PhoneNumber =
            this.item.DiaChi =
            this.item.Content =
              '';
          this.item.LocationWardId = null;
          this.loadData();
        }
      },
      () => {}
    );
  }
  search() {
    this.pageIndex = 1;
    this.keyword = this.keywordInput;
    this.loadData();
  }
  clearfilter() {
    this.pageIndex = 1;
    this.keywordInput = null;
    this.ward = this.wards[0].Id;
    this.loadData();
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
      'Feedback/ListFeedbacksNguoiDung',
      {
        TaxCode: this.keywordInput,
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.answers = result.Result;
          this.totalRow = result.TotalRow;
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
  paginate(event: any) {
    this.pageSize = event.rows ?? 10;
    var first = event.first ?? 0;
    this.pageIndex = Math.floor(first / this.pageSize) + 1;
    this.sortOrder = event.sortOrder == 1 ? true : false;
    this.sortField = event.sortField ?? '';
    this.filters = event.filters;
    setTimeout(() => {
      this.loadData();
    }, 100);
  }
  validateCustomMaxlength(item: string, maxLength: number, name: string) {
    if (item.length > maxLength) {
      this.toastr.error(name + ' quá dài', 'Cảnh báo', {
        timeOut: 3000,
      });
      return true;
    }
    return false;
  }
  isName(str: string): boolean {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    var regexName = /^[a-zA-Z' ]{2,}$/g;
    return regexName.test(str);
  }
  ViewAnswer(item: any)
  {
    const ref = this.dialogService
      .open(ViewAnswerModal, {
        data: {
          IsAdd: false,
          item: item,
        },
        header: 'Câu hỏi - trả lời',
        width: '55%',
      })!
      .onClose.subscribe((data: any) => {
        if (data) {
          this.loadData();
        }
      });
  }
}
