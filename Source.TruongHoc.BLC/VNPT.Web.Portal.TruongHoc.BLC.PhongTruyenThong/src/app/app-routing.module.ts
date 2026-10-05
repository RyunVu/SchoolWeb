import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { PageNotFoundComponent } from './layouts';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { DefaultPageComponent } from './pages/default-page/default-page.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuardService, NonAuthGuardService } from './services';

const routes: Routes = [
  { path: '', redirectTo: '/tablet', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' },
  },
  {
    path: 'default',
    component: DefaultPageComponent,
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' },
  },
  {
    path: 'danh-muc',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./pages/danh-muc-dung-chung/danhmuc.module`).then(
        (module) => module.DanhMucModule
      ),
    data: { role: 'AdminPage' },
  },
  {
    path: 'system',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./pages/systems/systems.module`).then(
        (module) => module.SystemsModule
      ),
    data: { role: 'AdminPage' },
  },
  {
    path: 'danh-muc',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./pages/danh-muc-dung-chung/danhmuc.module`).then(
        (module) => module.DanhMucModule
      ),
    data: { role: 'AdminPage' },
  },
  {
    path: 'tin-tuc',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./pages/danh-sach-tin-tuc/tintuc.module`).then(
        (module) => module.DanhSachTinTucModule
      ),
    data: { role: 'AdminPage' },
  },
  {
    path: 'tieu-su',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./pages/danh-sach-tieu-su/tieusu.module`).then(
        (module) => module.DanhSachTieuSuModule
      ),
    data: { role: 'AdminPage' },
  },
  {
    path: 'nhiem-ky',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./pages/danh-sach-nhiem-ky/nhiemky.module`).then(
        (module) => module.DanhSachNhiemKyModule
      ),
    data: { role: 'AdminPage' },
  },
  {
    path: 'co-so',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./pages/co-so/co-so.module`).then((module) => module.CoSoModule),
    data: { role: 'AdminPage' },
  },
  {
    path: 'public',
    // canActivate: [AuthGuardService],
    // canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./public/public.module`).then((module) => module.PublicModule),
    data: { role: 'HomePage' },
  },
  {
    path: 'tablet',
    // canActivate: [AuthGuardService],
    // canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./tablet/tablet.module`).then((module) => module.TabletModule),
    data: { role: 'TabletPage' },
  },
  {
    path: 'phan-anh',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./pages/feedbacks/feedback.module`).then(
        (module) => module.FeedbacksModule
      ),
    data: { role: 'AdminPage' },
  },
  {
    path: 'thong-bao',
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    loadChildren: () =>
      import(`./pages/notifications/notifications.module`).then(
        (module) => module.NotificationsModule
      ),
    data: { role: 'AdminPage' },
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
    canActivate: [AuthGuardService],
    data: { role: 'AdminPage' },
  },
  { path: '**', redirectTo: 'pageNotFound' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
