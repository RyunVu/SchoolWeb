import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportChiTietPAHTComponent } from './report-chitiet-paht/report-chitiet-paht.component';
import { ReportChiTietPAMCComponent } from './report-chitiet-pamc/report-chitiet-pamc.component';
import { ReportTongHopPAHTComponent } from './report-tonghop-paht/report-tonghop-paht.component';
import { ReportViewerComponent } from './report-viewer/report-viewer.component';
import { ReportQuaHanTongHopPAHTComponent } from './report-quahan-tonghop-paht/report-quahan-tonghop-paht.component';
import { ReportQuaHanChiTietPAHTComponent } from './report-quahan-chitiet-patht/report-quahan-chitiet-patht.component';

const routes: Routes = [
  {
    path:'',
    component: ReportViewerComponent
  },
  {
    path:'bao-cao-tong-hop-paht',
    component: ReportTongHopPAHTComponent
  },
  {
    path:'bao-cao-chi-tiet-paht',
    component: ReportChiTietPAHTComponent
  },
  {
    path:'bao-cao-chi-tiet-pamc',
    component: ReportChiTietPAMCComponent
  },
  {
    path:'bao-cao-tong-hop-paht-quahan',
    component: ReportQuaHanTongHopPAHTComponent
  },
  {
    path:'bao-cao-chi-tiet-paht-quahan',
    component: ReportQuaHanChiTietPAHTComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
