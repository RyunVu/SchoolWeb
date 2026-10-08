import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';

@Component({
    standalone: false,
    selector: 'app-function-menu',
    templateUrl: './function.modal.html',
    styleUrls: ['./function.modal.scss']
})
export class FunctionMenuModal implements OnInit {
    item: any;
    keyword: string = "";
    ortherTitle: string = "";
    loading: boolean = false;
    treeNodes: any = [];
    cols: any[] = [];
    totalRecords: number = 0;
    viewDialog: boolean = false;
    ortherItem: any;
    ortherActions: any[] = [];

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        public message: MessageService,
    ) {
        this.item = this.config.data;
    }


    ngOnInit() {
        this.loadData();
    }
    search() {
        this.loadData(true);
    }
    addOrther() {
        this.ortherItem.OtherActions.push({
            Name: ""
        })
    }
    removeOther(item: any) {
        this.ortherItem.OtherActions = this.ortherItem.OtherActions.filter((s: any) => s != item);
    }
    saveOther() {
        var temp = this.ortherItem.OtherActions.filter((s: any) => s.Name.toLowerCase() == 'add' || s.Name.toLowerCase() == 'edit' || s.Name.toLowerCase() == 'delete');
        if (temp.length > 0) {
            this.message.add({ severity: 'error', summary: 'Error', detail: "Không được chứa 'add'/'edit'/'delete'" });
            return;
        }
        this.http.post("MenuRole/SaveFunctionInMenus", {
            Actions: this.ortherItem.OtherActions,
            Controller: this.ortherItem.Controller,
            Method: this.ortherItem.Name,
            MenuId: this.ortherItem.MenuId
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                //this.customerTypes = result.Result;
                this.message.add({ severity: 'success', summary: 'Thông báo', detail: "Thay đổi thành công!" });
            } else {

                this.message.add({ severity: 'error', summary: 'Error', detail: result.Message });
            }
        }, () => {
            this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng kiểm tra Internet!" });
        });
    }
    openOther(rowData: any) {
        // console.log(rowData);
        this.viewDialog = true;
        this.ortherItem = rowData;
        this.ortherTitle = "Các quyền khác cho: " + rowData.Controller + "/" + rowData.Name;
    }
    closeView() {
        this.viewDialog = false;

    }
    onKeyUp(event: any) {
        if (event.keyCode == 13) {
            this.search();
        }
    }
    private loadData(isExpanded = false): void {
        this.treeNodes = [];
        this.loading = true;
        this.http.post("MenuRole/GetAllController", {
            MenuId: this.item.Id,
            Name: this.keyword
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.totalRecords = result.TotalRow;
                this.treeNodes = [];
                result.Result.forEach((element: any) => {
                    var add = {
                        data: {
                            Name: element.Name,
                            MenuId: element.MenuId,
                            IsParent: true
                        },
                        leaf: element.Children?.length > 0 ? false : true,
                        expanded: true,
                        children: this.getChildrenNode(element.Actions, element)
                    }
                    this.treeNodes.push(add)
                });
            }
            this.loading = false;
        }, () => {
            this.loading = false;
        });
    }
    getChildrenNode(children: any[], parent: any): any {
        if (children != null && children.length > 0) {
            var childs: any = [];
            children.forEach((element: any) => {
                var isAdd = false;
                element.Actions.forEach((action: any) => {
                    switch (action.Name) {
                        case "allow":
                            isAdd = true;
                            break;
                    }
                });
                var add = {
                    data: {
                        Name: element.Name,
                        Controller: parent.Name,
                        MenuId: parent.MenuId,
                        Allow: isAdd,
                        IsParent: false,
                        Actions: element.Actions,
                        OtherActions: element.Actions.filter((s: any) => s.Name != 'allow')
                    },
                    leaf: element.Children?.length > 0 ? false : true,
                    expanded: false,
                    // children: this.getChildrenNode(element.Children)
                }
                childs.push(add)
            });
            return childs;
        } else {
            return [];
        }
    }
    save(action: string, rowData: any) {
        this.http.post("MenuRole/SaveFunctionInMenu", {
            Action: action,
            Name: rowData.Controller,
            Method: rowData.Name,
            MenuId: rowData.MenuId
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                //this.customerTypes = result.Result;
                this.message.add({ severity: 'success', summary: 'Thông báo', detail: "Thay đổi thành công!" });
                
            } else {

                this.message.add({ severity: 'error', summary: 'Error', detail: result.Message });
            }
        }, () => {
            this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng kiểm tra Internet!" });
        });
    }

}
