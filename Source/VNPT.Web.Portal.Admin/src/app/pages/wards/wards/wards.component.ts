import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { ResultCode, ResultModel } from "src/app/models";
import { BasePage, HttpService } from "src/app/services";
import { Parameter } from "src/app/services/staticparameters.service";
import { WardsModal } from "./wards.modal";

@Component({
  selector: "app-wards",
  templateUrl: "./wards.component.html",
  styleUrls: ["./wards.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class WardsComponent extends BasePage {
  @ViewChild("dt", { static: false }) dt: any;
  provinces: any = [];
  province: any;
  districts: any = [];
  district: any;
  wards: any[] = [];
  ward: any;
  items: any[] = [];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalRow: number = 0;
  loading: boolean = false;
  unitcode: any;
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
    this.provinces = Parameter.provinces;
    this.province = Parameter.province.Id;
  }

  onInit(): void {}
  loadPage(): void {
    this.loadDistrics();
  }
  loadDistrics() {
    this.http.post(
      "QMSAdmin/DistrictsFieldWard",
      {},
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.districts = result.Result;
          this.district = this.districts[0].Id;
          this.loadWards();
        }
      },
      () => {}
    );
  }
  selectDistrict(event: any) {
    if (this.district != null) {
      this.ward = null;
      this.loadWards();
    } else {
      this.wards = [];
      this.ward = null;
    }
  }
  loadWards() {
    this.loading = true;
    this.http.post(
      "location/getWards",
      {
        ParentId: this.district,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.wards = result.Result;
        }
      },
      () => {}
    );
    this.loading = false;
  }

  edit(item: any) {
    this.unitcode= this.districts.filter((s: { Id: any; UnitCode: any}) => s.Id ==this.district);
    this.unitcode = this.unitcode[0].UnitCode
    const ref = this.dialogService
      .open(WardsModal, {
        data: {
          IsAdd: false,
          item: item,
          unitcode: this.unitcode,
        },
        header: "Cập nhật lĩnh vực phường xã: "+item.Name,
        width: "50%",
      })
      .onClose.subscribe((data: any) => {
        if (data) {
          this.loadWards();
        }
      });
  }

  refresh() {
    this.dt.first = 0;
  }

  search() {
    this.pageIndex = 1;
    this.refresh();
    this.loadWards();
  }
}
