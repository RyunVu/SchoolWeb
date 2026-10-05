import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AreaComponent } from './area/area.component';
import { CounterComponent } from './counter/counter.component';
import { QmsComponent } from './qms/qms.component';

const routes: Routes = [
  {
    path:'',
    component: QmsComponent
  },
  {
    path:'dia-diem',
    component: QmsComponent
  },
  {
    path:'khu-vuc/:id',
    component: AreaComponent
  },
  {
    path:'quay/:id',
    component: CounterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QmsRoutingModule { }
