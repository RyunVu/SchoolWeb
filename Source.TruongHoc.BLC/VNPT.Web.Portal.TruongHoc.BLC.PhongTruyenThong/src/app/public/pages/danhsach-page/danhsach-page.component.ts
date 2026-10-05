import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-danhsach-page',
  templateUrl: './danhsach-page.component.html',
  styleUrls: ['./danhsach-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DanhSachPageComponent implements OnInit, OnDestroy {

  type: any = null;
  subtitle = "";

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    private agmGeocoder: AgmGeocoder,
    public dialogService: DialogService,

    private router: Router,

  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((param: any) => {
      this.type = param.type;
      if (this.type == 1) {
        this.subtitle = "giáo dục truyền thống"
      } else if (this.type == 2) {
        this.subtitle = "Các hoạt động phòng trào"
      } else if (this.type == 3) {
        this.subtitle = "Thành tích"
      }
    })

  }

  ngOnDestroy(): void {
  }

}
