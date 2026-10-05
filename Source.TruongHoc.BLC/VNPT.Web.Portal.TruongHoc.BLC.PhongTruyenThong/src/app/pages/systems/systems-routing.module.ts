import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/users.component';
import { UnitComponent } from './units/units.component';
import { PositionComponent } from './position/position.component';
import { HistoryComponent } from './history/history.component';
import { HistoryUserComponent } from './history/history-user.component';
import { DefaultPageComponent } from '../default-page/default-page.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RoleV2Component } from './role-v2/role-v2.component';
const routes: Routes = [
  {
    path: '',
    component: DefaultPageComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'role',
    component: RoleComponent,
  },
  {
    path: 'role-v2',
    component: RoleV2Component,
  },
  {
    path: 'menu',
    component: MenuComponent,
  },
  {
    path: 'unit',
    component: UnitComponent,
  },
  {
    path: 'position',
    component: PositionComponent,
  },
  {
    path: 'lich-su/:id',
    component: HistoryComponent,
  },
  {
    path: 'lich-su-nguoi-dung/:id',
    component: HistoryUserComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DynamicDialogRef, DynamicDialogConfig],
})
export class SystemsRoutingModule {}
