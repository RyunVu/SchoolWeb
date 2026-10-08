
import { NgModule } from "@angular/core";

import { datetimePipe, imageUrlPipe } from "../pipes";

import { ButtonModule } from "primeng/button";
import { CarouselModule } from "primeng/carousel";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from 'primeng/textarea';
import { KeyFilterModule } from "primeng/keyfilter";
import { MenubarModule } from "primeng/menubar";
import { MessageModule } from "primeng/message";
import { PanelModule } from "primeng/panel";
import { RatingModule } from "primeng/rating";
import { SelectButtonModule } from "primeng/selectbutton";
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { MultiSelectModule } from 'primeng/multiselect';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { CardModule } from 'primeng/card'
import { PaginatorModule } from 'primeng/paginator';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeTableModule } from 'primeng/treetable';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { ImageModule } from 'primeng/image';
import { ThumbComponent } from "../components/thumb/thumb.component";
import { ShowDialogService } from "./showDialog.service";
import { AppDialogService } from "./app-dialog.service";
import { CkEditorComponent } from "../components";
import { ValidationMessagesModule } from "../modules";
import { ChartModule } from 'primeng/chart';
import { ConvertFileSizePipe } from "../pipes/convertFileSize.pipe";


@NgModule({
    declarations: [
        ThumbComponent,
        imageUrlPipe,
        datetimePipe,
        CkEditorComponent,
        ConvertFileSizePipe
    ],
    imports: [
        ImageModule,
        CarouselModule,
        ButtonModule,
        DataViewModule,
        PanelModule,
        TabsModule,
        InputTextModule,
        RatingModule,
        SelectModule,
        DialogModule,
        TextareaModule,
        SelectButtonModule,
        InputNumberModule,
        MessageModule,
        KeyFilterModule,
        MenubarModule,
        TableModule,
        SplitButtonModule,
        ToastModule,
        ConfirmDialogModule,
        DatePickerModule,
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
        ProgressBarModule,
        ValidationMessagesModule,
        ChartModule
    ],
    exports: [
        ImageModule,
        ThumbComponent,
        CarouselModule,
        ButtonModule,
        DataViewModule,
        PanelModule,
        TabsModule,
        InputTextModule,
        RatingModule,
        SelectModule,
        DialogModule,
        TextareaModule,
        SelectButtonModule,
        InputNumberModule,
        MessageModule,
        KeyFilterModule,
        MenubarModule,
        TableModule,
        SplitButtonModule,
        ToastModule,
        ConfirmDialogModule,
        DatePickerModule,
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
        ProgressBarModule,
        CkEditorComponent,
        ValidationMessagesModule,
        ConvertFileSizePipe
    ],
    providers: [
        MessageService,
        ConfirmationService,
        imageUrlPipe,
        datetimePipe,
        { provide: DialogService, useClass: AppDialogService },
        ShowDialogService
    ],
    bootstrap: []
})
export class SharedModule { }