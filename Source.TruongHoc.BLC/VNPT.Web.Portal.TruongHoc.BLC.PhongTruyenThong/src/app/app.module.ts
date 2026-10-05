import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DefaultPageComponent } from './pages/default-page/default-page.component';
import { HomeHeaderComponent } from './home-layout/header/header.component';
import { HomeMainComponent } from './home-layout/main.component';
import { TabletHeaderComponent } from './tablet-layout/header/header.component';

import { TabletMainComponent } from './tablet-layout/main.component';
import { WidgetComponent, LineChartComponent } from './pages/home/components';
import { MatSliderModule } from '@angular/material/slider';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
registerLocaleData(localeVi, 'vi');
import { SwiperModule } from 'swiper/angular';
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
        NgbModule,
        FontAwesomeModule,
        SharedModule,
        ChartModule,
        IonicModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: environment.googleKey//'AIzaSyCAVzFWcKojFmLMdTsoVVhy1EOhBFvolMg',
        }),
        MatSliderModule,
        NgMultiSelectDropDownModule.forRoot(),

        ToastrModule.forRoot(),
    ],
    providers: [
        AuthGuardService,
        NonAuthGuardService,
        AuthService,
        CookieService,
        HttpService,
        BaseService,
        DatePipe,
        ToastrService
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        ChangeUserInfoModal
    ]
})
export class AppModule { }
