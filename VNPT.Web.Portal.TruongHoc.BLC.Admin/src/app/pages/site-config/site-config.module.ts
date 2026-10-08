import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DrawerModule } from "primeng/drawer";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { SharedModule } from "src/app/services/shared.module";
import { SiteConfigComponent } from "./site-config.component";

const routes: Routes = [{ path: "", component: SiteConfigComponent }];

@NgModule({
    declarations: [SiteConfigComponent],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        DrawerModule,
        ToggleSwitchModule,
        RouterModule.forChild(routes),
    ],
})
export class SiteConfigModule { }
