import { Component, OnInit } from '@angular/core';
import { version, licenses } from './../../../../package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public appVersion = version;
  public licenses = licenses;
  constructor() {}

  ngOnInit() {
  }
}
