import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { CanhBaoModal } from './canhbao-modal/canhbao.modal';

@Component({
  standalone: false,
  selector: 'app-canhbao-page',
  templateUrl: './canhbao-page.component.html',
  styleUrls: ['./canhbao-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CanhBaoPageComponent implements OnInit, OnDestroy {


  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    public dialogService: DialogService,
  ) { }

  ngOnInit(): void {

  }

  guiCanhBao() {
    const ref = this.dialogService
      .open(CanhBaoModal, {
        data: {
          IsAdd: false,
        },
        header: 'Cảnh báo vệ sinh an toàn thực phẩm',
        width: '55%',
      })!
      .onClose.subscribe((data: any) => {
        if (data) {
          //this.loadData();
        }
      });
  }


  ngOnDestroy(): void {
  }

}
