import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NhaTuyenDungComponent } from './nha-tuyen-dung/nha-tuyen-dung.component'; 
import { LinhVucTuyenDungComponent } from './linh-vuc-tuyen-dung/linh-vuc-tuyen-dung.component';
import { ViTriTuyenDungComponent } from './vi-tri-tuyen-dung/vi-tri-tuyen-dung.component';
import { ViecLamComponent } from './viec-lam/viec-lam.component';
const routes: Routes = [
  {
    path:'viec-lam',
    component: ViecLamComponent
  },
  {
    path:'nha-tuyen-dung',
    component: NhaTuyenDungComponent
  },
  {
    path:'linh-vuc-tuyen-dung',
    component: LinhVucTuyenDungComponent
  },
  {
    path:'vi-tri-tuyen-dung',
    component: ViTriTuyenDungComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViecLamRoutingModule { }
