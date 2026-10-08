import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { MapDirectionsService, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { GoogleMapsLoaderService } from './google-maps-loader.service';

export interface GmapMarker {
  lat: number;
  lng: number;
  icon?: any;
  iconHome?: any;
  entity?: any;
}

/**
 * Thay thế <agm-map>/<agm-marker>/<agm-info-window>/<agm-direction> (@agm/core không hỗ trợ Angular >= 13)
 * bằng @angular/google-maps, giữ nguyên cách dùng ở các trang.
 *
 * <app-gmap [lat] [lng] [zoom] [styles] [mapTypeId] [markers] [icon] [infoOpen] [origin] [destination] [panel]>
 *   <ng-template #info let-marker> ...nội dung info window... </ng-template>
 * </app-gmap>
 */
@Component({
  standalone: false,
  selector: 'app-gmap',
  template: `
    @if (apiLoaded) {
      <google-map width="100%" height="100%" [center]="center" [zoom]="zoom" [mapTypeId]="$any(mapTypeId)" [options]="options">
        @if (!directions) {
          @for (m of markers || []; track $index) {
            <map-marker #marker="mapMarker" [position]="{ lat: m.lat, lng: m.lng }" [icon]="$any(toIcon(m.icon ?? m.iconHome ?? icon))"
              (mapClick)="openInfo(marker, m)" />
          }
          <map-info-window>
            @if (activeMarker && infoTemplate) {
              <ng-container *ngTemplateOutlet="infoTemplate; context: { $implicit: activeMarker }" />
            }
          </map-info-window>
        } @else {
          <map-directions-renderer [directions]="directions" [options]="{ panel: panel }" />
        }
      </google-map>
    }
  `,
  styles: [':host { display: block; }'],
})
export class GmapComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() lat = 0;
  @Input() lng = 0;
  @Input() zoom = 15;
  @Input() styles: google.maps.MapTypeStyle[] | null = null;
  @Input() mapTypeId: string = 'roadmap';
  @Input() markers: GmapMarker[] = [];
  /** Icon mặc định của marker (string hoặc { url, scaledSize: { width, height } } như AGM). */
  @Input() icon: any;
  /** Tương đương [isOpen] của agm-info-window: boolean hoặc hàm điều kiện theo từng marker. */
  @Input() infoOpen: boolean | ((marker: GmapMarker) => boolean) = false;
  /** Chỉ đường (thay agm-direction). */
  @Input() origin: google.maps.LatLngLiteral | null = null;
  @Input() destination: google.maps.LatLngLiteral | null = null;
  @Input() panel: HTMLElement | null = null;

  @ContentChild('info') infoTemplate: TemplateRef<any> | null = null;
  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;
  @ViewChildren('marker') markerRefs?: QueryList<MapMarker>;

  apiLoaded = false;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  options: google.maps.MapOptions = {};
  directions: google.maps.DirectionsResult | null = null;
  activeMarker: GmapMarker | null = null;
  private autoOpened: GmapMarker | null = null;

  constructor(
    private loader: GoogleMapsLoaderService,
    private directionsService: MapDirectionsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loader.load().then(() => {
      this.apiLoaded = true;
      this.updateDirections();
      this.cdr.markForCheck();
    }).catch(() => {
      this.apiLoaded = false;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lat'] || changes['lng']) {
      this.center = { lat: Number(this.lat) || 0, lng: Number(this.lng) || 0 };
    }
    if (changes['styles']) {
      // AGM mặc định: ẩn mapTypeControl & fullscreenControl
      this.options = { styles: this.styles ?? undefined, mapTypeControl: false, fullscreenControl: false };
    }
    if (changes['origin'] || changes['destination']) {
      this.updateDirections();
    }
  }

  ngAfterViewChecked(): void {
    if (!this.infoWindow || !this.markerRefs || this.directions) {
      return;
    }
    const markers = this.markers || [];
    const target = markers.find((m) =>
      typeof this.infoOpen === 'function' ? this.infoOpen(m) : !!this.infoOpen
    ) ?? null;
    if (target === this.autoOpened) {
      return;
    }
    this.autoOpened = target;
    if (!target) {
      this.infoWindow.close();
      return;
    }
    const ref = this.markerRefs.get(markers.indexOf(target));
    if (ref) {
      // Mở ở tick sau để tránh ExpressionChangedAfterItHasBeenChecked
      setTimeout(() => this.openInfo(ref, target));
    }
  }

  openInfo(ref: MapMarker, marker: GmapMarker): void {
    this.activeMarker = marker;
    this.cdr.detectChanges();
    this.infoWindow?.open(ref);
  }

  toIcon(icon: any): string | google.maps.Icon | undefined {
    if (!icon || typeof icon === 'string' || !this.apiLoaded) {
      return icon || undefined;
    }
    const size = icon.scaledSize;
    return {
      ...icon,
      scaledSize: size && !(size instanceof google.maps.Size) ? new google.maps.Size(size.width, size.height) : size,
    };
  }

  private updateDirections(): void {
    if (!this.apiLoaded || !this.origin || !this.destination) {
      this.directions = null;
      return;
    }
    this.directionsService
      .route({ origin: this.origin, destination: this.destination, travelMode: google.maps.TravelMode.DRIVING })
      .subscribe((response) => {
        this.directions = response.result ?? null;
        this.cdr.markForCheck();
      });
  }
}
