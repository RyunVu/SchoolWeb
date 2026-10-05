import { Injectable } from '@angular/core';

import { HttpService } from 'src/app/services';
import { SearchEntity } from 'src/app/shared';

@Injectable()
export class PermitPageService {
  constructor(private httpService: HttpService) {}

  searchPermitList(searchEntity: SearchEntity): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'GiayPhep/List',
        {
          LocationDistrictId: searchEntity.city || '',
          LocationWardId: searchEntity.ward || '',
          LocationStreetId: searchEntity.streetAddr || '',
          Keyword: searchEntity.keyword || '',
          TrangThaiXay:
            searchEntity.constructionStatus === -1
              ? 0
              : searchEntity.constructionStatus || '',
          TrangThaiNopThue:
            searchEntity.feeStatus === -1 ? 0 : searchEntity.feeStatus || '',
          Id: searchEntity.id || '',
          PageSize: searchEntity.pageSize || 1000,
          PageIndex: searchEntity.pageIndex,
        },
        (res: any) => {
          resolve({
            total: res.TotalRow,
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

  findPermit(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'GiayPhep/List',
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
}
