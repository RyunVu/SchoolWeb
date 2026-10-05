import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService, ShowDialogService } from 'src/app/services';
import { RoleMenuModal } from './role-menu.modal';
import { RoleModal } from './role.modal';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss']
})
export class RoleComponent extends BasePage {

    loading: boolean = false;
    treeNodes: any = [];
    cols: any[] = [];
    totalRecords: number = 0;
    keywordInput: any;

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
        this.cols = [
            { field: 'Name', header: 'Mã' },
            { field: 'Description', header: 'Tên' },
            { field: 'RoleLevel', header: 'Level' },
            { field: 'ParentName', header: 'Quyền cha' }
        ];
    }
    delete(item: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xoá quyền ' + item.Name + '?',
            accept: () => {
                this.http.post("role/Delete", {
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
        this.showDialogService.showDialog(RoleModal, 'Cập nhật: ' + item.roleName, item,
            (data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }

    add() {
        this.showDialogService.showDialog(RoleModal, 'Thêm mới', {
            Id: "",
            IsEdit: false
        }, (data: any) => {
            if (data) {
                this.loadData();
            }
        });
    }

    loadPage(): void {
        this.loading = true;
        this.loadData();
    }

    private loadData(): void {
        this.treeNodes = [];
        this.loading = true;
        this.http.post("role/ParentRoles", {

        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.totalRecords = result.TotalRow;
                this.treeNodes = [];
                result.Result.forEach((element: any) => {
                    var add = {
                        data: {
                            Name: element.Name,
                            Id: element.Id,
                            Description: element.Description,
                            RoleLevel: element.RoleLevel,
                            ParentName: element.ParentName,
                            ParentId: element.ParentId
                        },
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
    getChildrenNode(children: any[]): any {
        if (children != null && children.length > 0) {
            var childs: any = [];
            children.forEach((element: any) => {
                var add = {
                    data: {
                        Name: element.Name,
                        Id: element.Id,
                        Description: element.Description,
                        RoleLevel: element.RoleLevel,
                        ParentName: element.ParentName,
                        ParentId: element.ParentId
                    },
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
    menu(item: any) {
        this.showDialogService.showDialog(RoleMenuModal, 'Thêm mới', item,
            (data: any) => {
                if (data) {
                    this.loadData();
                }
            });
    }
}
