import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { SharedModule } from 'src/app/services/shared.module';
import { PublicRoutingModule, publicComponents } from './public-routing.module';
import { environment } from 'src/environments/environment';

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
  ],
  providers: [ToastrService],
})
export class PublicModule {}
