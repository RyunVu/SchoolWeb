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
import { NewsHistoryModal } from './news-history.modal';
import { NewsPreviewModal } from './news-preview.modal';

@NgModule({
  declarations: [
    DanhSachTinTucComponent, 
    DanhSachTinTucModal, 
    DuyetTinTucComponent, 
    DuyetTinTucModal,
    NewsHistoryModal,
    NewsPreviewModal
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
  providers: [ToastrService],
})
export class DanhSachTinTucModule {}
