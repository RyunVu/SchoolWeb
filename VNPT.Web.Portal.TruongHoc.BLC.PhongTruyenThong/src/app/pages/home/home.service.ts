import { Injectable } from '@angular/core';

import { HttpService } from 'src/app/services';

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private httpService: HttpService) {}

  getThueXDReportMonthly(year: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.get(
        `Dashboard/ThueXDReportMonthly?year=${year}`,
        (res: any) => {
          resolve(res.Result);
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }

  getThueHKDReportMonthly(year: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.get(
        `Dashboard/ThueHKDReportMonthly?year=${year}`,
        (res: any) => {
          resolve(res.Result);
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }
}
