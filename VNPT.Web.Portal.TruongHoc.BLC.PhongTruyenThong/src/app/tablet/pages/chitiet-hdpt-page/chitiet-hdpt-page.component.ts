import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AgmGeocoder } from '@agm/core';
import { BaseService, HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';
import * as moment from 'moment';

import {
  gmDefaultStyles,
  gmDarkStyles,
  populateBusinessFullAddress,
  SearchEntity,
} from 'src/app/shared';
import { defaultLocation } from 'src/app/shared/constants';
import { Location } from '@angular/common';
import { HomePageService } from '../../services';
import { DialogService } from 'primeng/dynamicdialog';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-chitiet-hdpt-page',
  templateUrl: './chitiet-hdpt-page.component.html',
  styleUrls: ['./chitiet-hdpt-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChiTietHDPTPageComponent implements OnInit, OnDestroy {
  code = "";
  id = "";
  alias = "";
  baiviet: any = null;
  lstLQ: any[] = [];

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    private agmGeocoder: AgmGeocoder,
    public dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    public http: HttpService,
    public sanitizer: DomSanitizer,
    private baseService: BaseService

  ) { }

  ngOnInit(): void {

    $('#menu-mobile').css({ 'width': '0px' });
    $('#main').css({ 'margin-left': '0px' });
    $('#menu-mobile').removeClass("show");

    this.route.queryParams.subscribe((baiviet: any) => {
      this.alias = baiviet.alias;
      this.code = baiviet.code;
      this.id = baiviet.id;

    })
    this.loadBaiViet();
    this.loadDsLienQuan();

  }

  loadBaiViet() {
    this.http.post(
      'NewGuest/Detail',
      {
        Alias: this.alias,
        UnitCode: this.baseService.unitCode
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.baiviet = result.Result;
          this.baiviet.Content = this.sanitizer.bypassSecurityTrustHtml(this.baiviet.Content)

          if (result.Result.CreateDate != "" && result.Result.CreateDate != null)
            this.baiviet.CreateDate = moment(result.Result.CreateDate, "DD/MM/YYYY HH:mm:ss").toDate();
        }
      },
      () => { }
    );
  }

  loadDsLienQuan() {
    this.http.post(
      'NewGuest/GetList',
      {
        Code: this.code,
        Id: this.id,
        PageSize: 3,
        PageIndex: 1
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.lstLQ = result.Result;
          this.lstLQ.forEach((element: any) => {
            element.ImageUrl = this.baseService.mediaUrl + element.ImageUrl;
          });
        }
      },
      () => { }
    );
  }

  clickChTietBV(code: string, id: any, alias: string) {
    const newCodeValue = code;
    const newIdValue = id;
    const newAliasValue = alias;

    const currentQueryParams = { ...this.activatedRoute.snapshot.queryParams };

    currentQueryParams['code'] = newCodeValue;
    currentQueryParams['id'] = newIdValue;
    currentQueryParams['alias'] = newAliasValue;
    const newUrl = window.location.origin + "/#/" + this.router.createUrlTree([], {
      relativeTo: this.activatedRoute,
      queryParams: currentQueryParams,
    }).toString();
    window.open(newUrl);
  }

  backPage() {
    this.location.back();
  }

  ngOnDestroy(): void {
  }

}
