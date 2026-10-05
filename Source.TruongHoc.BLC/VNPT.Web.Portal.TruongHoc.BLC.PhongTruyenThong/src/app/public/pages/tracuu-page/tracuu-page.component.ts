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

@Component({
  selector: 'app-tracuu-page',
  templateUrl: './tracuu-page.component.html',
  styleUrls: ['./tracuu-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TraCuuPageComponent implements OnInit, OnDestroy {


  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    private agmGeocoder: AgmGeocoder
  ) { }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
  }

}
