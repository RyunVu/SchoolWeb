import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, BaseService, HttpService } from 'src/app/services';
import { OTPCheckModal } from '../systems/user/otpcheck.modal';
import { UserModal } from '../systems/user/user.modal';
import { PopupImageModal } from '../feedbacks/feedback/popupImage.modal';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { DanhSachNhiemKyModal } from './danh-sach-nhiem-ky.modal';
import { CanBoNhiemKyModal } from './can-bo-nhiem-ky.modal';

@Component({
  standalone: false,
  selector: 'app-danh-sach-nhiem-ky',
  templateUrl: './danh-sach-nhiem-ky.component.html',
  styleUrls: ['./danh-sach-nhiem-ky.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DanhSachNhiemKyComponent extends BasePage {
  @ViewChild('dt', { static: false }) dt: any;

  items: any[] = [];
  pageSize: number = 20;
  pageIndex: number = 1;
  totalRow: number = 0;
  sortField: string = '';
  sortOrder: boolean = false;
  loading: boolean = false;
  oldEvent: any;
  filters: any = {};
  keywordInput: any;
  locations: any[] = [];
  location: any = null;
  itemLoaiNhiemKys: any[] = [];
  itemLoaiNhiemKy: any = null;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public http: HttpService,
    public message: MessageService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private baseService: BaseService,
    private toastr: ToastrService
  ) {
    super(router, route, http, message);
    this.loadNhiemKy();
  }

  paginate(event: TableLazyLoadEvent) {
    if (this.oldEvent == null || event == this.oldEvent) {
      this.oldEvent = event;
      return;
    }
    this.oldEvent = event;
    this.pageSize = event.rows ?? 10;
    var first = event.first ?? 0;
    this.pageIndex = Math.floor(first / this.pageSize) + 1;

    this.sortOrder = event.sortOrder == 1 ? true : false;
    this.sortField = (event.sortField as string) ?? '';
    this.filters = event.filters;
    setTimeout(() => {
      this.loadData();
    }, 100);
  }

  onInit(): void {}

  add() {
    const ref = this.dialogService
      .open(DanhSachNhiemKyModal, {
        data: {
          IsAdd: true,
          Code: this.parameter,
        },
        header: 'Thêm mới nhiệm kỳ',
        width: '60%',
      })!
      .onClose.subscribe((data: any) => {
        if (data) {
          this.loadData();
        }
      });
  }
  loadNhiemKy() {
    this.http.post(
      'GeneralCategory/ItemsV2',
      { Code: 'LoaiNhiemKy' },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.itemLoaiNhiemKys = result.Result;
          if (this.itemLoaiNhiemKys.length > 0) {
            this.itemLoaiNhiemKy = this.itemLoaiNhiemKys[0].Value;
          }
          this.loadData();
        }
      },
      () => {}
    );
  }
  edit(item: any) {
    const ref = this.dialogService
      .open(DanhSachNhiemKyModal, {
        data: {
          IsAdd: false,
          item: item,
          Code: this.parameter,
        },
        header: 'Cập nhật nhiệm kỳ',
        width: '60%',
      })!
      .onClose.subscribe((data: any) => {
        if (data) {
          this.loadData();
        }
      });
  }
  cbnk(item: any) {
    if (item.CVNKlst.length == 0) {
      this.toastr.warning(
        'Nhiệm kỳ chưa có chức vụ nào được chọn',
        'Cảnh báo',
        {
          timeOut: 3000,
        }
      );
    } else {
      const ref = this.dialogService
        .open(CanBoNhiemKyModal, {
          data: {
            item: item,
          },
          header: 'Cập nhật cán bộ nhiệm kỳ',
          width: '50%',
        })!
        .onClose.subscribe((data: any) => {
          if (data) {
            this.loadData();
          }
        });
    }
  }

  delete(item: any) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xoá nhiệm kỳ của ' + item.Ten + ' không?',
      accept: () => {
        this.http.post(
          'NhiemKy/Delete',
          {
            Id: item.Id,
          },
          (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
              this.loadData();
            }
          },
          () => {}
        );
      },
    });
  }

  loadPage(): void {
    this.pageIndex = 1;
    if (this.dt != null) {
      this.refresh();
    }
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.http.post(
      'NhiemKy/List',
      {
        Keyword: this.keywordInput == '' ? null : this.keywordInput,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        Code: this.itemLoaiNhiemKy,
        IsPagination: true
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

  search() {
    this.pageIndex = 1;
    this.refresh();
    this.loadData();
  }

  clearfilter() {
    this.pageIndex = 1;
    this.keywordInput = null;
    this.refresh();
    this.loadData();
  }

  refresh() {
    this.dt.first = 0;
  }

  openPopupImage(item: any) {
    const ref = this.dialogService
      .open(PopupImageModal, {
        data: {
          items: item.ImageList,
        },
        header: 'Slideshow',
        width: '70%',
      })!
      .onClose.subscribe((data: any) => {});
  }
}
