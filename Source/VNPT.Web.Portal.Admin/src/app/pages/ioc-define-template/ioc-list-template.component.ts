import { Component, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { BasePage, BaseService, HttpService, ShowDialogService } from 'src/app/services';

import * as _ from "lodash";
import { ConfirmationService, LazyLoadEvent, MessageService, TreeNode } from 'primeng/api';
import { IocDefineTemplateModal } from './ioc-modal/ioc-define-template.modal';
import { MapDonViTemplateModal } from './ioc-modal/map-don-vi-template.modal';
import { TongHopTemplateModal } from './ioc-modal/tong-hop-template.modal';
import { PrintTemplateModal } from './ioc-modal/print-template.modal';
import { InputModal } from './ioc-input-modal/ioc-input.modal';
import { DialogService } from "primeng/dynamicdialog";
import { InputGridModal } from './ioc-input-modal/ioc-input-grid.modal';
import { InputGridV2Modal } from './ioc-input-modal/ioc-input-grid-v2.modal';
import { CookieService } from 'ngx-cookie-service';
import { DonViTemplateModal } from './ioc-input-modal/don-vi-template.modal';
import { IOCTargetTemplateModal } from './ioc-input-modal/ioc-target-template.modal';
// import { MapDonViTemplateModal } from './map-don-vi-template.modal';
// import { DonViTemplateModal } from './don-vi-template.modal';
// import { TongHopTemplateModal } from './tong-hop-template.modal';
// import { IocDefineTemplateModal } from './ioc-define-template.modal';
// import { InputGridQuarterModal } from '../ioc-input/ioc-input-grid-quarter.modal';
// import { PrintTemplateModal } from './print-template.modal';
// import { InputGridModal } from '../ioc-input/ioc-input-grid.modal';
// import { InputModal } from '../ioc-input/ioc-input.modal';
declare var $: any;

@Component({
    selector: 'ioc-list',
    templateUrl: './ioc-list-template.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./ioc-list-template.component.scss']
})
export class IocListTemplateComponent extends BasePage {
    addButton: any;
    subTitle: any;
    mainTitle: any;
    code: any;
    action: any;
    type: any;
    hasValue: any;

    //pagination component
    Keyword: any;
    currentPageSize: any;
    currentPageIndex: any;
    listPage: any[] = [];
    listDisplayPage: any[] = [];
    maxpage: any;
    total: any;
    currentRole: any;

    fields: any = [];
    defaultField: any;

    organizations: any = [];
    defaultOrganization: any;

    isDisabled: boolean = false;
    hasPermisionAdmin: boolean;
    hasPermision: boolean;
    hasPermisionInput: boolean;
    isSuper: boolean;

    public listItem: any; // biến này chưa danh sách lấy từ serve
    public listItemSearch: any // biến này chưa danh sách để hiển thị lên datatable sau khi search bằng từ khóa

    isToggle: boolean = true;

    constructor(
        public router: Router,
        public http: HttpService,
        public route: ActivatedRoute,
        public showDialogService: ShowDialogService,
        public message: MessageService,
        private confirmationService: ConfirmationService,
        private dialogService: DialogService,
        private cookieService: CookieService,
    ) {
        // Bắt buộc có
        super(router, route, http, message);
        this.Keyword = "";
        this.currentPageSize = 10;
        this.currentPageIndex = 1;
        this.total = 0;

        this.currentRole = this.cookieService.get("MulRole");

        this.hasPermisionAdmin = false;
        this.hasPermision = true;
        this.hasPermisionInput = false;
        this.isSuper = false;

        if (this.currentRole != "" && this.currentRole != null) {
            if (this.currentRole.includes("AdminIOC") || this.currentRole.includes("SuperAdminSystem")) { // Nếu là quyền SuperAdminSystem or AdminIOC
                this.hasPermisionAdmin = true;
            }

            if (this.currentRole.includes("AdminNhapLieuIOC") || this.currentRole.includes("NhapLieuIOC")
                || this.currentRole.includes("AdminPBNhapLieuIOC") || this.currentRole.includes("PBNhapLieuIOC")) { // Nếu là quyền nhập liệu
                this.hasPermisionInput = true;
            }

            if (!this.currentRole.includes("AdminIOC") && !this.currentRole.includes("SuperAdminSystem")) {
                this.hasPermision = false;
            }

            if (this.currentRole.includes("SuperAdminSystem")) {
                this.isSuper = true;
            }
        }

    }

