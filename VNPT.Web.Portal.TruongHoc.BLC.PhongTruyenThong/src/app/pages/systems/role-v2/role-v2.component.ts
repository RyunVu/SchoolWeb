import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BasePage, HttpService, ShowDialogService } from 'src/app/services';
import { RoleV2MenuModal } from './role-v2-menu.modal';
import { RoleV2Modal } from './role-v2.modal';
import { ToastrService } from 'ngx-toastr';
import { RoleV2UserModal } from './role-v2-user.modal';
@Component({
  standalone: false,
  selector: 'app-role-v2',
  templateUrl: './role-v2.component.html',
  styleUrls: ['./role-v2.component.scss'],
})
export class RoleV2Component extends BasePage {
  loading: boolean = false;
  loadingTree: boolean = false;
  treeNodes: any = [];
  treeNodesMenu: any = [];
  cols: any[] = [];
  totalRecords: number = 0;
  keyRole: any;
  keyword: any;
  ortherItem: any;
  viewDialog: boolean = false;
  ortherTitle: string = '';
  selectedFiles: any[] = [];
  saveFile: any[] = [];
  unSaveFile: any[] = [];
  unSelectedFiles: any[] = [];
  mixSaveFile: any[] = [];
  IsHide: boolean = true;
  menuId: any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public http: HttpService,
    public message: MessageService,
    public showDialogService: ShowDialogService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private toastr: ToastrService
  ) {
    super(router, route, http, message);
  }

  onInit(): void {
    this.cols = [
      { field: 'Name', header: 'Mã' },
      { field: 'Description', header: 'Tên' },
      { field: 'RoleLevel', header: 'Level' },
      { field: 'ParentName', header: 'Quyền cha' },
    ];
  }
  delete(item: any) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xoá quyền ' + item.Name + '?',
      accept: () => {
        this.http.post(
          'role/Delete',
          {
            Id: item.Id,
          },
          (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
              //this.customerTypes = result.Result;
              this.message.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Xoá thành công!',
              });
              this.loadData();
            } else {
              this.message.add({
                severity: 'error',
                summary: 'Error',
                detail: result.Message,
              });
            }
          },
          () => {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Vui lòng kiểm tra Internet!',
            });
          }
        );
      },
    });
  }
  edit(item: any) {
    item.IsEdit = true;
    this.dialogService
      .open(RoleV2Modal, {
        data: item,
        header: 'Cập nhật: ' + item.Description,
        width: '40%',
        styleClass: 'nofooter',
      })!
      .onClose.subscribe((data: any) => {
        this.loadData();
      });
    // this.showDialogService.showDialog(RoleModal, 'Cập nhật: ' + item.Name, item,
    //     (data: any) => {
    //         if (data) {
    //             this.loadData();
    //         }
    //     });
  }

  add() {
    this.dialogService
      .open(RoleV2Modal, {
        data: {
          Id: '',
          IsEdit: false,
        },
        header: 'Thêm mới',
        width: '40%',
        styleClass: 'nofooter',
      })!
      .onClose.subscribe((data: any) => {
        this.loadData();
      });
    // this.showDialogService.showDialog(RoleModal, 'Thêm mới',, (data: any) => {
    //     if (data) {
    //         this.loadData();
    //     }
    // });
  }

  loadPage(): void {
    this.loading = true;
    this.loadData();
  }

  private loadData(): void {
    this.treeNodes = [];
    this.loading = true;
    this.http.post(
      'role/ParentRoles',
      {},
      (result: ResultModel) => {
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
                ParentId: element.ParentId,
              },
              leaf: element.Children?.length > 0 ? false : true,
              expanded: false,
              children: this.getChildrenNode(element.Children),
            };
            this.treeNodes.push(add);
          });
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
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
            ParentId: element.ParentId,
          },
          leaf: element.Children?.length > 0 ? false : true,
          expanded: false,
          children: this.getChildrenNode(element.Children),
        };
        childs.push(add);
      });
      return childs;
    } else {
      return [];
    }
  }

  onNodeExpand(event: any) {}
  loadNodes(event: any) {
    setTimeout(() => {
      this.loadData();
    }, 100);
  }
  menu(item: any) {
    this.dialogService
      .open(RoleV2MenuModal, {
        data: item,
        header: 'Cập nhật quyền - ' + item.Name + ' - ' + item.Description,
        width: '70%',
        styleClass: 'nofooter',
      })!
      .onClose.subscribe((data: any) => {
        this.loadData();
      });
  }
  user(item: any) {
    this.dialogService
      .open(RoleV2UserModal, {
        data: item,
        header: 'Tài khoản quyền - ' + item.Name,
        width: '70%',
        styleClass: 'nofooter',
      })!
      .onClose.subscribe((data: any) => {});
  }
  //div right
  exit() {
    this.IsHide = true;
  }
  openMenu(item: any) {
    this.menuId = item;
    this.IsHide = false;
    this.selectedFiles = [];
    this.saveFile = [];
    this.unSaveFile = [];
    this.loadDataMenuRight(item.Id);
  }
  loadDataMenuRight(itemId: any): void {
    this.treeNodesMenu = [];
    this.loadingTree = true;
    this.http.post(
      'MenuRole/MenuByRole',
      {
        RoleId: itemId,
        Keyword: this.keyword,
      },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.totalRecords = result.TotalRow;
          this.treeNodesMenu = [];
          result.Result.forEach((element: any) => {
            element.OrderNoShow = element.OrderNo + '.';
            var add = {
              data: element,
              leaf: element.Children?.length > 0 ? false : true,
              expanded: true,
              children: this.getChildrenNodeMenu(
                element.Children,
                element.OrderNo + ''
              ),
            };
            this.treeNodesMenu.push(add);
          });
          this.checkNode(this.treeNodesMenu);
        }
        this.loadingTree = false;
      },
      () => {
        this.loadingTree = false;
      }
    );
  }
  getChildrenNodeMenu(children: any[], ParentOrderNo: any): any {
    if (children != null && children.length > 0) {
      var childs: any = [];
      children.forEach((element: any) => {
        element.OrderNoShow = ParentOrderNo + '.' + element.OrderNo;
        var add = {
          data: element,
          leaf: element.Children?.length > 0 ? false : true,
          expanded: false,
          children: this.getChildrenNodeMenu(
            element.Children,
            element.OrderNoShow
          ),
        };
        childs.push(add);
      });
      return childs;
    } else {
      return [];
    }
  }
  checkNode(nodes: any) {
    for (let i = 0; i < nodes.length; i++) {
      if (!nodes[i].leaf && nodes[i].children[0].leaf) {
        for (let j = 0; j < nodes[i].children.length; j++) {
          if (
            this.checkTreeNodeSelectAll(nodes[i].children[j].data.Permissions)
          ) {
            if (!this.selectedFiles.includes(nodes[i].children[j])) {
              this.selectedFiles.push(nodes[i].children[j]);
            }
          }
        }
      }
      if (nodes[i].leaf) {
        if (this.checkTreeNodeSelectAll(nodes[i].data.Permissions)) {
          if (!this.selectedFiles.includes(nodes[i])) {
            this.selectedFiles.push(nodes[i]);
          }
        }
      }
      this.checkNode(nodes[i].children);
      let count = nodes[i].children.length;
      let c = 0;
      for (let j = 0; j < nodes[i].children.length; j++) {
        if (this.selectedFiles.includes(nodes[i].children[j])) {
          c++;
        }
        if (nodes[i].children[j].partialSelected)
          nodes[i].partialSelected = true;
      }
      if (c == 0) {
      } else if (c == count) {
        nodes[i].partialSelected = false;
        if (!this.selectedFiles.includes(nodes[i])) {
          this.selectedFiles.push(nodes[i]);
        }
      } else {
        nodes[i].partialSelected = true;
      }
    }
  }
  checkTreeNodeSelectAll(treeNodePermissions: any) {
    if (treeNodePermissions.length <= 0) {
      return false;
    }
    for (let index = 0; index < treeNodePermissions.length; index++) {
      const element = treeNodePermissions[index];
      if (!element.Value) {
        return false;
      }
    }
    return true;
  }
  checkChildrenUnselect(node: any) {
    var isUnselected = true;
    for (let index = 0; index < node.children.length; index++) {
      const element = node.children[index];
      if (this.selectedFiles.includes(element)) {
        isUnselected = false;
        break;
      }
      if (isUnselected) {
        var checkChild = this.checkChildrenUnselect(node.children[index]);
        if (!checkChild) {
          isUnselected = false;
          break;
        }
      }
    }
    return isUnselected;
  }
  findParent(node: any, allNodes: any) {
    var parrent = null;
    for (let index = 0; index < allNodes.length; index++) {
      if (allNodes[index].data.Id == node.ParentId) {
        parrent = allNodes[index];
        break;
      }
      if (parrent == null) {
        var checkParent: any = this.findParent(node, allNodes[index].children);
        if (checkParent != null) {
          parrent = checkParent;
          break;
        }
      }
    }
    return parrent;
  }
  findAllUnselected(allNodes: any) {
    for (let index = 0; index < allNodes.length; index++) {
      if (!this.selectedFiles.includes(allNodes[index])) {
        this.unSelectedFiles.push(allNodes[index]);
        if (!this.checkChildrenUnselect(allNodes[index])) {
          this.mixSaveFile.push(allNodes[index]);
        }
      }
      this.findAllUnselected(allNodes[index].children);
    }
  }
  submit() {
    this.loadingTree = true;
    this.unSelectedFiles = [];
    this.unSaveFile = [];
    this.saveFile = [];
    this.mixSaveFile = [];
    this.mixSaveFile.push(...this.selectedFiles);
    this.findAllUnselected(this.treeNodesMenu);
    for (let index = 0; index < this.mixSaveFile.length; index++) {
      const element = this.mixSaveFile[index].data;
      element.IsAdd = true;
      this.saveFile.push(element);
    }
    for (let index = 0; index < this.unSelectedFiles.length; index++) {
      if (
        this.unSelectedFiles[index].leaf ||
        this.checkChildrenUnselect(this.unSelectedFiles[index])
      ) {
        this.unSelectedFiles[index].data.IsAdd = false;
        this.unSaveFile.push(this.unSelectedFiles[index].data);
      }
    }
    this.saveFile.push(...this.unSaveFile);
    this.http.post(
      'MenuRole/SaveAllV2',
      { Children: this.saveFile },
      (result: ResultModel) => {
        if (result.Code == ResultCode.Success) {
          this.toastr.success('Cập nhật quyền', 'Thành công', {
            timeOut: 3000,
          });
        } else {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: result.Message,
          });
        }
        this.IsHide = true;
        this.loadingTree = false;
        this.openMenu(this.menuId);
      },
      () => {
        this.IsHide = true;
        this.loadingTree = false;
        this.openMenu(this.menuId);
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Vui lòng kiểm tra Internet!',
        });
      }
    );
  }
}
