import { Component, ViewEncapsulation } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { DialogService } from 'primeng/dynamicdialog';
@Component({
  standalone: false,
  selector: 'view-answer-modal',
  templateUrl: 'view-answer.modal.html',
  styleUrls: ['./view-answer.modal.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewAnswerModal {
  item: any = {};

  trangthai = 0;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public http: HttpService,
    private message: MessageService,
    private toastr: ToastrService,
    public dialogService: DialogService
  ) {
    if (this.config.data.item != null) {
      this.item = this.config.data.item;
    }
  }
  ngOnInit() {}

  cancel() {
    this.ref.close();
  }
}