    onInit() {
        this.getListDonVi();
        //this.getIocFields();
        this.loadData();
    }

    getListDonVi() {
        var data = {
        };
        this.http.post('IOC/GetListDonVi', data, (kq: any) => {
            if (kq.Code == 200) {
                this.organizations = kq.Result;
                this.organizations.unshift({ Name: '--Tất cả đơn vị--', Id: null });
            }
            else {

            }
        }, () => {

        }
        );
    }

    loadPage() {
    }

    search() {
        this.Keyword = BaseService.convertToUnsignChar(this.Keyword.toLowerCase().trim());
        this.currentPageIndex = 1;
        this.loadData();
    }

    //get enter key search
    getSearch(event: any) {
        if (event == 13) {
            this.search();
        }
    }

    //page list fetching
    hashPaginationBar(listTotal: any) {
        this.listPage = [];
        this.listDisplayPage = [];
        this.total = listTotal; 
        this.maxpage = 1;

        if (this.total % this.currentPageSize == 0) {
            this.maxpage = this.total / this.currentPageSize;
        } else {
            this.maxpage = Math.floor(this.total / this.currentPageSize) + 1;
        }

        for (var index = 0; index < this.maxpage; index++) {
            this.listPage.push({
                pageNumber: index + 1,
            });
        }

        // < 5 trang
        if (this.listPage.length <= 5) {
            this.listPage.forEach(element => {
                this.listDisplayPage.push({ pageDisplay: element.pageNumber, pageNumber: element.pageNumber });
            });
        }
        // 5 trang +
        else if (this.listPage.length > 5) {

            if (this.currentPageIndex == this.maxpage) {
                this.listDisplayPage.push(
                    { pageDisplay: "First", pageNumber: 1 },
                    { pageDisplay: this.currentPageIndex - 4, pageNumber: this.currentPageIndex - 4 },
                    { pageDisplay: this.currentPageIndex - 3, pageNumber: this.currentPageIndex - 3 },
                    { pageDisplay: this.currentPageIndex - 2, pageNumber: this.currentPageIndex - 2 },
                    { pageDisplay: this.currentPageIndex - 1, pageNumber: this.currentPageIndex - 1 },
                    { pageDisplay: this.currentPageIndex, pageNumber: this.currentPageIndex },
                );
            }
            else if (this.currentPageIndex == this.maxpage - 1) {
                this.listDisplayPage.push(
                    { pageDisplay: "First", pageNumber: 1 },
                    { pageDisplay: this.currentPageIndex - 3, pageNumber: this.currentPageIndex - 3 },
                    { pageDisplay: this.currentPageIndex - 2, pageNumber: this.currentPageIndex - 2 },
                    { pageDisplay: this.currentPageIndex - 1, pageNumber: this.currentPageIndex - 1 },
                    { pageDisplay: this.currentPageIndex, pageNumber: this.currentPageIndex },
                    { pageDisplay: this.currentPageIndex + 1, pageNumber: this.currentPageIndex + 1 },
                );
            }
            else if (this.currentPageIndex <= 4) {
                this.listDisplayPage.push(
                    { pageDisplay: 1, pageNumber: 1 },
                    { pageDisplay: 2, pageNumber: 2 },
                    { pageDisplay: 3, pageNumber: 3 },
                    { pageDisplay: 4, pageNumber: 4 },
                    { pageDisplay: 5, pageNumber: 5 },
                    { pageDisplay: "Last", pageNumber: this.maxpage },
                );
            }
            else if (this.currentPageIndex > 4 && this.currentPageIndex < this.maxpage - 1) {
                this.listDisplayPage.push(
                    { pageDisplay: "First", pageNumber: 1 },
                    { pageDisplay: this.currentPageIndex - 2, pageNumber: this.currentPageIndex - 2 },
                    { pageDisplay: this.currentPageIndex - 1, pageNumber: this.currentPageIndex - 1 },
                    { pageDisplay: this.currentPageIndex, pageNumber: this.currentPageIndex },
                    { pageDisplay: this.currentPageIndex + 1, pageNumber: this.currentPageIndex + 1 },
                    { pageDisplay: this.currentPageIndex + 2, pageNumber: this.currentPageIndex + 2 },
                    { pageDisplay: "Last", pageNumber: this.maxpage },
                );
            }

        }

    }

