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
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  standalone: false,
  selector: 'app-gioithieu-page',
  templateUrl: './gioithieu-page.component.html',
  styleUrls: ['./gioithieu-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GioiThieuPageComponent implements OnInit, OnDestroy {

  type: any = null;
  subtitle = "";
  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    public dialogService: DialogService,

    private router: Router,
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((param: any) => {
      this.type = param.type;
      if (this.type == 1) {
        this.subtitle = "Ngày thành lập"
      } else if (this.type == 2) {
        this.subtitle = "Trưởng ban, Chủ nhiệm Ủy ban Kiểm tra Tỉnh ủy qua các thời kỳ"
      } else if (this.type == 3) {
        this.subtitle = "Ủy ban Kiểm tra Tỉnh ủy qua các thời kỳ"
      } else if (this.type == 4) {
        this.subtitle = "Ủy ban Kiểm tra Huyện ủy, Thành ủy và tương đương"
      } else if (this.type == 10) {
        this.subtitle = "giới thiệu"
      }
    })
  }


  ngOnDestroy(): void {
  }

  nhiemKyOpen() {
    this.router.navigate(['/public/gioithieu'], { queryParams: { type: 5 } });
  }

  showPerson() {
    this.router.navigate(['/public/chitiet'], { queryParams: { type: 0 } });
  }
}
