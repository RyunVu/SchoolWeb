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
import { CarouselModule } from 'primeng/carousel';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $: any;

@Component({
  standalone: false,
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent implements OnInit, OnDestroy {

  responsiveOptions: any;
  products: any = [
    { id: 1, img: "assets/template/images/slider-6.jpg" },
    { id: 2, img: "assets/template/images/slider-6.jpg" },
    { id: 3, img: "assets/template/images/slider-6.jpg" },
  ];

  lanhdaos: any = [
    { id: 1, img: "assets/template/images/profile/avatar.png" },
    { id: 1, img: "assets/template/images/nn2.jpg" },
    { id: 1, img: "assets/template/images/nn3.jpg" },
    { id: 1, img: "assets/template/images/nn4.jpg" },
    { id: 1, img: "assets/template/images/nn5.jpg" },
    { id: 1, img: "assets/template/images/nn6.jpg" },
    { id: 1, img: "assets/template/images/nn7.jpg" },
    // { id: 1, img: "assets/template/images/nn3.jpg" },
    // { id: 1, img: "assets/template/images/nn3.jpg" },
    // { id: 1, img: "assets/template/images/nn3.jpg" },
  ];

  hoatdongs: any = [
    { id: 1, img: "assets/template/images/nn1.jpg" },
    { id: 1, img: "assets/template/images/nn2.jpg" },
    { id: 1, img: "assets/template/images/nn3.jpg" },
    // { id: 1, img: "assets/template/images/nn4.jpg" },
    // { id: 1, img: "assets/template/images/nn5.jpg" },
    // { id: 1, img: "assets/template/images/nn6.jpg" },
    // { id: 1, img: "assets/template/images/nn7.jpg" },
    // { id: 1, img: "assets/template/images/nn3.jpg" },
    // { id: 1, img: "assets/template/images/nn3.jpg" },
    // { id: 1, img: "assets/template/images/nn3.jpg" },
  ];


  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    private router: Router,
    public spinner: NgxSpinnerService,
    private location: Location,
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  openTieuSu() {
    this.router.navigate(['/public/chitiet'], { queryParams: { type: 0 } });
  }

  backPage() {
    this.location.back();
  }

  ngOnInit(): void {
    this.spinner.show();

    localStorage.setItem('lanhDaoTab', JSON.stringify(1));

    if (HomePageService.isPlay) {
      HomePageService.resumeAudio1();
      HomePageService.stopAudio2();
      HomePageService.stopAudio3();
    } else {
      HomePageService.stopAudio1();
      HomePageService.stopAudio2();
      HomePageService.stopAudio3();
    }

    $('#menu-mobile').css({ 'width': '0px' });
    $('#main').css({ 'margin-left': '0px' });
    $('#menu-mobile').removeClass("show");

    setTimeout(() => {
      this.spinner.hide()
    }, 500);
  }

  gotoGt() {
    this.router.navigate(['/tablet/gioithieu'], { queryParams: { type: "gioi-thieu-phong-truyen-thong-b88ede06-4ed3-470a-9265-66c66032adc8" } });
  }

  gotoCacPhongBan() {
    this.router.navigate(['/tablet/cacphongban']);
  }

  gotoDangUy() {
    this.router.navigate(['/tablet/nhiemky'], { queryParams: { Code: "DANGUYSOGD" } });
  }

  gotoCDNganh() {
    this.router.navigate(['/tablet/nhiemky'], { queryParams: { Code: "CONGDOANNGANH" } });
  }

  gotoGdtt() {
    this.router.navigate(['/tablet/hoatdongnoibat']);
  }

  gotoHa() {
    this.router.navigate(['/tablet/hinhanhvideo']);
  }

  gotoLanhDao() {
    this.router.navigate(['/tablet/lanhdao']);
  }

  gotoUbTu() {
    this.router.navigate(['/tablet/nhiemky']);
  }

  gotoCDSo() {
    this.router.navigate(['/tablet/nhiemky'], { queryParams: { Code: "CONGDOANSO" } });
  }

  goto360() {
    alert("Tính năng đang phát triển!!!")
  }

  gotoTt() {
    this.router.navigate(['/tablet/trangsuvang']);
  }

  ngOnDestroy(): void {
  }

}
