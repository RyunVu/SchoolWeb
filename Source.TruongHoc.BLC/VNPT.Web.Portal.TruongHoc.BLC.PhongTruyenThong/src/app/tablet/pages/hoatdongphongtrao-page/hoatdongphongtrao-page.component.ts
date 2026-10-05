import { Component, OnDestroy, OnInit, Pipe, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AgmGeocoder } from '@agm/core';
import { Location } from '@angular/common';
import { BaseService, HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';

import {
  gmDefaultStyles,
  gmDarkStyles,
  populateBusinessFullAddress,
  SearchEntity,
} from 'src/app/shared';
import { defaultLocation } from 'src/app/shared/constants';

import { HomePageService } from '../../services';
import { DialogService } from 'primeng/dynamicdialog';

declare var $: any;
import { DomSanitizer } from "@angular/platform-browser";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-hoatdongphongtrao-page',
  templateUrl: './hoatdongphongtrao-page.component.html',
  styleUrls: ['./hoatdongphongtrao-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class HoatDongPhongTraoPageComponent implements OnInit, OnDestroy {

  subtitle = "Hoạt động phong trào";
  code = "DMHoatDongPhongTrao";
  type: any = null;
  activeTab: any;
  lstHoatDongPT: any[] = [];

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    private agmGeocoder: AgmGeocoder,
    public dialogService: DialogService,
    public sanitizer: DomSanitizer,
    public http: HttpService,
    private baseService: BaseService,
    private router: Router,
    private location: Location,
    public spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.spinner.show();

    var tab = localStorage.getItem("lanhDaoTab");
    this.activeTab = tab ? parseInt(tab) : 1;
    localStorage.setItem('lanhDaoTab', this.activeTab);

    $('#menu-mobile').css({ 'width': '0px' });
    $('#main').css({ 'margin-left': '0px' });
    $('#menu-filter').css({ 'width': '0px' });
    $('#menu-mobile').removeClass("show");

    if (HomePageService.isPlay) {
      HomePageService.resumeAudio1();
      HomePageService.stopAudio2();
    } else {
      HomePageService.stopAudio1();
      HomePageService.stopAudio2();
    }
    
    this.loadHoatDongPhongTrao();

    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  loadHoatDongPhongTrao() {
    this.http.post(
        'GeneralCategory/Items',
        {
          Code: this.code,
        },
        (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.lstHoatDongPT = result.Result;           
                this.lstHoatDongPT.forEach((element: any) => {
                  element.ImageUrl = JSON.parse(element.ImageUrl);  
              });           
            }
        },
        () => { }
    );
  }

  backPage() {
    this.location.back();
  }

  openFilter() {
    $('#menu-filter').css({ 'width': '250px' });
    setTimeout(() => {
      $('#menu-filter').addClass("show");
    }, 500);
  }

  closeFilter() {
    $('#menu-filter').removeClass("show");
    $('#menu-filter').css({ 'width': '0px' });
  }

  ngOnDestroy(): void {
    //HomePageService.stopAudio2();
  }

  clickHDPT(hoatdong: any, subtitle: string) {
    this.router.navigate(['/tablet/ds-hdpt'], { queryParams: { hd: hoatdong, subtitle: subtitle } });
  }
}
