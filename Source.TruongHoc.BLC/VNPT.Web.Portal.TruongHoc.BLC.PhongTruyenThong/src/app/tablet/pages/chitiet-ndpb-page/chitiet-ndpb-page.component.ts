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
  selector: 'app-chitiet-ndpb-page',
  templateUrl: './chitiet-ndpb-page.component.html',
  styleUrls: ['./chitiet-ndpb-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChiTietNDPBPageComponent implements OnInit, OnDestroy {
  baiviet: any = {
    TieuDe: "",
    NgayDangString: "",
    NoiDung: ""
  };

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
    private baseService: BaseService,
    public sanitizer: DomSanitizer,

  ) { }

  ngOnInit(): void {

    $('#menu-mobile').css({ 'width': '0px' });
    $('#main').css({ 'margin-left': '0px' });
    $('#menu-mobile').removeClass("show");

    var id = this.route.snapshot.params['baiviet'];
    this.loadBaiViet(id);
  }

  loadBaiViet(id: any) {
    this.http.post(
      'TieuSu/GetBaiPhatBieu',
      {
        Id: id,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.baiviet = result.Result;
          this.baiviet.NoiDung = this.sanitizer.bypassSecurityTrustHtml(this.baiviet.NoiDung);
        }
      },
      () => { }
    );
  }

  backPage() {
    this.location.back();
  }

  ngOnDestroy(): void {
  }

}
