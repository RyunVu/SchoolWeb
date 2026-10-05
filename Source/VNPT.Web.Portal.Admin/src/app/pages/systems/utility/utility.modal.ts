import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { MessageService } from "primeng/api";
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";
import { Parameter } from "src/app/services/staticparameters.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "utility-modal",
  templateUrl: "utility.modal.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./utility.modal.scss"],
})
export class UtilityModal {
  item: any;

  parent: any = "";
  menus: any[] = [];
  type: any = "";
  menuTypes: any[] = [];
  locations: any[] = [];
  location: any;
  utilities: any[] = [];
  parentUtility: any;
  imageUrl: any;
  imageDisplay: any;
  province: any;
  districts: any = [];
  district: any;
  wards: any[] = [];
  ward: any;
  code: any;
  name: any;
  geolocation: any;
  address: any;
  phonenumber: any;
  orderno: any;
  description: any;
  id: any;
  isGetAllChildren: boolean = false;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public http: HttpService,
    private message: MessageService,
    public dialogService: DialogService,
    private toastr: ToastrService
  ) {
    this.item = {
      Id: null,
      Name: null,
      ImageUrl: null,
      Code: null,
      LocationDistrictId: null,
      LocationProvinceId: null,
      LocationWardId: null,
      Address: null,
      OrderNo: null,
      GeoLocation: null,
      PhoneNumber: null,
      UnitCode: null,
      ParentId: null,
      Description: null,
      HasChild: null,
    };
    this.province = Parameter.province;
    if (this.config.data.IsEdit) {
      this.item = this.config.data.data;
      this.id = this.item.Id ? this.item.Id : null;
      this.location = this.item.UnitCode ? this.item.UnitCode : null;
      this.code = this.item.Code ? this.item.Code : null;
      this.name = this.item.Name ? this.item.Name : null;
      this.geolocation = this.item.GeoLocation ? this.item.GeoLocation : null;
      this.address = this.item.Address ? this.item.Address : null;
      this.district = this.item.LocationDistrictId
        ? this.item.LocationDistrictId
        : null;
      this.ward = this.item.LocationWardId ? this.item.LocationWardId : null;
      this.phonenumber = this.item.PhoneNumber ? this.item.PhoneNumber : null;
      this.orderno = this.item.OrderNo ? this.item.OrderNo : null;
      this.imageUrl = this.item.ImageUrl ? this.item.ImageUrl : null;
      this.description = this.item.Description ? this.item.Description : null;
      this.isGetAllChildren = this.item.IsGetAllChildren ?? false;
    }
    this.parentUtility = this.config.data.Id ? this.config.data.Id : null;
  }
  ngAfterViewInit(): void { }

  ngOnInit() {
    this.loadLocations();
    this.loadDistrics();
  }

  loadLocations() {
    this.http.post(
      "field/units",
      {},
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.locations = result.Result;
        }
      },
      () => { }
    );
  }
  loadDistrics() {
    this.http.post(
      "QMSAdmin/Districts",
      {},
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.districts = result.Result;
          if (this.config.data != null && this.district != null) {
            this.district = this.districts.filter((a: any) => {
              return a.Id == this.district;
            })[0].Id;
            this.loadWards();
          } else {
            this.district = null;
          }
        }
      },
      () => { }
    );
  }
  loadWards() {
    this.http.post(
      "location/getWards",
      {
        ParentId: this.district,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.wards = result.Result;
          if (this.config.data != null && this.ward != null) {
            this.ward = this.wards.filter((a: any) => {
              return a.Id == this.ward;
            })[0].Id;
          } else {
            this.ward = null;
          }
        }
      },
      () => { }
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
  cancel() {
    this.ref.close();
  }
  openFileDilog() {
    const ref = this.dialogService
      .open(FileManagerModal, {
        data: {
          filetype: "image",
          multipleselect: false,
        },
        header: "Quản lý file",
        width: "70%",
      })
      .onClose.subscribe((data: any) => {
        if (data) {
          var fileUrls = data.urls;
          fileUrls.forEach((element: any) => {
            this.imageUrl = element.Url;
          });
        }
      });
  }
  submit() {
    if (this.location == null || this.location == '' ) {
      this.toastr.warning("Vui lòng chọn khu vực", "Cảnh báo", {
        timeOut: 3000,
      });
      return;
    }
    if (this.code == null|| this.code == '' ) {
      this.toastr.warning("Vui lòng nhập code", "Cảnh báo", {
        timeOut: 3000,
      });
      return;
    }
    if (this.name == null|| this.name == '' ) {
      this.toastr.warning("Vui lòng nhập tên", "Cảnh báo", {
        timeOut: 3000,
      });
      return;
    }
    if (this.orderno == null|| this.orderno == '' ) {
      this.toastr.warning("Vui lòng nhập số thức tự", "Cảnh báo", {
        timeOut: 3000,
      });
      return;
    }

    this.item.ParentId = this.parentUtility;
    this.item.UnitCode = this.location;
    this.item.Code = this.code;
    this.item.Name = this.name;
    this.item.GeoLocation = this.geolocation;
    this.item.Address = this.address;
    this.item.LocationProvinceId = this.province.Id;
    this.item.LocationDistrictId = this.district;
    this.item.LocationWardId = this.ward;
    this.item.PhoneNumber = this.phonenumber;
    this.item.OrderNo = this.orderno;
    this.item.ImageUrl = this.imageUrl;
    this.item.Description = this.description;
    this.item.IsGetAllChildren = this.isGetAllChildren;
    this.http.post(
      "Utilities/Save",
      this.item,
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.toastr.success("Thêm tiện ích", "Thành công", {
            timeOut: 3000,
          });
          this.ref.close({ confirm: "yes" });
        } else {
          this.toastr.error("Thêm tiện ích", "Thất bại", {
            timeOut: 3000,
          });
        }
      },
      () => {
        this.toastr.error("Vui lòng kiểm tra tin nhắn", "Thất bại", {
          timeOut: 3000,
        });
      }
    );
  }
}
