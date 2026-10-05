import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DanhMucComponent } from './danh-muc.component'; 
const routes: Routes = [
  {
    path:':id',
    component: DanhMucComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhMucRoutingModule { }
