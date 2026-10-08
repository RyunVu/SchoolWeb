import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

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
  standalone: false,
  selector: 'app-danhsach-page',
  templateUrl: './danhsach-page.component.html',
  styleUrls: ['./danhsach-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DanhSachPageComponent implements OnInit, OnDestroy {

  type: any = null;
  subtitle = "";

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    public dialogService: DialogService,
    private location: Location,
    private router: Router,

  ) { }

  ngOnInit(): void {

    // if (HomePageService.isPlay) {
    //   HomePageService.stopAudio1();
    //   HomePageService.stopAudio2();
    //   HomePageService.stopAudio3();
    //   HomePageService.playAudio2();
    // } else {
    //   HomePageService.stopAudio1();
    //   HomePageService.stopAudio2();
    //   HomePageService.stopAudio3();
    // }

    $('#menu-mobile').css({ 'width': '0px' });
    $('#main').css({ 'margin-left': '0px' });
    $('#menu-mobile').removeClass("show");

    this.route.queryParams.subscribe((param: any) => {
      this.type = param.type;
      if (this.type == 1) {
        this.subtitle = "giáo dục truyền thống"
      } else if (this.type == 2) {
        this.subtitle = "hoạt động phòng trào"
      } else if (this.type == 3) {
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
