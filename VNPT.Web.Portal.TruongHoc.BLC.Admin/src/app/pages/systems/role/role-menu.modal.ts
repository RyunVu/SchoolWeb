import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService } from 'src/app/services';

@Component({
    standalone: false,
    selector: 'app-role-menu-modal',
    templateUrl: './role-menu.modal.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./role-menu.modal.scss']
})
export class RoleMenuModal implements OnInit {
    item: any;
    keyword: string = "";
    ortherTitle: string = "";
    loading: boolean = false;
    treeNodes: any = [];
    cols: any[] = [];
    totalRecords: number = 0;
    viewDialog: boolean = false;
    ortherItem: any = {};
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

    openOther(rowData: any) {
        // console.log(rowData);
        this.viewDialog = true;
        this.ortherItem = rowData;
        this.ortherTitle = "Các quyền khác cho: " + rowData.Title;
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
        this.http.post("MenuRole/MenuByRole", {
            RoleId: this.item.Id,
            Keyword: this.keyword
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.totalRecords = result.TotalRow;
                this.treeNodes = [];
                result.Result.forEach((element: any) => {
                    element.Add = false;
                    element.Edit = false;
                    element.IsHomePage = element.IsHomePage;
                    element.Allow = false;
                    element.Delete = false;
                    element.OtherPermissions = element.Permissions.filter((s: any) => s.Command.toLowerCase() != 'add' && s.Command.toLowerCase() != 'edit' && s.Command.toLowerCase() != 'delete' && s.Command.toLowerCase() != 'allow');
                    element.Permissions.forEach((action: any) => {
                        switch (action.Command) {
                            case "allow":
                                element.Allow = action.Value;
                                break;
                            case "add":
                                element.Add = action.Value;
                                break;
                            case "edit":
                                element.Edit = action.Value;
                                break;
                            case "delete":
                                element.Delete = action.Value;
                                break;
                            default:
                                break;
                        }
                    });
                    var add = {
                        data: element,
                        leaf: element.Children?.length > 0 ? false : true,
                        expanded: true,
                        children: this.getChildrenNode(element.Children)
                    }
                    this.treeNodes.push(add)
                });
                // console.log(result.Result);
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
                element.Add = false;
                element.IsHomePage = element.IsHomePage;
                element.Allow = false;
                element.Edit = false;
                element.Delete = false;
                element.OtherPermissions = element.Permissions.filter((s: any) => s.Command.toLowerCase() != 'add' && s.Command.toLowerCase() != 'edit' && s.Command.toLowerCase() != 'delete' && s.Command.toLowerCase() != 'allow');
                element.Permissions.forEach((action: any) => {
                    switch (action.Command) {
                        case "allow":
                            element.Allow = action.Value;
                            break;
                        case "add":
                            element.Add = action.Value;
                            break;
                        case "edit":
                            element.Edit = action.Value;
                            break;
                        case "delete":
                            element.Delete = action.Value;
                            break;
                        default:
                            break;
                    }
                });
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
    save(action: string, rowData: any) {
        if(action == "All"){
            rowData.Allow = !rowData.Allow;
            this.save('Allow',rowData);
            rowData.Add = !rowData.Add;
            this.save('Add',rowData);
            rowData.Edit = !rowData.Edit;
            this.save('Edit',rowData);
            rowData.Delete = !rowData.Delete;
            this.save('Delete',rowData);
        }else{
            this.http.post("MenuRole/SaveMenuInRole", {
                MenuId: rowData.Id,
                RoleId: rowData.RoleId,
                Command: action,
            }, (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    //this.customerTypes = result.Result;
                    rowData.GoiYs = rowData.GoiYs.filter((s: string) => s != action);
                    if(this.ortherItem.OtherPermissions == null){
                        this.ortherItem.OtherPermissions = [];
                    }
                    this.ortherItem.OtherPermissions.push({
                        Command: action,
                        Value: true
                    })
                    this.message.add({ severity: 'success', summary: 'Thông báo', detail: "Thay đổi thành công!" });
                } else {
    
                    this.message.add({ severity: 'error', summary: 'Error', detail: result.Message });
                }
            }, () => {
                this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng kiểm tra Internet!" });
            });
        }
    
    }
    addRole() {
        this.ortherItem.OtherPermissions.push({
            Command: "",
            Value: false,
            IsNew: true
        })
    }
    saveNew(item: any, rowData: any) {
        this.http.post("MenuRole/SaveMenuInRole", {
            MenuId: rowData.Id,
            RoleId: rowData.RoleId,
            Command: item.Command,
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                //this.customerTypes = result.Result;
                item.IsNew = false;
                item.Value = true;
                this.message.add({ severity: 'success', summary: 'Thông báo', detail: "Thay đổi thành công!" });
            } else {

                this.message.add({ severity: 'error', summary: 'Error', detail: result.Message });
            }
        }, () => {
            this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng kiểm tra Internet!" });
        });
    }
    sethomepageForChild(children: any[], id: any) {
        if (children != null && children.length > 0) {
            children.forEach(element => {
                element.data.IsHomePage = element.data.Id == id;
                this.sethomepageForChild(element.children, id);
            });
        }
    }
    setHomePage(rowData: any) {
        // console.log(rowData);
        this.http.post("MenuRole/setHomePage", {
            Id: rowData.Id,
            RoleId: rowData.RoleId,
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.message.add({ severity: 'success', summary: 'Thông báo', detail: "Thay đổi thành công!" });
                for (let index = 0; index < this.treeNodes.length; index++) {
                    var element = this.treeNodes[index];
                    element.data.IsHomePage = element.data.Id == rowData.Id;
                    this.sethomepageForChild(element.children, rowData.Id);
                }
            } else {

                this.message.add({ severity: 'error', summary: 'Error', detail: result.Message });
            }
        }, () => {
            this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng kiểm tra Internet!" });
        });
    }
}
