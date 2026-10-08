import { Component, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResultCode, ResultModel } from 'src/app/models';
import { BaseService, HttpService } from 'src/app/services';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { FMMiniWindowModal } from './fm-mini-window.modal';

declare var $: any;

@Component({
    standalone: false,
    selector: 'app-file-manager',
    templateUrl: './file-manager.component.html',
    styleUrls: ['./file-manager.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FileManagerModal {

    currentFolder: any;

    treeView: TreeNode[] = [];

    selectedfolder: any;
    selectedfiles: any[] = [];

    filetype: any;
    multipleselect: any;
    isGetFullImageInfo: any;

    keyword = "";
    defaultFolder: any = {};
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        private message: MessageService,
        private toastr: ToastrService,
        private baseService: BaseService,
        private confirmationService: ConfirmationService,
        public dialogService: DialogService,
    ) {
        this.selectedfolder = {
            ChildrenFolders: []
        }
        this.filetype = config.data.filetype;
        this.multipleselect = config.data.multipleselect;
        this.isGetFullImageInfo = config.data.isGetFullImageInfo;
        this.defaultFolder = config.data.DefaultFolder;
        if(this.isGetFullImageInfo == null) {
            this.isGetFullImageInfo = false;
        }

        this.loadViews();
        this.loadFolders(this.selectedfolder);
    }

    onInit(): void {

    }

    loadPage(): void {

    }

    loadViews() {
        this.treeView = [];
        if(this.defaultFolder && this.defaultFolder.Name){
            this.treeView.push({
                data: {
                    IsNotLoadApi: true,
                    Children: this.defaultFolder.Images
                },
                // leaf: element.Children?.length > 0 ? false : true,
                label: this.defaultFolder.Name,
                expanded: false,
                children: []
            });
        }
        this.http.post("media/FoldersByUser", {

        }, (result: ResultModel) => {
            if (result.Code == ResultCode.Success) {
                result.Result.forEach((element: any) => {
                    var add = {
                        data: {
                            Id: element.Id,
                            Name: element.Name,
                            ParentId: element.ParentId
                        },
                        // leaf: element.Children?.length > 0 ? false : true,
                        label: element.Name,
                        expanded: false,
                        children: this.getChildrenNode(element.ChildrenFolders)
                    };
                    this.treeView.push(add);

                    this.expandAll();
                });
            }
        }, () => {
        });
    }

    reload() {
        this.loadFolders(this.selectedfolder);
    }

    loadFolders(folder: any=null) {
        if(folder.IsNotLoadApi == true){
            this.selectedfolder = {
               Files: folder.Children
            };
            this.selectedfolder.Files.forEach((element: any) => {
                element.FullThumbUrl = this.baseService.mediaUrl + element.ThumbUrl;
                element.FullUrl = this.baseService.mediaUrl + element.Url;
            });

            this.setSelectedFile(null);
        }else{
            this.http.post("media/GetItemInFolder", {
                "Id": folder == null ? "" : folder.Id,
                "FileType": this.filetype,
                "Keyword": this.keyword
            }, (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    this.selectedfolder = result.Result;
    
                    this.selectedfolder.Files.forEach((element: any) => {
                        element.FullThumbUrl = result.Domain + element.ThumbUrl;
                        element.FullUrl = result.Domain + element.Url;
                    });
    
                    this.setSelectedFile(null);
                }
            }, () => {
            });
        }
        
    }

    getChildrenNode(children: any[]): any {
        if (children != null && children.length > 0) {
            var childs: any = [];
            children.forEach((element: any) => {
                var add = {
                    data: {
                        Name: element.Name,
                        Id: element.Id,
                        ParentId: element.Id
                    },
                    // leaf: element.Children?.length > 0 ? false : true,
                    label: element.Name,
                    expandedIcon: "pi pi-folder-open",
                    collapsedIcon: "pi pi-folder",
                    expanded: false,
                    children: this.getChildrenNode(element.ChildrenFolders)

                }
                childs.push(add);
            });
            return childs;
        } else {
            return [];
        }
    }

    selectFile() {
        if(!this.isGetFullImageInfo) {
            if (this.selectedfiles.length > 0) {
                var selectedUrls: any[] = [];
                this.selectedfiles.forEach(element => {
                    selectedUrls.push(element);
                });
                this.ref.close({ urls: selectedUrls });
            } else {
                this.toastr.error('Chưa chọn tập tin', 'Cảnh báo', {
                    timeOut: 3000,
                });
            }
        } else {
            this.selectFiles();
        }
    }

    selectFiles() {
        if (this.selectedfiles.length > 0) {
            this.ref.close({ urls: this.selectedfiles });
        } else {
            this.toastr.error('Chưa chọn tập tin', 'Cảnh báo', {
                timeOut: 3000,
            });
        }
    }

    setSelectedFile(file: any) {
        if(file == null) {
            this.selectedfolder.Files.forEach((element: any) => {
                element.selected = false;
            });
            this.selectedfiles = [];
            return;
        }
        if (!this.multipleselect) {
            this.selectedfiles = [];
            this.selectedfolder.Files.forEach((element: any) => {
                element.selected = false;
            });
            file.selected = !file.selected;
            this.selectedfiles.push(file);
        } else {
            file.selected = !file.selected;
            if (this.selectedfiles.filter(x => { return x.Url == file.Url }).length > 0) {
                var spliceindex = -1;
                this.selectedfiles.forEach((element, index) => {
                    if (element.Url == file.Url) {
                        spliceindex = index;
                    }
                });
                this.selectedfiles.splice(spliceindex, 1);
            } else {
                this.selectedfiles.push(file);
            }
        }
    }

    newFolder() {
        const ref = this.dialogService.open(FMMiniWindowModal, {
            data: {
                objectType: "folder",
                folderId: this.selectedfolder.Id
            },
            header: 'Thư mục',
            width: '50%'
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadViews();
                this.loadFolders(this.selectedfolder);
            }
        });
    }

    newFile() {
        const ref = this.dialogService.open(FMMiniWindowModal, {
            data: {
                objectType: "file",
                folderId: this.selectedfolder.Id,
                type: this.filetype
            },
            header: 'Tập tin',
            width: '50%'
        })!.onClose.subscribe((data: any) => {
            if (data) {
                this.loadFolders(this.selectedfolder);
            }
        });
    }

    deleteFolder(folder: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xoá thư mục này không?',
            accept: () => {
                this.http.post("media/DeleteFolder", {
                    "Id": folder.Id
                }, (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                        this.loadViews();
                        this.loadFolders(this.selectedfolder);
                    }
                }, () => {
                });
            }
        });
    }

    deleteFile(file: any) {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xoá tập tin này không?',
            accept: () => {
                this.http.post("media/DeleteFile", {
                    "Id": file.Id
                }, (result: ResultModel) => {
                    if (result.Code == ResultCode.Success) {
                        this.loadFolders(this.selectedfolder);
                    }
                }, () => {
                });
            }
        });

    }

    nodeSelect(event: any) {
        this.keyword = "";
        this.loadFolders(event.node.data);
    }

    cancel() {
        this.ref.close();
    }

    expandAll() {
        this.treeView.forEach(node => {
            this.expandRecursive(node, true);
        });
    }
    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }

}
