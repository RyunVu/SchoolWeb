import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AgmGeocoder } from '@agm/core';

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
import { Location } from '@angular/common';

@Component({
  selector: 'app-chitiet-tintuc-page',
  templateUrl: './chitiet-tintuc-page.component.html',
  styleUrls: ['./chitiet-tintuc-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChiTietBaiVietPageComponent implements OnInit, OnDestroy {

  baiviet: any = null;
  subtitle = "giới thiệu";

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    private agmGeocoder: AgmGeocoder,
    public dialogService: DialogService,
    private location: Location,
    private router: Router,

  ) { }

  ngOnInit(): void {

    // if (HomePageService.isPlay) {
    //   HomePageService.resumeAudio1();
    //   HomePageService.stopAudio2();
    // } else {
    //   HomePageService.stopAudio1();
    //   HomePageService.stopAudio2();
    // }


    $('#menu-mobile').css({ 'width': '0px' });
    $('#main').css({ 'margin-left': '0px' });
    $('#menu-mobile').removeClass("show");

    this.route.queryParams.subscribe((param: any) => {
      this.baiviet = +param.baiviet;

      if (this.baiviet == 1) {
        this.subtitle = "giáo dục truyền thống"
      } else if (this.baiviet == 2) {
        this.subtitle = "Các hoạt động phòng trào"
      } else if (this.baiviet == 3) {
        this.subtitle = "Thành tích"
      }
    })

  }

  ngOnDestroy(): void {
  }

  backPage() {
    this.location.back();
  }

}
