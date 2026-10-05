import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DanhSachNhiemKyComponent } from './danh-sach-nhiem-ky.component';
const routes: Routes = [
  {
    path: 'phong-truyen-thong/nhiem-ky',
    component: DanhSachNhiemKyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachNhiemKyRoutingModule {}
