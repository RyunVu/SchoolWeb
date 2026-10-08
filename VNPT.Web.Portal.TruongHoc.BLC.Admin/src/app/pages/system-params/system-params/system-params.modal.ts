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
  standalone: false,
  selector: "system-params-modal",
  templateUrl: "./system-params.modal.html",
  styleUrls: ["./system-params.modal.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SystemParamsModal {
  item: any;
  id: any;
  code: any;
  // unitcodes: any[] = [];
  // unitcode: any;
  units: any[] = [];
  unit: any;
  description: any;
  value: any;
  value2: any;
  value3: any;
  value4: any;
  value5: any;
  value6: any;
  value7: any;
  isAdd: any;

  imageUrl: any;
  imageUrl_Name: any;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public http: HttpService,
    private message: MessageService,
    private toastr: ToastrService,
    public dialogService: DialogService
  ) {
    this.item = {
      Id: "",
      Code: "",
      Value: "",
      Value2: "",
      Value3: "",
      Value4: "",
      Value5: "",
      Value7: "",
      UnitCode: "",
      Description: "",
    };

    this.isAdd = this.config.data.IsAdd ? this.config.data.IsAdd : false;
    if (this.config.data.item != null) {
      this.item = this.config.data.item;
    }
    this.id = this.item.Id;
    this.code = this.item.Code;
    this.unit = this.item.UnitCode;
    this.description = this.item.Description;
    this.value = this.item.Value;
    this.value2 = this.item.Value2;
    this.value3 = this.item.Value3;
    this.value4 = this.item.Value4;
    this.value5 = this.item.Value5;
    this.value6 = this.item.Value6;
    this.value7 = this.item.Value7;

    this.imageUrl = this.item.Value2;
    this.imageUrl_Name = this.item.Value4;
  }

  ngOnInit() {
    //this.loadLocations();
    this.loadUnits();
  }

  loadUnits() {
    this.http.post("user/Units", {

    }, (result: ResultModel) => {
      if (result.Code == ResultCode.Success) {
        this.units = result.Result;
        this.units.unshift({ Id: null, Name: '--Chưa chọn đơn vị--' });
        if (!this.config.data.IsAdd) // edit
        {
          this.unit = this.item.UnitCode;
        }
        else {
          this.unit = null;
        }
      }
    }, () => {
    });
  }

  // loadLocations() {
  //   // this.http.post(
  //   //   "field/units",
  //   //   {},
  //   //   (result: ResultModel) => {
  //   //     if (result.Code == ResultCode.Success) {
  //   //       this.unitcodes = result.Result;
  //   //       this.unitcodes.unshift({ Id: 'LDG', Name: "Đơn vị thuộc tỉnh" });
  //   //     }
  //   //   },
  //   //   () => {}
  //   // );

  //   this.http.post("unit/districts", {

  //   }, (result: ResultModel) => {
  //     if (result.Code == ResultCode.Success) {
  //       this.unitcodes = result.Result;
  //       this.unitcodes.unshift({ Id: null, Name: "Tất cả" })
  //       this.unitcodes.forEach(element => {
  //         if (element.Id != null) {
  //           element.Id = element.Id.toLowerCase();
  //         }
  //       });
  //       if (this.isAdd) {
  //         this.unitcode = null;
  //       }
  //     }
  //   }, () => {
  //   });
  // }

  cancel() {
    this.ref.close();
  }
  onKeyUp(event: any) {
    if (event.keyCode == 13) {
    }
  }
  submit() {
    if (this.unit == undefined || this.unit == null) {
      this.toastr.warning("Vui lòng chọn đơn vị", "Cảnh báo", {
        timeOut: 3000,
      });
      return;
    }
    if (this.id == null || this.id == "") {
      this.toastr.warning("Vui lòng nhập Id", "Cảnh báo", {
        timeOut: 3000,
      });
      return;
    }
    if (this.code == null || this.code == "") {
      this.toastr.warning("Vui lòng nhập Code", "Cảnh báo", {
        timeOut: 3000,
      });
      return;
    }
    this.item.Id = this.id;
    this.item.UnitCode = this.unit;
    this.item.Description = this.description;
    this.item.Code = this.code;
    this.item.Value = this.value;
    this.item.Value2 = (this.item.Code == 'BANNER_HEADER' || this.item.Code == 'BANNER_CENTER' || this.item.Code == 'LINK_MENU' || this.item.Id.includes('LOGO') || this.item.Id.includes('TINNHIEMMANG')) ? this.imageUrl : this.value2;
    this.item.Value3 = this.value3;
    this.item.Value4 = (this.item.Id.includes('NAME')) ? this.imageUrl_Name : this.value4;
    this.item.Value5 = this.value5;
    this.item.Value6 = this.value6;
    this.item.Value7 = this.value7;

    this.http.post(
      "Menu/SaveSystemParams",
      this.item,
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.ref.close({ confirm: "yes" });
          this.toastr.success("Lưu tham số hệ thống", "Thành công", {
            timeOut: 3000,
          });
        } else {
          this.toastr.error("Lưu tham số hệ thống", "Thất bại", {
            timeOut: 3000,
          });
        }
      },
      () => { }
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
      })!
      .onClose.subscribe((data: any) => {
        if (data) {
          var fileUrls = data.urls;
          fileUrls.forEach((element: any) => {
            this.imageUrl = element.Url;
          });
        }
      });
  }

  openFileDilog_Name() {
    const ref = this.dialogService
      .open(FileManagerModal, {
        data: {
          filetype: "image",
          multipleselect: false,
        },
        header: "Quản lý file",
        width: "70%",
      })!
      .onClose.subscribe((data: any) => {
        if (data) {
          var fileUrls = data.urls;
          fileUrls.forEach((element: any) => {
            this.imageUrl_Name = element.Url;
          });
        }
      });
  }
}
