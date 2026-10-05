import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsModal } from './notifications/notifications.modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/services/shared.module';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';


@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationsModal
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule, 
    NotificationsRoutingModule,
    DialogModule,
    DynamicDialogModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [
    NotificationsModal
  ],
  providers: [
    ToastrService
  ]
})
export class NotificationsModule { }
