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
  selector: 'app-coquanubkt-page',
  templateUrl: './coquanubkt-page.component.html',
  styleUrls: ['./coquanubkt-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class CoQuanUBKTPageComponent implements OnInit, OnDestroy {
  subtitle = "CƠ QUAN UỶ BAN KIỂM TRA TỈNH UỶ";
  type: any = null;
  activeTab: any;

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

    setTimeout(() => {
      this.spinner.hide();
    }, 500);
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
 
  showChiTietCQ(coquan: number) {
    this.router.navigate(['/tablet/chitiet-coquantinhuy'], { queryParams: { coquan: coquan } });
  }
  
  images_ToNuCong: any = [

    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công 2.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công 2.JPG", title: "Tổ nữ công 2" },
    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/tổ nữ công 3.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/tổ nữ công 3.JPG", title: "Tổ nữ công 3" },
    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan 1.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan 1.JPG", title: "Tổ nữ công cơ quan 1" },
    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan 2.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan 2.JPG", title: "Tổ nữ công cơ quan 2" },
    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan.JPG", title: "Tổ nữ công cơ quan" },
    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan1.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan1.JPG", title: "Tổ nữ công cơ quan1" },
  ];

  activeIndex: number = 0;
  displayBasic_TNC:boolean = false

  clickImageTNC() {
    this.displayBasic_TNC = true
  }
}
