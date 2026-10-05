import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  calculateBusinessStatusBadge,
  populateBusinessFullAddress,
} from 'src/app/shared';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'hp-left-panel',
  templateUrl: './hp-left-panel.component.html',
  styleUrls: ['./hp-left-panel.component.scss'],
})
export class HPLeftPanelComponent implements OnInit {
  @Input() loading = false;
  @Input() items: any[] = [];

  @Output() viewBusiness = new EventEmitter<any>();
  @Output() closeViewBusiness = new EventEmitter<void>();

  // Utils functions
  calculateBusinessStatusBadge = calculateBusinessStatusBadge;
  populateBusinessFullAddress = populateBusinessFullAddress;
  businessDetail: any;

  constructor() {}

  ngOnInit(): void {}

  viewDetail(entity: any): void {
    // this.businessDetail = entity;
    this.viewBusiness.emit(entity);
  }

  closeDetail(): void {
    this.businessDetail = null;
    this.closeViewBusiness.emit();
  }
}
