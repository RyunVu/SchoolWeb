import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import { SearchEntity } from 'src/app/shared';
import { HomePageService } from '../../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'business-list-page',
  templateUrl: './business-list-page.component.html',
  styleUrls: ['./business-list-page.component.scss'],
})
export class BusinessListPageComponent implements OnInit {
  loading = true;
  businessList: any = null;
  initSearch = false;
  params: any;
  searchParams: SearchEntity = {};
  totalRecords = 0;

  constructor(
    private messageService: MessageService,
    private hpService: HomePageService
  ) {}

  ngOnInit(): void {}

  searchFormChange(searchFormParams: any): void {
    if (searchFormParams.ward && !this.initSearch && !this.params) {
      this.initSearch = true;
      this.search(searchFormParams);
    }
  }

  pageChange(event: { pageSize: number; pageIndex: number }): void {
    if (!this.initSearch) {
      return;
    }

    this.search({
      ...this.searchParams,
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  async search(criteria: SearchEntity): Promise<void> {
    this.searchParams = criteria;
    try {
      this.loading = true;

      const result = await this.hpService.searchBusinessList(criteria);

      this.businessList = result.list || [];
      this.totalRecords = result.total || 0;

      this.loading = false;
    } catch (error) {
      const errorMessage = 'Có lỗi xảy ra khi tìm kiếm dữ liệu!';

      this.loading = false;
      this.messageService.add({
        severity: 'error',
        detail: errorMessage,
      });
    }
  }
}
