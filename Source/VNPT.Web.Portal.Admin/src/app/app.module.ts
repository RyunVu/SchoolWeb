import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppButtonComponent } from './components';
import { FooterComponent } from './layouts/footer/footer.component';
import { HeaderComponent } from './layouts/header/header.component';
import { MessagesDropdownMenuComponent } from './layouts/header/messages-dropdown-menu/messages-dropdown-menu.component';
import { NotificationsDropdownMenuComponent } from './layouts/header/notifications-dropdown-menu/notifications-dropdown-menu.component';
import { UserDropdownMenuComponent } from './layouts/header/user-dropdown-menu/user-dropdown-menu.component';
import { LoginComponent } from './layouts/login/login.component';
import { MainComponent } from './layouts/main.component';
import { MenuSidebarComponent } from './layouts/menu-sidebar/menu-sidebar.component';
import { RegisterComponent } from './layouts/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardService, AuthService, BaseService, HttpService, NonAuthGuardService } from './services';
import { CookieService } from 'ngx-cookie-service';
import { PageNotFoundComponent } from './layouts/page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './services/shared.module';
import { HomeComponent } from './pages/home/home.component';

import localeVi from '@angular/common/locales/vi';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DefaultPageComponent } from './pages/default-page/default-page.component';
import { ToastrModule } from 'ngx-toastr';
import { ChartModule } from 'primeng/chart';
import { ReportExportComponent } from './pages/report-export/report-export.component';
import { ReportExportPVComponent } from './pages/report-export-pv/report-export-pv.component';
import { CongThongTinComponent } from './pages/cong-thong-tin/cong-thong-tin.component';
import { CongThongTinModal } from './pages/cong-thong-tin/cong-thong-tin.modal';
import { SysPortalAliasModal } from './pages/cong-thong-tin/sys-portal-alias.modal';
import { SysPortalAliasAddModal } from './pages/cong-thong-tin/sys-portal-alias-add.modal';
import { SysPortalSiteURLModal } from './pages/cong-thong-tin/sys-portal-site-url.modal';
import { SysPortalSiteURLAddModal } from './pages/cong-thong-tin/sys-portal-site-url-add.modal';
import { SysPortalReviewComponent } from './pages/sysportal-review/sysportal-review.component';
import { SysPortalReviewModal } from './pages/sysportal-review/sysportal-review.modal';
import { QuanLyVanBanComponent } from './pages/quan-ly-van-ban/quan-ly-van-ban.component';
import { ChangePasswordModal } from './layouts/header/change-password/change-password.modal';
import { UploadFileModal } from './pages/cong-thong-tin/upload-file.modal';
registerLocaleData(localeVi, 'vi');

declare module '@angular/core' {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    PageNotFoundComponent,
    MenuSidebarComponent,
    MessagesDropdownMenuComponent,
    NotificationsDropdownMenuComponent,
    UserDropdownMenuComponent,
    ChangePasswordModal,
    RegisterComponent,
    DashboardComponent,
    AppButtonComponent,
    HomeComponent,
    DefaultPageComponent,
    ReportExportComponent,
    ReportExportPVComponent,
    CongThongTinComponent,
    CongThongTinModal,
    SysPortalAliasModal,
    SysPortalAliasAddModal,
    SysPortalSiteURLModal,
    SysPortalSiteURLAddModal,
    SysPortalReviewComponent,
    SysPortalReviewModal,
    QuanLyVanBanComponent,
    UploadFileModal
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    SharedModule,
    ChartModule,
    ToastrModule.forRoot()
  ],
  entryComponents: [
    CongThongTinModal, 
    SysPortalAliasModal,
    SysPortalAliasAddModal,
    SysPortalSiteURLModal,
    SysPortalSiteURLAddModal,
    SysPortalReviewModal,
    ChangePasswordModal,
    UploadFileModal
  ],
  providers: [
    AuthGuardService,
    NonAuthGuardService,
    AuthService,
    CookieService,
    HttpService,
    BaseService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
