import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachNhiemKyRoutingModule } from './nhiemky-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/services/shared.module';
import { DanhSachNhiemKyComponent } from './danh-sach-nhiem-ky.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DanhSachNhiemKyModal } from './danh-sach-nhiem-ky.modal';
import { CanBoNhiemKyModal } from './can-bo-nhiem-ky.modal';

@NgModule({
  declarations: [
    DanhSachNhiemKyComponent,
    DanhSachNhiemKyModal,
    CanBoNhiemKyModal,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    DanhSachNhiemKyRoutingModule,
    ToastrModule.forRoot(),
  ],
  providers: [ToastrService],
})
export class DanhSachNhiemKyModule {}
