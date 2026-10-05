import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  HPLeftPanelComponent,
  PermitLeftPanelComponent,
  BusinessTinyDetailComponent,
  PermitTinyDetailComponent,
  SearchFormComponent,
  SearchFormService,
  BusinessSearchFormComponent,
  BusinessListComponent,
  PermitSearchFormComponent,
  PermitListComponent,
  FeedbackTaxComponent,
} from './components';
import {
  HomePageComponent,
  TraCuuPageComponent,
  PermitPageComponent,
  BusinessListPageComponent,
  BusinessDetailPageComponent,
  PermitListPageComponent,
  PermitDetailPageComponent,
  CanhBaoPageComponent,
  GioiThieuPageComponent,
  ChiTietPageComponent,
  DanhSachPageComponent,
  ChiTietBaiVietPageComponent
} from './pages';
import { HomePageService, PermitPageService } from './services';
import { FeedbackTaxPageComponent } from './pages/feedback-tax-page';
export const publicComponents = [
  // Pages
  ChiTietPageComponent,
  GioiThieuPageComponent,
  ChiTietBaiVietPageComponent,
  HomePageComponent,
  TraCuuPageComponent,
  DanhSachPageComponent,
  CanhBaoPageComponent,
  PermitPageComponent,
  BusinessListPageComponent,
  BusinessDetailPageComponent,
  PermitListPageComponent,
  PermitDetailPageComponent,
  FeedbackTaxPageComponent,
  // Components
  HPLeftPanelComponent,
  PermitLeftPanelComponent,
  BusinessTinyDetailComponent,
  PermitTinyDetailComponent,
  SearchFormComponent,
  BusinessSearchFormComponent,
  BusinessListComponent,
  PermitSearchFormComponent,
  PermitListComponent,
  FeedbackTaxComponent
];

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'gioithieu',
    component: GioiThieuPageComponent,
  },
  {
    path: 'chitiet-baiviet',
    component: ChiTietBaiVietPageComponent,
  },
  {
    path: 'chitiet',
    component: ChiTietPageComponent,
  },
  {
    path: 'danhsach',
    component: DanhSachPageComponent,
  },
  {
    path: 'tracuu',
    component: TraCuuPageComponent,
  },
  {
    path: 'canhbao',
    component: CanhBaoPageComponent,
  },
  {
    path: 'business-list',
    component: BusinessListPageComponent,
  },
  {
    path: 'business-detail/:id',
    component: BusinessDetailPageComponent,
  },
  {
    path: 'permit-map',
    component: PermitPageComponent,
  },
  {
    path: 'permit-list',
    component: PermitListPageComponent,
  },
  {
    path: 'permit-detail/:id',
    component: PermitDetailPageComponent,
  },
  {
    path: 'feedback-tax',
    component: FeedbackTaxPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [HomePageService, SearchFormService, PermitPageService],
})
export class PublicRoutingModule { }
