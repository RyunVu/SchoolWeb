import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { Location } from '@angular/common';
import { HomePageService } from '../../services';
import { GalleriaModule } from 'primeng/galleria';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseService, HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';
declare var $: any;

@Component({
  selector: 'app-chitiet-huyenuy',
  templateUrl: './chitiet-huyenuy.component.html',
  styleUrls: ['./chitiet-huyenuy.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChiTietHuyenUyComponent implements OnInit, OnDestroy {

  huyenuy: any = 0;
  person: any = 0;
  subtitle = "Tiểu sử";
  // images: any = [
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Các đ.c Chủ trì dự HN trực tuyến sơ kết 6 tháng năm 2021.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Các đ.c Chủ trì dự HN trực tuyến sơ kết 6 tháng năm 2021.jpg", title: "Các đ.c Chủ trì dự HN trực tuyến sơ kết 6 tháng năm 2021" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Chủ trì kỳ họp lần thứ 11 nhiệm kỳ XI.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Chủ trì kỳ họp lần thứ 11 nhiệm kỳ XI.jpg", title: "Chủ trì kỳ họp lần thứ 11 nhiệm kỳ XI" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/đ.c Đặng Đức Hiệp phát biểu tại hội nghị tổng kết công tác năm 2022.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/đ.c Đặng Đức Hiệp phát biểu tại hội nghị tổng kết công tác năm 2022.jpg", title: "đ.c Đặng Đức Hiệp phát biểu tại hội nghị tổng kết công tác năm 2022" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Hoạt động đền ơn đáp nghĩa.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Hoạt động đền ơn đáp nghĩa.jpg", title: "Hoạt động đền ơn đáp nghĩa" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Hoạt động động viên các chốt kiểm soát chống dịch Covid 19.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Hoạt động động viên các chốt kiểm soát chống dịch Covid 19.jpg", title: "Hoạt động động viên các chốt kiểm soát chống dịch Covid 19" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/images2426808_2b_01.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/images2426808_2b_01.jpg", title: "Nội dung" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Thăm hỏi các chốt kiểm soát chống dịch Covid.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Thăm hỏi các chốt kiểm soát chống dịch Covid.jpg", title: "Thăm hỏi các chốt kiểm soát chống dịch Covid" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/Trao quà động viên các lực lượng tuyến đầu chống dịch Covid 19.jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/Trao quà động viên các lực lượng tuyến đầu chống dịch Covid 19.jpg", title: "Trao quà động viên các lực lượng tuyến đầu chống dịch Covid 19" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.1.UBKT TINH UY (105).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.1.UBKT TINH UY (105).jpg", title: "2022.1.UBKT TINH UY (105)" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.1.UBKT TINH UY (106).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.1.UBKT TINH UY (106).jpg", title: "2022.1.UBKT TINH UY (106)" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (115).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (115).jpg", title: "2022.12.UBKT TINH UY (115)" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (116).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (116).jpg", title: "2022.12.UBKT TINH UY (116)" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (118).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2022.12.UBKT TINH UY (118).jpg", title: "2022.12.UBKT TINH UY (118)" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2023.2.UBKT TINH UY (136).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2023.2.UBKT TINH UY (136).jpg", title: "2023.2.UBKT TINH UY (136)" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2023.4.UBKT TINH UY (130).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2023.4.UBKT TINH UY (130).jpg", title: "2023.4.UBKT TINH UY (130)" },
  //   { id: 1, previewImageSrc: "assets/template/images/DangDucHiep/2023.5.UBKT TINH UY (130).jpg", thumbnailImageSrc: "assets/template/images/DangDucHiep/2023.5.UBKT TINH UY (130).jpg", title: "2023.5.UBKT TINH UY (130)" },
  // ];

  // images2: any = [
  //   { id: 1, previewImageSrc: "assets/template/images/MaiVanNgoc/1.PNG", thumbnailImageSrc: "assets/template/images/MaiVanNgoc/1.PNG", title: "Các đồng chí nguyên lãnh đạo UBKTTU các khoá chụp hình lưu niệm với hội nghị" },
  //   { id: 1, previewImageSrc: "assets/template/images/MaiVanNgoc/2.PNG", thumbnailImageSrc: "assets/template/images/MaiVanNgoc/2.PNG", title: "Lễ kỷ niệm 55 năm ngày truyền thống Ngành Kiểm tra Đảng (16.10.2023)" },
  //   { id: 1, previewImageSrc: "assets/template/images/MaiVanNgoc/3.PNG", thumbnailImageSrc: "assets/template/images/MaiVanNgoc/3.PNG", title: "Lễ kỷ niệm lần thứ 54 năm ngày thành lập Ngành Kiểm tra của Đảng" },
  // ];
  // images5: any = [
  //   { id: 1, previewImageSrc: "assets/template/images/PhanHuuGian/img030.jpg", thumbnailImageSrc: "assets/template/images/PhanHuuGian/img030.jpg", title: "img030" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhanHuuGian/ROM_5531.JPG", thumbnailImageSrc: "assets/template/images/PhanHuuGian/ROM_5531.JPG", title: "ROM_5531" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhanHuuGian/ROM_5537.JPG", thumbnailImageSrc: "assets/template/images/PhanHuuGian/ROM_5537.JPG", title: "ROM_5537" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhanHuuGian/ROM_5547.JPG", thumbnailImageSrc: "assets/template/images/PhanHuuGian/ROM_5547.JPG", title: "ROM_5547" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhanHuuGian/ROM_5549.JPG", thumbnailImageSrc: "assets/template/images/PhanHuuGian/ROM_5549.JPG", title: "ROM_5549" },
  // ];
  // images6: any = [
  //   { id: 1, previewImageSrc: "assets/template/images/TranDinhPhac/img006.jpg", thumbnailImageSrc: "assets/template/images/TranDinhPhac/img006.jpg", title: "img006" },
  //   { id: 1, previewImageSrc: "assets/template/images/TranDinhPhac/img018.jpg", thumbnailImageSrc: "assets/template/images/TranDinhPhac/img018.jpg", title: "img018" },
  //   { id: 1, previewImageSrc: "assets/template/images/TranDinhPhac/img019.jpg", thumbnailImageSrc: "assets/template/images/TranDinhPhac/img019.jpg", title: "img019" },
  // ];
  // images7: any = [
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/img028.jpg", thumbnailImageSrc: "assets/template/images/PhamVanBon/img028.jpg", title: "img028" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/img029.jpg", thumbnailImageSrc: "assets/template/images/PhamVanBon/img029.jpg", title: "img029" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5465.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5465.JPG", title: "ROM_5465" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5469.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5469.JPG", title: "ROM_5469" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5470.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5470.JPG", title: "ROM_5470" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5471.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5471.JPG", title: "ROM_5471" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5473.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5473.JPG", title: "ROM_5473" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5484.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5484.JPG", title: "ROM_5484" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5485.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5485.JPG", title: "ROM_5485" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5489.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5489.JPG", title: "ROM_5489" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5491.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5491.JPG", title: "ROM_5491" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5495.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5495.JPG", title: "ROM_5495" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5498.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5498.JPG", title: "ROM_5498" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5506.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5506.JPG", title: "ROM_5506" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5507.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5507.JPG", title: "ROM_5507" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5519.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5519.JPG", title: "ROM_5519" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5598.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5598.JPG", title: "ROM_5598" },
  //   { id: 1, previewImageSrc: "assets/template/images/PhamVanBon/ROM_5606.JPG", thumbnailImageSrc: "assets/template/images/PhamVanBon/ROM_5606.JPG", title: "ROM_5606" },

  // ];
  // images8: any = [
  //   { id: 1, previewImageSrc: "assets/template/images/VuCongTien/2013.jpg", thumbnailImageSrc: "assets/template/images/VuCongTien/2013.jpg", title: "2013" },
  //   { id: 1, previewImageSrc: "assets/template/images/VuCongTien/Đồng chí Vũ Công Tiến phát biểu tại buổi làm việc với Đảng ủy xã Phú Hội 2012.jpg", thumbnailImageSrc: "assets/template/images/VuCongTien/Đồng chí Vũ Công Tiến phát biểu tại buổi làm việc với Đảng ủy xã Phú Hội 2012.jpg", title: "Đồng chí Vũ Công Tiến phát biểu tại buổi làm việc với Đảng ủy xã Phú Hội 2012" },
  //   { id: 1, previewImageSrc: "assets/template/images/VuCongTien/HN tổng kết năm 2011.jpg", thumbnailImageSrc: "assets/template/images/VuCongTien/HN tổng kết năm 2011.jpg", title: "HN tổng kết năm 201119" },
  // ];
  // images9: any = [
  //   { id: 1, previewImageSrc: "assets/template/images/HoThiNga/1.PNG", thumbnailImageSrc: "assets/template/images/HoThiNga/1.PNG", title: "đc Hồ Thị Nga - UVBTV, Chủ nhiệm UBKTTU khoá Ĩ nhận Cờ đơn vị dẫn đầu phong trào thi đua 5 năm (2005 - 2010)" },
  //   { id: 1, previewImageSrc: "assets/template/images/HoThiNga/7.Tỉnh ủy tặng Cờ thi đua cho Ủy ban Kiểm tra Tỉnh ủy nhiệm kỳ  2005-2010.jpg", thumbnailImageSrc: "assets/template/images/HoThiNga/7.Tỉnh ủy tặng Cờ thi đua cho Ủy ban Kiểm tra Tỉnh ủy nhiệm kỳ  2005-2010.jpg", title: "7.Tỉnh ủy tặng Cờ thi đua cho Ủy ban Kiểm tra Tỉnh ủy nhiệm kỳ  2005-2010" },
  //   { id: 1, previewImageSrc: "assets/template/images/HoThiNga/Hoạt động đền ơn đáp nghĩa của của đc Hồ Thị Nga - nguyên Chủ nhiệm.jpg", thumbnailImageSrc: "assets/template/images/HoThiNga/Hoạt động đền ơn đáp nghĩa của của đc Hồ Thị Nga - nguyên Chủ nhiệm.jpg", title: "Hoạt động đền ơn đáp nghĩa của của đc Hồ Thị Nga - nguyên Chủ nhiệm" },
  //   { id: 1, previewImageSrc: "assets/template/images/HoThiNga/img007.jpg", thumbnailImageSrc: "assets/template/images/HoThiNga/img007.jpg", title: "img007" },
  // ];
  // images10: any = [
  //   { id: 1, previewImageSrc: "assets/template/images/DaoNgocCan/2014.jpg", thumbnailImageSrc: "assets/template/images/DaoNgocCan/2014.jpg", title: "2014" },

  // ];
  // images11: any = [
  //   { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/Chủ trì kỳ họp lần thứ 20 nhiệm kỳ X.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/Chủ trì kỳ họp lần thứ 20 nhiệm kỳ X.jpg", title: "Chủ trì kỳ họp lần thứ 20 nhiệm kỳ X" },
  //   { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/dc Duong Cong Hiep phát biểu tại Đại hội Chi bộ cơ quan.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/dc Duong Cong Hiep phát biểu tại Đại hội Chi bộ cơ quan.jpg", title: "dc Duong Cong Hiep phát biểu tại Đại hội Chi bộ cơ quan" },
  //   { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/Khen thưởng con em.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/Khen thưởng con em.jpg", title: "Khen thưởng con em" },
  //   { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/Khen thưởng con em3.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/Khen thưởng con em3.jpg", title: "Khen thưởng con em3" },
  //   { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/ký kết quy chế phối hợp.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/ký kết quy chế phối hợp.jpg", title: "ký kết quy chế phối hợp" },
  //   { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/Trao giấy khen tập thể xuất sắc năm 2018.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/Trao giấy khen tập thể xuất sắc năm 2018.jpg", title: "Trao giấy khen tập thể xuất sắc năm 2018" },
  //   { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/1.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/1.jpg", title: "1" },
  //   { id: 1, previewImageSrc: "assets/template/images/DuongCongHiep/2.jpg", thumbnailImageSrc: "assets/template/images/DuongCongHiep/2.jpg", title: "2" },
  // ];
  displayCustom: boolean = false;

  activeIndex: number = 0;
  contentPage: any = {};

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    private agmGeocoder: AgmGeocoder,
    private location: Location,
    public spinner: NgxSpinnerService,
    public http: HttpService,
    public baseService: BaseService,
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    $('#menu-mobile').css({ 'width': '0px' });
    $('#main').css({ 'margin-left': '0px' });
    $('#menu-mobile').removeClass("show");

    this.route.queryParams.subscribe((param: any) => {
      this.huyenuy = param.huyenuy;

      this.http.post(
        "newguest/detail",
        {
          Alias: param.huyenuy,
        },
        (result: ResultModel) => {
          if (result.Code == ResultCode.Success) {
            // result.Result.forEach((item: any) => {
            //   item.ImageUrl = JSON.parse(item.ImageUrl)
            // });

            this.contentPage = result.Result;
            console.log(result.Result)
          }

          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );

    })
    this.route.queryParams.subscribe((person: any) => {
      this.person = person.person;
    })

    setTimeout(() => {
      this.spinner.hide()
    }, 500);


    //console.log(this.person)
  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  ngOnDestroy(): void {
  }

  backPage() {
    this.location.back();
  }

  showPerson() {

  }
}
