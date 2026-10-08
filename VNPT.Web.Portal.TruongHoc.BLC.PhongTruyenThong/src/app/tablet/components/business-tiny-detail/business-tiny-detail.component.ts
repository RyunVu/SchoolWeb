import { Component, Input, OnInit } from '@angular/core';

import {
  calculateBusinessStatusBadge,
  populateBusinessFullAddress,
} from 'src/app/shared';

@Component({
  standalone: false,
  // tslint:disable-next-line: component-selector
  selector: 'business-tiny-detail',
  templateUrl: './business-tiny-detail.component.html',
  styleUrls: ['./business-tiny-detail.component.scss'],
})
export class BusinessTinyDetailComponent implements OnInit {
  @Input() entity: any;

  calculateBusinessStatusBadge = calculateBusinessStatusBadge;
  populateBusinessFullAddress = populateBusinessFullAddress;

  constructor() {}

  ngOnInit(): void {}
}
