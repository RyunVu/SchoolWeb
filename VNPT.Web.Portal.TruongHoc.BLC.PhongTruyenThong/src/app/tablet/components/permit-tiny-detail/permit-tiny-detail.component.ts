import { Component, Input, OnInit } from '@angular/core';

import {
  calculateConstructionStatusBadge,
  calculatePermitFeeStatusBadge,
  populatePermitFullAddress,
} from 'src/app/shared';

@Component({
  standalone: false,
  // tslint:disable-next-line: component-selector
  selector: 'permit-tiny-detail',
  templateUrl: './permit-tiny-detail.component.html',
  styleUrls: ['./permit-tiny-detail.component.scss'],
})
export class PermitTinyDetailComponent implements OnInit {
  @Input() entity: any;

  calculatePermitFeeStatusBadge = calculatePermitFeeStatusBadge;
  calculateConstructionStatusBadge = calculateConstructionStatusBadge;
  populatePermitFullAddress = populatePermitFullAddress;

  constructor() {}

  ngOnInit(): void {}
}
