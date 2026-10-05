import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WardsComponent } from './wards/wards.component'; 

const routes: Routes = [
  {
    path:'',
    component: WardsComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WardsRoutingModule { }
