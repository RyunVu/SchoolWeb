import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ResultCode, ResultModel } from 'src/app/models';
import { AuthService, BaseService, HttpService } from 'src/app/services';

@Component({
    standalone: false,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

    loginForm: FormGroup = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        Otp: [''],
    });
    returnUrl: string = "";
    code: string = "";
    message: string = "";
    accessToken: string = "";
    isAuthLoading = false;
    checkOtp: boolean = false;
    constructor(
        private renderer: Renderer2,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService,
        private http: HttpClient,
        private baseService: BaseService,
        private cookieService: CookieService,
        private router: Router,
        private messageService: MessageService,
        public httpService: HttpService
    ) { }

    ngOnInit() {
        this.renderer.addClass(document.querySelector('app-root'), 'login-page');
        this.authService.logoutUser();
        this.returnUrl = this.route.snapshot.queryParams['retUrl'] || '/';
        this.code = this.route.snapshot.queryParams['code'];
        this.message = this.route.snapshot.queryParams['message'];
        this.accessToken = this.route.snapshot.queryParams['access_token'];
        if (this.code == "1" && this.accessToken != "") {
            this.login(this.accessToken);
        }
        this.deviceId();
    }
    deviceId(): string {
        var id = localStorage.getItem('ClientId');
        if (id == null || !id || id == undefined || id == "undefined") {
            var browers = this.fnBrowserDetect();
            id = "Web;" + browers + ";" + this.generateUUID();
            localStorage.setItem('ClientId', id);
        }
        return id;
    }
    fnBrowserDetect(): string {

        let userAgent = navigator.userAgent;
        let browserName;

        if (userAgent.match(/chrome|chromium|crios/i)) {
            browserName = "Chrome";
        } else if (userAgent.match(/firefox|fxios/i)) {
            browserName = "Firefox";
        } else if (userAgent.match(/safari/i)) {
            browserName = "Safari";
        } else if (userAgent.match(/opr\//i)) {
            browserName = "Opera";
        } else if (userAgent.match(/edg/i)) {
            browserName = "Edge";
        } else {
            browserName = "Unknown";
        }
        return browserName;
    }
    generateUUID() {
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    get f() { return this.loginForm.controls; }


    loginOtp() {

    }
    login(access = "") {
        this.isAuthLoading = true;
        // this.httpService.post("login/CheckLogin", this.loginForm.value, (result: ResultModel) => {
        //     if (result.Code == ResultCode.Success) {
        //         this.checkOtp = true;
        //     } else {
        //         this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: result.Message });;//this.toastr.warning(result.Message);
        //     }
        //     this.isAuthLoading = false;
        // }, () => {
        //     this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: "Lỗi kết nối!" });//this.toastr.error("Lỗi kết nối!");
        //     this.isAuthLoading = false;
        // });
        // 

        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                DeviceId: localStorage.getItem('ClientId') || "",
                CurrentPublicIp: this.cookieService.get('publicIp')
            })
        };
        let body = new URLSearchParams();
        body.set('grant_type', 'password')
        if (access == "") {
            if (this.loginForm.invalid) {
                return;
            }
            body.set('username', this.f.username.value);
            body.set('password', this.f.password.value);
        } else {
            body.set('access_token', access);
        }


        this.http.post<UserToken>(
            this.baseService.apiUrl + 'token',
            body.toString(),
            httpOptions)
            .subscribe({
                next: data => {
                    this.authService.loginUser(data);
                    BaseService.setLogin(data);
                    // if (this.returnUrl.includes("login") || this.returnUrl == "/") {
                    //     this.returnUrl = '/' + data.DefaultMenu;
                    // }
                    // if (this.returnUrl)
                    //     this.router.navigate(['/' + this.returnUrl]);
                    this.returnUrl = 'home';
                    this.router.navigate(['/' + this.returnUrl]);
                    this.isAuthLoading = false;
                },
                error: error => {
                    this.isAuthLoading = false;
                    if (error.status == 400)
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sai thông tin đăng nhập' });
                    else
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error_description });
                }
            });

    }

    ngOnDestroy() {
        this.renderer.removeClass(document.querySelector('app-root'), 'login-page');
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
