import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DanhSachTinTucComponent } from './danh-sach-tin-tuc.component'; 
import { DuyetTinTucComponent } from './duyet-tin-tuc.component';
const routes: Routes = [
  {
    path:'quan-ly-tin-tuc/:id',
    component: DanhSachTinTucComponent
  },
  {
    path:'quan-ly-tin-tuc/duyet/:id',
    component: DuyetTinTucComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhSachTinTucRoutingModule { }
