import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DanhSachTieuSuComponent } from './danh-sach-tieu-su.component'; 
const routes: Routes = [
  {
    path:'phong-truyen-thong/tieu-su',
    component: DanhSachTieuSuComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhSachTieuSuRoutingModule { }
