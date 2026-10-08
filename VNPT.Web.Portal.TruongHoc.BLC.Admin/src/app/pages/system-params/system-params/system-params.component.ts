import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { ResultCode, ResultModel } from "src/app/models";
import { BasePage, BaseService, HttpService } from "src/app/services";
import { SystemParamsModal } from "./system-params.modal";

@Component({
  standalone: false,
  selector: "app-system-params",
  templateUrl: "./system-params.component.html",
  styleUrls: ["./system-params.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SystemParamsComponent extends BasePage {
  @ViewChild("dt", { static: false }) dt: any;

  items: any[] = [];
  pageSize: number = 20;
  pageIndex: number = 1;
  keyword: any;
  sortField: string = "";
  sortOrder: boolean = false;
  loading: boolean = false;
  filters: any = {};
  units: any[] = [];
  unit: any;
  codes: any[] = [];
  code: any;
  keywordInput: any;
  totalRow: any;

  isSuperAdminSystem: boolean = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public http: HttpService,
    public message: MessageService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService,
    private baseService: BaseService,
  ) {
    super(router, route, http, message);

    var mulRole = this.baseService.MulRole;
    if (mulRole != "" && mulRole != null && (mulRole.includes("SuperAdminSystem") || mulRole.includes("AdminTramYTe") || mulRole.includes("AdminPhongYTe"))) {
      this.isSuperAdminSystem = true;
    }
  }

  onInit(): void { }
  loadPage(): void {
    this.loadUnits();
    this.loadData();
    this.loadCodes();
  }
  add() {
    const ref = this.dialogService
      .open(SystemParamsModal, {
        data: {
          IsAdd: true,
        },
        header: "Thêm mới tham số hệ thống",
        width: "70%",
      })!
      .onClose.subscribe((data: any) => {
        if (data) {
          this.loadData();
        }
      });
  }

  loadUnits() {
    this.http.post("user/Units", {

    }, (result: ResultModel) => {
      if (result.Code == ResultCode.Success) {
        this.units = result.Result;
        this.units.unshift({ Id: null, Name: "Tất cả đơn vị" });
        this.unit = null
      }
    }, () => {
    });
  }

  loadCodes() {
    this.http.post(
      "Menu/CodesSystemParams",
      {},
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.codes = result.Result;
          this.codes.unshift({ Code: "Chọn tất cả" });
        }
      },
      () => { }
    );
  }
  paginate(event: any) {
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
  edit(item: any) {
    const ref = this.dialogService
      .open(SystemParamsModal, {
        data: {
          IsAdd: false,
          item: item,
        },
        header: "Cập nhật tham số hệ thống " + item.Id,
        width: "70%",
      })!
      .onClose.subscribe((data: any) => {
        if (data) {
          this.loadData();
        }
      });
  }
  delete(item: any) {
    this.confirmationService.confirm({
      message: "Bạn có chắc chắn muốn xoá item " + item.Id + "?",
      accept: () => {
        this.http.post(
          "Menu/DeleteSystemParams",
          {
            Id: item.Id,
          },
          (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
              this.loadData();
            }
          },
          () => { }
        );
      },
    });
  }
  loadData() {
    this.code = this.code == "Chọn tất cả" ? null : this.code;
    this.loading = true;
    this.http.post(
      "Menu/ItemsSystemParams",
      {
        keyword: this.keyword,
        UnitCode: this.unit,
        PageSize: this.pageSize,
        PageIndex: this.pageIndex,
        Code: this.code,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.items = result.Result;
          this.totalRow = result.TotalRow
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
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
