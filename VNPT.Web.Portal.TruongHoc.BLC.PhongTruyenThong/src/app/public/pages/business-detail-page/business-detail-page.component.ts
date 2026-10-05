import { AgmGeocoder } from '@agm/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import {
  calculateBusinessStatusBadge,
  gmDefaultStyles,
  gmDarkStyles,
  populateBusinessFullAddress,
  SearchEntity,
} from 'src/app/shared';
import { defaultLocation } from 'src/app/shared/constants';

import { HomePageService } from '../../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'business-detail-page',
  templateUrl: './business-detail-page.component.html',
  styleUrls: ['./business-detail-page.component.scss'],
})
export class BusinessDetailPageComponent implements OnInit, OnDestroy {
  loading = true;
  businessDetail: any = null;
  routeSub: Subscription | undefined;
  id: string | undefined;
  mapTypeId: any = 'roadmap';
  mapOptions: any = {
    lat: defaultLocation.lat,
    lng: defaultLocation.lng,
    markers: [],
    styles: gmDarkStyles,
    iconHome: {
      url: './assets/img/store.png',
      scaledSize: {
        width: 30,
        height: 30,
      },
    },
    zoom: 15,
  };
  populateBusinessFullAddress = populateBusinessFullAddress;
  calculateBusinessStatusBadge = calculateBusinessStatusBadge;
  origin: any;
  destination: any;
  openMarker = true;

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private router: Router,
    private route: ActivatedRoute,
    private agmGeocoder: AgmGeocoder
  ) {}
  public changeMapType(){
    if(this.mapTypeId=="roadmap") this.mapTypeId ='satellite';
    else this.mapTypeId ='roadmap';

  }
  ngOnInit(): void {
    this.loading = true;
    this.routeSub = this.route.params.subscribe(async (params) => {
      this.id = params.id;
      if (this.id) {
        this.loadBusinessDetail(this.id);
      }
    });
  }

  back(): void {
    window.history.back();
  }

  direct(): void {
    this.openMarker = false;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      },
      (error) => {
        this.origin = {
          lat: defaultLocation.lat,
          lng: defaultLocation.lng,
        };
      }
    );
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: no-unused-expression
    this.routeSub && this.routeSub.unsubscribe();
  }

  private async loadBusinessDetail(id: string): Promise<void> {
    try {
      this.loading = true;

      const result = await this.hpService.findBusinessNguoiDung(id);

      this.businessDetail = result;

      if (!this.businessDetail) {
        this.router.navigate(['/pageNotFound']);
      }

      this.focusMap(this.businessDetail);
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

  private async focusMap(entity: any): Promise<void> {
    // Focus map to the current business location
    // const location = (entity.ToaDo || '').split(',');
    const lot = await this.getLocation(entity);

    this.mapOptions.lat = lot.lat;
    this.mapOptions.lng = lot.lng;
    this.mapOptions.markers.push({
      entity,
      lat: lot.lat,
      lng: lot.lng,
      iconHome: entity.ImageUrl
    });
    this.destination = { lat: lot.lat, lng: lot.lng };
  }

  private getLocation(entity: any): Promise<any> {
    if (entity.ToaDo) {
      const points = entity.ToaDo.split(',');

      return Promise.resolve({
        lat: points[0] ? parseFloat(points[0]) : defaultLocation.lat,
        lng: points[1] ? parseFloat(points[1]) : defaultLocation.lng,
      });
    }

    // tslint:disable-next-line: one-variable-per-declaration
    return new Promise((resolve) => {
      this.agmGeocoder
        .geocode({
          address: populateBusinessFullAddress(entity),
        })
        .subscribe(
          (results: any) => {
            const lat =
              get(results, '0.geometry.location.lat') &&
              get(results, '0.geometry.location.lat')();
            const lng =
              get(results, '0.geometry.location.lng') &&
              get(results, '0.geometry.location.lng')();

            return resolve({ lat, lng });
          },
          (err: any) => {
            return resolve({ lat: 0, lng: 0 });
          }
        );
    });
  }
}
