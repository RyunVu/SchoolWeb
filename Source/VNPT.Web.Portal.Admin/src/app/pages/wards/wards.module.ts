import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WardsRoutingModule } from "./wards-routing.module";
import { WardsComponent } from "./wards/wards.component";
import { WardsModal } from "./wards/wards.modal";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "src/app/services/shared.module";
import { DialogModule } from "primeng/dialog";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { ToastrModule, ToastrService } from "ngx-toastr";

@NgModule({
  declarations: [WardsComponent, WardsModal],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    WardsRoutingModule,
    DialogModule,
    DynamicDialogModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [WardsModal],
  providers: [ToastrService],
})
export class WardsModule {}
