import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, BaseService, HttpService } from 'src/app/services';
import { ShowDialogService } from 'src/app/services/showDialog.service';
import { FunctionMenuModal } from './function.modal';
import { MenuModal } from './menu.modal';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MenuComponent extends BasePage {
    keywordInput: string = "";
    loading: boolean = false;
    treeNodes: any = [];
    cols: any[] = [];
    totalRecords: number = 0;
    menuPositions: any[] = [
        {
            Id: null, Name: "Chọn vị trí"
        },
        {
            Id: 1, Name: "Menu Ngang"
        },
        {
            Id: 2, Name: "Menu Dọc"
        },
        {
            Id: 3, Name: "Trang chủ"
        }
    ];
    menuPosition: any = null;
    units: any[] = [];
    unit: any;

    menuTypes: any[] = [];
    type: any = "";

    isSuperAdminSystem: boolean = false;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public showDialogService: ShowDialogService,
        private confirmationService: ConfirmationService,
        private baseService: BaseService
    ) {
        super(router, route, http, message);

        var mulRole = this.baseService.MulRole;
        if (mulRole != "" && mulRole != null && (mulRole.includes("SuperAdminSystem") || mulRole.includes("AdminTramYTe") || mulRole.includes("AdminPhongYTe"))) {
            this.isSuperAdminSystem = true;
        }
    }

    onInit(): void {
        this.cols = [
            { field: 'Name', header: 'Mã' },
            { field: 'Description', header: 'Tên' },
            { field: 'menuLevel', header: 'Level' },
            { field: 'ParentName', header: 'Quyền cha' }
        ];

        this.loadUnits();
        //this.loadTypes();
    }

    loadUnits() {
        this.http.post("user/Units", {

        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;
                this.units.unshift({ Id: null, Name: "Tất cả đơn vị" });
                this.unit = null
            }
        }, () => {
        });
    }

    // loadTypes() {
    //     this.http.post("GeneralCategory/Items", {
    //         Code: "MenuType"
    //     }, (result: ResultModel) => {
    //         if (result.Code == ResultCode.Success) {
    //             this.menuTypes = result.Result;
    //             //this.menuTypes.unshift({ Id: null, Name: "Tất cả loại menu" });
    //             this.type = this.menuTypes[1].Value;
    //         }
    //     }, () => {
    //     });
    // }

    search() {
        this.loadData();
    }

    delete(item: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xoá quyền ' + item.Name + '?',
            accept: () => {
                this.http.post("menu/Delete", {
                    Id: item.Id
                }, (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                        //this.customerTypes = result.Result;
                        this.message.add({ severity: 'success', summary: 'Error', detail: "Xoá thành công!" });
                        this.loadData();
                    } else {
                        this.message.add({ severity: 'error', summary: 'Error', detail: result.Message });
                    }
                }, () => {
                    this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng kiểm tra Internet!" });
                });
            }
        });
    }
    edit(item: any) {
        item.IsEdit = true;
        this.showDialogService.showDialog(MenuModal, 'Cập nhật:' + item.Title, item,
            (data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }

    functionMenu(item: any) {
        item.IsEdit = true;
        this.showDialogService.showDialog(FunctionMenuModal, 'Action for:' + item.Title, item, (data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }

    add() {
        this.showDialogService.showDialog(MenuModal, 'Thêm mới',
            {
                Id: "",
                IsEdit: false,
                MenuCode: this.type,
                MenuPosition: this.menuPosition
            }, (data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }

    loadPage(): void {
        this.loadData();
    }

    private loadData(): void {
        this.treeNodes = [];
        this.loading = true;
        this.http.post("menu/Parentmenus", {
            UnitCode: this.unit,
            MenuCode: 'Web',
            Keyword: this.keywordInput,
            menuPosition: this.menuPosition
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.totalRecords = result.TotalRow;
                this.treeNodes = [];
                result.Result.forEach((element: any) => {
                    var add = {
                        data: element,
                        leaf: element.Children?.length > 0 ? false : true,
                        expanded: true,
                        children: this.getChildrenNode(element.Children)

                    }
                    this.treeNodes.push(add)
                });
            }
            this.loading = false;
        }, () => {
            this.loading = false;
        });
    }
    getChildrenNode(children: any[]): any {
        if (children != null && children.length > 0) {
            var childs: any = [];
            children.forEach((element: any) => {
                var add = {
                    data: element,
                    leaf: element.Children?.length > 0 ? false : true,
                    expanded: true,
                    children: this.getChildrenNode(element.Children)

                }
                childs.push(add)
            });
            return childs;
        } else {
            return [];
        }
    }

    onNodeExpand(event: any) {

    }
    loadNodes(event: any) {
        setTimeout(() => {
            this.loadData();

        }, 100);
    }

}
