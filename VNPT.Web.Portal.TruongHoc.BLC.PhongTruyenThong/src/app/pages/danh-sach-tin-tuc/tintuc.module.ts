import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DanhSachTinTucRoutingModule } from "./tintuc-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/services/shared.module";
import { DanhSachTinTucComponent } from "./danh-sach-tin-tuc.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DanhSachTinTucModal } from "./danh-sach-tin-tuc.modal";
import { CaptionImageModel } from "./caption-image.modal";

@NgModule({
  declarations: [DanhSachTinTucComponent, DanhSachTinTucModal, CaptionImageModel],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    DanhSachTinTucRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],
})
export class DanhSachTinTucModule { }
