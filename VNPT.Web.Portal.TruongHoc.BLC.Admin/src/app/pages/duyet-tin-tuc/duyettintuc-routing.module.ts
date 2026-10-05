import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DuyetTinTucComponent } from './duyet-tin-tuc.component'; 
const routes: Routes = [
  {
    path:'duyet-tin-tuc',
    component: DuyetTinTucComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DuyetTinTucRoutingModule { }
