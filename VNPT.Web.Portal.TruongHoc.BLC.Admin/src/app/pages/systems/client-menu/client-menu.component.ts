import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, BaseService, HttpService } from 'src/app/services';
import { ShowDialogService } from 'src/app/services/showDialog.service';
import { ClientMenuModal } from './client-menu.modal';
import { MenuModal } from '../menu/menu.modal';

@Component({
    standalone: false,
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

    /** SuperAdminSystem được chọn cổng (đơn vị) để xem/quản lý menu của cổng đó */
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
        if (mulRole != "" && mulRole != null && mulRole.includes("SuperAdminSystem")) {
            this.isSuperAdminSystem = true;
            this.loadUnits();
        }
    }

    /** Bật/tắt hiển thị menu (IsShowMenu 0/1); hoàn tác nếu lưu thất bại */
    toggleShowMenu(item: any, checked: boolean) {
        var oldValue = item.IsShowMenu;
        item.IsShowMenu = checked;
        item._savingShow = true;
        this.http.post("ClientMenu/ChangeShowMenu", {
            Id: item.Id,
            IsShowMenu: checked
        }, (result: ResultModel) => {
            item._savingShow = false;
            if (result.Code == ResultCode.Success) {
                this.message.add({ severity: 'success', summary: 'Thông báo', detail: (checked ? 'Đã hiển thị menu "' : 'Đã ẩn menu "') + item.Title + '"' });
            } else {
                item.IsShowMenu = oldValue;
                this.message.add({ severity: 'error', summary: 'Lỗi', detail: result.Message || 'Không cập nhật được trạng thái hiển thị!' });
            }
        }, () => {
            item._savingShow = false;
            item.IsShowMenu = oldValue;
            this.message.add({ severity: 'error', summary: 'Lỗi', detail: 'Không cập nhật được trạng thái hiển thị!' });
        });
    }

    getUnitName(): string {
        var u = this.units.filter(s => s.Code == this.unit)[0];
        return u ? u.Name : 'Đơn vị đăng nhập';
    }

    loadUnits() {
        this.http.post("user/Units", {
        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                this.units = result.Result;
                // null: backend dùng đơn vị của tài khoản đăng nhập
                this.units.unshift({ Code: null, Name: "Đơn vị đăng nhập" });
            }
        }, () => {
        });
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
                IsShowMenu: true,
                // Cổng đang chọn (SuperAdminSystem); null => đơn vị của tài khoản đăng nhập
                UnitCode: this.unit
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
