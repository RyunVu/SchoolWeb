import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachTieuSuRoutingModule } from './tieusu-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/services/shared.module';
import { DanhSachTieuSuComponent } from './danh-sach-tieu-su.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DanhSachTieuSuModal } from './danh-sach-tieu-su.modal';
import { BaiVietTieuSuModal } from './bai-viet-tieu-su.modal';

@NgModule({
  declarations: [
    DanhSachTieuSuComponent,
    DanhSachTieuSuModal,
    BaiVietTieuSuModal,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    DanhSachTieuSuRoutingModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [DanhSachTieuSuModal, BaiVietTieuSuModal],
  providers: [ToastrService],
})
export class DanhSachTieuSuModule {}
