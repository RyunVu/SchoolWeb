import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import {
  calculateBusinessStatusBadge,
  populateBusinessFullAddress,
} from 'src/app/shared';

@Component({
  standalone: false,
  // tslint:disable-next-line: component-selector
  selector: 'business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessListComponent implements OnInit {
  @Input() list: any[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() showDoanhThu = false;
  @Input() typeSearch: any = null;
  @Output() page = new EventEmitter<any>();

  cols: any[] = [];
  calculateBusinessStatusBadge = calculateBusinessStatusBadge;
  populateBusinessFullAddress = populateBusinessFullAddress;

  pageSize: any = 10;
  pageIndex: any = 1;

  constructor() {}

  ngOnInit(): void {}

  pageChange(event: any): void {
    const pageSize = (this.pageSize = event.rows ?? 10);
    const pageIndex = (this.pageIndex =
      Math.floor((event.first ?? 0) / pageSize) + 1);

    this.page.emit({ pageIndex, pageSize });
  }
}
