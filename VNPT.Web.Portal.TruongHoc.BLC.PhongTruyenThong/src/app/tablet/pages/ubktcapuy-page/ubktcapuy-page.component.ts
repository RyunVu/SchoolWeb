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
  selector: 'app-ubktcapuy-page',
  templateUrl: './ubktcapuy-page.component.html',
  styleUrls: ['./ubktcapuy-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class UBKTCapUyPageComponent implements OnInit, OnDestroy {

  type: any = null;
  subtitle = "";
  activeTab: any;
  contentPage: any;
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
    public baseService: BaseService,

  ) {
    this.imageUrl = this.baseService.mediaUrl
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


    // this.http.post(
    //   'NhiemKy/Items',
    //   { Code: 'CoQuanNhiemKyPTT' },
    //   (result: ResultModel) => {
    //     if (result.Code == ResultCode.Success) {
    //       this.listHuyenUy = result.Result;

    //       console.log(this.listHuyenUy)

    //     }
    //     this.spinner.hide();
    //   },
    //   () => {
    //     this.spinner.hide();
    //   }
    // );

    this.http.post(
      "newguest/getlist",
      {
        Code: "cac-phong-ban",
        UnitCode: this.baseService.unitCode
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          // result.Result.forEach((item: any) => {
          //   item.ImageUrl = JSON.parse(item.ImageUrl)
          // });

          this.listHuyenUy = result.Result;
          //console.log(result.Result)
        }

        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );

    // if (this.type == 10) {
    //   HomePageService.pauseAudio1();
    //   HomePageService.playAudio3();
    // } else {
    //   if (HomePageService.isPlay) {
    //     HomePageService.resumeAudio1();
    //     HomePageService.stopAudio2();
    //   } else {
    //     HomePageService.stopAudio1();
    //     HomePageService.stopAudio2();
    //   }
    // }
  }

  tabActive(num: any) {
    this.activeTab = parseInt(num);
    localStorage.setItem("lanhDaoTab", num);
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

  // toggleMenu() {
  //   $('#menu-mobile').css({'width': '250px'});
  //   $('#main').css({'margin-left': '250px'});
  // }

  // closeMenu() {
  //   $('#menu-mobile').css({'width': '0px'});
  //   $('#main').css({'margin-left': '0px'});
  // }

  ngOnDestroy(): void {
    //HomePageService.stopAudio2();
  }

  isOn = true;
  turnOffSound() {
    this.isOn = false;
    HomePageService.stopAudio1();
    HomePageService.stopAudio2();
    HomePageService.pauseAudio3();
  }

  turnOnSound() {
    this.isOn = true;
    HomePageService.resumeAudio3();
  }

  nhiemKyOpen(nhiemky: number) {
    this.router.navigate(['/tablet/ds-canbo'], { queryParams: { nhiemky: nhiemky } });
  }

  showPerson() {
    this.router.navigate(['/tablet/chitiet'], { queryParams: { type: 0 } });
  }
  showTieuSu(person: number) {
    this.router.navigate(['/tablet/chitiet'], { queryParams: { person: person } });
    window.scrollTo(0, 0);
  }
  showUyVien(person: number) {
    this.router.navigate(['/tablet/chitietuyvien'], { queryParams: { person: person } });
  }

  showChiTiet(alias: string) {
    this.router.navigate(['/tablet/nhiemky'], { queryParams: { Code: alias } });
    //   this.router.navigate(['/tablet/chitiet-huyenuy'], { queryParams: { huyenuy: alias } });
  }

  showChiTietCQ(coquan: number) {
    this.router.navigate(['/tablet/chitiet-coquantinhuy'], { queryParams: { coquan: coquan } });
  }
  images: any = [
    { id: 1, previewImageSrc: "assets/template/images/media/1.jpg", thumbnailImageSrc: "assets/template/images/media/1.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/2.jpg", thumbnailImageSrc: "assets/template/images/media/2.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/3.jpg", thumbnailImageSrc: "assets/template/images/media/3.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/4.jpg", thumbnailImageSrc: "assets/template/images/media/4.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/5.jpg", thumbnailImageSrc: "assets/template/images/media/5.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/6.jpg", thumbnailImageSrc: "assets/template/images/media/6.jpg" },
    { id: 1, previewImageSrc: "assets/template/images/media/7.jpg", thumbnailImageSrc: "assets/template/images/media/7.jpg" },

  ];

  imagesThanhTich: any = [
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/1. HUÂN CHƯƠNG/2008. HUÂN CHƯƠNG LAO ĐỘNG HẠNG BA/Huân chương lao động Hạng Ba (2008).JPG", thumbnailImageSrc: "assets/template/images/thanhtich/1. HUÂN CHƯƠNG/2008. HUÂN CHƯƠNG LAO ĐỘNG HẠNG BA/Huân chương lao động Hạng Ba (2008).JPG", caption: "Huân chương lao động Hạng Ba (2008)" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/1. HUÂN CHƯƠNG/2013. HUÂN CHƯƠNG LAO ĐỘNG HẠNG NHÌ/Huân chương lao động Hạng Nhì (2013).JPG", thumbnailImageSrc: "assets/template/images/thanhtich/2013. HUÂN CHƯƠNG LAO ĐỘNG HẠNG NHÌ/Huân chương lao động Hạng Nhì (2013).JPG", caption: "Huân chương lao động Hạng Nhì (2013)" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/1. HUÂN CHƯƠNG/2023. HUÂN CHƯƠNG LAO ĐỘNG HẠNG NHẤT/Huân chương lao động Hạng Nhất (2023).jpg", thumbnailImageSrc: "assets/template/images/thanhtich/1. HUÂN CHƯƠNG/2023. HUÂN CHƯƠNG LAO ĐỘNG HẠNG NHẤT/Huân chương lao động Hạng Nhất (2023).jpg", caption: "UBKT TINH UY - HUẤN CHƯƠNG LAO ĐỘNG HẠNG NHẤT" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/1. HUÂN CHƯƠNG/2023. HUÂN CHƯƠNG LAO ĐỘNG HẠNG NHẤT/2023.2.UBKT TINH UY - HUẤN CHƯƠNG LAO ĐỘNG HẠNG NHẤT.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/1. HUÂN CHƯƠNG/2023. HUÂN CHƯƠNG LAO ĐỘNG HẠNG NHẤT/2023.2.UBKT TINH UY - HUẤN CHƯƠNG LAO ĐỘNG HẠNG NHẤT.jpg", caption: "UBKT TINH UY - HUẤN CHƯƠNG LAO ĐỘNG HẠNG NHẤT" },

  ];
  imagesThanhTich2: any = [
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen đạt danh hiệu Đơn vị xuất sắc năm 2005.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen đạt danh hiệu Đơn vị xuất sắc năm 2005.jpg", caption: "Bằng khen đạt danh hiệu Đơn vị xuất sắc năm 2005" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen đơn vị đạt thành tích xuất sắc năm 2004-2007.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen đơn vị đạt thành tích xuất sắc năm 2004-2007.jpg", caption: "Bằng khen đơn vị đạt thành tích xuất sắc năm 2004-2007" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen thành tích xuất sắc phong trào thi đua mừng kỳ niệm 70 năm ngày truyền thống ngành.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen thành tích xuất sắc phong trào thi đua mừng kỳ niệm 70 năm ngày truyền thống ngành.jpg", caption: "Bằng khen thành tích xuất sắc phong trào thi đua mừng kỳ niệm 70 năm ngày truyền thống ngành" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiên tiến xuất sắc (2010).jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiên tiến xuất sắc (2010).jpg", caption: "Đơn vị tiên tiến xuất sắc (2010)" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiên tiến xuất sắc 2006-2010.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiên tiến xuất sắc 2006-2010.jpg", caption: "Đơn vị tiên tiến xuất sắc 2006-2010" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2006.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2006.jpg", caption: "Đơn vị tiêu biểu xuất sắc năm 2006" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2007.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2007.jpg", caption: "Đơn vị tiêu biểu xuất sắc năm 2007" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2008.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2008.jpg", caption: "Đơn vị tiêu biểu xuất sắc năm 2008" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2009.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2009.jpg", caption: "Đơn vị tiêu biểu xuất sắc năm 2009" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2011.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2011.jpg", caption: "Đơn vị tiêu biểu xuất sắc năm 2011" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2012.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2012.jpg", caption: "Đơn vị tiêu biểu xuất sắc năm 2012" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2013.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc năm 2013.jpg", caption: "Đơn vị tiêu biểu xuất sắc năm 2013" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc nhiệm kỳ 2011-2015.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc nhiệm kỳ 2011-2015.jpg", caption: "Đơn vị tiêu biểu xuất sắc nhiệm kỳ 2011-2015" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc nhiệm kỳ 2016-2021.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/2. ỦY BAN KIỂM TRA TRUNG ƯƠNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị tiêu biểu xuất sắc nhiệm kỳ 2016-2021.jpg", caption: "ĐƠN VỊ TIÊU BIỂU XUẤT SẮC NHIỆM KỲ 2016-2021" },
  ];
  imagesThanhTich3: any = [
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/3. CHÍNH PHỦ TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị dẫn đầu phong trào thi đua năm 2007.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/3. CHÍNH PHỦ TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị dẫn đầu phong trào thi đua năm 2007.jpg", caption: "Đơn vị dẫn đầu phong trào thi đua năm 2007" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/3. CHÍNH PHỦ TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị xuất sắc trong phong trào thi đua năm 2017.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/3. CHÍNH PHỦ TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị xuất sắc trong phong trào thi đua năm 2017.jpg", caption: "Đơn vị xuất sắc trong phong trào thi đua năm 2017" },

  ];
  imagesThanhTich5: any = [
    // { id: 1, previewImageSrc: "assets/template/images/thanhtich/5. TỈNH ỦY, BAN THƯỜNG VỤ TỈNH ỦY TẶNG CỜ THI ĐUA, BẰNG KHEN/25.8.2010. Lãnh đạo UBKT TINH UY đón nhận Cờ thi đua hoàn thành xuất sắc nhiệm vụ 2005-2010.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/5. TỈNH ỦY, BAN THƯỜNG VỤ TỈNH ỦY TẶNG CỜ THI ĐUA, BẰNG KHEN/25.8.2010. Lãnh đạo UBKT TINH UY đón nhận Cờ thi đua hoàn thành xuất sắc nhiệm vụ 2005-2010.jpg", caption: "25.8.2010. Lãnh đạo UBKT TINH UY đón nhận Cờ thi đua hoàn thành xuất sắc nhiệm vụ 2005-2010" },
    // { id: 1, previewImageSrc: "assets/template/images/thanhtich/5. TỈNH ỦY, BAN THƯỜNG VỤ TỈNH ỦY TẶNG CỜ THI ĐUA, BẰNG KHEN/2013.10.14. Lãnh đạo UBKTTU đón nhận cờ thi đua Tỉnh ủy.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/5. TỈNH ỦY, BAN THƯỜNG VỤ TỈNH ỦY TẶNG CỜ THI ĐUA, BẰNG KHEN/2013.10.14. Lãnh đạo UBKTTU đón nhận cờ thi đua Tỉnh ủy.jpg", caption: "2013.10.14. Lãnh đạo UBKTTU đón nhận cờ thi đua Tỉnh ủy" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/5. TỈNH ỦY, BAN THƯỜNG VỤ TỈNH ỦY TẶNG CỜ THI ĐUA, BẰNG KHEN/Cờ 55 năm ngày thành lập ngành.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/5. TỈNH ỦY, BAN THƯỜNG VỤ TỈNH ỦY TẶNG CỜ THI ĐUA, BẰNG KHEN/Cờ 55 năm ngày thành lập ngành.jpg", caption: "Cờ 55 năm ngày thành lập ngành" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/5. TỈNH ỦY, BAN THƯỜNG VỤ TỈNH ỦY TẶNG CỜ THI ĐUA, BẰNG KHEN/Cờ 65 năm ngày thành lập ngành.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/5. TỈNH ỦY, BAN THƯỜNG VỤ TỈNH ỦY TẶNG CỜ THI ĐUA, BẰNG KHEN/Cờ 65 năm ngày thành lập ngành.jpg", caption: "Cờ 65 năm ngày thành lập ngành" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/5. TỈNH ỦY, BAN THƯỜNG VỤ TỈNH ỦY TẶNG CỜ THI ĐUA, BẰNG KHEN/Đạt thành tích xuất sắc 2005-2010.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/5. TỈNH ỦY, BAN THƯỜNG VỤ TỈNH ỦY TẶNG CỜ THI ĐUA, BẰNG KHEN/Đạt thành tích xuất sắc 2005-2010.jpg", caption: "Đạt thành tích xuất sắc 2005-2010" },
  ];
  imagesThanhTich6: any = [
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đón nhận Cờ thi đua Đơn vị xuất sắc dẫn đầu phong trào thi đua yêu nước năm 2005-2010.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đón nhận Cờ thi đua Đơn vị xuất sắc dẫn đầu phong trào thi đua yêu nước năm 2005-2010.jpg", caption: "14.8.2010. Lãnh đạo UBKTTU đón nhận Cờ thi đua Đơn vị xuất sắc dẫn đầu phong trào thi đua yêu nước năm 2005-2010" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2005.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2005.JPG", caption: "Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2005" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2006.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2006.jpg", caption: "Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2006" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị thi đua xuất sắc năm 2007.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị thi đua xuất sắc năm 2007.jpg", caption: "Đơn vị thi đua xuất sắc năm 2007" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị xuất sắc dẫn đầu phong trào thi đua 5 năm 2005-2010.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Đơn vị xuất sắc dẫn đầu phong trào thi đua 5 năm 2005-2010.jpg", caption: "Đơn vị xuất sắc dẫn đầu phong trào thi đua 5 năm 2005-2010" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Thành tích xuất sắc dẫn đầu các cụm, khối thi đua trên địa bàn tỉnh Lâm Đồng năm 2019.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Thành tích xuất sắc dẫn đầu các cụm, khối thi đua trên địa bàn tỉnh Lâm Đồng năm 2019.jpg", caption: "Thành tích xuất sắc dẫn đầu các cụm, khối thi đua trên địa bàn tỉnh Lâm Đồng năm 2019" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Thành tích xuất sắc dẫn đầu các cụm, khối thi đua trên địa bàn tỉnh Lâm Đồng năm 2021.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/6. ỦY BAN NHÂN DÂN TỈNH LÂM ĐỒNG TẶNG CỜ THI ĐUA, BẰNG KHEN/Thành tích xuất sắc dẫn đầu các cụm, khối thi đua trên địa bàn tỉnh Lâm Đồng năm 2021.jpg", caption: "Thành tích xuất sắc dẫn đầu các cụm, khối thi đua trên địa bàn tỉnh Lâm Đồng năm 2021" },
  ];
  imagesThanhTich7: any = [
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen danh hiệu đơn vị xuất sắc năm 2005.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen danh hiệu đơn vị xuất sắc năm 2005.JPG", caption: "Bằng khen danh hiệu đơn vị xuất sắc năm 2005" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen đơn vị đạt thành tích xuất sắc trong thực hiện Luật phòng, chống tham nhũng 2006-2016.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen đơn vị đạt thành tích xuất sắc trong thực hiện Luật phòng, chống tham nhũng 2006-2016.JPG", caption: "Bằng khen đơn vị đạt thành tích xuất sắc trong thực hiện Luật phòng, chống tham nhũng 2006-2016" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2009.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2009.JPG", caption: "Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2009" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2010.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2010.JPG", caption: "Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2010" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2011.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2011.JPG", caption: "Bằng khen hoàn thành xuất sắc nhiệm vụ năm 2011" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước 05 năm 2005-2010.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước 05 năm 2005-2010.JPG", caption: "Bằng khen phong trào thi đua yêu nước 05 năm 2005-2010" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước năm 2012.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước năm 2012.jpg", caption: "Bằng khen phong trào thi đua yêu nước năm 2012" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước năm 2013.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước năm 2013.jpg", caption: "Bằng khen phong trào thi đua yêu nước năm 2013" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước năm 2015.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước năm 2015.JPG", caption: "Bằng khen phong trào thi đua yêu nước năm 2015" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước năm 2016.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước năm 2016.JPG", caption: "Bằng khen phong trào thi đua yêu nước năm 2016" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước năm 2018.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/7. CHỦ TỊCH ỦY BAN NHÂN DÂN TỈNH TẶNG CỜ THI ĐUA, BẰNG KHEN/Bằng khen phong trào thi đua yêu nước năm 2018.JPG", caption: "Bằng khen phong trào thi đua yêu nước năm 2018" },
  ];
  imagesThanhTich8: any = [
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/Bang_vang_Chi_bo_Doan_the2.jpg", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/Bang_vang_Chi_bo_Doan_the2.jpg", caption: "Bang_vang_Chi_bo_Doan_the2" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5681.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5681.JPG", caption: "ROM_5681" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5682.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5682.JPG", caption: "ROM_5681" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5683.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5683.JPG", caption: "ROM_5681" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5684.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5684.JPG", caption: "ROM_5681" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5685.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5685.JPG", caption: "ROM_5681" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5686.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5686.JPG", caption: "ROM_5681" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5687.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5687.JPG", caption: "ROM_5681" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5688.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5688.JPG", caption: "ROM_5681" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5690.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5690.JPG", caption: "ROM_5690" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5692.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5692.JPG", caption: "ROM_5692" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5694.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5694.JPG", caption: "ROM_5694" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5695.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5695.JPG", caption: "ROM_5695" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5697.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5697.JPG", caption: "ROM_5697" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5698.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CHI BỘ CƠ QUAN ỦY BAN KIỂM TRA TỈNH ỦY/ROM_5698.JPG", caption: "ROM_5698" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CÔNG ĐOÀN CƠ QUAN/ROM_5610.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CÔNG ĐOÀN CƠ QUAN/ROM_5610.JPG", caption: "ROM_5610" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CÔNG ĐOÀN CƠ QUAN/ROM_5611.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CÔNG ĐOÀN CƠ QUAN/ROM_5611.JPG", caption: "ROM_5611" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CÔNG ĐOÀN CƠ QUAN/ROM_5612.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CÔNG ĐOÀN CƠ QUAN/ROM_5612.JPG", caption: "ROM_5612" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CÔNG ĐOÀN CƠ QUAN/ROM_5613.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CÔNG ĐOÀN CƠ QUAN/ROM_5613.JPG", caption: "ROM_5613" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CÔNG ĐOÀN CƠ QUAN/ROM_5614.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/CÔNG ĐOÀN CƠ QUAN/ROM_5614.JPG", caption: "ROM_5614" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/HỘI CỰU CHIẾN BINH CƠ QUAN/ROM_5615.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/HỘI CỰU CHIẾN BINH CƠ QUAN/ROM_5615.JPG", caption: "ROM_5615" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/HỘI CỰU CHIẾN BINH CƠ QUAN/ROM_5616.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/HỘI CỰU CHIẾN BINH CƠ QUAN/ROM_5616.JPG", caption: "ROM_5616" },
    { id: 1, previewImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/HỘI CỰU CHIẾN BINH CƠ QUAN/ROM_5617.JPG", thumbnailImageSrc: "assets/template/images/thanhtich/8. BẰNG KHEN, GIẤY KHEN CHI BỘ, ĐOÀN THỂ CƠ QUAN/HỘI CỰU CHIẾN BINH CƠ QUAN/ROM_5617.JPG", caption: "ROM_5617" },
  ];
  imagesHD1: any = [
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.1.UBKT TINH UY (106).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.1.UBKT TINH UY (106).jpg", title: "2022.1.UBKT TINH UY (106)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (115).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (115).jpg", title: "2022.12.UBKT TINH UY (115)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (116).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (116).jpg", title: "2022.12.UBKT TINH UY (116)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (118).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (118).jpg", title: "2022.12.UBKT TINH UY (118)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2023.2.UBKT TINH UY (136).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2023.2.UBKT TINH UY (136).jpg", title: "2023.2.UBKT TINH UY (136)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2023.4.UBKT TINH UY (130).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2023.4.UBKT TINH UY (130).jpg", title: "2023.4.UBKT TINH UY (130)" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2023.5.UBKT TINH UY (130).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2023.5.UBKT TINH UY (130).jpg", title: "2023.5.UBKT TINH UY (130)" },
  ];
  imagesHD2: any = [
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Hoạt động động viên các chốt kiểm soát chống dịch Covid 19.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Hoạt động động viên các chốt kiểm soát chống dịch Covid 19.jpg", title: "Hoạt động động viên các chốt kiểm soát chống dịch Covid 19" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Thăm hỏi các chốt kiểm soát chống dịch Covid.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Thăm hỏi các chốt kiểm soát chống dịch Covid.jpg", title: "Thăm hỏi các chốt kiểm soát chống dịch Covid" },
    { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Trao quà động viên các lực lượng tuyến đầu chống dịch Covid 19.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Trao quà động viên các lực lượng tuyến đầu chống dịch Covid 19.jpg", title: "Trao quà động viên các lực lượng tuyến đầu chống dịch Covid 19" },

  ];
  imagesHD3: any = [
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/HOẠT ĐỘNG VỀ NGUỒN/19.Đoàn cán bộ UBKT Lâm Đồng đi thăm chiến trường và nghĩa trang liệt sĩ Điện Biên Phủ năm 2009.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/HOẠT ĐỘNG VỀ NGUỒN/19.Đoàn cán bộ UBKT Lâm Đồng đi thăm chiến trường và nghĩa trang liệt sĩ Điện Biên Phủ năm 2009.JPG", title: "Đoàn cán bộ UBKT Lâm Đồng đi thăm chiến trường và nghĩa trang liệt sĩ Điện Biên Phủ năm 2009" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/HOẠT ĐỘNG VỀ NGUỒN/20.Đoàn cán bộ UBKT Lâm Đồng viếng Lăng Chủ tịch Hồ Chí Minh năm 2009.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/HOẠT ĐỘNG VỀ NGUỒN/20.Đoàn cán bộ UBKT Lâm Đồng viếng Lăng Chủ tịch Hồ Chí Minh năm 2009.JPG", title: "20.Đoàn cán bộ UBKT Lâm Đồng viếng Lăng Chủ tịch Hồ Chí Minh năm 2009" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/HOẠT ĐỘNG VỀ NGUỒN/21.Đoàn cán bộ UBKT Lâm Đồng đi thăm Đền thờ Vua Hùng tại tỉnh Phú Thọ.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/HOẠT ĐỘNG VỀ NGUỒN/21.Đoàn cán bộ UBKT Lâm Đồng đi thăm Đền thờ Vua Hùng tại tỉnh Phú Thọ.JPG", title: "21.Đoàn cán bộ UBKT Lâm Đồng đi thăm Đền thờ Vua Hùng tại tỉnh Phú Thọ" },
  ];
  imagesHD4: any = [
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0975.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0975.JPG", title: "IMG_0975" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0976.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0976.JPG", title: "IMG_0976" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0977.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0977.JPG", title: "IMG_0977" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0980.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0980.JPG", title: "IMG_0980" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0996.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0996.JPG", title: "IMG_0996" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0998.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/03. Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh/VĂN HÓA - VĂN NGHỆ/IMG_0998.JPG", title: "IMG_0998" },
  ];
  imagesHD5: any = [
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/12.Đại hội Chi đoàn Cơ quan UBKT Tỉnh ủy lần thứ I (nhiệm kỳ 2015-2017).JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/12.Đại hội Chi đoàn Cơ quan UBKT Tỉnh ủy lần thứ I (nhiệm kỳ 2015-2017).JPG", title: "1" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_0968.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_0968.JPG", title: "2" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_0974.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_0974.JPG", title: "2" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_0985.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_0985.JPG", title: "2" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_0988.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_0988.JPG", title: "2" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_1009.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_1009.JPG", title: "2" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_1013.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_1013.JPG", title: "2" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_1019.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_1019.JPG", title: "2" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_1016.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_1016.JPG", title: "2" },
    { id: 1, previewImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_1024.JPG", thumbnailImageSrc: "assets/template/images/HoatDongPhongTrao/04.Hoạt động Chi Đoàn TNCSHCM Cơ quan/IMG_1024.JPG", title: "2" },
  ];
  imagesHD6: any = [

    { id: 1, previewImageSrc: "assets/template/images/CQTU/Phòng Nghiệp vụ 2.JPG", thumbnailImageSrc: "assets/template/images/CQTU/Phòng Nghiệp vụ 2.JPG", title: "1" },
    { id: 1, previewImageSrc: "assets/template/images/CQTU/Phòng Nghiệp vụ 1.JPG", thumbnailImageSrc: "assets/template/images/CQTU/Phòng Nghiệp vụ 1.JPG", title: "2" },
    { id: 1, previewImageSrc: "assets/template/images/CQTU/Phòng Tổng hợp.JPG", thumbnailImageSrc: "assets/template/images/CQTU/Phòng Tổng hợp.JPG", title: "3" },
    { id: 1, previewImageSrc: "assets/template/images/CQTU/Tổ nữ công cơ quan1.JPG", thumbnailImageSrc: "assets/template/images/CQTU/Tổ nữ công cơ quan1.JPG", title: "4" },
  ];
  videos: any = [
    { id: 1, previewImageSrc: this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/_RM2SKVyqj0?si=UKgiYOkQH2lUu8NN"), thumbnailImageSrc: "assets/template/images/media/1.jpg" },

  ];
  images_ToNuCong: any = [

    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công 2.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công 2.JPG", title: "Tổ nữ công 2" },
    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/tổ nữ công 3.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/tổ nữ công 3.JPG", title: "Tổ nữ công 3" },
    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan 1.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan 1.JPG", title: "Tổ nữ công cơ quan 1" },
    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan 2.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan 2.JPG", title: "Tổ nữ công cơ quan 2" },
    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan.JPG", title: "Tổ nữ công cơ quan" },
    { id: 1, previewImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan1.JPG", thumbnailImageSrc: "assets/template/images/1. Cơ quan Ủy ban Kiểm tra Tỉnh ủy 2020-2025 (hoanchinh)/5. Tổ nữ công/Tổ nữ công cơ quan1.JPG", title: "Tổ nữ công cơ quan1" },
  ];
  listHuyenUy: any = [
    // { id: 1, name: "ĐÀ LẠT", img: "assets/template/images/HuyenUy/DL.jpg" },
    // { id: 2, name: "LẠC DƯƠNG", img: "assets/template/images/HuyenUy/LD.jpg" },
    // { id: 3, name: "ĐỨC TRỌNG", img: "assets/template/images/HuyenUy/DT.jpg" },
    // { id: 4, name: "ĐƠN DƯƠNG", img: "assets/template/images/HuyenUy/DD.jpg" },
    // { id: 5, name: "LÂM HÀ", img: "assets/template/images/HuyenUy/LH.jpg" },
    // { id: 6, name: "ĐAM RÔNG", img: "assets/template/images/HuyenUy/DR.jpg" },
    // { id: 7, name: "DI LINH", img: "assets/template/images/HuyenUy/DLH.jpg" },
    // { id: 8, name: "BẢO LỘC", img: "assets/template/images/HuyenUy/BL.jpg" },
    // { id: 9, name: "BẢO LÂM", img: "assets/template/images/HuyenUy/BLM.jpg" },
    // { id: 10, name: "ĐẠ HUOAI", img: "assets/template/images/HuyenUy/DHI.jpg" },
    // { id: 11, name: "ĐẠ TẺH", img: "assets/template/images/HuyenUy/DTH.jpg" },
    // { id: 12, name: "CÁT TIÊN", img: "assets/template/images/HuyenUy/CT.jpg" },
    // { id: 13, name: "CÔNG AN TỈNH", img: "assets/template/images/HuyenUy/CAT.jpg" },
    // { id: 14, name: "QUÂN SỰ TỈNH", img: "assets/template/images/HuyenUy/QST.jpg" },
    // { id: 15, name: "ĐẢNG ỦY KHỐI CÁC CƠ QUAN", img: "assets/template/images/HuyenUy/DUCQ.jpg" },
    // { id: 16, name: "ĐẢNG ỦY KHỐI DOANH NGHIỆP", img: "assets/template/images/HuyenUy/DUDN.jpg" },
    // { id: 17, name: "TRƯỜNG ĐẠI HỌC ĐÀ LẠT", img: "assets/template/images/HuyenUy/DHDL.jpg" },
    // { id: 18, name: "VIỆN NGHIÊN CỨU HẠT NHÂN", img: "assets/template/images/HuyenUy/VNCHN.jpg" },
  ];


  activeIndex: number = 0;

  displayBasic: boolean = false;
  displayBasic2: boolean = false;
  displayBasic3: boolean = false;
  displayBasic5: boolean = false;
  displayBasic6: boolean = false;
  displayBasic7: boolean = false;
  displayBasic8: boolean = false;
  displayBasic9: boolean = false;
  displayBasic10: boolean = false;
  displayBasic11: boolean = false;
  displayBasic12: boolean = false;
  displayBasic13: boolean = false;
  displayBasic14: boolean = false;
  displayVideo: boolean = false;
  displayBasic_TNC: boolean = false
  clickImage() {
    this.displayBasic = true
  }

  clickVideo() {
    this.displayVideo = true;
    HomePageService.pauseAudio1()
    HomePageService.pauseAudio2()
  }

  // clickImage(index: number) {


  //   this.activeIndex = index;
  //   this.displayBasic = true;

  // }
  clickHDPT(hoatdong: number) {
    this.router.navigate(['/tablet/ds-hdpt'], { queryParams: { hd: hoatdong } });
  }
  clickImage2() {
    this.displayBasic2 = true
  }
  clickImage3() {
    this.displayBasic3 = true
  }
  clickImage5() {
    this.displayBasic5 = true
  }
  clickImage6() {
    this.displayBasic6 = true
  }
  clickImage7() {
    this.displayBasic7 = true
  }
  clickImage8() {
    this.displayBasic8 = true
  }
  clickImage9() {
    this.displayBasic9 = true
  }
  clickImage10() {
    this.displayBasic10 = true
  }
  clickImage11() {
    this.displayBasic11 = true
  }
  clickImage12() {
    this.displayBasic12 = true
  }
  clickImage13() {
    this.displayBasic13 = true
  }
  clickImage14() {
    this.displayBasic14 = true
  }
  clickImageTNC() {
    this.displayBasic_TNC = true
  }
}
