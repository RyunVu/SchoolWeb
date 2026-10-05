import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DanhMucRoutingModule } from "./danhmuc-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/services/shared.module";
import { DanhMucComponent } from "./danh-muc.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DanhMucModal } from "./danh-muc.modal";

@NgModule({
  declarations: [DanhMucComponent, DanhMucModal],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    DanhMucRoutingModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [DanhMucModal],
  providers: [ToastrService],
})
export class DanhMucModule {}
