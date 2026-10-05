import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SystemParamsRoutingModule } from "./system-params-routing.module";
import { SystemParamsComponent } from "./system-params/system-params.component"; 
import { SystemParamsModal } from "./system-params/system-params.modal"; 
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "src/app/services/shared.module";
import { DialogModule } from "primeng/dialog";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { ToastrModule, ToastrService } from "ngx-toastr";

@NgModule({
  declarations: [SystemParamsComponent, SystemParamsModal],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    SystemParamsRoutingModule,
    DialogModule,
    DynamicDialogModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [SystemParamsModal],
  providers: [ToastrService],
})
export class SystemParamsModule {}
