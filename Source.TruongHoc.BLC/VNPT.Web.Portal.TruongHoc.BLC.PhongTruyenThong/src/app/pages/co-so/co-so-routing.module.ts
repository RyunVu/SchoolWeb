import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DanhSachCoSoComponent } from './danh-sach-co-so/danh-sach-co-so.component';
const routes: Routes = [
  {
    path: '',
    component: DanhSachCoSoComponent,
  },
  {
    path: 'danh-sach',
    component: DanhSachCoSoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DynamicDialogRef, DynamicDialogConfig],
})
export class CoSoRoutingModule {}
