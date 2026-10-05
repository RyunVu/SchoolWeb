import {
    Component,
    OnInit,
    ViewChild,
    HostListener,
    ElementRef,
    Renderer2,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthService, BaseService, HttpService } from 'src/app/services';
import { ChangeUserInfoModal } from '../change-user-info/change-user-info.modal';

@Component({
    selector: 'app-user-dropdown-menu',
    templateUrl: './user-dropdown-menu.component.html',
    styleUrls: ['./user-dropdown-menu.component.scss'],
})
export class UserDropdownMenuComponent implements OnInit {
    public user: any;

    @ViewChild('dropdownMenu', { static: false }) dropdownMenu: any;
    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.hideDropdownMenu();
        }
    }

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private authService: AuthService,
        public dialogService: DialogService,
        public httpService: HttpService
    ) { }

    ngOnInit(): void {
        this.user = this.authService.user;
    }

    toggleDropdownMenu() {
        if (this.dropdownMenu.nativeElement.classList.contains('show')) {
            this.hideDropdownMenu();
        } else {
            this.showDropdownMenu();
        }
    }

    showDropdownMenu() {
        this.renderer.addClass(this.dropdownMenu.nativeElement, 'show');
    }

    hideDropdownMenu() {
        this.renderer.removeClass(this.dropdownMenu.nativeElement, 'show');
    }

    logout() {
        //this.appService.logout();
        BaseService.removeLogin();
        this.authService.logoutUser();
    }
    changePassword() {
        const ref = this.dialogService.open(ChangeUserInfoModal, {
            data: {
            },
            header: 'Thay đổi mật khẩu',
            width: '70%',
            style: 'max-width:500px'
        }).onClose.subscribe((data: any) => {
            if (data) {
            }
        });
    }
}
