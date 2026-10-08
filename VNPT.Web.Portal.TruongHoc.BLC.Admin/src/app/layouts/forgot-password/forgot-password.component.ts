import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding,
    ViewEncapsulation,
} from '@angular/core';
import {
    Validators,
    FormGroup,
    FormControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from 'src/app/services';
import { CustomValidators } from 'src/app/modules';
import { ResultCode, ResultModel } from 'src/app/models';

@Component({
    standalone: false,
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'login-box';
    public loginForm: FormGroup;
    public otpForm: FormGroup;
    public isAuthLoading = false;
    public isLoginOtp = false;
    public enablePhone = true;
    public returnUrl: any = '';
    public phoneError = "";
    constructor(
        private router: Router,
        private renderer: Renderer2,
        private toastr: ToastrService,
        public dialogService: DialogService,
        private cookieService: CookieService,
        private route: ActivatedRoute,
        private http: HttpClient,
        private httpService: HttpService
    ) {
        this.loginForm = new FormGroup({
            Email: new FormControl(
                '', [CustomValidators.required(), CustomValidators.email()]
            ),

        });
        this.otpForm = new FormGroup({
            otp: new FormControl(
                '', [CustomValidators.required(), CustomValidators.isNumber(), CustomValidators.minLength(6), CustomValidators.maxLength(6)]
            ),
        });
        this.returnUrl = this.route.snapshot.queryParams['retUrl'] || '/'; }

    ngOnInit() {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page',
        );
    }

    async login() {
        this.phoneError = "";
        if (this.isLoginOtp) {
            if (this.otpForm.invalid) {
                this.otpForm.markAllAsTouched();
                return;
            }
            await this.postLoginAsync();
        } else {
            if (this.loginForm.invalid) {
                this.loginForm.markAllAsTouched();
                return;
            }
            this.loginByAuth();
        }
    }
    async loginByAuth() {
        try {
            this.isAuthLoading = true;
            this.httpService.post(
                "LoginV2/CheckUserByEmail",
                this.loginForm.value,
                async (result: ResultModel) => {
                    if (result.Result == true) {
                        //      this.loginForm.controls['otp'].setValidators([CustomValidators.required(), CustomValidators.minLength(6)]);
                        //      this.loginForm.controls['otp'].updateValueAndValidity();
                        if (result.Code == ResultCode.Success) {
                            this.isLoginOtp = true;
                            this.isAuthLoading = false;
                        } else {
                            if (result.Code == 3010) {
                                this.showLoginError(result.Message);
                            } else {
                                this.enablePhone = true;
                                this.phoneError = result.Message;
                                this.isAuthLoading = false;

                            }
                        }
                    } else {
                        this.phoneError = result.Message;
                        this.isAuthLoading = false;
                    }
                },
                () => {
                    this.isAuthLoading = false;
                }
            );
        } catch (error:any) {
            this.toastr.error(error.message);
        }
    }
    showLoginError(time: any) {
        var that = this;
        var timeSet = parseInt(time);
        var timeCount = setInterval(function () {
            console.log(timeSet);
            timeSet--;
            that.enablePhone = false;
            var dive = (timeSet / 60) + "";
            var minute = parseInt(dive);
            var secound = timeSet % 60;
            var text = "";
            if (minute) {
                text = minute + " phút";
            }

            if (secound) {
                text += " " + secound + " giây.";
            }
            text = text.trim();
            that.phoneError = 'Vui lòng thử lại sau ' + text;
            if (timeSet <= 0) {
                clearInterval(timeCount);
                that.isLoginOtp = false;
                that.phoneError = "";
                that.enablePhone = true;
                that.isAuthLoading = false;

                //   this.loginForm.controls['otp'].setValidators([CustomValidators.minLength(6), CustomValidators.maxLength(6)]);
                // this.loginForm.controls['otp'].updateValueAndValidity();
            }
        }, 1000);
    }
    private async postLoginAsync() {
        this.isAuthLoading = true;
        this.httpService.post(
            "LoginV2/CheckOtpByEmail",
            {
                Otp: this.otpForm.value.otp,
                Email: this.loginForm.value.Email
            },
            async (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.toastr.success("Vui lòng kiểm tra email.");
                    this.router.navigate(['/login']);
                } else {
                    if (result.Code == 3010) {
                        this.showLoginError(result.Message);
                    } else {
                        this.enablePhone = true;
                        this.phoneError = result.Message;
                        this.isAuthLoading = false;

                    }
                }
            },
            () => {
                this.isAuthLoading = false;
            }
        );

    }
    ngOnDestroy() {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page',
        );
    }
    async setLogin(data: any) {
        var dateExpires = new Date(data['.expires']);
        this.cookieService.set('access_token', data.access_token, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('token_type', data.token_type, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('userName', data.userName, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('user', data.user, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('OrganizationName', data.OrganizationName, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('PositionName', data.PositionName, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('userId', data.userId, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('DefaultMenu', data.DefaultMenu, { expires: dateExpires, sameSite: 'Lax' });
    }
}
interface UserToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    userName: string;
    DefaultMenu: string;
    user: any;
    //'.issued': Date;
    '.expires': Date;
}