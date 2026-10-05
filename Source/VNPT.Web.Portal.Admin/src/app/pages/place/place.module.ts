import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PlaceRoutingModule } from "./place-routing.module";
import { PlaceComponent } from "./place/place.component";
import { PlaceModal } from "./place/place.modal";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "src/app/services/shared.module";
import { DialogModule } from "primeng/dialog";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { ToastrModule, ToastrService } from "ngx-toastr";

@NgModule({
  declarations: [PlaceComponent, PlaceModal],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    PlaceRoutingModule,
    DialogModule,
    DynamicDialogModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [PlaceModal],
  providers: [ToastrService],
})
export class PlaceModule {}
