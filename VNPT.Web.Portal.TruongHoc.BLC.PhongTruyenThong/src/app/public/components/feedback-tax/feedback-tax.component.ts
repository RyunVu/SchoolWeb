import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  calculateConstructionStatusBadge,
  calculatePermitFeeStatusBadge,
  populatePermitFullAddress,
} from 'src/app/shared';

@Component({
  standalone: false,
  // tslint:disable-next-line: component-selector
  selector: 'feedback-tax',
  templateUrl: './feedback-tax.component.html',
})
export class FeedbackTaxComponent implements OnInit {
  @Input() list: any[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() page = new EventEmitter<any>();

  calculateConstructionStatusBadge = calculateConstructionStatusBadge;
  calculatePermitFeeStatusBadge = calculatePermitFeeStatusBadge;
  populatePermitFullAddress = populatePermitFullAddress;

  constructor() {}

  ngOnInit(): void {}

  pageChange(event: any): void {
    const pageSize = event.rows ?? 10;
    const pageIndex = Math.floor((event.first ?? 0) / pageSize) + 1;

    this.page.emit({ pageIndex, pageSize });
  }
}
