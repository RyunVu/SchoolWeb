import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services';

import {
  calculateConstructionStatusBadge,
  calculatePermitFeeStatusBadge,
  populatePermitFullAddress,
} from 'src/app/shared';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'permit-left-panel',
  templateUrl: './permit-left-panel.component.html',
  styleUrls: ['./permit-left-panel.component.scss'],
})
export class PermitLeftPanelComponent implements OnInit {
  @Input() loading = false;
  @Input() items: any[] = [];

  @Output() viewPermit = new EventEmitter<any>();
  @Output() closeViewPermit = new EventEmitter<void>();

  // Utils functions
  calculatePermitFeeStatusBadge = calculatePermitFeeStatusBadge;
  calculateConstructionStatusBadge = calculateConstructionStatusBadge;
  populatePermitFullAddress = populatePermitFullAddress;
  permitDetail: any;
  isLogin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLogin = this.authService.isUserLoggedIn();
  }

  goToTaxUpdate(data: any) {
    this.router.navigate(['system/cap-phep'], {
      queryParams: { showTaxUpdate: true, id: data.Id },
    });
  }

  goToTaxCollect(data: any) {
    this.router.navigate(['system/cap-phep'], {
      queryParams: { showTaxCollect: true, id: data.Id },
    });
  }

  viewDetail(entity: any): void {
    // this.permitDetail = entity;
    this.viewPermit.emit(entity);
  }

  closeDetail(): void {
    this.permitDetail = null;
    this.closeViewPermit.emit();
  }
}
