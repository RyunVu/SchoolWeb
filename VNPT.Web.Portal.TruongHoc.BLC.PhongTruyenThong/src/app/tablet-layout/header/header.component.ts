import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CanhBaoModal } from 'src/app/public/pages/canhbao-page/canhbao-modal/canhbao.modal';
import { AuthService } from 'src/app/services';
declare var $: any;

@Component({
  selector: 'app-tablet-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabletHeaderComponent implements OnInit {
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

  openMenu() {
    $('#menu-mobile').css({'width': '250px'});
    $('#main').css({'margin-left': '250px'});

    setTimeout(() => {
      $('#menu-mobile').addClass("show");
    }, 500);
  }

  closeMenu() {
    $('#menu-mobile').css({'width': '0px'});
    $('#main').css({'margin-left': '0px'});
    $('#menu-mobile').removeClass("show");
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
      })
      .onClose.subscribe((data: any) => {
        if (data) {
          //this.loadData();
        }
      });
  }
}
