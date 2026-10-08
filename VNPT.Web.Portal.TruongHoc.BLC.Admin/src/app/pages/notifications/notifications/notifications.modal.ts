import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { HttpService } from 'src/app/services';

@Component({
  standalone: false,
  selector: 'notifications-modal',
  templateUrl: './notifications.modal.html',
  styleUrls: ['./notifications.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsModal {

  item: any;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public http: HttpService,
    private message: MessageService,
    private toastr: ToastrService,
    public dialogService: DialogService,
  ) {
    this.item = {
      "Id": null,
      "Title": "",
      "Content": "",
      "UnitCode": ""
    };

    if (this.config.data.item != null) {
      this.item = this.config.data.item;
    }

    this.location = this.item.UnitCode;
  }

  ngOnInit() {
    this.loadLocations();
  }
  loadLocations() {
    this.http.post("Notification/districts", {

    }, (result: ResultModel) => {
      if (result.Code == ResultCode.Success) {
        this.locations = result.Result;
      }
    }, () => {
    });
  }
  locations: any[] = [];
  location: any;

  cancel() {
    this.ref.close();
  }
  onKeyUp(event: any) {
    if (event.keyCode == 13) {
    }
  }
  submit() {
    if (this.item.Title == null || this.item.Title == "") {
      this.toastr.error('Thiếu trường tiêu đề', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }
    if (this.item.Content == null || this.item.Content == "") {
      this.toastr.error('Thiếu trường nội dung', 'Cảnh báo', {
        timeOut: 3000,
      });
      return;
    }
    this.http.post("Notification/save",
      {
        "Id": this.item.Id,
        "Title": this.item.Title,
        "Content": this.item.Content,
        "UnitCode": this.location
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.ref.close({ confirm: 'yes' });
        }
      }, () => {
      });
  }

}
