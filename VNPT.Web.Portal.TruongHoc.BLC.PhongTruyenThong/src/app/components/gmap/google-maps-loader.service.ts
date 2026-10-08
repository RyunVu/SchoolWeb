import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Nạp Google Maps JavaScript API một lần cho toàn ứng dụng.
 * (@agm/core trước đây tự nạp script; @angular/google-maps yêu cầu tự nạp.)
 */
@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private loading?: Promise<void>;

  load(): Promise<void> {
    if (typeof google !== 'undefined' && google.maps) {
      return Promise.resolve();
    }
    if (!this.loading) {
      this.loading = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (err) => {
          this.loading = undefined;
          reject(err);
        };
        document.head.appendChild(script);
      });
    }
    return this.loading;
  }

  /** Thay cho AgmGeocoder.geocode(): trả về toạ độ của kết quả đầu tiên. */
  async geocode(address: string): Promise<{ lat: number; lng: number }> {
    await this.load();
    const { results } = await new google.maps.Geocoder().geocode({ address });
    const location = results?.[0]?.geometry?.location;
    return location ? { lat: location.lat(), lng: location.lng() } : { lat: 0, lng: 0 };
  }
}
