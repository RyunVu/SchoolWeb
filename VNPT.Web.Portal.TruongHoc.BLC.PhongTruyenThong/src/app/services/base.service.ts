import { environment } from '../../environments/environment';

export class BaseService {

  get unitCode(): string {
    return environment.unitCode;
  }

  get apiUrl(): string {
    // return "https://localhost:44370/";
   // return "https://chicucthue.dalat.vn/hub/";
    return environment.apiUrl;
  }

  get mediaUrl(): string {
    return environment.mediaUrl;
    //return "https://localhost:44381/";
    // return "/Hub/";
  }

  get serverUrlImobile(): string {
    //return "https://chicucthue.dalat.vn/hub/";
    return environment.apiUrl;
    // return "/Hub/";
  }

  get serverUrlThue(): string {
    return this.apiUrl;
    // return "/Hub/";
  }

  public static setLogin(data: any) {

    localStorage.setItem('MulRole', data.MulRole);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('fullName', data.fullName);
  }

  get MulRole(): any {
    return localStorage.getItem('MulRole') != 'null'
      ? localStorage.getItem('MulRole')
      : null;
  }

  get LocationProvinceId(): any {
    return localStorage.getItem('LocationProvinceId') != 'null'
      ? localStorage.getItem('LocationProvinceId')
      : null;
  }

  get LocationDistrictId(): any {
    return localStorage.getItem('LocationDistrictId') != 'null'
      ? localStorage.getItem('LocationDistrictId')
      : null;
  }

  get LocationWardId(): any {
    return localStorage.getItem('LocationWardId') != 'null'
      ? localStorage.getItem('LocationWardId')
      : null;
  }

  get MaDoanhNghiep(): any {
    return localStorage.getItem('MaDoanhNghiep') != 'null'
      ? localStorage.getItem('MaDoanhNghiep')
      : null;
  }

  get MaTramXang(): any {
    return localStorage.getItem('MaTramXang') != 'null'
      ? localStorage.getItem('MaTramXang')
      : null;
  }

  get UserId(): any {
    return localStorage.getItem("userId") != "null" ? localStorage.getItem("userId") : null;
  }

  get FulName(): any {
    return localStorage.getItem("fullName") != "null" ? localStorage.getItem("fullName") : null;
  }

  public static removeLogin() {
    localStorage.clear();
  }
  public static mangso = [
    'không',
    'một',
    'hai',
    'ba',
    'bốn',
    'năm',
    'sáu',
    'bảy',
    'tám',
    'chín',
  ];
  public static dochangchuc(so: any, daydu: any) {
    var chuoi = '';
    var chuc = Math.floor(so / 10);
    var donvi = so % 10;
    if (chuc > 1) {
      chuoi = ' ' + this.mangso[chuc] + ' mươi';
      if (donvi == 1) {
        chuoi += ' mốt';
      }
    } else if (chuc == 1) {
      chuoi = ' mười';
      if (donvi == 1) {
        chuoi += ' một';
      }
    } else if (daydu && donvi > 0) {
      chuoi = ' lẻ';
    }
    if (donvi == 5 && chuc > 1) {
      chuoi += ' lăm';
    } else if (donvi > 1 || (donvi == 1 && chuc == 0)) {
      chuoi += ' ' + this.mangso[donvi];
    }
    return chuoi;
  }

  public static docblock(so: any, daydu: any) {
    var chuoi = '';
    var tram = Math.floor(so / 100);
    so = so % 100;
    if (daydu || tram > 0) {
      chuoi = ' ' + this.mangso[tram] + ' trăm';
      chuoi += this.dochangchuc(so, true);
    } else {
      chuoi = this.dochangchuc(so, false);
    }
    return chuoi;
  }

  public static dochangtrieu(so: any, daydu: any) {
    var chuoi = '';
    var trieu = Math.floor(so / 1000000);
    so = so % 1000000;
    if (trieu > 0) {
      chuoi = this.docblock(trieu, daydu) + ' triệu';
      daydu = true;
    }
    var nghin = Math.floor(so / 1000);
    so = so % 1000;
    if (nghin > 0) {
      chuoi += this.docblock(nghin, daydu) + ' nghìn';
      daydu = true;
    }
    if (so > 0) {
      chuoi += this.docblock(so, daydu);
    }
    return chuoi;
  }

  public static docTienBangChu(so: any) {
    if (so == 0) return this.mangso[0];
    var chuoi = '',
      hauto = '';
    do {
      var ty = so % 1000000000;
      so = Math.floor(so / 1000000000);
      if (so > 0) {
        chuoi = this.dochangtrieu(ty, true) + hauto + chuoi;
      } else {
        chuoi = this.dochangtrieu(ty, false) + hauto + chuoi;
      }
      hauto = ' tỷ';
    } while (so > 0);
    chuoi = chuoi.substring(1, 2).toUpperCase() + chuoi.substring(2);
    return chuoi + ' đồng.';
  }
}
