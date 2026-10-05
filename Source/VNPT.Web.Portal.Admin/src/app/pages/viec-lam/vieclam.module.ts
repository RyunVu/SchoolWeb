import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/services/shared.module";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { NhaTuyenDungComponent } from "./nha-tuyen-dung/nha-tuyen-dung.component";
import { NhaTuyenDungModal } from "./nha-tuyen-dung/nha-tuyen-dung.modal";
import { LinhVucTuyenDungComponent } from "./linh-vuc-tuyen-dung/linh-vuc-tuyen-dung.component";
import { LinhVucTuyenDungModal } from "./linh-vuc-tuyen-dung/linh-vuc-tuyen-dung.modal";
import { ViecLamRoutingModule } from "./vieclam-routing.module";
import { ViTriTuyenDungComponent } from "./vi-tri-tuyen-dung/vi-tri-tuyen-dung.component";
import { ViTriTuyenDungModal } from "./vi-tri-tuyen-dung/vi-tri-tuyen-dung.modal";
import { ViecLamComponent } from "./viec-lam/viec-lam.component";
import { ViecLamModal } from "./viec-lam/viec-lam.modal";

@NgModule({
  declarations: [
    NhaTuyenDungComponent,
    NhaTuyenDungModal,
    LinhVucTuyenDungComponent,
    LinhVucTuyenDungModal,
    ViTriTuyenDungComponent,
    ViTriTuyenDungModal,
    ViecLamComponent,
    ViecLamModal
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    ViecLamRoutingModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [NhaTuyenDungModal, LinhVucTuyenDungModal,ViTriTuyenDungModal,ViecLamModal],
  providers: [ToastrService],
})
export class ViecLamModule {}
