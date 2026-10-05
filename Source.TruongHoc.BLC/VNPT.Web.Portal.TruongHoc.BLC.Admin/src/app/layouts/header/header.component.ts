import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HistoryLoginModal } from 'src/app/pages/systems/user/historylogin.modal';
import { AuthService } from 'src/app/services';
import { DialogService } from "primeng/dynamicdialog";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>();
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl(null),
  });

  constructor(
    private authService: AuthService,
    public dialogService: DialogService
    ) { }

  ngOnInit() {
  }
  historyLogin() {
    const ref = this.dialogService
      .open(HistoryLoginModal, {
        data: {
          isUserLogin: true,
        },
        header: "Lịch sử đăng nhập",
        width: "70%",
      })
      .onClose.subscribe((data: any) => {});
  }
  // logout() {
  //   //this.appService.logout();
  //   this.authService.logoutUser();
  // }
}
