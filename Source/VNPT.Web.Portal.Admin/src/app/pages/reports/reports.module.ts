import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/services/shared.module';
import { ReportViewerComponent } from './report-viewer/report-viewer.component';
import { ReportTongHopPAHTComponent } from './report-tonghop-paht/report-tonghop-paht.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ReportChiTietPAHTComponent } from './report-chitiet-paht/report-chitiet-paht.component';
import { ReportChiTietPAMCComponent } from './report-chitiet-pamc/report-chitiet-pamc.component';
import { ReportQuaHanTongHopPAHTComponent } from './report-quahan-tonghop-paht/report-quahan-tonghop-paht.component';
import { ReportQuaHanChiTietPAHTComponent } from './report-quahan-chitiet-patht/report-quahan-chitiet-patht.component';

@NgModule({
  declarations: [
    ReportViewerComponent,
    ReportTongHopPAHTComponent,
    ReportChiTietPAHTComponent,
    ReportChiTietPAMCComponent,
    ReportQuaHanTongHopPAHTComponent,
    ReportQuaHanChiTietPAHTComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    ReportsRoutingModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [],
  providers: [
    ToastrService
  ]
})
export class ReportsModule { }
