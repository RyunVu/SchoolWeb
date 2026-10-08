import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ColorPickerModule } from 'primeng/colorpicker';
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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { HistoryComponent } from './history/history.component';
import { HistoryModal } from './history/history.modal';
import { LocationModal } from './user/location.modal';
import { HistoryUserComponent } from './history/history-user.component';
import { FileManagerModal } from 'src/app/components/file-manager/file-manager.component';
import { FMMiniWindowModal } from 'src/app/components/file-manager/fm-mini-window.modal';
import { HistoryLoginModal } from './user/historylogin.modal';
import { HistoryLoginAdminModal } from './user/historyloginadmin.modal';
import { ClientMenuComponent } from './client-menu/client-menu.component';
import { ClientMenuModal } from './client-menu/client-menu.modal';
import { CategoryMenuModal } from './client-menu/category-menu.modal';
import { NewsTypeMenuModal } from './client-menu/news-type-menu.modal';
import { QrOtpModal } from './user/qr-otp.modal';

@NgModule({
    declarations: [
        UserComponent,
        UserModal,
        HistoryLoginModal,
        HistoryLoginAdminModal,
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
        ClientMenuComponent,
        ClientMenuModal,
        CategoryMenuModal,
        NewsTypeMenuModal,
        QrOtpModal
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
        ToggleSwitchModule,
        SharedModule,
        SystemsRoutingModule,
        ToastrModule.forRoot()
    ],
    providers: [
        ToastrService,
    ]
})
export class SystemsModule { }
