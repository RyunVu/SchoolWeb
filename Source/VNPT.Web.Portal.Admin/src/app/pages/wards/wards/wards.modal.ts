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
  selector: "wards-modal",
  templateUrl: "./wards.modal.html",
  styleUrls: ["./wards.modal.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class WardsModal {
  item: any;
  ward: any;
  types: any = [];
  selectedFields: any = [];
  listFieldWard: any = [];
  keyword: any;
  linhvucs: any = [];
  linhvuc: any;
  loading: boolean = true;
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
    };
    if (this.config.data.item != null) {
      this.item = this.config.data.item;
      this.ward = this.item.Id;
      this.unitcode = this.config.data.unitcode;
    }
  }

  ngOnInit() {
    this.loadListFieldWard();
    this.loadLinhVucs();
  }
  loadLinhVucs() {
    this.http.post(
      "GeneralCategory/SearchItems",
      { Code: "FeedbackType" },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.linhvucs = result.Result;
          this.linhvucs.unshift({ Value: null, Name: "Chọn tất cả" });
        }
      },
      () => {}
    );
  }
  loadListFieldWard() {
    this.loading = true;
    this.http.post(
      "Field/ListField",
      { WardId: this.ward, Keyword: this.keyword, Code: this.linhvuc, UnitCode: this.unitcode },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.types = result.Result;
        }
      },
      () => {}
    );
    this.loading = false;
  }
  cancel() {
    this.ref.close();
  }
  onKeyUp(event: any) {
    if (event.keyCode == 13) {
      this.loadListFieldWard();
    }
  }
  save(item: any) {
    this.http.post(
      "Field/AddField",
      { FieldId: item.Id, WardId: this.item.Id },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.toastr.success("Thay đổi Field Ward", "Thành công", {
            timeOut: 3000,
          });
        }
      },
      () => {}
    );
  }
}
