import { Component, OnDestroy, OnInit, Pipe, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

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
import { BaseService, HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';

@Component({
  standalone: false,
  selector: 'app-dsubkttinhuy-page',
  templateUrl: './dsubkttinhuy-page.component.html',
  styleUrls: ['./dsubkttinhuy-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class DanhSachCanBoPageComponent implements OnInit, OnDestroy {

  nhiemkyId: any = null;
  subtitle = "";
  lstData: any = [];
  imageUrl: any;

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    public dialogService: DialogService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private location: Location,
    public spinner: NgxSpinnerService,
    public http: HttpService,
    public baseService: BaseService
  ) {
    this.imageUrl = this.baseService.mediaUrl
  }

  ngOnInit(): void {
    this.spinner.show();

    if (HomePageService.isPlay) {
      HomePageService.resumeAudio1();
      HomePageService.stopAudio2();
    } else {
      HomePageService.stopAudio1();
      HomePageService.stopAudio2();
    }

    $('#menu-mobile').css({ 'width': '0px' });
    $('#main').css({ 'margin-left': '0px' });
    $('#menu-filter').css({ 'width': '0px' });
    $('#menu-mobile').removeClass("show");

    this.route.queryParams.subscribe((param: any) => {
      this.nhiemkyId = param.nhiemkyId;
      this.http.post(
        "NhiemKy/GetNhiemKy",
        { "Id": this.nhiemkyId },
        (result: ResultModel) => {
          if (result.Code == ResultCode.Success) {

            this.lstData = result.Result.CVNKlst;
            //this.contentPage = result.Result;
            console.log(result)
          }
        },
        () => {

        }
      );

    })

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
  }


  showTieuSu(person: number) {
    this.router.navigate(['/tablet/chitietuyvien'], { queryParams: { person: person } });
  }

  images: any = [
    { id: 1, previewImageSrc: "assets/template/images/media/1.jpg", thumbnailImageSrc: "assets/template/images/media/1.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/2.jpg", thumbnailImageSrc: "assets/template/images/media/2.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/3.jpg", thumbnailImageSrc: "assets/template/images/media/3.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/4.jpg", thumbnailImageSrc: "assets/template/images/media/4.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/5.jpg", thumbnailImageSrc: "assets/template/images/media/5.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/6.jpg", thumbnailImageSrc: "assets/template/images/media/6.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/7.jpg", thumbnailImageSrc: "assets/template/images/media/7.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/1.jpg", thumbnailImageSrc: "assets/template/images/media/1.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/2.jpg", thumbnailImageSrc: "assets/template/images/media/2.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/3.jpg", thumbnailImageSrc: "assets/template/images/media/3.jpg" },

    { id: 1, previewImageSrc: "assets/template/images/media/1.jpg", thumbnailImageSrc: "assets/template/images/media/1.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/2.jpg", thumbnailImageSrc: "assets/template/images/media/2.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/3.jpg", thumbnailImageSrc: "assets/template/images/media/3.jpg" },
  ];



  activeIndex: number = 0;

  displayBasic: boolean = false;
  displayVideo: boolean = false;


}
