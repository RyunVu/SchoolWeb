import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ResultCode, ResultModel } from 'src/app/models';
import { HttpService } from 'src/app/services';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private httpService: HttpService) {}
  getNopThueReport(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('LocationDistrictId', params.LocationDistrictId || null)
        .append('LinhVucId', params.LinhVucId || null)
        .append('LoaiHinhNopThue', params.LoaiHinh);
      this.httpService.get(
        'report-bao-cao-nop-thue?' + httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  postNopThueReport(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanhAdmin/ReportPost',
        {
          LocationDistrictId: params.LocationDistrictId,
          LinhVucId: params.LinhVucId,
          LoaiHinhNopThue: params.LoaiHinh,
        },
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  getNopThueByWard(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('LocationDistrictId', params.LocationDistrictId || null)
        .append('LocationWardId', params.LocationWardId || null)
        .append('LinhVucId', params.LinhVucId || null)
        .append('LoaiHinhNopThue', params.LoaiHinh);

      this.httpService.get(
        'report-bao-cao-nop-thue-by-ward?' + httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  postNopThueByWard(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanhAdmin/ReportByWardPost',
        {
          LocationDistrictId: params.LocationDistrictId,
          LocationWardId: params.LocationWardId,
          LinhVucId: params.LinhVucId,
          LoaiHinhNopThue: params.LoaiHinh,
        },
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  getNopThueLoaiHinhReport(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('LocationDistrictId', params.LocationDistrictId || null)
        .append('LinhVucId', params.LinhVucId || null)
        .append('HKDStatus', params.HKDStatus || '');
      this.httpService.get(
        'report-bao-cao-nop-thue-theo-loai-hinh?' + httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  postNopThueLoaiHinhReport(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanhAdmin/ReportTheoLoaiHinhPost',
        {
          LocationDistrictId: params.LocationDistrictId,
          LinhVucId: params.LinhVucId,
          HKDStatus: params.HKDStatus,
        },
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  getNopThueLoaiHinhByWard(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('LocationDistrictId', params.LocationDistrictId || null)
        .append('LocationWardId', params.LocationWardId || null)
        .append('LinhVucId', params.LinhVucId || null)
        .append('HKDStatus', params.HKDStatus || '');

      this.httpService.get(
        'report-bao-cao-nop-thue-theo-loai-hinh-by-ward?' +
          httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  postNopThueLoaiHinhByWard(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanhAdmin/ReportTheoLoaiHinhByWardPost',
        {
          LocationDistrictId: params.LocationDistrictId,
          LocationWardId: params.LocationWardId,
          LinhVucId: params.LinhVucId,
          HKDStatus: params.HKDStatus,
        },
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  getNopThueGCNByWard(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('LocationDistrictId', params.LocationDistrictId || null)
        .append('LocationWardId', params.LocationWardId || null)
        .append('LinhVucId', params.LinhVucId || null)
        .append('LoaiHinhNopThue', params.LoaiHinh);

      this.httpService.get(
        'report-bao-cao-nop-thue-by-ward-gcn?' + httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  postNopThueGCNByWard(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanhAdmin/ReportGCNByWardPost',
        {
          LocationDistrictId: params.LocationDistrictId,
          LocationWardId: params.LocationWardId,
          LinhVucId: params.LinhVucId,
          LoaiHinhNopThue: params.LoaiHinh,
        },
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  getNopThueDetailsReport(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('LocationDistrictId', params.LocationDistrictId || null)
        .append('LocationWardId', params.LocationWardId || null)
        .append('LocationStreetId', params.LocationStreetId || null)
        .append('LinhVucId', params.LinhVucId || null)
        .append('HKDStatus', params.HKDStatus || '')
        .append('LoaiHinhNopThue', params.LoaiHinh);

      this.httpService.get(
        'report-bao-cao-nop-thue-details?' + httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  postNopThueDetailsReport(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanhAdmin/ReportDetailsPost',
        {
          LocationDistrictId: params.LocationDistrictId,
          LocationWardId: params.LocationWardId,
          LocationStreetId: params.LocationStreetId,
          LinhVucId: params.LinhVucId,
          HKDStatus: params.HKDStatus,
          LoaiHinhNopThue: params.LoaiHinh,
        },
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  getNopThueReportGCN(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('LocationDistrictId', params.LocationDistrictId || null)
        .append('LinhVucId', params.LinhVucId || null)
        .append('LoaiHinhNopThue', params.LoaiHinh);
      this.httpService.get(
        'report-bao-cao-nop-thue-gcn?' + httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  postNopThueReportGCN(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanhAdmin/ReportGCNPost',
        {
          LocationDistrictId: params.LocationDistrictId,
          LinhVucId: params.LinhVucId,
          LoaiHinhNopThue: params.LoaiHinh,
        },
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  postReportActionHKD(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanhAdmin/ReportActionHKD',
        {
          UnitId: params.UnitId,
          TuNgay: params.TuNgay,
          DenNgay: params.DenNgay,
        },
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }
  postReportActionGPXD(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'GiayPhepAdmin/ReportActionGPXD',
        {
          UnitId: params.UnitId,
          TuNgay: params.TuNgay,
          DenNgay: params.DenNgay,
        },
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }
  getNopThueDetailsReportGCN(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('LocationDistrictId', params.LocationDistrictId || null)
        .append('LocationWardId', params.LocationWardId || null)
        .append('LocationStreetId', params.LocationStreetId || null)
        .append('LinhVucId', params.LinhVucId || null)
        .append('HKDStatus', params.HKDStatus || '')
        .append('LoaiHinhNopThue', params.LoaiHinh);

      this.httpService.get(
        'report-bao-cao-nop-thue-details-gcn?' + httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  postNopThueDetailsReportGCN(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.post(
        'HoKinhDoanhAdmin/ReportDetailsGCNPost',
        {
          LocationDistrictId: params.LocationDistrictId,
          LocationWardId: params.LocationWardId,
          LocationStreetId: params.LocationStreetId,
          LinhVucId: params.LinhVucId,
          HKDStatus: params.HKDStatus,
          LoaiHinhNopThue: params.LoaiHinh,
        },
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
  getNopThueReportMST(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('DistrictId', params.DistrictId || null)
        .append('WardId', params.WardId || null)
        .append('TinhTrang', params.TinhTrang || '')
        .append('NganhNghe', params.NganhNghe || '')
        .append(
          'FromDate',
          params.FromDate ? params.FromDate.toISOString() : ''
        )
        .append('ToDate', params.ToDate ? params.ToDate.toISOString() : '');
      this.httpService.get(
        'report-bao-cao-nop-thue-chua-co-mst?' + httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }
  getNopThueDetailsReportMST(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('DistrictId', params.DistrictId || null)
        .append('WardId', params.WardId || null)
        .append('TinhTrang', params.TinhTrang || '')
        .append('NganhNghe', params.NganhNghe || '')
        .append(
          'FromDate',
          params.FromDate ? params.FromDate.toISOString() : ''
        )
        .append('ToDate', params.ToDate ? params.ToDate.toISOString() : '');
      this.httpService.get(
        'report-bao-cao-nop-thue-chua-co-mst-chi-tiet?' + httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }

  getQuanLyGPKTReport(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('DistrictId', params.DistrictId || null)
        .append('WardId', params.WardId || null)
        .append('TinhTrang', params.TinhTrang || '')
        .append('NganhNghe', params.NganhNghe || '')
        .append(
          'FromDate',
          params.FromDate ? params.FromDate.toISOString() : ''
        )
        .append('ToDate', params.ToDate ? params.ToDate.toISOString() : '');
      this.httpService.get(
        'report-bao-cao-quan-ly-gpkd?' + httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
          });
        },
        (error: any) => {
          // throw error;
          reject(error);
        }
      );
    });
  }

  getQuanLyGPKTChiTietReport(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpParams = new HttpParams()
        .append('DistrictId', params.DistrictId || null)
        .append('WardId', params.WardId || null)
        .append('LoaiBaoCao', params.LoaiBaoCao || '')
        //.append('NganhNghe', params.NganhNghe || '')
        .append(
          'FromDate',
          params.FromDate ? params.FromDate.toISOString() : ''
        )
        .append('ToDate', params.ToDate ? params.ToDate.toISOString() : '');
      this.httpService.get(
        'report-bao-cao-quan-ly-gpkd-chi-tiet?' + httpParams.toString(),
        (res: any) => {
          resolve({
            list: res.Result,
            name: res.Message,
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
