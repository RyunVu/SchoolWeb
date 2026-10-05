import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public sidebarMenuOpened = true;
  @ViewChild('contentWrapper', { static: false }) contentWrapper: any;

  constructor(private renderer: Renderer2) {

    var widthScreen = window.innerWidth;
    if (widthScreen > 768 && widthScreen <= 991) {
      this.sidebarMenuOpened = false;
      this.renderer.addClass(document.querySelector('body'), 'sidebar-collapse');
    } else if (widthScreen < 768) {

      this.sidebarMenuOpened = false;
    }
  }

  ngOnInit() {
    // this.renderer.addClass(document.querySelector('body'), 'sidebar-mini');
    // this.renderer.addClass(document.querySelector('body'), 'sidebar-open');
    this.renderer.removeClass(document.querySelector('app-root'), 'login-page');
    this.renderer.removeClass(document.querySelector('app-root'), 'register-page');
  }

  mainSidebarHeight(height: any) {
    // this.renderer.setStyle(
    //   this.contentWrapper.nativeElement,
    //   'min-height',
    //   height - 114 + 'px'
    // );
  }

  toggleMenuSidebar() {

    if (this.sidebarMenuOpened) {
      this.renderer.removeClass(document.querySelector('body'), 'sidebar-open');
      this.renderer.addClass(document.querySelector('body'), 'sidebar-collapse');
      this.sidebarMenuOpened = false;
    } else {
      this.renderer.removeClass(document.querySelector('body'), 'sidebar-collapse');
      this.renderer.addClass(document.querySelector('body'), 'sidebar-open');
      this.sidebarMenuOpened = true;
    }
  }
}
