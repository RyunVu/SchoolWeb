import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { BaseService } from './base.service';

@Injectable()
export class HttpService {
  get httpOptions(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        CurrentPublicIp: this.cookieService.get('publicIp'),
        DeviceId: localStorage.getItem('ClientId') || "",
        Authorization:
          this.cookieService.get('token_type') +
          ' ' +
          this.cookieService.get('access_token'),
      }),
    };
  }

  get httpOptionUpload(): any {
    return {
      headers: new HttpHeaders({
        CurrentPublicIp: this.cookieService.get('publicIp'),
        DeviceId: localStorage.getItem('ClientId') || "",
        Authorization:
          this.cookieService.get('token_type') +
          ' ' +
          this.cookieService.get('access_token'),
      }),
    };
  }
  constructor(
    private http: HttpClient,
    private baseService: BaseService,
    private cookieService: CookieService,
    private router: Router,
    private message: MessageService
  ) { }

  get(url: string, successFunction: any, errorFunction: any): any {
    return this.http
      .get(this.baseService.apiUrl + 'api/' + url, this.httpOptions)
      .subscribe({
        next: (data) => {
          successFunction(data);
        },
        error: (error) => {
          if (error.status === 401) {
            this.message.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: 'Bạn không có quyền truy cập vào hành động này!\n' + url,
            });
            // this.router.navigate(["/"], { queryParams: { retUrl: this.router.url } });
            errorFunction(error);
          } else {
            errorFunction(error);
          }
        },
      });
  }
  uploadPromise(
    url: string,
    data: any,
    successFunction: Function,
    errorFunction: Function
  ) {
    return this.http
      .post(this.baseService.apiUrl + 'api/' + url, data, this.httpOptionUpload)
      .toPromise()
      .then(
        (data) => {
          successFunction(data);
        },
        (error) => {
          if (error.status == 401) {
            this.message.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: 'Bạn không có quyền truy cập vào hành động này!\n' + url,
            });
            errorFunction(error);
          } else errorFunction(error);
        }
      );
  }
  postFile(
    url: string,
    data: any,
    successFunction: Function,
    errorFunction: Function
  ) {
    return this.http
      .post(this.baseService.apiUrl + 'api/' + url, data, this.httpOptions)
      .toPromise()
      .then(
        (data) => {
          successFunction(data);
        },
        (error) => {
          if (error.status == 401) {
            this.message.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: 'Bạn không có quyền truy cập vào hành động này!\n' + url,
            });
            errorFunction(error);
          } else errorFunction(error);
        }
      );
  }
  post(url: string, data: any, successFunction: any, errorFunction: any): any {
    return this.http
      .post(this.baseService.apiUrl + 'api/' + url, data, this.httpOptions)
      .subscribe({
        next: (res: any) => {
          successFunction(res);
        },
        error: (error) => {
          if (error.status === 401) {
            this.message.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: 'Bạn không có quyền truy cập vào hành động này!\n' + url,
            });
            //     this.router.navigate(["/"], { queryParams: { retUrl: this.router.url } });
            errorFunction(error);
          } else {
            errorFunction(error);
          }
        },
      });
  }

  upload(
    url: string,
    data: any,
    successFunction: any,
    errorFunction: any
  ): any {
    return this.http
      .post(this.baseService.apiUrl + 'api/' + url, data, this.httpOptionUpload)
      .subscribe({
        next: (res: any) => {
          successFunction(res);
        },
        error: (error) => {
          if (error.status === 401) {
            this.message.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: 'Bạn không có quyền truy cập vào hành động này!\n' + url,
            });
            //     this.router.navigate(["/"], { queryParams: { retUrl: this.router.url } });
            errorFunction(error);
          } else {
            errorFunction(error);
          }
        },
      });
  }

  uploadFile(
    fileName: string,
    file: File,
    successFunc: any,
    errorFunc: any
  ): any {
    // Upload file here send a Form data
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
      reportProgress: true,
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

  downloadFile(url: string, data: any, filename: string = 'Export.xls'): any {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.baseService.apiUrl + 'api/' + url, data, {
          ...this.httpOptions,
          ...{ responseType: 'blob' as any },
        })
        .subscribe(
          (res: any) => {
            const downloadURL = URL.createObjectURL(res);
            const fileLink = document.createElement('a');

            fileLink.href = downloadURL;
            fileLink.download = filename;
            fileLink.click();

            return resolve(res);
          },
          (error) => {
            return reject(error);
          }
        );
    });
  }

  saveFileAs(response: any) {
    let dataType = response.type;
    let binaryData = [];
    binaryData.push(response);
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(
      new Blob(binaryData, { type: dataType })
    );
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
