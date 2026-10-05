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

import { HomePageService } from '../../services';
import { GalleriaModule } from 'primeng/galleria';
@Component({
  selector: 'app-chitiet-page',
  templateUrl: './chitiet-page.component.html',
  styleUrls: ['./chitiet-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChiTietPageComponent implements OnInit, OnDestroy {

  type: any = 0;
  id: any;
  subtitle = "Tiểu sử";
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

  displayCustom: boolean= false;

  activeIndex: number = 0;

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    private agmGeocoder: AgmGeocoder,
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((param: any) => {
      this.type = param.type;
      this.id = param.id;
      if (this.type == 1) {
        this.subtitle = "ỦY BAN KIỂM TRA TỈNH ỦY QUA CÁC THỜI KỲ "
      } else {
        this.type = 0;
      }
    })
  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  ngOnDestroy(): void {
  }

  showPerson() {

  }
}
