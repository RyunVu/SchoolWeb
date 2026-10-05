import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ResultCode, ResultModel } from 'src/app/models';

import { HttpService } from 'src/app/services';

@Injectable()
export class TempalteListService {
    loading = false;

    constructor(
        public http: HttpService
    ) { }

    async loadData(data: any) {
        this.loading = true;
        return new Promise((resolve, reject) => {
            this.http.post(`Template/GetListTable`, data, (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    resolve(result);
                }
                this.loading = false;
                resolve({});
            }, () => {
                this.loading = false;
                reject({});
            });
        });
    }
}
