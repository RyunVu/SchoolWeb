import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IocListTemplateComponent } from './ioc-list-template.component';

const routes: Routes = [
  {
    path:'',
    component: IocListTemplateComponent
  },
  {
    path:'ioc-list',
    component: IocListTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IocTemplatesRoutingModule { }
