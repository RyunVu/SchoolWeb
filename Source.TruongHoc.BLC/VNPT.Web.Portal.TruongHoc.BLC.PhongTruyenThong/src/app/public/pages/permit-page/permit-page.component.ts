import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { gmDefaultStyles, gmDarkStyles, SearchEntity } from 'src/app/shared';
import { defaultLocation } from 'src/app/shared/constants';

import { PermitPageService } from '../../services';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'permit-page',
  templateUrl: './permit-page.component.html',
  styleUrls: ['./permit-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PermitPageComponent implements OnInit, OnDestroy {
  loading = true;
  permitList: any = null;
  mapOptions: any = {
    lat: defaultLocation.lat,
    lng: defaultLocation.lng,
    markers: [],
    styles: gmDarkStyles,//gmDefaultStyles,
    iconHome: {
      url: './assets/img/home.png',
      scaledSize: {
        width: 30,
        height: 30,
      },
    },
    zoom: 14,
  };
  mapTypeId: any = 'roadmap';
  initSearch = false;
  viewedPermit: any;
  params: any;
  routeSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private permitPageService: PermitPageService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(async (params) => {
      if (params.id) {
        this.initSearch = true;
        this.params = params;
        await this.search({ id: params.id });

        if (this.permitList && this.permitList.length) {
          this.viewPermit(this.permitList[0]);
        }
      }
    });
  }

  searchFormChange(searchFormParams: any): void {
    if (searchFormParams.ward && !this.initSearch && !this.params) {
      this.initSearch = true;
      this.search(searchFormParams);
    }
  }

  viewPermit(entity: any): void {
    // Focus map to the current business location
    const location = (entity.ToaDo || '').split(',');

    this.viewedPermit = entity;
    this.mapOptions.zoom = 17;
    this.mapOptions.lat = parseFloat(location[0]);
    this.mapOptions.lng = parseFloat(location[1]);
  }

  async search(criteria: SearchEntity): Promise<void> {
    try {
      this.loading = true;

      const result = await this.permitPageService.searchPermitList(criteria);

      this.permitList = result.list || [];
      this.populateMarkers();

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

  ngOnDestroy(): void {}

  private populateMarkers(): void {
    this.mapOptions.markers = [];
    this.mapOptions.markers = this.permitList.map((entity: any) => {
      const location = (entity.ToaDo || '').split(',');

      return {
        lat: parseFloat(location[0]),
        lng: parseFloat(location[1]),
        entity,
      };
    });
  }
  public changeMapType(){
    if(this.mapTypeId=="roadmap") this.mapTypeId ='satellite';
    else this.mapTypeId ='roadmap';

  }
}
