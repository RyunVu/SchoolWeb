import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { SharedModule } from 'src/app/services/shared.module';
import { TabletRoutingModule, tabletComponents } from './tablet-routing.module';
import { environment } from 'src/environments/environment';
import { NgxSpinnerModule } from "ngx-spinner";
//import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

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
    ToastrModule.forRoot()],
  providers: [ToastrService],
  // <swiper-container>/<swiper-slide> là web component (Swiper Element)
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TabletModule {}
