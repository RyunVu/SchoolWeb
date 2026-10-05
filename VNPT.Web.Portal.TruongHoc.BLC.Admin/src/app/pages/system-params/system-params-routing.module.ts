import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemParamsComponent } from './system-params/system-params.component'; 

const routes: Routes = [
  {
    path:'',
    component: SystemParamsComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemParamsRoutingModule { }
