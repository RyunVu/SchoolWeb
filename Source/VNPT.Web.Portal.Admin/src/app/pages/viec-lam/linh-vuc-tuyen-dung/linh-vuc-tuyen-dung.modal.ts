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
  selector: "linh-vuc-tuyen-dung-modal",
  templateUrl: "linh-vuc-tuyen-dung.modal.html",
  styleUrls: ["./linh-vuc-tuyen-dung.modal.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LinhVucTuyenDungModal {
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
      ImageUrl: "",
      Name: "",
    };
    this.province = Parameter.province.Id;
    if (this.config.data.item != null) {
      this.item = this.config.data.item;
    }
    this.imageUrl = this.item.ImageUrl;
  }

  ngOnInit() {
  }
  cancel() {
    this.ref.close();
  }
  onKeyUp(event: any) {
    if (event.keyCode == 13) {
    }
  }
  submit() {
    this.http.post(
      "WorkField/save",
      {
        Id: this.item.Id,
        Name: this.item.Name, 
        ImageUrl: this.imageUrl,
        Description: this.item.Description,
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
