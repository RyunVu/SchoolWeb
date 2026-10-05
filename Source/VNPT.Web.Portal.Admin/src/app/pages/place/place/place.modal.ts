import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MessageService } from "primeng/api";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";
import { ResultCode, ResultModel } from "src/app/models";
import { HttpService } from "src/app/services";
import { Parameter } from "src/app/services/staticparameters.service";

@Component({
  selector: "place-modal",
  templateUrl: "./place.modal.html",
  styleUrls: ["./place.modal.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PlaceModal {
  province: any;
  districts: any = [];
  district: any;
  wards: any[] = [];
  ward: any;
  item: any;
  phonenumber: any;
  code: any;
  name: any;
  geolocation: any;
  address: any;
  imageUrl: any;
  description: any;
  shortname: any;
  email: any;
  fburl: any;
  taxcode: any;
  content: any;
  id: any;
  importid: any;
  types: any = [];
  type: any;
  unitcode: any;
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
      TypeId: null,
      Name: "",
      ShortName: "",
      GeoLocation: "",
      Address: "",
      ImageUrl: "",
      Email: "",
      PhoneNo: "",
      FacebookUrl: "",
      Content: "",
      TaxCode: "",
      ImportId: null,
      Description: "",
      LocationProvinceId: null,
      LocationDistrictId: null,
      LocationWardId: null,
      UnitCode: "",
    };

    if (this.config.data.item != null) {
      this.item = this.config.data.item;
    }
    this.province = Parameter.province.Id;
    this.type = this.item.TypeId;
    this.name = this.item.Name;
    this.shortname = this.item.ShortName;
    this.geolocation = this.item.GeoLocation;
    this.address = this.item.Address;
    this.imageUrl = this.item.ImageUrl;
    this.email = this.item.Email;
    this.phonenumber = this.item.PhoneNo;
    this.fburl = this.item.FacebookUrl;
    this.content = this.item.Content;
    this.code = this.item.TaxCode;
    this.importid = this.item.ImportId;
    this.description = this.item.Description;
    this.district = this.item.LocationDistrictId;
    this.ward = this.item.LocationWardId;
    this.taxcode = this.item.TaxCode;
  }

  ngOnInit() {
    this.loadLocations();
    this.loadDistrics();
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
      () => {}
    );
  }
  loadLocations() {
    this.http.post(
      "GeneralCategory/SearchItems",
      { Code: "PlaceType" },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.types = result.Result;
        }
      },
      () => {}
    );
  }

  cancel() {
    this.ref.close();
  }
  onKeyUp(event: any) {
    if (event.keyCode == 13) {
    }
  }
  submit() {
    this.unitcode = this.districts.filter((x: { Id: any; UnitCode: any}) => x.Id === this.district);
    this.unitcode = this.unitcode[0].UnitCode;
    this.item.TypeId = this.type;
    this.item.Name = this.name;
    this.item.ShortName = this.shortname;
    this.item.GeoLocation = this.geolocation;
    this.item.Address = this.address;
    this.item.ImageUrl = this.imageUrl;
    this.item.Email = this.email;
    this.item.PhoneNo = this.phonenumber;
    this.item.FacebookUrl = this.fburl;
    this.item.Content = this.content;
    this.item.TaxCode = this.taxcode;
    this.item.ImportId = this.importid;
    this.item.Description = this.description;
    this.item.LocationProvinceId = this.province;
    this.item.LocationDistrictId = this.district;
    this.item.LocationWardId = this.ward;
    this.item.UnitCode = this.unitcode;
    this.http.post(
      "Place/Save",
      this.item,
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.toastr.success('Lưu cơ quan', 'Thành công', {
            timeOut: 3000,
          });
          this.ref.close({ confirm: "yes" });
        } else{
          this.toastr.error('Lưu cơ quan"', 'Thất bại', {
            timeOut: 3000,
          });
        }
      },
      () => {}
    );
  }
}
