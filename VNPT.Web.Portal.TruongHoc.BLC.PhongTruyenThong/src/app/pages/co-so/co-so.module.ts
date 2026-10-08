import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ColorPickerModule } from 'primeng/colorpicker';

import { ValidationMessagesModule } from '../../modules';
import { CoSoRoutingModule } from './co-so-routing.module';
import { SharedModule } from 'src/app/services/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TreeModule } from 'primeng/tree';
import { DividerModule } from 'primeng/divider';
import { FileManagerModal } from 'src/app/components/file-manager/file-manager.component';
import { FMMiniWindowModal } from 'src/app/components/file-manager/fm-mini-window.modal';
import { DanhSachCoSoComponent } from './danh-sach-co-so/danh-sach-co-so.component';
import { DanhSachCoSoModal } from './danh-sach-co-so/danh-sach-co-so.modal';

@NgModule({
    declarations: [
        DanhSachCoSoComponent,
        DanhSachCoSoModal
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        DialogModule,
        DynamicDialogModule,
        SelectModule,
        DatePickerModule,
        ColorPickerModule,
        TreeModule,
        DividerModule,
        SharedModule,
        CoSoRoutingModule,
        ToastrModule.forRoot(),
        ValidationMessagesModule],
    providers: [ToastrService],
})
export class CoSoModule { }
