import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  standalone: false,
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss'],
})
export class DefaultPageComponent implements OnInit {
  constructor(
    private router: Router,
    private cookieService: CookieService) {}

  ngOnInit() {
    var defaultMenu = this.cookieService.get('defaultMenu');
    if(defaultMenu){
        //this.router.navigate(['/' + defaultMenu]);
    }else{
        //this.router.navigate(['/pageNotFound' ]);
    }
  }
}
