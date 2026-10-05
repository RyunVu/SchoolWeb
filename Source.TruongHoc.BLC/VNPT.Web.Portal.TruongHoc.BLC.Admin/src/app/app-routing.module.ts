import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './layouts';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { CongThongTinComponent } from './pages/cong-thong-tin/cong-thong-tin.component';
import { DefaultPageComponent } from './pages/default-page/default-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SysPortalReviewComponent } from './pages/sysportal-review/sysportal-review.component';
import { QuanLyVanBanComponent } from './pages/quan-ly-van-ban/quan-ly-van-ban.component';
import { AuthGuardService, NonAuthGuardService } from './services';
import { ForgotPasswordComponent } from './layouts/forgot-password/forgot-password.component';
import { TemplateListComponent } from './pages/template/template-list.component';
import { UploadMediaComponent } from './pages/upload-media/upload-media.component';
import { TraCuuDiemComponent } from './pages/tra-cuu-diem/tra-cuu-diem.component';

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
    loadChildren: () =>
      import(`./pages/danh-sach-nhiem-ky/nhiemky.module`).then(
        (module) => module.DanhSachNhiemKyModule
      ),
    data: { role: 'AdminPage' },
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./pages/danh-sach-tieu-su/tieusu.module`).then(
        (module) => module.DanhSachTieuSuModule
      ),
    data: { role: 'AdminPage' },
  },
  {
    path: 'phong-truyen-thong',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./pages/danh-sach-tin-tuc-ptt/tintuc.module`).then(
        (module) => module.DanhSachTinTucPttModule
      ),
    data: { role: 'AdminPage' },
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/duyet-tin-tuc/duyettintuc.module`).then(
      module => module.DuyetTinTucModule
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
    path: 'tham-so-he-thong',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () => import(`./pages/system-params/system-params.module`).then(
      module => module.SystemParamsModule
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
    path: 'tra-cuu-diem',
    component: TraCuuDiemComponent,
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' }
  },
  {
    path: 'upload-media',
    component: UploadMediaComponent, 
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' }
  },
  {
    path: 'template/list',
    component: TemplateListComponent,
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' }
  },
  {
    path: 'quen-mat-khau',
    component: ForgotPasswordComponent,
    canActivate: [NonAuthGuardService]
  },
  { path: '**', redirectTo: 'pageNotFound' }
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
