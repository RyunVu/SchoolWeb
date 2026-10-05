import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/services/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {GalleriaModule} from 'primeng/galleria';
import {TimelineModule} from 'primeng/timeline';
import { IocListTemplateComponent } from './ioc-list-template.component';
import { IocTemplatesRoutingModule } from './ioc-define-template-routing.module';
import { IocDefineTemplateModal } from './ioc-modal/ioc-define-template.modal';
import {RadioButtonModule} from 'primeng/radiobutton';
import { MapDonViTemplateModal } from './ioc-modal/map-don-vi-template.modal';
import { ListboxModule } from 'primeng/listbox';
import { TongHopTemplateModal } from './ioc-modal/tong-hop-template.modal';
import {TabViewModule} from 'primeng/tabview';
import { PrintTemplateModal } from './ioc-modal/print-template.modal';
import { MultiSelectModule } from 'primeng/multiselect';
import {CalendarModule} from 'primeng/calendar';
import { InputModal } from './ioc-input-modal/ioc-input.modal';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputGridModal } from './ioc-input-modal/ioc-input-grid.modal';
import { InputGridV2Modal } from './ioc-input-modal/ioc-input-grid-v2.modal';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { DonViTemplateModal } from './ioc-input-modal/don-vi-template.modal';
import { IOCTargetTemplateModal } from './ioc-input-modal/ioc-target-template.modal';


@NgModule({
    declarations: [
        IocListTemplateComponent,
        IocDefineTemplateModal,
        MapDonViTemplateModal,
        TongHopTemplateModal,
        PrintTemplateModal,
        InputModal,
        InputGridModal,
        InputGridV2Modal,
        DonViTemplateModal,
        IOCTargetTemplateModal
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule, 
        GalleriaModule,
        TimelineModule,
        IocTemplatesRoutingModule,
        RadioButtonModule,
        ListboxModule,
        TabViewModule,
        MultiSelectModule,
        CalendarModule,
        DynamicDialogModule,
        ProgressSpinnerModule
    ],
    entryComponents: [
        IocDefineTemplateModal,
        MapDonViTemplateModal,
        TongHopTemplateModal,
        PrintTemplateModal,
        InputModal,
        InputGridModal,
        InputGridV2Modal,
        DonViTemplateModal,
        IOCTargetTemplateModal
  
    ],
    providers: [
    ]
})
export class IocTemplatesModule { }
