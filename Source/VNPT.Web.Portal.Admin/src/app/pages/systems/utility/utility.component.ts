import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
  TreeNode,
} from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { ResultCode, ResultModel } from "src/app/models";
import { BasePage, HttpService } from "src/app/services";
import { ShowDialogService } from "src/app/services/showDialog.service";
import { UtilityModal } from "./utility.modal";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-utility",
  templateUrl: "./utility.component.html",
  styleUrls: ["./utility.component.scss"],
})
export class UtilityComponent extends BasePage {
  loading: boolean = false;
  treeNodes: any = [];
  cols: any[] = [];
  totalRecords: number = 0;
  routeSub: any;
  ParentId: any;
  sortField: string = "";
  sortOrder: boolean = false;
  oldEvent: any;
  filters: any = {};
  pageSize: number = 10;
  pageIndex: number = 1;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public http: HttpService,
    public message: MessageService,
    public showDialogService: ShowDialogService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService
  ) {
    super(router, route, http, message);
  }

  onInit(): void {
  }
  delete(item: any) {
    this.confirmationService.confirm({
      message: "Bạn có chắc chắn muốn xoá quyền " + item.Name + "?",
      accept: () => {
        this.http.post(
          "Utilities/Delete",
          {
            Id: item.Id,
          },
          (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
              this.message.add({
                severity: "success",
                summary: "Error",
                detail: "Xoá thành công!",
              });
              this.loadData();
            } else {
              this.message.add({
                severity: "error",
                summary: "Error",
                detail: result.Message,
              });
            }
          },
          () => {
            this.message.add({
              severity: "error",
              summary: "Error",
              detail: "Vui lòng kiểm tra Internet!",
            });
          }
        );
      },
    });
  }
  edit(item: any) {
    this.showDialogService.showDialog(
      UtilityModal,
      "Cập nhật:" + item.Name,
      { data: item, IsEdit: true, Id: this.ParentId ? this.ParentId : null },
      (data: any) => {
        if (data) {
          this.loadData();
        }
      }
    );
  }
  utilityChild(item: any) {
    window.open(`/#/system/utility/${item.Id}`);
  }
  paginate(event: LazyLoadEvent) {
    if (this.oldEvent == null || event == this.oldEvent) {
      this.oldEvent = event;
      return;
    }
    this.oldEvent = event;
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
  add() {
    this.showDialogService.showDialog(
      UtilityModal,
      "Thêm mới",
      {
        Id: this.ParentId ? this.ParentId : null,
        IsEdit: false,
      },
      (data: any) => {
        if (data) {
          this.loadData();
        }
      }
    );
  }

  loadPage(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.ParentId = params["id"];
      this.loadData();
    });
  }

  private loadData(): void {
    this.treeNodes = [];
    this.loading = true;
    this.ParentId
      ? this.http.post(
        "Utilities/Items",
        {
          ParentId: this.ParentId,
          PageIndex: this.pageIndex,
          PageSize: this.pageSize,
        },
        (result: ResultModel) => {
          if (result.Code == ResultCode.Success) {
            this.totalRecords = result.TotalRow;
            this.treeNodes = result.Result;
          }
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      )
      : this.http.post(
        "Utilities/Items",
        {
          HasRoot: 1,
        },
        (result: ResultModel) => {
          if (result.Code == ResultCode.Success) {
            this.totalRecords = result.TotalRow;
            this.treeNodes = [];
            this.treeNodes = result.Result;
          }
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
  }
}
