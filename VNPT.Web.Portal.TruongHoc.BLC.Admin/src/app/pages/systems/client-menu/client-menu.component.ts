import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { ShowDialogService } from 'src/app/services/showDialog.service';
import { ClientMenuModal } from './client-menu.modal';
import { MenuModal } from '../menu/menu.modal';

@Component({
    selector: 'app-client-menu',
    templateUrl: './client-menu.component.html',
    styleUrls: ['./client-menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClientMenuComponent extends BasePage {
    keywordInput: string = "";
    loading: boolean = false;
    treeNodes: any = [];
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
        },
        {
            Id: 5, Name: "Phòng truyền thống"
        },
        {
            Id: 4, Name: "Trang quản trị"
        }
    ];
    menuPosition: any = 3;
    units: any[] = [];
    unit: any;

    menuTypes: any[] = [];
    type: any = "";

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public showDialogService: ShowDialogService,
        private confirmationService: ConfirmationService
    ) {
        super(router, route, http, message);
    }

    onInit(): void {
       

    }

    search() {
        if (this.menuPosition == 4)
        {
            this.loadDataAdmin();
        }
        else
        {
            this.loadData();
        }
    }

    getPosition(menuPosition:any){
        var p = this.menuPositions.filter(s=>s.Id == menuPosition)[0];
        if(p){
            return p.Name;
        }
        return 'Không xác định';
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

        if(this.menuPosition == 4)
        {
            this.showDialogService.showDialog(MenuModal, 'Cập nhật:' + item.Title, item,
                (data: any) => {
                    if (data) {
                        this.loadDataAdmin();
                    }
                });
        }
        else
        {
            this.showDialogService.showDialog(
                ClientMenuModal, 'Cập nhật:' + item.Title,
                item,
                (data: any) => {
                    if (data) {
                        this.loadData();
                    }
                });
        }
        
    }


    add() {
        this.showDialogService.showDialog(ClientMenuModal, 'Thêm mới',
            {
                Id: "",
                IsEdit: false,
                MenuCode: this.type,
                MenuPosition: this.menuPosition,
                IsShowMenu: true
            }, (data: any) => {
                if (data) {
                    if(this.menuPosition == 4)
                    {
                        this.loadDataAdmin();
                    }
                    else
                    {
                        this.loadData();
                    }
                }
            });
    }

    loadPage(): void {
        this.loadData();
    }

    private loadData(): void {
        this.treeNodes = [];
        this.loading = true;
        this.http.post("ClientMenu/Parentmenus", {
            UnitCode: this.unit,
            MenuCode: this.type,
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
                        expanded: false,
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

    private loadDataAdmin(): void {
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
                    expanded: false,
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
