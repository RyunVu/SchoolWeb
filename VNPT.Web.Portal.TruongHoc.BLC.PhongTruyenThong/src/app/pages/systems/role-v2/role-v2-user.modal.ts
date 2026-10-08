import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: false,
  selector: 'role-v2-user-modal',
  templateUrl: 'role-v2-user.modal.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./role-v2-user.modal.scss'],
})
export class RoleV2UserModal {
  @ViewChild('dt', { static: false }) dt: any;
  item: any;
  items: any[] = [];
  loading: boolean = false;
  keyword: any;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRow: number = 0;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public http: HttpService,
    private message: MessageService,
    public confirmationService: ConfirmationService,
    public toastr: ToastrService
  ) {
    this.item = this.config.data;
  }
  ngAfterViewInit(): void {}
  paginate(event: TableLazyLoadEvent) {
    this.pageSize = event.rows ?? 10;
    var first = event.first ?? 0;
    this.pageIndex = Math.floor(first / this.pageSize) + 1;
    setTimeout(() => {
      this.loadData();
    }, 100);
  }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.loading = true;
    this.http.post(
      'User/UsersByRole',
      {
        UnitId: this.item.Id,
        keyword: this.keyword,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
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
    this.dt.first = 0;
    this.loadData();
  }
  delete(itemUser: any) {
    this.confirmationService.confirm({
      message:
        'Bạn có chắc chắn muốn xoá tài khoản ' + itemUser.UserName + ' ?',
      accept: () => {
        this.http.post(
          'User/DeleteRoleUser',
          {
            Id: itemUser.Id,
            RoleId: this.item.Id,
          },
          (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
              this.toastr.success('Xóa thành công!', 'Thông báo', {
                timeOut: 3000,
              });
              this.loadData();
            } else {
              this.toastr.error('Xóa thất bại!', 'Thông báo', {
                timeOut: 3000,
              });
            }
          },
          () => {
            this.toastr.error('Vui lòng kiểm tra Internet!', 'Cảnh báo', {
              timeOut: 3000,
            });
          }
        );
      },
    });
  }
}
