import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './layouts';
import { LoginComponent } from './layouts/login/login.component';
import { MainComponent } from './layouts/main.component';
import { RegisterComponent } from './layouts/register/register.component';
import { CongThongTinComponent } from './pages/cong-thong-tin/cong-thong-tin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DefaultPageComponent } from './pages/default-page/default-page.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ReportExportPVComponent } from './pages/report-export-pv/report-export-pv.component';
import { ReportExportComponent } from './pages/report-export/report-export.component';
import { SysPortalReviewComponent } from './pages/sysportal-review/sysportal-review.component';
import { QuanLyVanBanComponent } from './pages/quan-ly-van-ban/quan-ly-van-ban.component';
import { AuthGuardService, NonAuthGuardService } from './services';

const routes: Routes = [
  {
    path: '',
    component: DefaultPageComponent,
    canActivate: [AuthGuardService],
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: CongThongTinComponent,
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' }
  },
  {
    path: 'cong-thong-tin',
    component: CongThongTinComponent,
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' }
  },
  {
    path: 'default',
    component: DefaultPageComponent,
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' }
  },
  {
    path: 'admin',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { role: 'AdminPage' }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { role: 'AdminPage' }
      }
    ]
  },
  {
    path: 'system',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/systems/systems.module`).then(
      module => module.SystemsModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: 'phan-anh',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/feedbacks/feedback.module`).then(
      module => module.FeedbacksModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/danh-muc-dung-chung/danhmuc.module`).then(
      module => module.DanhMucModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/danh-sach-tin-tuc/tintuc.module`).then(
      module => module.DanhSachTinTucModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/viec-lam/vieclam.module`).then(
      module => module.ViecLamModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: 'report',
    //canActivate: [AuthGuardService],
    //canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/reports/reports.module`).then(
      module => module.ReportsModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: 'thong-bao',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/notifications/notifications.module`).then(
      module => module.NotificationsModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: 'phuong-xa',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/wards/wards.module`).then(
      module => module.WardsModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: 'tham-so-he-thong',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/system-params/system-params.module`).then(
      module => module.SystemParamsModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: 'co-quan-hanh-chinh',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/place/place.module`).then(
      module => module.PlaceModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: 'qms',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/qms/qms.module`).then(
      module => module.QmsModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NonAuthGuardService],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NonAuthGuardService],
  },
  {
    path: 'pageNotFound',
    component: PageNotFoundComponent,
    canActivate: [NonAuthGuardService],
    data: { role: 'AdminPage' }
  },
  {
    path: 'ioc',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/ioc-define-template/ioc-define-template.module`).then(
      module => module.IocTemplatesModule
    ),
    data: { role: 'AdminPage' }
  },
  {
    path: 'ty-le-boc-so',
    component: ReportExportComponent,
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' }
  },
  {
    path: 'quan-ly-hoi-dap',
    component: SysPortalReviewComponent,
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' }
  },
  {
    path: 'quan-ly-van-ban',
    component: QuanLyVanBanComponent,
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' }
  },
  {
    path: 'ty-le-duoc-phuc-vu',
    component: ReportExportPVComponent,
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' }
  }
  , { path: '**', redirectTo: 'pageNotFound' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
