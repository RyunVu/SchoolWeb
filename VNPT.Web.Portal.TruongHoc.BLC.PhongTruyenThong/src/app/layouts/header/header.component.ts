import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>();
  public searchForm: FormGroup = new FormGroup({
    search: new FormControl(null),
  });

  constructor(
    private authService: AuthService
    ) { }

  ngOnInit() {
  }

  // logout() {
  //   //this.appService.logout();
  //   this.authService.logoutUser();
  // }
}
