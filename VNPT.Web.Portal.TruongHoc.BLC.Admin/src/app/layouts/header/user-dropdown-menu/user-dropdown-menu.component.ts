import {
    Component,
    OnInit,
    ViewChild,
    HostListener,
    ElementRef,
    Renderer2,
} from "@angular/core";
import { AuthService, BaseService, HttpService } from "src/app/services";
import { DialogService } from "primeng/dynamicdialog";
import { HistoryLoginModal } from "src/app/pages/systems/user/historylogin.modal";
import { ChangePasswordModal } from "../change-password/change-password.modal";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
@Component({
    standalone: false,
    selector: "app-user-dropdown-menu",
    templateUrl: "./user-dropdown-menu.component.html",
    styleUrls: ["./user-dropdown-menu.component.scss"],
})
export class UserDropdownMenuComponent implements OnInit {
    public user: any;

    displayModal = false;
    displayF2aModal = false;
    imageUrl: string = "";
    keyQr: string = "";
    loading = false;
    updateForm: FormGroup = this.formBuilder.group({
        OldPassword: ['', Validators.required],
        NewPassword: ['', Validators.required],
        ConfirmPassword: ['', Validators.required]
    });

    f2aForm: FormGroup = this.formBuilder.group({
        Password: ['', Validators.required],
    });

    @ViewChild("dropdownMenu", { static: false }) dropdownMenu: any;
    @HostListener("document:click", ["$event"])
    clickout(event: any) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.hideDropdownMenu();
        }
    }

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private authService: AuthService,
        private httpService: HttpService,
        public dialogService: DialogService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        this.user = this.authService.user;
    }

    toggleDropdownMenu() {
        if (this.dropdownMenu.nativeElement.classList.contains("show")) {
            this.hideDropdownMenu();
        } else {
            this.showDropdownMenu();
        }
    }

    showDropdownMenu() {
        this.renderer.addClass(this.dropdownMenu.nativeElement, "show");
    }

    hideDropdownMenu() {
        this.renderer.removeClass(this.dropdownMenu.nativeElement, "show");
    }

    logout() {
        BaseService.removeLogin();
        this.authService.logoutUser();
    }
    historyLogin() {
        const ref = this.dialogService
            .open(HistoryLoginModal, {
                header: "Lịch sử đăng nhập",
                width: "70%",
                baseZIndex: -700,
            })!
            .onClose.subscribe((data: any) => { });
    }

    // changePassword() {
    //     const ref = this.dialogService.open(ChangePasswordModal, {
    //         data: {

    //         },
    //         header: 'Thay đổi mật khẩu',
    //         width: '60%'
    //     })!.onClose.subscribe((data: any) => {
    //         if (data) {

    //         }
    //     });
    // }
    changePass() {
        this.displayModal = true;
    }
    saveChangePass() {
        if (!this.updateForm.invalid) {
            this.loading = true;
            this.httpService.post("LoginV2/ChangePassword", this.updateForm.value,
                (data: any) => {
                    if (data.Code == 200) {
                        this.toastr.success("Lưu thành công", "Thông báo");
                        this.displayModal = false;
                    } else {
                        this.toastr.error(data.Message, "Thông báo");
                    }
                    this.loading = false;
                },
                (error: any) => {
                    this.toastr.error("Mật khẩu cũ không đúng hoặc Mật khẩu mới không khớp. ", "Lỗi");
                    this.loading = false;
                })
        }
    }
    xm2Lop() {
        this.displayF2aModal = true;
        this.imageUrl = "";
        this.keyQr = "";
    }
    getImageF2a() {
        if (!this.f2aForm.invalid) {
            this.loading = true;
            this.imageUrl = "";
            this.keyQr = "";
            this.httpService.post("LoginV2/GetQrAuthorization", this.f2aForm.value,
                (data: any) => {
                    if (data.Code == 200) {
                        this.imageUrl = data.Result;
                        this.keyQr = data.Message;
                    } else {
                        this.toastr.error(data.Message, "Thông báo");
                    }
                    this.loading = false;
                },
                (error: any) => {
                    this.toastr.error("Mật khẩu không đúng", "Lỗi");
                    this.loading = false;
                })
        }
    }
}
