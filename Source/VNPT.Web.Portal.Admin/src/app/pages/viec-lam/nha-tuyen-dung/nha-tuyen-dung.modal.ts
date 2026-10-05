import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { MessageService } from "primeng/api";
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";
import { Parameter } from "src/app/services/staticparameters.service";

@Component({
  selector: "nha-tuyen-dung-modal",
  templateUrl: "nha-tuyen-dung.modal.html",
  styleUrls: ["./nha-tuyen-dung.modal.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class NhaTuyenDungModal {
  item: any;
  imageUrl: any;
  imageDisplay: any;
  province: any;
  districts: any = [];
  wards: any[] = [];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public http: HttpService,
    private message: MessageService,
    private toastr: ToastrService,
    public dialogService: DialogService
  ) {
    this.item = {
      Id: null,
      Code: "",
      Director: "",
      PhoneNo: "",
      Email: "",
      GeoLocation: "",
      ImageUrl: "",
      Name2: "",
      Name: "",
      WebsiteUrl: "",
      Address: "",
      LocationDistrictId: "",
      LocationProvinceId: "",
      LocationNationId: "",
      LocationWardId: "",
      LocationStreetId: "",
      UnitCode: "",
    };
    this.province = Parameter.province.Id;
    if (this.config.data.item != null) {
      this.item = this.config.data.item;
    }
    this.imageUrl = this.item.ImageUrl;
  }

  ngOnInit() {
    this.loadDistrics();
  }
  cancel() {
    this.ref.close();
  }
  onKeyUp(event: any) {
    if (event.keyCode == 13) {
    }
  }
  loadDistrics() {
    this.http.post(
      "QMSAdmin/DistrictsFieldWard",
      {},
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.districts = result.Result;
          this.item.LocationDistrictId = this.item.LocationDistrictId
            ? this.item.LocationDistrictId
            : null;
          this.loadWards();
        }
      },
      () => {}
    );
  }
  selectDistrict(event: any) {
    if (this.item.LocationDistrictId != null) {
      this.item.LocationWardId = null;
      this.loadWards();
    } else {
      this.wards = [];
      this.item.LocationWardId = null;
    }
  }
  loadWards() {
    this.http.post(
      "location/getWards",
      {
        ParentId: this.item.LocationDistrictId,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.wards = result.Result;
          this.item.LocationWardId = this.item.LocationWardId
            ? this.item.LocationWardId
            : null;
        }
      },
      () => {}
    );
  }
  submit() {
    this.http.post(
      "Business/save",
      {
        Id: this.item.Id,
        Name: this.item.Name,
        Code: this.item.Code,
        ImageUrl: this.imageUrl,
        Description: this.item.Description,
        Director: this.item.Director,
        PhoneNo: this.item.PhoneNo,
        Email: this.item.Email,
        GeoLocation: this.item.GeoLocation,
        Name2: this.item.Name2,
        WebsiteUrl: this.item.WebsiteUrl,
        Address: this.item.Address,
        LocationDistrictId: this.item.LocationDistrictId,
        LocationProvinceId: this.item.LocationProvinceId,
        LocationNationId: this.item.LocationNationId,
        LocationWardId: this.item.LocationWardId,
        LocationStreetId: this.item.LocationStreetId,
        UnitCode: this.item.UnitCode,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.ref.close({ confirm: "yes" });
        }
      },
      () => {}
    );
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
}
