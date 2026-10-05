import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { HttpService } from 'src/app/services';
import { SearchEntity } from 'src/app/shared';

@Injectable()
export class HomePageService {
  constructor(private httpService: HttpService) {}

  searchMockBusinessList(): Promise<any> {
    const businessList = require('../mocks/business-list.json');

    return of(businessList).pipe(delay(2000)).toPromise();
  }

  searchBusinessList(searchEntity: SearchEntity): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanh/ListNguoiDung',
        {
          PageSize: searchEntity.pageSize || 10,
          PageIndex: searchEntity.pageIndex || 1,
          LinhVucId: searchEntity.businessType || '',
          LocationDistrictId: searchEntity.city || '',
          LocationWardId: searchEntity.ward || '',
          LocationStreetId: searchEntity.streetAddr || '',
          Keyword: searchEntity.keyword || '',
          HKDStatus: searchEntity.status || '',
          LoaiHinhNopThue: searchEntity.loaiHinh,
          Id: null,
        },
        (res: any) => {
          resolve({
            list: res.Result,
            total: res.TotalRow,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }

  findBusinessNguoiDung(id: string): Promise<any> {
    // return new Promise((resolve, reject) => {
    //   this.httpService.post(
    //     'HoKinhDoanh/SearchByIdNguoiDung',
    //     {
    //       Id: id,
    //     },
    //     (res: any) => {
    //       return resolve((res.Result || null));
    //     },
    //     (error: any) => {
    //       // throw error;
    //       reject(error);
    //     }
    //   );
    // });
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanh/ListNguoiDung',
        {
          Id: id,
        },
        (res: any) => {
          return resolve((res.Result || null)[0]);
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }

  findBusiness(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanh/List',
        {
          Id: id,
        },
        (res: any) => {
          return resolve((res.Result || [])[0]);
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }

  LoadListPlots(WardId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HopDongThuThue/ListPlots',
        {
          WardId: WardId,
        },
        (res: any) => {
          return resolve({
            list: res.Result,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }
  LoadListWard(CityId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'Location/GetWards',
        {
          ParentId: CityId,
        },
        (res: any) => {
          return resolve({
            list: res.Result,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }
  LoadListThuaDatBan(WardId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HopDongThuThue/ListThuaDat',
        {
          WardId: WardId,
        },
        (res: any) => {
          return resolve({
            list: res.Result,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }
  ConvertVN2000(xy: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HopDongThuThue/vn2000towgs84',
        {
          xy: xy,
        },
        (res: any) => {
          return resolve({
            list: res.Result,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }
  LoadCungDuongByWard(WardId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'CungDuong/CungDuongByWardId',
        {
          WardId: WardId,
        },
        (res: any) => {
          return resolve({
            list: res.Result,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }
  GetListLichSuThuThue(WardId: any, SoTo: any, SoThua: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HopDongThuThue/ListLichSuBanDat',
        {
          WardId: WardId,
          SoTo: SoTo,
          SoThua: SoThua,
        },
        (res: any) => {
          return resolve({
            list: res.Result,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }
  SaveLichSuThuaDat(LichSuThuaDat: any) {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HopDongThuThue/AddLichSuBanDat',
        LichSuThuaDat,
        (res: any) => {
          return resolve({
            Code: res.Code,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }
}
