import { Component } from '@angular/core';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BaseService } from './services';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    Role: string = '';
    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private router: Router
    ) {
        // listen to page variable from router events
        // get current Ip public
        this.getIp();
        this.deviceId();
        this.cookieService.set('StimulsoftWebViewerExportSettingsExcel', JSON.stringify({ "PageRange": "All", "ExcelType": "Excel2007", "ImageResolution": "100", "ImageQuality": "0.75", "ExportDataOnly": false, "ExportObjectFormatting": false, "UseOnePageHeaderAndFooter": true, "ExportEachPageToSheet": false, "ExportPageBreaks": false }));
        this.router.events.subscribe((event) => {
            if (event instanceof RoutesRecognized) {
                let route = event.state.root.firstChild;
                if (route != null) this.Role = route.data.role;
            }
            if (event instanceof NavigationEnd) {
                var lasturl = localStorage.getItem("lasturl");
                if(lasturl && (lasturl == '/' || lasturl.indexOf('/public') >= 0) && (event.url.indexOf('/public') < 0 && event.url != '/')) {
                    window.location.reload();
                }
                localStorage.setItem("lasturl", event.url);
            }
        });
    }
    getIp() {
        this.http
            .get<any>('https://api.ipify.org/?format=json&callback=getIP')
            .toPromise()
            .then((data) => {
                this.cookieService.set('publicIp', data.ip);
            }).catch((errorw: any) => {
                this.http
                    .get<any>(environment.apiUrl + "api/Client/GetIpAddress")
                    .toPromise()
                    .then((data) => {
                        this.cookieService.set('publicIp', data);
                    }).catch((errorw: any) => {
                    });
            });

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
}
