import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DuyetTinTucRoutingModule } from "./duyettintuc-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/services/shared.module";
import { DuyetTinTucComponent } from "./duyet-tin-tuc.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DuyetTinTucModal } from "./duyet-tin-tuc.modal";

@NgModule({
  declarations: [DuyetTinTucComponent, DuyetTinTucModal],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    DuyetTinTucRoutingModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [DuyetTinTucModal],
  providers: [ToastrService],
})
export class DuyetTinTucModule {}
