import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { MessageService } from "primeng/api";
import { Subject } from "rxjs";
import { BaseService } from "./base.service";

@Injectable()
export class HttpService {
    get httpOptions(): any {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'CurrentPublicIp': this.cookieService.get('publicIp'),
                'DeviceId': this.deviceId,
                Authorization: this.cookieService.get('token_type') + ' ' + this.cookieService.get('access_token'),
                UnitCode: "LDG"
            })
        };
    }
    get httpOptionUpload(): any {
        return {
            headers: new HttpHeaders({
                'CurrentPublicIp': this.cookieService.get('publicIp'),
                'DeviceId': this.deviceId,
                Authorization: this.cookieService.get('token_type') + ' ' + this.cookieService.get('access_token'),
                UnitCode: "LDG"
            })
        };
    }

    get deviceId(): string {
        var id = this.cookieService.get('ClientId');
        if (id == null || !id || id == undefined || id == "undefined") {
            var browers = this.fnBrowserDetect();
            id = "Web;" + browers + ";" + this.generateUUID();
            this.cookieService.set('ClientId', id);
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
    constructor(
        private http: HttpClient,
        private baseService: BaseService,
        private cookieService: CookieService,
        private router: Router,
        private message: MessageService
    ) { }
    errorHanlder(error: any, errorFunction: Function) {
        if (error != null && error.error != null &&(error.error.Code == 401 || error.error.Code == 402)) {
            this.message.add({ severity: 'error', summary: 'Thông báo', detail: error.error.Message });//"Bạn không có quyền truy cập vào hành động này!" });
            this.router.navigate(["/login"], { queryParams: { retUrl: this.router.url } });
            //errorFunction(error);
        }
        else {
            errorFunction(error);
        }
    }
    get(url: string, successFunction: Function, errorFunction: Function) {
        return this.http.get(this.baseService.apiUrl + 'api/' + url, this.httpOptions)
            .subscribe({
                next: data => {
                    successFunction(data)
                },
                error: (error) => {
                    this.errorHanlder(error, errorFunction);
                }
            })
    }

    post(url: string, data: any, successFunction: Function, errorFunction: Function) {
        return this.http.post(this.baseService.apiUrl + 'api/' + url, data, this.httpOptions)
            .subscribe({
                next: data => {
                    successFunction(data)
                },
                error: (error) => {
                    this.errorHanlder(error, errorFunction);
                }
            })
    }
    postPromise(
        url: string,
        data: any,
        successFunction: Function,
        errorFunction: Function
      ) {
        return this.http
          .post(this.baseService.apiUrl + "api/" + url, data, this.httpOptions)
          .toPromise()
          .then(
            (data) => {
              successFunction(data);
            },
            (error) => {
              if (error.status == 401) {
                errorFunction(error);
              } else errorFunction(error);
            }
          );
      }
    post2(url: string, data: any, successFunction: Function, errorFunction: Function) {
        return this.http.post(this.baseService.apiIocUrl + 'api/' + url, data, this.httpOptions)
            .subscribe({
                next: data => {
                    successFunction(data)
                },
                error: (error) => {
                    this.errorHanlder(error, errorFunction);
                }
            })
    }

    upload(url: string, data: any, successFunction: Function, errorFunction: Function) {
        return this.http.post(this.baseService.apiUrl + 'api/' + url, data, this.httpOptionUpload)
            .subscribe({
                next: data => {
                    successFunction(data)
                },
                error: (error) => {
                    this.errorHanlder(error, errorFunction);
                }
            })
    }

    uploadFile(fileName: string, file: File, successFunc: Function, errorFunc: Function) {
        //Upload file here send a Form data
        const uploadFormData = new FormData();
        uploadFormData.append('file', file, fileName);
        // this.http.post('assets/uploads', uploadFormData, {
        //     reportProgress: true
        // })
        // .subscribe(
        //     (data) => successFunc(data),
        //     (error) => errorFunc(error)
        // );

        const req = new HttpRequest('POST', 'assets/uploads', uploadFormData, {
            reportProgress: true
        });
        const progress = new Subject<number>();
        // this.http.request(req).subscribe(event => {
        //     if (event.type === HttpEventType.UploadProgress) {
        //         const percentDone = Math.round(100 * event.loaded / event.total);
        //         progress.next(percentDone);
        //     } else if (event instanceof HttpResponse) {
        //         progress.complete();
        //         successFunc(event)
        //     }
        // },
        //     (error) => errorFunc(error));

    }
}