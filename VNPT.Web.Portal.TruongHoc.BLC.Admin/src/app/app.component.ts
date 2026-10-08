import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from "ngx-cookie-service";

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  IsAdmin: boolean = false;
  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router
  ) {
    // listen to page variable from router events
    // get current Ip public
    this.getIp();
    this.router.events.subscribe(event => {
      if (event instanceof RoutesRecognized) {
        let route = event.state.root.firstChild;
        if (route != null)
          this.IsAdmin = route.data.role == "AdminPage";
      }
    });
  }
  getIp() {
    this.http.get<any>("https://api.ipify.org/?format=json&callback=getIP").toPromise().then(data => {
      this.cookieService.set('publicIp', data.ip);
    });;
  }
}
