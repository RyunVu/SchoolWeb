import { Component, ElementRef, ViewChild } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { HttpService } from "src/app/services";
import { ToastrService } from "ngx-toastr";

import { ResultCode, ResultModel } from "src/app/models";

@Component({
  standalone: false,
  selector: "quan-ly-van-ban-modal",
  templateUrl: "quan-ly-van-ban.modal.html",
  styleUrls: ["./quan-ly-van-ban.modal.scss"],
})
export class QuanLyVanBanModal {
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef | undefined;

  item: any;
  soKyHieu: string = "";
  ngayBanHanh: any = "";
  nguoiKy: string = "";
  trichYeu: string = "";
  coQuanBanHanh: string = "";
  loaiVanBan: string = "";
  linhVuc: string = "";
  congBaoSo: string = "";
  ngayPhatHanh: any = "";
  ghiChu: string = "";
  fileName: string = "";
  uploadFile: any;

  uploadedFiles: any[] = [];


  // List
  docTypes: any[] = [];
  docCoQuanBhs: any[] = [];
  docLinhVucs: any[] = [];
  isLoading = false;
  isAdd: any;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public http: HttpService,
    private message: MessageService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
  ) {
    this.item = this.config.data.item || {};
    this.isAdd = this.config.data.IsAdd;

    this.setFormData();
  }

  setFormData() {
    if (!this.item) return;

    this.soKyHieu = this.item.SoKyHieu || "";
    this.congBaoSo = this.item.CongBaoSo || "";
    this.coQuanBanHanh = this.item.CoQuanBanHanh || "";
    this.ghiChu = this.item.GhiChu || "";
    this.linhVuc = this.item.LinhVuc || "";
    this.loaiVanBan = this.item.LoaiVanBan || "";
    this.nguoiKy = this.item.NguoiKy || "";
    this.trichYeu = this.item.TrichYeu || "";

    this.ngayBanHanh = this.item.NgayBanHanh ? new Date(this.item.NgayBanHanh) : null;
    this.ngayPhatHanh = this.item.NgayPhatHanh ? new Date(this.item.NgayPhatHanh) : null;

    this.uploadedFiles = this.item.Attachments;
  }


  submitEdit() {
    if (!this.soKyHieu) {
      this.toastr.warning("Vui lòng nhập số ký hiệu", "Cảnh báo", {
        timeOut: 3000,
      });
      return;
    }

    if (!this.ngayBanHanh) {
      this.toastr.warning("Vui lòng chọn ngày ban hành", "Cảnh báo", {
        timeOut: 3000,
      });
      return;
    }

    const form = new FormData();

    // Nếu có file mới, thêm file vào formData
    if (this.uploadFile && this.uploadFile.length) {
      for (let i = 0; i < this.uploadFile.length; i++) {
        form.append("Files[]", this.uploadFile[i], this.uploadFile[i].name);
      }
    }

    debugger

    if (this.item.Id) {
      form.append("Id", this.item.Id);
    }
    form.append("SoKyHieu", this.soKyHieu);
    form.append("CongBaoSo", this.congBaoSo);
    form.append("CoQuanBanHanh", this.coQuanBanHanh);
    form.append("GhiChu", this.ghiChu);
    form.append("LinhVuc", this.linhVuc);
    form.append("LoaiVanBan", this.loaiVanBan);
    form.append("NgayBanHanh", this.ngayBanHanh ? this.ngayBanHanh.toISOString() : null);
    form.append("NgayPhatHanh", this.ngayPhatHanh ? this.ngayPhatHanh.toISOString() : null);
    form.append("NguoiKy", this.nguoiKy);
    form.append("TrichYeu", this.trichYeu);
    form.append("UnitCode", this.item.UnitCode);

    this.isLoading = true;
    this.http.upload(
      'EOffice/Edit',
      form,
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.ref.close(result.Result);
        } else {
          this.toastr.error(result.Message || "Đã có lỗi xảy ra!", "Lỗi", {
            timeOut: 3000,
          });
        }

        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit() {
    this.isLoading = true; // Bật trạng thái loading
    Promise.all([
      this.loadDocTypes(),
      this.loadDocCoQuanBhs(),
      this.loadLinhVucs()
    ]).then(() => {
      this.isLoading = false; // Tắt trạng thái loading sau khi cả 3 hoàn thành
    }).catch(() => {
      this.isLoading = false; // Đảm bảo loading tắt ngay cả khi có lỗi
    });
  }

  cancel() {
    this.ref.close();
  }

  chooseFile(event: any) {
    this.uploadFile = event.target.files;
    let fileNameList = [];
    for (let i = 0; i < this.uploadFile.length; i++) {
      fileNameList.push(this.uploadFile[i].name);
    }
    this.fileName = fileNameList.join(", ");
  }

  clickFile() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  removeFile(file: any) {
    this.confirmationService.confirm({
      message: "Bạn có chắc chắn file này không?",
      accept: () => {

        const form = new FormData();
        form.append("filePath", file.Path);
        form.append("fileName", file.Name);

        this.http.upload(
          "EOffice/DeleteFile",
          form,
          (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {

              this.uploadedFiles = this.uploadedFiles.filter(x => x.Path != file.Path);
              this.toastr.success(result.Message, "Thành công", {
                timeOut: 3000,
              });
              //this.ref.close(result.Result);
            } else {
              this.toastr.error(result.Message || "Đã có lỗi xảy ra!", "Lỗi", {
                timeOut: 3000,
              });
            }
          },
          () => { }
        );

        // this.http.post(
        //     "News/DuyetTinTuc",
        //     {
        //         Id: item.Id,
        //         Code: type
        //     },
        //     (result: ResultModel) => {
        //         if (result.Code == ResultCode.Success) {
        //             this.ref.close({ confirm: "yes" });
        //             this.toastr.success("Xét duyệt bài viết", "Thành công!", {
        //                 timeOut: 3000,
        //             });
        //         }
        //     },
        //     () => { }
        // );
      },
    });
  }

  submit() {
    if (!this.soKyHieu) {
      this.toastr.warning("Vui lòng nhập số ký hiệu", "Cảnh báo", {
        timeOut: 3000,
      });
      return;
    }

    if (!this.ngayBanHanh) {
      this.toastr.warning("Vui lòng chọn ngày ban hành", "Cảnh báo", {
        timeOut: 3000,
      });
      return;
    }

    const form = new FormData();

    if (this.uploadFile && this.uploadFile.length) {
      for (let i = 0; i < this.uploadFile.length; i++) {
        form.append("Files[]", this.uploadFile[i], this.uploadFile[i].name);
      }
    }

    form.append("SoKyHieu", this.soKyHieu);
    form.append("CongBaoSo", this.congBaoSo);
    form.append("CoQuanBanHanh", this.coQuanBanHanh);
    form.append("GhiChu", this.ghiChu);
    form.append("LinhVuc", this.linhVuc);
    form.append("LoaiVanBan", this.loaiVanBan);
    form.append("NgayBanHanh", this.ngayBanHanh ? this.ngayBanHanh.toISOString() : null);
    form.append("NgayPhatHanh", this.ngayPhatHanh ? this.ngayPhatHanh.toISOString() : null);
    form.append("NguoiKy", this.nguoiKy);
    form.append("TrichYeu", this.trichYeu);
    form.append("UnitCode", this.config.data.UnitCode);

    this.isLoading = true;
    this.http.upload(
      "EOffice/Add",
      form,
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.ref.close(result.Result);
        } else {
          this.toastr.error(result.Message || "Đã có lỗi xảy ra!", "Lỗi", {
            timeOut: 3000,
          });
        }
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
       }
    );
  }

  private loadLinhVucs(): Promise<void> {
    return new Promise((resolve) => {
      this.http.post(
        "GeneralCategory/SearchItems",
        {
          Code: "Field",
        },
        (result: ResultModel) => {
          if (result.Code == ResultCode.Success) {
            this.docLinhVucs = result.Result;
            if (this.docLinhVucs.length > 0) {
              this.linhVuc = this.docLinhVucs[0].Name
            }
          }
          resolve();
        },
        () => {
          resolve();
        }
      );
    });
  }

  private loadDocCoQuanBhs(): Promise<void> {
    return new Promise((resolve) => {
      this.http.post(
        "GeneralCategory/SearchItems",
        {
          Code: "CoQuanBanHanh",
        },
        (result: ResultModel) => {
          if (result.Code == ResultCode.Success) {
            this.docCoQuanBhs = result.Result;
            if (this.docCoQuanBhs.length > 0) {
              this.coQuanBanHanh = this.docCoQuanBhs[0].Name
            }
          }

          resolve();
        },
        () => {
          resolve();
        }
      );
    });
  }

  private loadDocTypes(): Promise<void> {
    return new Promise((resolve) => {
      this.http.post(
        "GeneralCategory/SearchItems",
        {
          Code: "DocType",
        },
        (result: ResultModel) => {
          if (result.Code == ResultCode.Success) {
            this.docTypes = result.Result;
            if (this.docTypes.length > 0) {
              this.loaiVanBan = this.docTypes[0].Name
            }
          }
          resolve()
        },
        () => {
          resolve()
        }
      );
    });
  }
}
