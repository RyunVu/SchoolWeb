import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { appPrimeNGProviders } from './primeng-theme';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartModule } from 'primeng/chart';

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
import {
    AuthGuardService,
    AuthService,
    BaseService,
    HttpService,
    NonAuthGuardService,
} from './services';
import { PageNotFoundComponent } from './layouts/page-not-found/page-not-found.component';
import { SharedModule } from './services/shared.module';
import { HomeComponent } from './pages/home/home.component';
import localeVi from '@angular/common/locales/vi';
import { DefaultPageComponent } from './pages/default-page/default-page.component';
import { HomeHeaderComponent } from './home-layout/header/header.component';
import { HomeMainComponent } from './home-layout/main.component';
import { TabletHeaderComponent } from './tablet-layout/header/header.component';

import { TabletMainComponent } from './tablet-layout/main.component';
import { WidgetComponent, LineChartComponent } from './pages/home/components';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
registerLocaleData(localeVi, 'vi');
import { ChangeUserInfoModal } from './layouts/header/change-user-info/change-user-info.modal';

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
        RegisterComponent,
        HomeComponent,
        DefaultPageComponent,
        HomeHeaderComponent,
        HomeMainComponent,
        TabletHeaderComponent,
        TabletMainComponent,
        AppButtonComponent,
        WidgetComponent,
        LineChartComponent,

        ChangeUserInfoModal,
    ],
    imports: [
        NgxSpinnerModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        SharedModule,
        ChartModule,

        ToastrModule.forRoot(),
    ],
    providers: [
        // Angular 21: bootstrapModule mặc định là zoneless; ứng dụng này vẫn dựa vào zone.js
        provideZoneChangeDetection(),
        appPrimeNGProviders,
        AuthGuardService,
        NonAuthGuardService,
        AuthService,
        CookieService,
        HttpService,
        BaseService,
        DatePipe,
        ToastrService
    ],
    bootstrap: [AppComponent],})
export class AppModule { }
