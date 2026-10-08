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
import { BaseService, HttpService } from 'src/app/services';
import { CustomValidators } from 'src/app/modules';
import { ResultCode, ResultModel } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Component({
    standalone: false,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'login-portal-host login-box';
    public loginForm: FormGroup;
    public otpForm: FormGroup;
    public isAuthLoading = false;
    public isLoginOtp = false;
    public enablePhone = true;
    public returnUrl: any = '';
    public phoneError = "";
    showPassword: boolean = false;

    backToLogin(): void {
        this.isLoginOtp = false;
        this.phoneError = '';
        this.otpForm.reset();
    }
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
            username: new FormControl(
                '', [CustomValidators.required(), CustomValidators.minLength(8)]
            ),
            password: new FormControl(
                '', [CustomValidators.required(), CustomValidators.minLength(8)]
            ),
        });
        this.otpForm = new FormGroup({
            otp: new FormControl(
                '', [CustomValidators.required(), CustomValidators.isNumber(), CustomValidators.minLength(6), CustomValidators.maxLength(6)]
            ),
        });
        this.returnUrl = this.route.snapshot.queryParams['retUrl'] || '/';
    }

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
                "LoginV2/CheckLoginByUsername",
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
                        this.phoneError = "";
                        if (result.Code == ResultCode.Success) {
                            await this.postLoginAsync();
                        } else {
                            this.phoneError = result.Message;
                        }
                        this.isAuthLoading = false;

                    }
                },
                (error: any) => {
                    this.isAuthLoading = false;
                    this.phoneError = (error && error.error && (error.error.Message || error.error.message || error.error.error_description))
                        ? (error.error.Message || error.error.message || error.error.error_description)
                        : "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.";
                }
            );
        } catch (error: any) {
            this.isAuthLoading = false;
            this.phoneError = error?.message || "Đã xảy ra lỗi trong quá trình xử lý.";
            this.toastr.error(error?.message || "Đã xảy ra lỗi");
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
        try {
            
            this.isAuthLoading = true;
            //await this.delayFunc();
            let httpOptions = {
                headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', DeviceId: this.httpService.deviceId }),

            };
            let body = new URLSearchParams();
            body.set('grant_type', 'password')
            body.set('username', this.loginForm.value.username);
            body.set('password', this.loginForm.value.password);
            body.set('otp', this.otpForm.value.otp);
            var url = environment.apiUrl + 'token';
            const data: any = await (new Promise((resolve, reject) => {
                this.http.post<UserToken>(
                    url,
                    body.toString(),
                    httpOptions)
                    .subscribe({
                        next: data => {
                            BaseService.setLogin(data);
                            return resolve(data);
                        },
                        error: error => {
                            return reject(error);
                        }
                    });

                return;
            }));
            this.setLogin(data);
            if (this.returnUrl.includes("login") || this.returnUrl == "/") {
                this.returnUrl = '/' + data.DefaultMenu;
            }
            this.router.navigate([this.returnUrl]);
        } catch (error: any) {
            try {
                //var error = JSON.parse(error["_body"]);
                error = error.error;
                console.log(error)
                if (error.error == "OtpError") {
                    var errorResult = JSON.parse(error.error_description);
                    console.log(errorResult);
                    this.phoneError = errorResult.Message;
                    if (errorResult.Result.WrongTimeCount > 0 && errorResult.Result.WrongTime >= 3) {
                        var timeSet = parseInt(errorResult.Result.WrongTimeCount);
                        this.showLoginError(timeSet);
                    } else if (errorResult.Result.WrongTimeCount < 0 && errorResult.Result.WrongTime >= 3) {
                        this.isLoginOtp = false;
                        this.phoneError = "Vui lòng nhập lại số điện thoại";
                        this.enablePhone = true;
                        this.isAuthLoading = false;
                    } else if (errorResult.Result.WrongTime < 3) {
                        this.phoneError += " Bạn còn " + (3 - errorResult.Result.WrongTime) + " lần nhập!";
                        this.isAuthLoading = false;
                    }
                } else {
                    this.phoneError = error.error_description;
                    
                    this.isAuthLoading = false;
                }
            } catch (error) {
                this.phoneError = "Không thể kết nối đến máy chủ.";
                this.isAuthLoading = false;
            }
        }

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
        this.cookieService.set('defaultMenu', data.DefaultMenu, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('MulRole', data.MulRole, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('MulRoleLevel', data.MulRoleLevel, { expires: dateExpires, sameSite: 'Lax' });
        this.cookieService.set('TemplateUnitId', data.TemplateUnitId, { expires: dateExpires, sameSite: 'Lax' });

        // var valueData = JSON.parse(data.user);
        // this.cookieService.set('OrganizationId', valueData.OrganizationId, { expires: dateExpires, sameSite: 'Lax' });
        // this.cookieService.set('LocationNationalId', valueData.LocationNationalId, { expires: dateExpires, sameSite: 'Lax' });
        // this.cookieService.set('LocationProvinceId', valueData.LocationProvinceId, { expires: dateExpires, sameSite: 'Lax' });
        // this.cookieService.set('LocationDistrictId', valueData.LocationDistrictId, { expires: dateExpires, sameSite: 'Lax' });
        // this.cookieService.set('LocationWardId', valueData.LocationWardId, { expires: dateExpires, sameSite: 'Lax' });
        // this.cookieService.set('LocationStreetId', valueData.LocationStreetId, { expires: dateExpires, sameSite: 'Lax' });
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
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