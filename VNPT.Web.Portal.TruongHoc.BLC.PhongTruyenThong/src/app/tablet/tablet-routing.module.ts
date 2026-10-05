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
  LanhDaoPageComponent,
  NhiemKyPageComponent,
  UBKTCapUyPageComponent,
  InTroPageComponent,
  HomePageComponent,
  TraCuuPageComponent,
  PermitPageComponent,
  BusinessListPageComponent,
  BusinessDetailPageComponent,
  PermitListPageComponent,
  PermitDetailPageComponent,
  CanhBaoPageComponent,
  GioiThieuPageComponent,
  TrangSuVangPageComponent,
  GiaoDucTruyenThongPageComponent,
  HoatDongPhongTraoPageComponent,
  HinhAnhVideoPageComponent,
  CoQuanUBKTPageComponent,
  ChiTietPageComponent,
  DanhSachPageComponent,
  ChiTietBaiVietPageComponent,
  ChiTietUyVienPageComponent,
  DanhSachCanBoPageComponent,
  DanhSachHDPTPageComponent,
  ChiTietHDPTPageComponent,
  ChiTietHuyenUyComponent,
  ChiTietCoQuanTinhUyComponent,
  HoatDongNoiBatPageComponent,
  ChiTietNDPBPageComponent
} from './pages';
import { HomePageService, PermitPageService } from './services';
import { FeedbackTaxPageComponent } from './pages/feedback-tax-page';
export const tabletComponents = [
  // Pages
  LanhDaoPageComponent,
  HoatDongNoiBatPageComponent,
  NhiemKyPageComponent,
  UBKTCapUyPageComponent,
  InTroPageComponent,
  ChiTietPageComponent,
  GioiThieuPageComponent,
  TrangSuVangPageComponent,
  GiaoDucTruyenThongPageComponent,
  HoatDongPhongTraoPageComponent,
  HinhAnhVideoPageComponent,
  CoQuanUBKTPageComponent,
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
  FeedbackTaxComponent,
  ChiTietUyVienPageComponent,
  DanhSachCanBoPageComponent,
  DanhSachHDPTPageComponent,
  ChiTietHDPTPageComponent,
  ChiTietHuyenUyComponent,
  ChiTietCoQuanTinhUyComponent,
  ChiTietNDPBPageComponent
];

const routes: Routes = [
  {
    path: 'chitiet-noidung/:baiviet',
    component: ChiTietNDPBPageComponent,
  },
  {
    path: 'nhiemky',
    component: NhiemKyPageComponent,
  },
  {
    path: 'cacphongban',
    component: UBKTCapUyPageComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: '',
    component: InTroPageComponent,
  },
  {
    path: 'gioithieu',
    component: GioiThieuPageComponent,
  },
  {
    path: 'lanhdao',
    component: LanhDaoPageComponent,
  },
  {
    path: 'trangsuvang',
    component: TrangSuVangPageComponent,
  },
  {
    path: 'hoatdongnoibat',
    component: HoatDongNoiBatPageComponent,
  },
  {
    path: 'giaoductruyenthong',
    component: GiaoDucTruyenThongPageComponent,
  },
  {
    path: 'hoatdongphongtrao',
    component: HoatDongPhongTraoPageComponent,
  },
  {
    path: 'hinhanhvideo',
    component: HinhAnhVideoPageComponent,
  },
  {
    path: 'coquanubkt',
    component: CoQuanUBKTPageComponent,
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
  {
    path: 'chitietuyvien',
    component: ChiTietUyVienPageComponent,
  },
  {
    path: 'ds-canbo',
    component: DanhSachCanBoPageComponent,
  },
  {
    path: 'ds-hdpt',
    component: DanhSachHDPTPageComponent,
  },
  {
    path: 'chitiet-hdpt',
    component: ChiTietHDPTPageComponent,
  },
  {
    path: 'chitiet-huyenuy',
    component: ChiTietHuyenUyComponent,
  },
  {
    path: 'chitiet-coquantinhuy',
    component: ChiTietCoQuanTinhUyComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  
  exports: [RouterModule],
  providers: [HomePageService, SearchFormService, PermitPageService],
})
export class TabletRoutingModule { }
