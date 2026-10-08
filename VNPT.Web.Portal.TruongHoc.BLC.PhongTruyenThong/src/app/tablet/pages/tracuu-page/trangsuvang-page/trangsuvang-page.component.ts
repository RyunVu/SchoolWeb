import { Component, OnDestroy, OnInit, Pipe, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
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
  standalone: false,
  selector: 'app-trangsuvang-page',
  templateUrl: './trangsuvang-page.component.html',
  styleUrls: ['./trangsuvang-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class TrangSuVangPageComponent implements OnInit, OnDestroy {
  subtitle = "Những trang sử vàng"
  code = "NhungTrangSuVang";
  type: any = null;
  activeTab: any;
  lstTrangSuVang: any[] = [];
  imagesTSV: any = [];
  selectedTSV: any;

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
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

    this.loadTrangSuVang();

    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  loadTrangSuVang() {
    this.http.post(
      'NewGuest/GetList',
      {
        Code: this.code,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.lstTrangSuVang = result.Result;
          this.lstTrangSuVang.forEach((element: any) => {
            element.ImageUrl = this.baseService.mediaUrl + element.ImageUrl;
          });
        }
      },
      () => { }
    );
  }

  gotoChiTiet(alias: any, code: any, id: any) {
    this.router.navigate(['/tablet/chitiet-hdpt'], { queryParams: { code: code, id: id, alias: alias } });
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

  activeIndex: number = 0;

  displayBasic: boolean = false;

  clickImageTSV(value: any) {
    if (this.selectedTSV == null || this.selectedTSV.Id != value) {
      this.imagesTSV = [];
      this.activeIndex = 0;
      this.selectedTSV = this.lstTrangSuVang.find(item => item.Id === value);
      var imgs = JSON.parse(this.selectedTSV.Images);
      imgs.forEach((element: any) => {
        element.Url = this.baseService.mediaUrl + element.Url;
        this.imagesTSV.unshift({ id: element.Id, previewImageSrc: element.Url, thumbnailImageSrc: element.Url, caption: element.Name.replace(/\.(jpg|png)$/i, '') });
      });
    }
    this.displayBasic = true;
  }
}
