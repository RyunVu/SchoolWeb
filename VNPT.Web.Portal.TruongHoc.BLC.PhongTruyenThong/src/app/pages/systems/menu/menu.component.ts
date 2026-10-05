import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';
import { ShowDialogService } from 'src/app/services/showDialog.service';
import { FunctionMenuModal } from './function.modal';
import { MenuModal } from './menu.modal';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends BasePage {

    loading: boolean = false;
    treeNodes: any = [];
    cols: any[] = [];
    totalRecords: number = 0;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public http: HttpService,
        public message: MessageService,
        public showDialogService: ShowDialogService,
        private confirmationService: ConfirmationService,
        public dialogService: DialogService
    ) {
        super(router, route, http, message);
    }



    onInit(): void {
        this.cols = [
            { field: 'Name', header: 'Mã' },
            { field: 'Description', header: 'Tên' },
            { field: 'menuLevel', header: 'Level' },
            { field: 'ParentName', header: 'Quyền cha' }
        ];
    }
    delete(item: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xoá quyền ' + item.Title + '?',
            accept: () => {
                this.http.post("menu/Delete", {
                    Id: item.Id
                }, (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                        //this.customerTypes = result.Result;
                        this.message.add({ severity: 'success', summary: 'Thành công', detail: "Xoá thành công!" });
                        //this.loadData();
                    } else {
                        this.message.add({ severity: 'error', summary: 'Thông báo', detail: result.Message });
                    }
                }, () => {
                    this.message.add({ severity: 'error', summary: 'Thông báo', detail: "Vui lòng kiểm tra Internet!" });
                });
            }
        });
    }
    edit(item: any) {
        item.IsEdit = true;
        this.showDialogService.showDialog(MenuModal, 'Cập nhật:' + item.Title, item,
            (data: any) => {
                if (data) {
                    // this.loadData();
                }
            });
    }

    functionMenu(item: any) {
        item.IsEdit = true;
        // this.showDialogService.showDialog(FunctionMenuModal, 'Action for:' + item.Title, item, (data: any) => {
        //     if (data) {
        //         //  this.loadData();
        //     }
        // });
        this.dialogService.open(FunctionMenuModal, {
            data: item,
            header: 'Quyền: ' + item.Title,
            width: '60%',
        }).onClose.subscribe((data: any) => {
            //this.loadData();
        });
    }

    add() {
        this.dialogService.open(MenuModal, {
            data:
            {
                Id: "",
                IsEdit: false
            },
            header: 'Thêm mới',
            width: '60%',
        }).onClose.subscribe((data: any) => {
            this.loadData();
        });
        //     this.showDialogService.showDialog(MenuModal, 'Thêm mới',
        //         {
        //             Id: "",
        //             IsEdit: false
        //         }, (data: any) => {
        //             if (data) {
        //                 //this.loadData();
        //             }
        //         });
        // }
    }
    loadPage(): void {
        this.loadData();
    }

    loadData(): void {
        this.treeNodes = [];
        this.loading = true;
        this.http.post("menu/Parentmenus", {

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
