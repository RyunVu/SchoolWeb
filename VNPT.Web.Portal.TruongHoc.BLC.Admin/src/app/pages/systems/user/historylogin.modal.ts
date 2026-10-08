import { Component, ViewEncapsulation } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ResultCode, ResultModel } from "src/app/models";
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { HttpService } from "src/app/services";
import { ToastrService } from "ngx-toastr";
import moment from 'moment';

@Component({
  standalone: false,
  selector: "historylogin-modal",
  templateUrl: "historylogin.modal.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./historylogin.modal.scss"],
})
export class HistoryLoginModal {
  item: any;
  items: any[] = [];
  pageSize: number = 10;
  pageIndex: number = 1;
  keyword: string = "";
  totalRow: number = 0;
  sortField: string = "";
  sortOrder: boolean = false;
  loading: boolean = false;
  oldEvent: any;
  filters: any = {};
  isUserLogin: any;
  dateString: any;
  logoutCount: any;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public http: HttpService,
    private message: MessageService,
    public dialogService: DialogService,
    public toastr: ToastrService,
    private confirmationService: ConfirmationService
  ) {
    this.item = {
      Id: null,
      UserId: "",
      DeviceId: "",
      ExpiredDate: "",
      ExpiredDateString: "",
      Status: "",
      CreateDate: "",
      CreateDateString: "",
    };
  }

  ngOnInit() {
    this.loadData();
  }
  cancel() {
    this.ref.close();
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
    this.sortField = (event.sortField as string) ?? "";
    this.filters = event.filters;
    setTimeout(() => {
      this.loadData();
    }, 100);
  }
  private loadData(): void {
    this.loading = true;
    this.http.post(
      "User/DetailsUserHistory",
      {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.items = result.Result;
          this.totalRow = result.TotalRow;
          this.logoutCount = result.Message;
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
  logout(item: any) {
    this.confirmationService.confirm({
      message:
        "Bạn có chắc chắn muốn đăng xuất ở thiết bị " + item.DeviceId + "?",
      accept: () => {
        this.http.post(
          "User/DeleteUserLoginHistory",
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
  logoutAll(item: any) {
    this.confirmationService.confirm({
      message: "Bạn có chắc chắn muốn đăng xuất ở mọi thiết bị ?",
      accept: () => {
        this.http.post(
          "User/DeleteAllUserLoginHistory",
          {
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
}
