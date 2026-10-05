import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ColorPickerModule } from 'primeng/colorpicker';
import { AgmGeocoder, AgmCoreModule } from '@agm/core';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { ValidationMessagesModule } from '../../modules';
import { SystemsRoutingModule } from './systems-routing.module';
import { SharedModule } from 'src/app/services/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserComponent } from './user/users.component';
import { UserModal } from './user/user.modal';
import { RoleModal } from './role/role.modal';
import { RoleComponent } from './role/role.component';
import { MenuComponent } from './menu/menu.component';
import { MenuModal } from './menu/menu.modal';
import { FunctionMenuModal } from './menu/function.modal';
import { RoleMenuModal } from './role/role-menu.modal';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UnitComponent } from './units/units.component';
import { UnitModal } from './units/units.modal';
import { PositionComponent } from './position/position.component';
import { PositionModal } from './position/position.modal';
import { TreeModule } from 'primeng/tree';
import { DividerModule } from 'primeng/divider';
import { ChartsModule } from 'ng2-charts';
import { HistoryComponent } from './history/history.component';
import { HistoryModal } from './history/history.modal';
import { LocationModal } from './user/location.modal';
import { HistoryUserComponent } from './history/history-user.component';
import { FileManagerModal } from 'src/app/components/file-manager/file-manager.component';
import { FMMiniWindowModal } from 'src/app/components/file-manager/fm-mini-window.modal';
import { environment } from 'src/environments/environment';
import { RoleV2Component } from './role-v2/role-v2.component';
import { RoleV2MenuModal } from './role-v2/role-v2-menu.modal';
import { RoleV2Modal } from './role-v2/role-v2.modal';
import { RoleV2UserModal } from './role-v2/role-v2-user.modal';

@NgModule({
    declarations: [
        UserComponent,
        UserModal,
        RoleModal,
        RoleComponent,
        MenuComponent,
        MenuModal,
        FunctionMenuModal,
        RoleMenuModal,
        UnitComponent,
        UnitModal,
        PositionComponent,
        PositionModal,
        FileManagerModal,
        FMMiniWindowModal,
        HistoryComponent,
        HistoryModal,
        LocationModal,
        HistoryUserComponent,
        RoleV2Component,
        RoleV2MenuModal,
        RoleV2Modal,
        RoleV2UserModal,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        DialogModule,
        DynamicDialogModule,
        DropdownModule,
        CalendarModule,
        ColorPickerModule,
        TreeModule,
        DividerModule,
        SharedModule,
        SystemsRoutingModule,
        ToastrModule.forRoot(),
        ChartsModule,
        ValidationMessagesModule,
        NgxDropzoneModule,
        AgmCoreModule.forRoot({
            apiKey: environment.googleKey//'AIzaSyB0IURdzlzv2RgXGI-HlqTBp0VMxXeN2BU',
        }),
    ],
    entryComponents: [
        UserModal,
        RoleModal,
        MenuModal,
        FunctionMenuModal,
        RoleMenuModal,
        UnitModal,
        PositionModal,
        FileManagerModal,
        FMMiniWindowModal,
        HistoryModal,
        LocationModal,
        RoleV2MenuModal,
        RoleV2Modal,
        RoleV2UserModal,
    ],
    providers: [ToastrService, AgmGeocoder],
})
export class SystemsModule { }
