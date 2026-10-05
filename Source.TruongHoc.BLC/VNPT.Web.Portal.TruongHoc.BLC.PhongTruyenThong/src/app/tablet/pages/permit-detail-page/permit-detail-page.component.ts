import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import {
  calculateConstructionStatusBadge,
  calculatePermitFeeStatusBadge,
  gmDefaultStyles,
  populatePermitFullAddress,
} from 'src/app/shared';
import { defaultLocation } from 'src/app/shared/constants';
import { PermitPageService } from '../../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'permit-detail-page',
  templateUrl: './permit-detail-page.component.html',
  styleUrls: ['./permit-detail-page.component.scss'],
})
export class PermitDetailPageComponent implements OnInit, OnDestroy {
  loading = true;
  permitDetail: any = null;
  routeSub: Subscription | undefined;
  id: string | undefined;
  mapOptions: any = {
    lat: defaultLocation.lat,
    lng: defaultLocation.lng,
    markers: [],
    styles: gmDefaultStyles,
    iconHome: {
      url: './assets/img/home.png',
      scaledSize: {
        width: 30,
        height: 30,
      },
    },
    zoom: 14,
  };
  populatePermitFullAddress = populatePermitFullAddress;
  calculateConstructionStatusBadge = calculateConstructionStatusBadge;
  calculatePermitFeeStatusBadge = calculatePermitFeeStatusBadge;

  constructor(
    private messageService: MessageService,
    private permitService: PermitPageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.routeSub = this.route.params.subscribe(async (params) => {
      this.id = params.id;
      if (this.id) {
        this.loadPermitDetail(this.id);
      }
    });
  }

  back(): void {
    window.history.back();
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: no-unused-expression
    this.routeSub && this.routeSub.unsubscribe();
  }

  private async loadPermitDetail(id: string): Promise<void> {
    try {
      this.loading = true;

      const result = await this.permitService.findPermit(id);

      this.permitDetail = result;

      if (!this.permitDetail) {
        this.router.navigate(['/pageNotFound']);
      }

      this.focusMap(this.permitDetail);
      this.loading = false;
    } catch (error) {
      const errorMessage = 'Có lỗi xảy ra khi tìm kiếm dữ liệu!';

      this.loading = false;
      this.messageService.add({
        severity: 'error',
        detail: errorMessage,
      });
    }
  }

  private focusMap(entity: any): void {
    // Focus map to the current business location
    const location = (entity.ToaDo || '').split(',');

    this.mapOptions.zoom = 17;
    this.mapOptions.lat = parseFloat(location[0]);
    this.mapOptions.lng = parseFloat(location[1]);
    this.mapOptions.markers.push({
      entity,
      lat: parseFloat(location[0]),
      lng: parseFloat(location[1]),
    });
  }
}
