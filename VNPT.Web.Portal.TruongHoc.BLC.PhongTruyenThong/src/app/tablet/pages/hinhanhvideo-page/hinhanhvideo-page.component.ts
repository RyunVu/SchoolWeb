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
  selector: 'app-hinhanhvideo-page',
  templateUrl: './hinhanhvideo-page.component.html',
  styleUrls: ['./hinhanhvideo-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class HinhAnhVideoPageComponent implements OnInit, OnDestroy {
  subtitle = "Thư viện hình ảnh/ video"
  codeHA = "hinh-anh-ptt";
  type: any = null;
  activeTab: any;
  lstHA: any[] = [];
  imagesHA: any = [];
  selectedHA: any;
  codeVD = "videoptt";
  lstVD: any[] = [];
  videos: any = [];

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

    this.loadHinhAnh();
    this.loadVideo();

    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  loadHinhAnh() {
    this.http.post(
      'NewGuest/GetList',
      {
        Code: this.codeHA,
        PageSize: 10000,
        PageIndex: 1,
        UnitCode: this.baseService.unitCode
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.lstHA = result.Result;
          this.lstHA.forEach((element: any) => {
            element.ImageUrl = this.baseService.mediaUrl + element.ImageUrl;
          });
        }
      },
      () => { }
    );
  }

  loadVideo() {
    // this.http.post(
    //     'GeneralCategory/Items',
    //     {
    //       Code: this.codeVD,
    //     },
    //     (result: ResultModel) => {
    //         if (result.Code == ResultCode.Success) {
    //           this.lstVD = result.Result;           
    //           this.lstVD.forEach((element: any) => {
    //             element.ImageUrl = JSON.parse(element.ImageUrl); 
    //             this.videos.push({ id: element.Id, previewVideoSrc: this.sanitizer.bypassSecurityTrustResourceUrl(element.Value), thumbnailVideoSrc: element.Value });
    //           });  
    //         }
    //     },
    //     () => { }
    // );

    this.http.post(
      'NewGuest/GetList',
      {
        Code: this.codeVD,
        PageSize: 10000,
        PageIndex: 1,
        UnitCode: this.baseService.unitCode
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.lstVD = result.Result;
          this.lstVD.forEach((element: any) => {
            element.ImageUrl = this.baseService.mediaUrl + element.ImageUrl;
            this.videos.push({ id: element.Id, previewVideoSrc: this.sanitizer.bypassSecurityTrustResourceUrl(element.OtherUrl), thumbnailVideoSrc: element.OtherUrl });
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

  activeIndex: number = 0;
  displayBasic: boolean = false;

  clickImageHA(value: any) {
    if (this.selectedHA == null || this.selectedHA.Id != value) {
      this.imagesHA = [];
      this.activeIndex = 0;
      this.selectedHA = this.lstHA.find(item => item.Id === value);
      var imgs = JSON.parse(this.selectedHA.Description);
      imgs.forEach((element: any) => {
        element.Url = this.baseService.mediaUrl + element.Url;
        this.imagesHA.unshift({ id: element.Id, previewImageSrc: element.Url, thumbnailImageSrc: element.Url, caption: element.Caption });
      });
    }
    this.displayBasic = true;
  }

  activeIndexVD: number = 0;
  displayVideo: boolean = false;

  clickVideo(value: any) {
    this.activeIndexVD = value;
    this.displayVideo = true;
    HomePageService.pauseAudio1()
    HomePageService.pauseAudio2()
  }
}
