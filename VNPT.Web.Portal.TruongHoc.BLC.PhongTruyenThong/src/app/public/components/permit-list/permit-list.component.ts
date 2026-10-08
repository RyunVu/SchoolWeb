import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import {
  calculateConstructionStatusBadge,
  calculatePermitFeeStatusBadge,
  populatePermitFullAddress,
} from 'src/app/shared';

@Component({
  standalone: false,
  // tslint:disable-next-line: component-selector
  selector: 'permit-list',
  templateUrl: './permit-list.component.html',
  styleUrls: ['./permit-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PermitListComponent implements OnInit {
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
