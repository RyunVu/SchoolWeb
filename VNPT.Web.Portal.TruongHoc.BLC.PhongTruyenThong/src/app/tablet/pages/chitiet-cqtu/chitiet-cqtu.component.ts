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

@Component({
  standalone: false,
  selector: 'app-chitiet-cqtu',
  templateUrl: './chitiet-cqtu.component.html',
  styleUrls: ['./chitiet-cqtu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ChiTietCoQuanTinhUyComponent implements OnInit, OnDestroy {

  coquan: any = null;
  subtitle = "";

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    public dialogService: DialogService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private location: Location,
    public spinner: NgxSpinnerService
  ) { }

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
      this.coquan = param.coquan;
      
    })

    setTimeout(() => {
      this.spinner.hide();
    },500);
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

  
  showTieuSu(nhiemky: number,person: number) {
    this.router.navigate(['/tablet/chitietuyvien'], { queryParams: { nhiemky:nhiemky, person: person,  } });
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
