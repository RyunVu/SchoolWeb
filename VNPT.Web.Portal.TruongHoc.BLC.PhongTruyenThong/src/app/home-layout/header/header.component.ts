import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CanhBaoModal } from 'src/app/public/pages/canhbao-page/canhbao-modal/canhbao.modal';
import { AuthService } from 'src/app/services';
declare var $: any;

@Component({
  standalone: false,
  selector: 'app-home-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeHeaderComponent implements OnInit {
  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>();
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl(null),
  });

  isLogin: boolean = false;
  constructor(
    private authService: AuthService,
    public dialogService: DialogService,
  ) {
    this.isLogin = authService.isUserLoggedIn();
  }

  ngOnInit() {
  }

  toggleMenu() {
    $('#menu-mobile').slideToggle();
  }

  openNewTab(url: any) {

    window.open(url, '_blank');
  }
  // logout() {
  //   //this.appService.logout();
  //   this.authService.logoutUser();
  // }

  guiCanhBao() {
    const ref = this.dialogService
      .open(CanhBaoModal, {
        data: {
          IsAdd: false,
        },
        header: 'Cảnh báo vệ sinh an toàn thực phẩm',
        width: '55%',
      })!
      .onClose.subscribe((data: any) => {
        if (data) {
          //this.loadData();
        }
      });
  }
}
