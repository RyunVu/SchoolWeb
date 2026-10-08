import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { AuthService, BasePage, BaseService, HttpService } from 'src/app/services';
import { ShowDialogService } from 'src/app/services/showDialog.service';
import { TempalteListService } from './template-list.service';
import { TableTemplateModal, TemplateInputModal } from './modals';

@Component({
    standalone: false,
    selector: 'app-template-list',
    templateUrl: './template-list.component.html',
    styleUrls: ['./template-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [TempalteListService],
})
export class TemplateListComponent extends BasePage {

    keywordInput: string = "";
    loading: boolean = false;
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public showDialogService: ShowDialogService,
        private baseService: BaseService,
        public tempalteListService: TempalteListService,
        public authService: AuthService
    ) {
        super(router, route, http, message);
    }

    unitCode: string | null = null;
    list: any = [];
    totalRow: any = 0;
    pageSize: number = 20;
    pageIndex: number = 1;
    keyword: string = "";
    loadPage(): void {
        this.initData();
    }


    onInit(): void {

    }

    async initData(): Promise<any> {
        var data: any = await this.tempalteListService.loadData({
            keyword: this.keyword,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            unitCode: this.unitCode
        });
        this.list = data.Result;
        this.totalRow = data.TotalRow;
    }

    search() {
        this.initData();
    }

    add() {
        this.showDialogService.showDialog(TableTemplateModal, 'Tạo bảng mẫu', {
        }, (data: any) => {
            this.initData();
        }, '95%');
    }

    edit(row: any) {
        this.showDialogService.showDialog(TableTemplateModal, 'Cập nhật bảng mẫu', {
            TableTemplateId: row.Id
        }, (data: any) => {
            this.initData();
        }, '95%');
    }
    input(row: any) {
        this.showDialogService.showDialog(TemplateInputModal, 'Nhập liệu', row, (data: any) => {

        });
    }

    delete(row: any) {

    }

    oldEvent: any;
    async paginate(event: TableLazyLoadEvent) {
        if (this.oldEvent == null || event == this.oldEvent) {
            this.oldEvent = event;
            return;
        }
        this.oldEvent = event;
        this.pageSize = event.rows ?? 10;
        var first = event.first ?? 0;
        this.pageIndex = Math.floor(first / this.pageSize) + 1;
        await this.initData();

    }

}