    changePage(pageNumber: number) {
        if (pageNumber != this.currentPageIndex) {
            this.listDisplayPage = [];
            this.currentPageIndex = pageNumber;
            this.loadData();
        }
    }

    turnToPage(event: any) {
        if (event.keyCode == 13) {
            var num = parseInt(event.target.value);
            if (num <= this.maxpage && num > 0) {
                this.changePage(num);
            }
            event.target.value = "";
        }
    }

    changePageSize(pageSize: any) {
        if (pageSize != this.currentPageSize) {
            this.currentPageSize = pageSize;
            this.currentPageIndex = 1;
            this.loadData();
        }
    }

    getIocFields() {
        var data = {
        };
        this.http.post('IOC/GetListPropertyField', data, (kq: { Code: number; Result: any; }) => {
            if (kq.Code == 200) {
                this.fields = kq.Result;
                this.fields.unshift({ Name: '--Tất cả lĩnh vực--', Id: null });
            }
        }, (error: any) => {
        }
        );
    }

    onChangeField(value: { value: { Id: any; }; }) {
        this.defaultField = { Id: value.value.Id };
        this.loadData();
    }

    onChangeOrganization(value: { value: { Id: any; }; }) {
        this.defaultOrganization = { Id: value.value.Id };
        this.loadData();
    }

