import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AgmGeocoder } from '@agm/core';
import { HomePageService } from '../../services';
import { CarouselModule } from 'primeng/carousel';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

import SwiperCore, { Autoplay, SwiperOptions, EffectFade } from "swiper";
import { BaseService, HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';

// install Swiper components
SwiperCore.use([
  Autoplay,
  EffectFade
]);

@Component({
  selector: 'app-intro-page',
  templateUrl: './intro-page.component.html',
  styleUrls: ['./intro-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InTroPageComponent implements OnInit, OnDestroy {

  config: SwiperOptions = {
    // slidesPerView: 1,
    // direction: 'horizontal',
    // navigation: false,
    // pagination: false,
    // scrollbar: false,
    // loop: true,
    // autoplay: {
    //   delay: 3000,
    //   disableOnInteraction: false,
    //   // pauseOnMouseEnter: true,
    // },
    // effect: 'fade',
    // speed: 1500,

    autoplay: {
      delay: 15000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    loop: true,
    speed: 1500,
    slidesPerView: 1
  };

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

  Images: any = [
    { id: 1, img: "assets/template/images/intro/1.jpg" },
    { id: 1, img: "assets/template/images/intro/2.jpg" },
    { id: 1, img: "assets/template/images/intro/3.jpg" },
  ];

  isplay1: any;

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    private agmGeocoder: AgmGeocoder,
    private router: Router,
    public spinner: NgxSpinnerService,
    public http: HttpService,
    public baseService: BaseService,
  ) {

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.isplay1 = HomePageService.isPlay;
  }

  onSwiper([swiper]: any) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }

  openTieuSu() {
    this.router.navigate(['/public/chitiet'], { queryParams: { type: 0 } });
  }

  gotoHome() {
    this.router.navigate(['/tablet/home']);
  }

  ngOnInit(): void {
    if (HomePageService.isPlay) {
      HomePageService.stopAudio3();
      HomePageService.stopAudio2();
      HomePageService.stopAudio1();
      HomePageService.playAudio1();
    } else {
      HomePageService.stopAudio1();
      HomePageService.stopAudio2();
      HomePageService.stopAudio3();
    }

    $('#menu-mobile').css({ 'width': '0px' });
    $('#main').css({ 'margin-left': '0px' });
    $('#menu-mobile').removeClass("show");

    this.spinner.show();

    this.http.post(
      'NewGuest/GetList',
      {
        Code: 'intro-hinh-anh',
        PageSize: 10000,
        PageIndex: 1,
        UnitCode: this.baseService.unitCode
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.Images = result.Result;
          this.Images.forEach((element: any) => {
            element.ImageUrl = this.baseService.mediaUrl + element.ImageUrl;
          });
        }

        this.spinner.hide();
      },
      () => { 
        this.spinner.hide();
      }
    );

    // this.http.post(
    //   "GeneralCategory/Items",
    //   {
    //     Code: "HOME-IMAGE",
    //   },
    //   (result: ResultModel) => {
    //     if (result.Code == ResultCode.Success) {
    //       result.Result.forEach((item: any) => {
    //         item.ImageUrl = JSON.parse(item.ImageUrl)
    //       });
    //       this.Images = result.Result;
    //     }

    //     this.spinner.hide();
    //   },
    //   () => {
    //     this.spinner.hide();
    //   }
    // );
  }

  playSound() {
    HomePageService.isPlay = true;
    this.isplay1 = HomePageService.isPlay;
    HomePageService.playAudio1();
  }

  stopSound() {
    HomePageService.isPlay = false;
    this.isplay1 = HomePageService.isPlay;
    HomePageService.stopAudio1();
  }

  gotoGt() {
    this.router.navigate(['/tablet/gioithieu'], { queryParams: { type: 10 } });
  }

  gotoTbCn() {
    this.router.navigate(['/tablet/gioithieu'], { queryParams: { type: 2 } });
  }

  gotoTb() {
    this.router.navigate(['/tablet/gioithieu'], { queryParams: { type: 11 } });
  }

  gotoHdpt() {
    this.router.navigate(['/tablet/gioithieu'], { queryParams: { type: 14 } });
  }

  gotoGdtt() {
    this.router.navigate(['/tablet/gioithieu'], { queryParams: { type: 16 } });
  }

  gotoHa() {
    this.router.navigate(['/tablet/gioithieu'], { queryParams: { type: 12 } });
  }

  gotoUbTu() {
    this.router.navigate(['/tablet/gioithieu'], { queryParams: { type: 3 } });
  }

  gotoUbHu() {
    this.router.navigate(['/tablet/gioithieu'], { queryParams: { type: 15 } });
  }

  goto360() {
    alert("Tính năng đang phát triển!!!")
  }

  gotoTt() {
    this.router.navigate(['/tablet/gioithieu'], { queryParams: { type: 13 } });
  }

  ngOnDestroy(): void {
    //this.audioFile.stop();
  }

}
