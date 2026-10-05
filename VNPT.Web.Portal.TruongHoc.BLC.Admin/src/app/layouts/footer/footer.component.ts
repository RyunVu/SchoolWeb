import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public appVersion = '0.0.0';
  public licenses: any[] = [];
  constructor() { }

  ngOnInit() {
    //const packageJson = require('../../../../package.json');

    // this.appVersion = packageJson.version;
    //this.licenses = packageJson.license;
  }
}