    public loadData() {
        var fieldId = this.defaultField == undefined ? null : this.defaultField.Id;
        var organizationId = this.defaultOrganization == undefined ? null : this.defaultOrganization.Id;

        //use dataSearch for packaging the data
        var dataSearch = {
            FieldId: fieldId,
            OrganizationId: organizationId,
            PageIndex: this.currentPageIndex,
            PageSize: this.currentPageSize,
            Keyword: this.Keyword,
            // Keyword: "htc_test_10",
            IsPagination: true
        };

        this.isDisabled = true;

        this.http.post('IOC/GetListDocumentTemplateByOrgaId', dataSearch, (data1: { Code: number; Result: any; TotalRow: any; }) => {
            if (data1.Code == 200) {
                this.listItem = data1.Result;
                this.listItemSearch = this.listItem;
                this.hashPaginationBar(data1.TotalRow);
                this.isDisabled = false;
            }
            else {
                this.isDisabled = false;
            }
        }, (error: any) => {
            this.isDisabled = false;
        }
        );
    }
    delete(item: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn xóa biểu mẫu này không?',
            accept: () => {
                this.deleteItemConfirm(item);
            }
        });
    }
    deleteItemConfirm(item: { Id: any; }) {
        var data = {
            DocumentTemplateId: item.Id
        }
        this.http.post('IOC/DeleteDocumentTemplate', data, (data: { Code: number; }) => {
            if (data.Code == 200) {
                this.message.add({ severity: 'success', summary: 'Error', detail: "Xoá thành công!" });

                this.loadData();
            } else {
                this.message.add({ severity: 'error', summary: 'Error', detail: "Có lỗi xảy ra. xin vui lòng thử lại sau!" });
            }
        },
            (error: any) => {
                this.message.add({ severity: 'error', summary: 'Error', detail: "Có lỗi xảy ra. xin vui lòng thử lại sau!" });
            }
        );
    }

    mapUnit() {
        this.showDialogService.showDialog(MapDonViTemplateModal, 'Map đon vị chủ quản', {
            item: {
            },
            isAdd: true,
            code: ""
        }, (data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }

    tongHop() {
        this.showDialogService.showDialog(TongHopTemplateModal, 'Tổng hợp biểu mẫu', {
            item: {
            },
            isAdd: true,
            code: ""
        }, (data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }

    add() {
        this.showDialogService.showDialog(IocDefineTemplateModal, '', {
            item: {
            },
            isAdd: true,
            code: ""
        }, (data: any) => {
            if (data) {
                this.loadData();
            }
        });

    }

    editTongHop(item: { Id: any; IsNotSingle: any; }) {
        this.showDialogService.showDialog(TongHopTemplateModal, 'Cập nhật mẫu tổng hợp', {
            item: {
                Id: item.Id,
                IsTongHop: item.IsNotSingle
            },
            isAdd: false,
            code: ""
        }, (data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }

    editDonVi(item: { Id: any; IsNotSingle: any; }) {
        this.showDialogService.showDialog(DonViTemplateModal, 'Đơn vị - biểu mẫu', {
            item: {
                Id: item.Id,
                IsTongHop: item.IsNotSingle
            },
            isAdd: false,
            code: ""
        }, (data: any) => {
            if (data) {
            }
        });

    }

    editMau(item: { Id: any; IsNotSingle: any; }) {
        this.showDialogService.showDialog(IocDefineTemplateModal, 'Thêm mới', {
            item: {
                Id: item.Id,
                IsTongHop: item.IsNotSingle
            },
            isAdd: false,
            code: ""
        }, (data: any) => {
            if (data) {
            }
        });
    }

    input(item: any) {

        var mModal;
        if (item.FrequencyTypeId == 3) {
            mModal = InputGridModal;
        } else {
            if (item.FrequencyTypeId == 4) {
                mModal = InputGridModal;
            }
            else {
                mModal = InputModal;
            }
        }
        const ref = this.dialogService.open(mModal, {
            data: {
                item: {
                    Id: item.Id,
                    IsTongHop: item.IsNotSingle,
                    FrequencyTypeId: item.FrequencyTypeId,
                    NameTemplate: item.Code + " - " + item.Name
                },
                isAdd: false,
                code: ""
            },
            header: 'Nhập dữ liệu',
            width: '100%',
            height: '100%'
        });

        ref.onClose.subscribe((data: any) => {

        });

    }


    inputv2(item: any) {

        var mModal;
        if (item.FrequencyTypeId == 3) {
            mModal = InputGridV2Modal;
        } else {
            if (item.FrequencyTypeId == 4) {
                mModal = InputModal;
            }
            else {
                mModal = InputModal;
            }
        }
        const ref = this.dialogService.open(mModal, {
            data: {
                item: {
                    Id: item.Id,
                    IsTongHop: item.IsNotSingle,
                    FrequencyTypeId: item.FrequencyTypeId,
                    NameTemplate: item.Code + " - " + item.Name
                },
                isAdd: false,
                code: ""
            },
            header: 'Nhập dữ liệu',
            width: '100%'
        });

        ref.onClose.subscribe((data: any) => {

        });

    }


    themChiTieu(item: { Id: any; IsNotSingle: any; Name: any; OrganizationId: any; }) {
        // this.showDialogService.showDialog(IOCTargetTemplateModal, 'Thêm mới', {
        //     item: {
        //         Id: item.Id,
        //         IsTongHop: item.IsNotSingle,
        //         Name: item.Name,
        //         OrganizationId: item.OrganizationId
        //     },
        //     isAdd: false,
        //     code: ""
        // }, (data: any) => {
        //     if (data) {
        //     }
        // });
    }

    sortName() {
        this.listItemSearch.sort((a: { Name: string; }, b: { Name: string; }) => this.isToggle ? a.Name.localeCompare(b.Name) : b.Name.localeCompare(a.Name));
        this.isToggle = !this.isToggle;
    }


    printTemplate() {
        this.showDialogService.showDialog(PrintTemplateModal, 'In biểu mẫu', {
            item: {
            },
            isAdd: true,
            code: ""
        }, (data: any) => {
            if (data) {
            }
        });
    }
}
