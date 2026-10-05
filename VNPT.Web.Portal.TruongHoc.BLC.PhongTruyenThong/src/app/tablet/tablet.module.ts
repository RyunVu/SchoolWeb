import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AgmCoreModule, AgmGeocoder } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { NgxContentLoadingModule } from 'ngx-content-loading';

import { SharedModule } from 'src/app/services/shared.module';
import { TabletRoutingModule, tabletComponents } from './tablet-routing.module';
import { environment } from 'src/environments/environment';
import { NgxSpinnerModule } from "ngx-spinner";
//import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { SwiperModule } from 'swiper/angular';

declare module '@angular/core' {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}

@NgModule({
  declarations: [...tabletComponents],
  imports: [
    //NgbCarouselModule,
    NgxSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    TabletRoutingModule,
    ToastrModule.forRoot(),
    NgxContentLoadingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleKey//'AIzaSyB0IURdzlzv2RgXGI-HlqTBp0VMxXeN2BU',
    }),
    AgmDirectionModule,
    SwiperModule
  ],
  entryComponents: [],
  providers: [ToastrService, AgmGeocoder],
})
export class TabletModule {}
