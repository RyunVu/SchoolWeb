import { Component, OnInit } from '@angular/core';
import { AppService, ApiVersionInfo } from 'src/app/services';

@Component({
  standalone: false,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public appVersion = this.appService.appVersion;
  public apiVersion: ApiVersionInfo | null = null;
  public licenses: any[] = [];

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.apiVersion$.subscribe(v => {
      this.apiVersion = v;
    });
    this.appService.loadApiVersion();
  }
}
