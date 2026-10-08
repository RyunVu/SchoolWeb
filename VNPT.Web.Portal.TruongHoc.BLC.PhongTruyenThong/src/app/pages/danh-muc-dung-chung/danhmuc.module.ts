import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DanhMucRoutingModule } from "./danhmuc-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DanhMucComponent } from "./danh-muc.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DanhMucModal } from "./danh-muc.modal";
import { SharedModule } from "src/app/services/shared.module";

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
  providers: [ToastrService],
})
export class DanhMucModule {}
