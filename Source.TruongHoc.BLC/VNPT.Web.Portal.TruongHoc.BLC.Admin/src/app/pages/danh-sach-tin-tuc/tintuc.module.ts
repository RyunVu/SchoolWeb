import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DanhSachTinTucRoutingModule } from "./tintuc-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/services/shared.module";
import { DanhSachTinTucComponent } from "./danh-sach-tin-tuc.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DanhSachTinTucModal } from "./danh-sach-tin-tuc.modal";
import { DuyetTinTucComponent } from "./duyet-tin-tuc.component";
import { DuyetTinTucModal } from "./duyet-tin-tuc.modal";

@NgModule({
  declarations: [
    DanhSachTinTucComponent, 
    DanhSachTinTucModal, 
    DuyetTinTucComponent, 
    DuyetTinTucModal
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    DanhSachTinTucRoutingModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [DanhSachTinTucModal],
  providers: [ToastrService],
})
export class DanhSachTinTucModule {}
