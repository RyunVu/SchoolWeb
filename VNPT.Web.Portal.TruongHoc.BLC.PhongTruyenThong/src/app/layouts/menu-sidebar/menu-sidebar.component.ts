import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  Renderer2,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ResultCode, ResultModel } from 'src/app/models';
import { HttpService } from 'src/app/services';

@Component({
  standalone: false,
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss'],
})
export class MenuSidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mainSidebar', { static: false }) mainSidebar: any;
  @Output() mainSidebarHeight: EventEmitter<any> = new EventEmitter<any>();

  public user: any;
  public menus: any[] = [];
  public currentUrl: any;

  currentPath: any;
  currentUrlPath: any;

  ab = "tt";
  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public http: HttpService) {
    // 
    this.loadMenu();
    this.ev = this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((data: any) => {
        //this.setIsActive(data);
        this.currentUrl = data.url.substr(1);
        this.loadPagePath();
      });
    
    this.loadPagePath();
  }

  loadPagePath() {
    if (this.router.url.split("/").length > 1) {
      this.currentPath = this.router.url.split("/")[this.router.url.split("/").length - 2];
    }
    this.currentUrl = this.router.url.split("/")[this.router.url.split("/").length - 1];

    if (this.currentPath) {
      this.currentUrlPath = this.currentPath + "/" + this.currentUrl;
    } else {
      this.currentUrlPath = this.currentUrl;
    }
  }

  loadMenu() {

    this.http.post("Menu/LeftMenu", {
    }, (result: ResultModel) => {
      if (result.Code == ResultCode.Success) {
        this.menus = result.Result;
      }
    }, () => {
    });
  }

  ngOnInit() {

  }

  ev: any;
  ngOnDestroy() {
    if (this.ev) {
      this.ev.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.mainSidebarHeight.emit(this.mainSidebar.nativeElement.offsetHeight);
  }

  toggleMenu(event: any) {

    event.preventDefault();
    event.stopPropagation();
    // var element = event.target.localName === 'p' ? event.target.parentElement.parentElement : event.target.parentElement;
    // if (element.classList.contains('has-treeview')) {
    //   if (element.classList.contains('menu-open')) {
    //     this.hideMenu(element);
    //   } else {
    //     this.showMenu(element);
    //   }
    // }
    var target: any;

    try {
      if (event.target.nodeName.toLowerCase() == "p" || event.target.nodeName.toLowerCase() == "i") {
        target = event.target.parentNode.parentNode;
      } else if (event.target.nodeName.toLowerCase() == "a") {
        target = event.target.parentNode;
      }
      if (target.classList.contains("menu-open") && target.nodeName.toLowerCase() == "li") {
        target.classList.remove("menu-open");
        target.classList.remove("menu-is-opening");
      } else {
        target.classList.add("menu-open");
        target.classList.add("menu-is-opening");
      }
    } catch (error) {

    }
    // event.classList.toggle("menu-is-opening menu-open");
  }

  showMenu(element: any) {
    this.renderer.addClass(element, 'menu-open');
  }

  hideMenu(element: any) {
    this.renderer.removeClass(element, 'menu-open');
  }
}
