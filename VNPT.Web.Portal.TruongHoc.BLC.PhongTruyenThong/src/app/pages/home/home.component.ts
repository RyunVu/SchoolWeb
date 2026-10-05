import { Component, OnInit } from '@angular/core';
import { ResultCode, ResultModel } from 'src/app/models';
import { BaseService, HttpService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  hkdlv: any = {};
  taxBusinessData: any[] = [];
  hkdnlv: any = {};


  tinhTrangNhom: any = null;
  tinhTrang: any = null;
  isAllNhom: any = null;
  isAll: any = null;
  constructor(
    private httpService: HttpService,
    private baseService: BaseService) { }

  ngOnInit(): void {
    //this.loadData();
   // this.loadDataNhom();
  }
  // alLvChangeNhom(event: any){
  //   this.isAllNhom = event;
  //   this.loadDataNhom();
  // }
  // tinhTrangChangeNhom(event: any){
  //   this.tinhTrangNhom = event;
  //   this.loadDataNhom();
  // }
  // alLvChange(event: any){
  //   this.isAll = event;
  //   this.loadData();
  // }
  // tinhTrangChange(event: any){
  //   this.tinhTrang = event;
  //   this.loadData();
  // }
  // loadDataNhom(): void {
  //   const data = {
  //     "TrangThai": this.tinhTrangNhom,//null: tất cả, 1: đang hoạt động, 2: tạm ngưng, 3: ngừng hoạt động
  //     "IsAllLinhVuc": this.isAllNhom
  //   }
  //   this.httpService.post("/HkdChart/NhomLinhVuc", data, (result: ResultModel) => {
  //     if (result.Code == ResultCode.Success) {
  //       this.hkdnlv = {
  //         labels: result.Result.Labels,
  //         datasets: [
  //           {
  //             label: 'Hộ kinh doanh theo nhóm',
  //             data: result.Result.Data,
  //             backgroundColor: result.Result.Colors
  //           }
  //         ],
  //         borderColor: "#fff"
  //       };
  //     }
  //   },
  //     () => { });
  // }

  // loadData(): void {

  //   const data = {
  //     "TrangThai": this.tinhTrang,//null: tất cả, 1: đang hoạt động, 2: tạm ngưng, 3: ngừng hoạt động
  //     "IsAllLinhVuc": this.isAll
  //   }
  //   this.httpService.post("/HkdChart/List", data, (result: ResultModel) => {
  //     if (result.Code == ResultCode.Success) {
  //       this.hkdlv = {
  //         labels: result.Result.Labels,
  //         datasets: [
  //           {
  //             label: 'Hộ kinh doanh theo lĩnh vực',
  //             data: result.Result.Data,
  //             backgroundColor: result.Result.Colors
  //           }
  //         ],
  //         borderColor: "#fff"
  //       };
  //     }
  //   },
  //     () => { });
  // }


}
