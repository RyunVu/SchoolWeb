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
import { LinhVucTuyenDungModal } from "./linh-vuc-tuyen-dung.modal";

@Component({
  selector: "app-linh-vuc-tuyen-dung",
  templateUrl: "./linh-vuc-tuyen-dung.component.html",
  styleUrls: ["./linh-vuc-tuyen-dung.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LinhVucTuyenDungComponent extends BasePage {
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
  onInit(): void {}
  add() {
    const ref = this.dialogService
      .open(LinhVucTuyenDungModal, {
        data: {
          IsAdd: true,
        },
        header: "Thêm mới lĩnh vực tuyển dụng",
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
      .open(LinhVucTuyenDungModal, {
        data: {
          IsAdd: false,
          item: item,
        },
        header: "Cập nhật lĩnh vực tuyển dụng: "+item.Name,
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
          "WorkField/Delete",
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
      "WorkField/Items",
      {
        Keyword: this.keywordInput,
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

  openPopupImage(item: any) {
    const ref = this.dialogService
      .open(PopupImageModal, {
        data: {
          items: item.ImageList,
        },
        header: "Slideshow",
        width: "70%",
      })
      .onClose.subscribe((data: any) => {});
  }
}
