import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { MessageService } from "primeng/api";
import { HttpService } from "src/app/services";
import { ResultCode, ResultModel } from "src/app/models";
import { ToastrService } from "ngx-toastr";
import { FileManagerModal } from "src/app/components/file-manager/file-manager.component";
import { Parameter } from "src/app/services/staticparameters.service";
import * as moment from "moment";

@Component({
  selector: "viec-lam-modal",
  templateUrl: "viec-lam.modal.html",
  styleUrls: ["./viec-lam.modal.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ViecLamModal {
  item: any;
  imageUrl: any;
  imageDisplay: any;
  province: any;
  districts: any = [];
  wards: any[] = [];
  business: any[] = [];
  workPosi: any[] = [];
  workFields: any[] = [];
  workFieldSelecteds: any[] = [];
  typeSala: any[] = [
    {
      Id: "Tháng",
    },
    {
      Id: "Ngày",
    },
    {
      Id: "Giờ",
    },
    {
      Id: "Sản phẩm",
    },
  ];
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
      Name: "",
      BusinessId: "",
      TimeExpired: "",
      BenefitContent: "",
      RequiredContent: "",
      HosoContent: "",
      Place: "",
      Degree: "",
      Quantity: "",
      FemaleQuantity: "",
      IsAgreementSalary: "",
      FromSalary: "",
      ToSalary: "",
      IsSaleSalary: "",
      TypeSalary: "",
      IsPoundageSalary: "",
      FromAge: "",
      ToAge: "",
      Gender: "",
      WorkPositionId: "",
      Description: "",
      Address: "",
      LocationNationId: "",
      LocationProvinceId: "",
      LocationDistrictId: "",
      LocationWardId: "",
      LocationStreetId: "",
    };
    this.province = Parameter.province.Id;
    if (this.config.data.item != null) {
      this.item = this.config.data.item;
      if (this.item.TimeExpired) {
        this.item.TimeExpired = new Date(this.item.TimeExpired);
      }
    }
    this.imageUrl = this.item.ImageUrl;
  }

  ngOnInit() {
    this.loadDistrics();
    this.loadBusiness();
    this.loadWorkPosi();
    this.loadWorkField();
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
  loadBusiness() {
    this.http.post(
      "Business/Items",
      {},
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.business = result.Result;
          this.item.BusinessId = this.item.BusinessId
            ? this.item.BusinessId
            : null;
        }
      },
      () => {}
    );
  }
  loadWorkPosi() {
    this.http.post(
      "WorkField/ItemsWorkPosition",
      {},
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.workPosi = result.Result;
          this.item.WorkPositionId = this.item.WorkPositionId
            ? this.item.WorkPositionId
            : null;
        }
      },
      () => {}
    );
  }
  loadWorkField() {
    this.http.post(
      "WorkField/Items",
      {},
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.workFields = result.Result;
          this.http.post(
            "Work/SearchFIW",
            {
              WorkId: this.item.Id,
            },
            (result2: ResultModel) => {
              if (result2.Code == ResultCode.Success) {
                this.workFieldSelecteds = result2.Result.map(
                  (item: any) => item.Id
                );
              }
            },
            () => {}
          );
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
  async submit() {
    var resultRef1 = false;
    var resultRef2 = false;
    var resultRef3 = true;

    await this.http.postPromise(
      "Work/save",
      {
        Id: this.item.Id,
        Name: this.item.Name,
        BusinessId: this.item.BusinessId,
        TimeExpired: this.item.TimeExpired,
        BenefitContent: this.item.BenefitContent,
        RequiredContent: this.item.RequiredContent,
        HosoContent: this.item.HosoContent,
        Place: this.item.Place,
        Degree: this.item.Degree,
        Quantity: this.item.Quantity,
        FemaleQuantity: this.item.FemaleQuantity ? this.item.FemaleQuantity : 0,
        IsAgreementSalary: this.item.IsAgreementSalary,
        FromSalary: this.item.IsAgreementSalary ? null : this.item.FromSalary,
        ToSalary: this.item.IsAgreementSalary ? null : this.item.ToSalary,
        IsSaleSalary: this.item.IsSaleSalary,
        TypeSalary: this.item.TypeSalary,
        IsPoundageSalary: this.item.IsPoundageSalary,
        FromAge: this.item.FromAge,
        ToAge: this.item.ToAge,
        Gender: this.item.Gender,
        WorkPositionId: this.item.WorkPositionId,
        Description: this.item.Description,
        Address: this.item.Address,
        LocationDistrictId: this.item.LocationDistrictId,
        LocationProvinceId: this.item.LocationProvinceId,
        LocationNationId: this.item.LocationNationId,
        LocationWardId: this.item.LocationWardId,
        LocationStreetId: this.item.LocationStreetId,
      },
      (result1: ResultModel) => {
        if (result1.Code == ResultCode.Success) {
          (this.item.Id = result1.Message), (resultRef1 = true);
        }
      },
      () => {}
    );
    if (resultRef1) {
      await this.http.postPromise(
        "Work/XoaFIW",
        {
          WorkId: this.item.Id,
        },
        (result2: ResultModel) => {
          if (result2.Code == ResultCode.Success) {
            resultRef2 = true;
          }
        },
        () => {}
      );
    }
    if (resultRef2) {
      for (let i = 0; i < this.workFieldSelecteds.length; i++) {
        await this.http.postPromise(
          "Work/ThemFIW",
          {
            WorkFieldId: this.workFieldSelecteds[i],
            WorkId: this.item.Id,
          },
          (result3: ResultModel) => {
            if (result3.Code != ResultCode.Success) {
              resultRef3 = false;
            }
          },
          () => {}
        );
      }
      if (resultRef3) {
        this.ref.close({ confirm: "yes" });
        this.toastr.success("Thành công", "Lưu việc làm", {
          timeOut: 3000,
        });
      } else {
        this.toastr.error("Thất bại", "Lưu việc làm", {
          timeOut: 3000,
        });
      }
    }
    
  }
}
