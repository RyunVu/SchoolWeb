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
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ResultCode, ResultModel } from 'src/app/models';
import { BaseService, HttpService } from 'src/app/services';
import { Subscription } from 'rxjs';
import { MenuSidebarService } from './menu-sidebar.service';

@Component({
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

    isSuperAdminSystem: boolean = false;
    isUserDuyetTin: boolean = false;

    ab = "tt";

    private subscription: Subscription = new Subscription;

    constructor(
        private router: Router,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        public http: HttpService,
        private baseService: BaseService,
        private menuSidebarService: MenuSidebarService,
    ) {

        var mulRole = this.baseService.MulRole;
        if (mulRole != "" && mulRole != null && (mulRole.includes("SuperAdminSystem"))) {
            this.isSuperAdminSystem = true;
        }

        if (mulRole != "" && mulRole != null && (mulRole.includes("DuyetTin")) ||
            (mulRole != "" && mulRole != null && (mulRole.includes("DUYETTINXA"))) ||
            (mulRole != "" && mulRole != null && (mulRole.includes("DUYETTINXUANHUONG"))) ||
            (mulRole != "" && mulRole != null && (mulRole.includes("DUYETTINKHAC")))) {
            this.isUserDuyetTin = true;
        }
        // 
        this.loadMenu();
        this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((data: any) => {
                //this.setIsActive(data);
                this.currentUrl = data.url.substr(1);
                //console.log(this.currentUrl);
            });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    loadMenu() {

        this.http.post("Menu/LeftMenu", {
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.menus = result.Result;

                this.menus.forEach((element: any) => {
                    if (element.Children.length > 0) {
                        element.CountNewsApprove = element.Children.reduce((sum: any, child: { CountNewsApprove: any; }) => sum + child.CountNewsApprove, 0);
                    }
                });
            }
        }, () => {
        });
    }

    ngOnInit() {
        this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((data: any) => {
                //this.setIsActive(data);
                this.currentUrl = data.url.substr(1);
            });

        this.currentUrl = window.location.hash.replace('/#', '');

        this.subscription = this.menuSidebarService.menu.subscribe(() => {
            this.loadMenu();
        });
    }

    ngAfterViewInit() {
        this.mainSidebarHeight.emit(this.mainSidebar.nativeElement.offsetHeight);
    }

    toggleMenu(event: any) {
        // console.log(event);

        event.preventDefault();
        event.stopPropagation();
        var target: any;

        if (event.target.nodeName.toLowerCase() == "p" || event.target.nodeName.toLowerCase() == "i") {
            target = event.target.parentNode.parentNode;
        } else if (event.target.nodeName.toLowerCase() == "a") {
            target = event.target.parentNode;
        }
        if (target != undefined) {
            if (target.classList.contains("menu-open") && target.nodeName.toLowerCase() == "li") {
                target.classList.remove("menu-open");
                target.classList.remove("menu-is-opening");
            } else {
                target.classList.add("menu-open");
                target.classList.add("menu-is-opening");
            }
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
