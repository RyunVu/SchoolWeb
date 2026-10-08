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
    { id: 1, img: "assets/template/images/profile/avatar.png", name: "MAI VĂN NGỌC" , birthday: "01/01/1922"},
    { id: 2, img: "assets/template/images/profile/chedang.png", name: "CHẾ ĐẶNG" , birthday: "10/10/1923" },
    { id: 3, img: "assets/template/images/profile/PHGian.png", name: "PHAN HỮU GIẢN" , birthday: "15/8/1941" },
    { id: 4, img: "assets/template/images/profile/phac.png", name: "TRẦN ĐÌNH PHÁC" , birthday: "26/01/1942"},
    { id: 1, img: "assets/template/images/profile/1.png", name: "VŨ CÔNG TIẾN" , birthday: "02/9/1956" },
    { id: 1, img: "assets/template/images/profile/1.png", name: "PHẠM VĂN BỔN" , birthday: "11/1/1948" },
    { id: 1, img: "assets/template/images/profile/1.png", name: "HỒ THỊ NGA" , birthday: "20/01/1959"},
    { id: 1, img: "assets/template/images/profile/1.png", name: "DƯƠNG CÔNG HIỆP" , birthday: "02/9/1956" },
    { id: 1, img: "assets/template/images/profile/1.png", name: "ĐẶNG ĐỨC HIỆP" , birthday: "01/5/1972" },
  ];

  hoatdongs: any = [
    { id: 1, title: "Hoạt động Chi bộ Cơ quan UBKT Tỉnh ủy", img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/10daihoichibocoquanubkttukhoaxviinhiemky20152020_638314106704568984.jpg" },
    { id: 1, title: "Công đoàn cơ sở cơ quan", img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/18gapmatcanbonucoquannhanngaytruyenthongphunuvietnam2010_638314110363737341.jpg" },
    { id: 1, title: "Cơ quan UBKT Tỉnh ủy - Khối thi đua các cơ quan đảng tỉnh", img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/19doancanboubktlamdongdithamchientruongvanghiatranglietsidienbienphunam2009_638314111297931440.jpg" },
    { id: 1, title: "Hoạt động Chi Đoàn TNCSHCM Cơ quan", img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/12daihoichidoancoquanubkttinhuylanthuinhiemky20152017_638314201309199512.jpg" },
    { id: 1, title: "Hội Cựu chiến binh cơ quan", img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong//14lethanhlaphoicuuchienbinhcoquanuybankiemtratinhuy_638314201412456900.jpg" },
    { id: 1, title: "Ban liên lạc", img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/15leramatbanlienlaccuucanbocongchuccoquanubkttuxuanbinhthan2016_638314201517424952.jpg" },
    // { id: 1, img: "assets/template/images/nn4.jpg" },
    // { id: 1, img: "assets/template/images/nn5.jpg" },
    // { id: 1, img: "assets/template/images/nn6.jpg" },
    // { id: 1, img: "assets/template/images/nn7.jpg" },
    // { id: 1, img: "assets/template/images/nn3.jpg" },
    // { id: 1, img: "assets/template/images/nn3.jpg" },
    // { id: 1, img: "assets/template/images/nn3.jpg" },
  ];
  Videos: any = [
    { id: 1, title: "Hội nghị trao đổi kinh nghiệm hoạt động HĐND giữa Lâm Đồng và thành phố Đà Nẵng", link: "https://youtu.be/C4ZFBzH2w4A?si=FvAMPGlaY-vh_lPZ",  img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/1_638314229393596317.png"},
    { id: 1, title: "Lâm Đồng hưởng ứng chiến dịch làm cho thế giới sạch hơn năm 2023", link: "https://youtu.be/ydJTqfLIp9c?si=6qxvOchkems_482J",  img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/22_638314242254598459.png"},
    { id: 1, title: "Náo nức đêm hội trăng rằm 'về miền cổ tích'", link: "https://youtu.be/FYkyQL40uok?si=M1NEE2fFb3uQLS5K",  img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/23_638314243653368698.png"},
  ];
  Images: any = [
    { id: 1, title: "Huân chương lao động hạng nhất",   img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/20232ubkttinhuyhuanchuonglaodonghangnhat_638314233523761854.jpg"},
    { id: 1, title: "Hội thi hát Karaoke",   img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/img_0996_638314234086206756.jpg"},
    { id: 1, title: "Hội thao Khối thi đua công đoàn Khối VI",   img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/6thamgiahoithaokhoithiduacongdoankhoivi_638314234807755691.jpg"},
    { id: 1, title: "Hội nghị cán bộ - công chức",   img: "https://edumedia.dalat.vn/Images/LDG/superadminolab/PhongTruyenThong/17hoinghicanbocongchucnam2016_638314235572324332.jpg"},
  ];
  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    private router: Router,
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

  openTieuSu(id:any) {
    this.router.navigate(['/public/chitiet'], { queryParams: { type: 0, id : id}  });
  }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
  }

}
