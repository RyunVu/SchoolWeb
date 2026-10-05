import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { PlaceModal } from './place.modal'; 

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlaceComponent extends BasePage {

  @ViewChild('dt', { static: false }) dt: any;

  items: any[] = [];
  pageSize: number = 10;
  pageIndex: number = 1;
  keyword: any;
  totalRow: number = 0;
  sortField: string = "";
  sortOrder: boolean = false;
  loading: boolean = false;
  filters: any = {};
  locations: any[] = [];
  location: any;
  keywordInput: any;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public http: HttpService,
    public message: MessageService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService
  ) {
    super(router, route, http, message);
  }

  onInit(): void {
  }
  loadPage(): void {
    this.loadLocations();
  }
  add() {
    const ref = this.dialogService.open(PlaceModal, {
      data: {
        IsAdd: true,
      },
      header: 'Thêm mới cơ quan hành chính',
      width: '70%'
    }).onClose.subscribe((data: any) => {
      if (data) {
        this.loadData();
      }
    });
  }
  loadLocations() {
    this.http.post(
      "field/units",
      {},
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.locations = result.Result;
          this.locations.unshift({Id: 'LDG', Name: 'Đơn vị thuộc tỉnh'})
        }
      },
      () => {}
    );
  }
  edit(item: any) {
    const ref = this.dialogService.open(PlaceModal, {
      data: {
        IsAdd: false,
        item: item,
      },
      header: 'Cập nhật cơ quan hành chính: '+item.Name,
      width: '70%',
    }).onClose.subscribe((data: any) => {
      if (data) {
        this.loadData();
      }
    });
  }
  delete(item: any) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xoá item ' + item.Name + '?',
      accept: () => {
        this.http.post("Place/Delete",
          {
            Id: item.Id,
          },
          (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
              this.toastr.success('Xóa cơ quan', 'Thành công', {
                timeOut: 3000,
              });
              this.loadData();
            } else{
              this.toastr.error('Xóa cơ quan"', 'Thất bại', {
                timeOut: 3000,
              });
            }
          }, () => {
          });
      }
    });
  }
  paginate(event: any) {

    this.pageSize = event.rows ?? 10;
    var first = event.first ?? 0;
    this.pageIndex = Math.floor(first / this.pageSize) + 1;

    this.sortOrder = event.sortOrder == 1 ? true : false;
    this.sortField = event.sortField ?? "";
    this.filters = event.filters;
    setTimeout(() => {
      this.loadData();
    }, 100);
  }
  loadData() {
    this.loading = true;
    this.http.post("Place/Items", {
      keyword: this.keyword,
      UnitCode: this.location,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }, (result: ResultModel) => {
      if (result.Code == ResultCode.Success) {
        this.items = result.Result;
        this.totalRow = result.TotalRow
      }
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  refresh() {
    this.dt.first = 0;
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
}

