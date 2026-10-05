import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { ResultCode, ResultModel } from "src/app/models";
import { BasePage, HttpService } from "src/app/services";
import { PopupImageModal } from "../../feedbacks/feedback/popupImage.modal";
import { ViecLamModal } from "./viec-lam.modal";

@Component({
  selector: "app-viec-lam",
  templateUrl: "./viec-lam.component.html",
  styleUrls: ["./viec-lam.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ViecLamComponent extends BasePage {
  @ViewChild("dt", { static: false }) dt: any;

  items: any[] = [];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRow: number = 0;
  sortField: string = "";
  sortOrder: boolean = false;
  loading: boolean = false;
  oldEvent: any;
  filters: any = {};
  keywordInput: any;
  busiList: any[] = [];
  busi: any;
  posiList: any[] = [];
  posi: any;
  fieldList: any[] = [];
  field: any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public http: HttpService,
    public message: MessageService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {
    super(router, route, http, message);
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
  onInit(): void {
    this.loadBusi();
    this.loadField();
    this.loadPosi();
  }
  loadBusi() {
    this.http.post(
      "Business/Items",
      {
        PageSize: 10000,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.busiList = result.Result;
          this.busiList.unshift({ Id: null, Name: "Tất cả" });
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
  loadField() {
    this.http.post(
      "WorkField/Items",
      {
        PageSize: 10000,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.fieldList = result.Result;
          this.fieldList.unshift({ Id: null, Name: "Tất cả" });
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
  loadPosi() {
    this.http.post(
      "WorkField/ItemsWorkPosition",
      {
        PageSize: 10000,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.posiList = result.Result;
          this.posiList.unshift({ Id: null, Name: "Tất cả" });
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
  add() {
    const ref = this.dialogService
      .open(ViecLamModal, {
        data: {
          IsAdd: true,
        },
        header: "Thêm mới việc làm",
        width: "70%",
      })
      .onClose.subscribe((data: any) => {
        if (data) {
          this.loadData();
        }
      });
  }
  edit(item: any) {
    const ref = this.dialogService
      .open(ViecLamModal, {
        data: {
          IsAdd: false,
          item: item,
        },
        header: "Cập nhật việc làm " + item.Name,
        width: "70%",
      })
      .onClose.subscribe((data: any) => {
        if (data) {
          this.loadData();
        }
      });
  }
  delete(item: any) {
    this.confirmationService.confirm({
      message: "Bạn có chắc chắn muốn xoá item " + item.Name + "?",
      accept: () => {
        this.http.post(
          "Work/Delete",
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
      "Work/Items",
      {
        Keyword: this.keywordInput,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        BusinessIdSearch: this.busi ? this.busi : null,
        WorkPositionId: this.posi ? this.posi : null,
        WorkFieldId: this.field ? this.field : null,
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
  clearfilter() {
    this.pageIndex = 1;
    this.refresh();
    this.loadData();
  }
  search() {
    this.pageIndex = 1;
    this.refresh();
    this.loadData();
  }

  refresh() {
    this.dt.first = 0;
  }
}
