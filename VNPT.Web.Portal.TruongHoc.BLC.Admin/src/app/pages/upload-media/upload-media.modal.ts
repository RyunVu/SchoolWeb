import { Component, ElementRef, ViewChild } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { HttpService } from "src/app/services";
import { ToastrService } from "ngx-toastr";

import { ResultCode, ResultModel } from "src/app/models";

@Component({
  standalone: false,
  selector: "upload-media-modal",
  templateUrl: "upload-media.modal.html",
  styleUrls: ["./upload-media.modal.scss"],
})
export class UploadMediaModal {
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef | undefined;

  item: any;
  fileName: string = "";
  uploadFile: any;

  isLoading = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public http: HttpService,
    private message: MessageService,
    private toastr: ToastrService,
    public dialogService: DialogService
  ) { 
    this.item = this.config.data.item;
  }

  ngOnInit() {
    //this.isLoading = true; // Bật trạng thái loading
    // Promise.all([
    //   this.loadDocTypes(),
    //   this.loadDocCoQuanBhs(),
    //   this.loadLinhVucs()
    // ]).then(() => {
    //   this.isLoading = false; // Tắt trạng thái loading sau khi cả 3 hoàn thành
    // }).catch(() => {
    //   this.isLoading = false; // Đảm bảo loading tắt ngay cả khi có lỗi
    // });
  }

  cancel() {
    this.ref.close();
  }

  chooseFile(event: any) {
    const file = event.target.files[0]; // Chỉ lấy file đầu tiên
  
    if (file && file.type.startsWith("audio/")) { 
      this.uploadFile = file;
      this.fileName = file.name;
    } else {
      alert("Vui lòng chọn một file nhạc hợp lệ!");
      this.uploadFile = null;
      this.fileName = "";
    }
  }
  
  clickFile() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  submit() {
    if (!this.uploadFile) {
      this.toastr.error("Vui lòng chọn một file nhạc!", "Lỗi", {
        timeOut: 3000,
      });
      return;
    }

    this.isLoading = true;
  
    const form = new FormData();
    form.append("Id", this.item.Id); // Chỉ một file
    form.append("File", this.uploadFile, this.uploadFile.name); // Chỉ một file
  
    this.http.upload(
      "GeneralCategory/UpdateCategory",
      form,
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.ref.close();
          this.toastr.success('Lưu thông tin thành công!', 'Thành công', {
            timeOut: 3000,
          });
        } else {
          this.toastr.error(result.Message || "Đã có lỗi xảy ra!", "Lỗi", {
            timeOut: 3000,
          });
        }

        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.toastr.error("Đã có lỗi xảy ra!", "Lỗi", {
          timeOut: 3000,
        });
       }
    );


  }
}
