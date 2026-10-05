import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DanhSachTinTucComponent } from './danh-sach-tin-tuc.component'; 
const routes: Routes = [
  {
    path:'tin-tuc/:id',
    component: DanhSachTinTucComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhSachTinTucRoutingModule { }
