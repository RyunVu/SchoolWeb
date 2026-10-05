import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/services/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {GalleriaModule} from 'primeng/galleria';
import {TimelineModule} from 'primeng/timeline';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { QmsComponent } from './qms/qms.component';
import { QmsRoutingModule } from './qms-routing.module';
import { AreaComponent } from './area/area.component';
import { CounterComponent } from './counter/counter.component';
import { QMSModal } from './qms/qms.modal';
import { AreaModal } from './area/area.modal';
import { CounterModal } from './counter/counter.modal';


@NgModule({
    declarations: [
        QmsComponent,
        AreaComponent,
        CounterComponent,
        QMSModal,
        AreaModal,
        CounterModal,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule, 
        QmsRoutingModule,
        GalleriaModule,
        TimelineModule,
        ToastrModule.forRoot(),
    ],
    entryComponents: [
        QMSModal,
        AreaModal,
        CounterModal,
    ],
    providers: [
        ToastrService
    ]
})
export class QmsModule { }
