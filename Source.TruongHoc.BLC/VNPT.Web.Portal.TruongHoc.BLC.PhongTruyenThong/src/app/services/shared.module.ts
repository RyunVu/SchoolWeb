import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { MultiSelectModule } from 'primeng/multiselect';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeTableModule } from 'primeng/treetable';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ShowDialogService } from './showDialog.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ListboxModule } from 'primeng/listbox';

import {
  CkEditorComponent,
  BusinessTypeSelectorComponent,
  CitySelectorComponent,
  StreetSelectorComponent,
  WardSelectorComponent,
} from '../components';
import { datetimePipe, imageUrlPipe } from '../pipes';

@NgModule({
  declarations: [
    imageUrlPipe,
    datetimePipe,
    CkEditorComponent,
    BusinessTypeSelectorComponent,
    CitySelectorComponent,
    StreetSelectorComponent,
    WardSelectorComponent,
  ],
  imports: [
    CarouselModule,
    ButtonModule,
    DataViewModule,
    PanelModule,
    TabViewModule,
    InputTextModule,
    RatingModule,
    DropdownModule,
    DialogModule,
    InputTextareaModule,
    SelectButtonModule,
    InputNumberModule,
    MessagesModule,
    MessageModule,
    KeyFilterModule,
    MenubarModule,
    TableModule,
    SplitButtonModule,
    ToastModule,
    ConfirmDialogModule,
    CalendarModule,
    FileUploadModule,
    GalleriaModule,
    MultiSelectModule,
    CascadeSelectModule,
    CardModule,
    PaginatorModule,
    DynamicDialogModule,
    AutoCompleteModule,
    CheckboxModule,
    TreeTableModule,
    TooltipModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    ListboxModule
  ],
  exports: [
    CarouselModule,
    ButtonModule,
    DataViewModule,
    PanelModule,
    TabViewModule,
    InputTextModule,
    RatingModule,
    DropdownModule,
    DialogModule,
    InputTextareaModule,
    SelectButtonModule,
    InputNumberModule,
    MessagesModule,
    MessageModule,
    KeyFilterModule,
    MenubarModule,
    TableModule,
    SplitButtonModule,
    ToastModule,
    ConfirmDialogModule,
    CalendarModule,
    FileUploadModule,
    imageUrlPipe,
    datetimePipe,
    GalleriaModule,
    MultiSelectModule,
    CascadeSelectModule,
    CardModule,
    PaginatorModule,
    DynamicDialogModule,
    AutoCompleteModule,
    CheckboxModule,
    TreeTableModule,
    TooltipModule,
    ProgressSpinnerModule,
    CkEditorComponent,
    BusinessTypeSelectorComponent,
    CitySelectorComponent,
    StreetSelectorComponent,
    WardSelectorComponent,
    RadioButtonModule,
    ListboxModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    imageUrlPipe,
    datetimePipe,
    DialogService,
    ShowDialogService,
  ],
  bootstrap: [],
})
export class SharedModule { }
