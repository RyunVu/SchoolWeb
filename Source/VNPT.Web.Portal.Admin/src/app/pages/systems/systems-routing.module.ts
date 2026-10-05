import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/users.component';
import { UnitComponent } from './units/units.component';
import { PositionComponent } from './position/position.component';
import { HistoryComponent } from './history/history.component';
import { FieldsComponent } from './fields/fields.component';
import { HistoryUserComponent } from './history/history-user.component';
import { DefaultPageComponent } from '../default-page/default-page.component';
import { UtilityComponent } from './utility/utility.component';
import { VersionAppComponent } from './version-app/version-app.component';

const routes: Routes = [
  {
    path:'',
    component: DefaultPageComponent
  },
  {
    path:'user',
    component: UserComponent
  },
  {
    path:'role',
    component: RoleComponent
  },
  {
    path:'menu',
    component: MenuComponent
  },
  {
    path:'unit',
    component: UnitComponent
  },
  {
    path:'version',
    component: VersionAppComponent
  },
  {
    path:'position',
    component: PositionComponent
  },
  {
    path:'lich-su/:id',
    component: HistoryComponent
  },
  {
    path:'lich-su-nguoi-dung/:id',
    component: HistoryUserComponent
  },
  {
    path:'fields',
    component: FieldsComponent
  },
  {
    path:'utility',
    component: UtilityComponent
  },
  {
    path:'utility/:id',
    component: UtilityComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemsRoutingModule { }
