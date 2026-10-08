import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APP_VERSION } from 'src/environments/version';

export interface ApiVersionInfo {
  Version: string;
  AssemblyVersion?: string;
  FileVersion?: string;
  ProductVersion?: string;
  BuildDate?: string;
  BuildNumber?: string;
  Environment?: string;
  Name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  /** Thông tin phiên bản Web Angular từ file sinh tự động */
  public readonly appVersion = APP_VERSION;

  /** Quản lý phiên bản API Backend bằng BehaviorSubject */
  public apiVersion$ = new BehaviorSubject<ApiVersionInfo | null>(null);
  private loadingApiVersion = false;

  constructor(private http: HttpClient) {}

  /** Nạp thông tin phiên bản Backend API */
  public loadApiVersion(): void {
    if (this.apiVersion$.value || this.loadingApiVersion) return;
    this.loadingApiVersion = true;

    const baseApi = environment.apiUrl ? (environment.apiUrl.endsWith('/') ? environment.apiUrl : `${environment.apiUrl}/`) : '';
    this.http.get<any>(`${baseApi}api/System/Version`).subscribe({
      next: (res) => {
        this.loadingApiVersion = false;
        if (res && res.Code === 200 && res.Result) {
          this.apiVersion$.next(res.Result);
        }
      },
      error: () => {
        this.loadingApiVersion = false;
      }
    });
  }
}
