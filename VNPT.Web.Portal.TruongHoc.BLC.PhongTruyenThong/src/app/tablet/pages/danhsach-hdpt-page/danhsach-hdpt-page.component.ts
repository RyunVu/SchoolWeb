import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'lodash';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BaseService, HttpService } from 'src/app/services';
import { ResultCode, ResultModel } from 'src/app/models';

import {
  gmDefaultStyles,
  gmDarkStyles,
  populateBusinessFullAddress,
  SearchEntity,
} from 'src/app/shared';
import { defaultLocation } from 'src/app/shared/constants';

import { HomePageService } from '../../services';
import { DialogService } from 'primeng/dynamicdialog';
declare var $: any;
import { Location } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-danhsach-hdpt-page',
  templateUrl: './danhsach-hdpt-page.component.html',
  styleUrls: ['./danhsach-hdpt-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DanhSachHDPTPageComponent implements OnInit, OnDestroy {

  type: any = null;
  code: any = null;
  subtitle = "";
  lstBV: any[] = [];

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService,
    private route: ActivatedRoute,
    public dialogService: DialogService,
    private location: Location,
    private router: Router,
    public http: HttpService, 
    private baseService: BaseService

  ) { }

  ngOnInit(): void {

    $('#menu-mobile').css({ 'width': '0px' });
    $('#main').css({ 'margin-left': '0px' });
    $('#menu-mobile').removeClass("show");

    this.route.queryParams.subscribe((hoatdong: any) => {
      this.code = hoatdong.hd;
      this.subtitle = hoatdong.subtitle;     
    })

    this.loadDsBaiViet();
  }

  ngOnDestroy(): void {
  }

  loadDsBaiViet(){
    this.http.post(
      'NewGuest/GetList',
      {
        Code: this.code,
        PageSize: 10000,
        PageIndex: 1
      },
      (result: ResultModel) => {
          if (result.Code == ResultCode.Success) {
              this.lstBV = result.Result;   
              this.lstBV.forEach((element: any) => {
                element.ImageUrl = this.baseService.mediaUrl + element.ImageUrl;
            });           
          }
      },
      () => { }
    );
  }

  backPage() {
    this.location.back();
  }

  clickChTietBV(code: string, id: any, alias: string){
    this.router.navigate(['/tablet/chitiet-hdpt'], { queryParams: { code: code, id: id, alias: alias } });
  }
}
