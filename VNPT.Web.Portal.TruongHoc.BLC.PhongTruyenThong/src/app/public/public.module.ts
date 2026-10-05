import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AgmCoreModule, AgmGeocoder } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { NgxContentLoadingModule } from 'ngx-content-loading';

import { SharedModule } from 'src/app/services/shared.module';
import { PublicRoutingModule, publicComponents } from './public-routing.module';
import { environment } from 'src/environments/environment';

declare module '@angular/core' {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}

@NgModule({
  declarations: [...publicComponents],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    PublicRoutingModule,
    ToastrModule.forRoot(),
    NgxContentLoadingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleKey//'AIzaSyB0IURdzlzv2RgXGI-HlqTBp0VMxXeN2BU',
    }),
    AgmDirectionModule,
  ],
  entryComponents: [],
  providers: [ToastrService, AgmGeocoder],
})
export class PublicModule {}
