import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import { SearchEntity } from 'src/app/shared';
import { PermitPageService } from '../../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'permit-list-page',
  templateUrl: './permit-list-page.component.html',
  styleUrls: ['./permit-list-page.component.scss'],
})
export class PermitListPageComponent implements OnInit {
  loading = true;
  permitList: any = null;
  initSearch = false;
  params: any;
  searchParams: SearchEntity | undefined;
  totalRecords = 0;

  constructor(
    private messageService: MessageService,
    private permitService: PermitPageService
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
    this.searchParams.pageSize = 10;
    try {
      this.loading = true;

      const result = await this.permitService.searchPermitList(criteria);

      this.permitList = result.list || [];
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
