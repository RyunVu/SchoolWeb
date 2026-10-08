import { Component, HostListener, ViewEncapsulation } from '@angular/core';
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
    selectedNode: TreeNode | any = null;

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
            ChildrenFolders: [],
            Files: []
        };
        this.filetype = config.data?.filetype;
        this.multipleselect = config.data?.multipleselect;
        this.isGetFullImageInfo = config.data?.isGetFullImageInfo;
        this.defaultFolder = config.data?.DefaultFolder;
        if (this.isGetFullImageInfo == null) {
            this.isGetFullImageInfo = false;
        }

        // Get initial folder: priority config.data.folderId > localStorage > root
        const initialFolderId = config.data?.folderId !== undefined && config.data?.folderId !== null
            ? config.data.folderId
            : (localStorage.getItem('fm_last_folder_id') || "");

        this.loadViews(initialFolderId);
        this.loadFolders({ Id: initialFolderId });
    }

    onInit(): void {

    }

    loadPage(): void {

    }

    loadViews(targetFolderId: string = "") {
        this.treeView = [];
        if (this.defaultFolder && this.defaultFolder.Name) {
            this.treeView.push({
                data: {
                    IsNotLoadApi: true,
                    Children: this.defaultFolder.Images
                },
                label: this.defaultFolder.Name,
                expanded: false,
                children: []
            });
        }
        this.http.post("media/FoldersByUser", {}, (result: ResultModel) => {
            if (result.Code == ResultCode.Success && result.Result) {
                result.Result.forEach((element: any) => {
                    var add = {
                        data: {
                            Id: element.Id,
                            Name: element.Name,
                            ParentId: element.ParentId
                        },
                        label: element.Name,
                        expandedIcon: "pi pi-folder-open",
                        collapsedIcon: "pi pi-folder",
                        expanded: false,
                        children: this.getChildrenNode(element.ChildrenFolders)
                    };
                    this.treeView.push(add);
                });

                this.expandAll();

                const selectId = targetFolderId !== undefined && targetFolderId !== null
                    ? targetFolderId
                    : (this.selectedfolder ? (this.selectedfolder.Id || "") : "");
                if (selectId !== "") {
                    this.selectNodeById(selectId);
                }
            }
        }, () => {
        });
    }

    reload() {
        this.loadFolders(this.selectedfolder);
    }

    loadFolders(folder: any = null, uploadedFilesToSelect: any = null) {
        if (folder && folder.IsNotLoadApi == true) {
            this.selectedfolder = {
                Files: folder.Children || []
            };
            this.selectedfolder.Files.forEach((element: any) => {
                element.FullThumbUrl = this.baseService.mediaUrl + element.ThumbUrl;
                element.FullUrl = this.baseService.mediaUrl + element.Url;
            });

            this.setSelectedFile(null);
        } else {
            const folderId = folder == null ? "" : (folder.Id || "");
            this.http.post("media/GetItemInFolder", {
                "Id": folderId,
                "FileType": this.filetype,
                "Keyword": this.keyword
            }, (result: ResultModel) => {
                if (result.Code == ResultCode.Success && result.Result) {
                    this.selectedfolder = result.Result;

                    if (this.selectedfolder.Files) {
                        this.selectedfolder.Files.forEach((element: any) => {
                            element.FullThumbUrl = result.Domain + element.ThumbUrl;
                            element.FullUrl = result.Domain + element.Url;
                        });
                    }

                    if (uploadedFilesToSelect && uploadedFilesToSelect.length > 0 && this.selectedfolder.Files && this.selectedfolder.Files.length > 0) {
                        this.selectedfiles = [];
                        this.selectedfolder.Files.forEach((file: any) => {
                            file.selected = false;
                        });

                        const uploadIds = uploadedFilesToSelect.map((x: any) => String(x.Id || x.id || ''));
                        const uploadUrls = uploadedFilesToSelect.map((x: any) => x.Url || x.url || '');

                        let matchedFiles: any[] = [];
                        for (const file of this.selectedfolder.Files) {
                            const fileId = String(file.Id || '');
                            const fileUrl = file.Url || '';
                            if ((fileId && uploadIds.includes(fileId)) || (fileUrl && uploadUrls.includes(fileUrl))) {
                                matchedFiles.push(file);
                            }
                        }

                        if (matchedFiles.length === 0) {
                            matchedFiles = [this.selectedfolder.Files[0]];
                        }

                        if (!this.multipleselect) {
                            const targetFile = matchedFiles[0];
                            targetFile.selected = true;
                            this.selectedfiles = [targetFile];
                        } else {
                            matchedFiles.forEach(f => {
                                f.selected = true;
                                this.selectedfiles.push(f);
                            });
                        }
                    } else {
                        this.setSelectedFile(null);
                    }

                    // Save last working folder in localStorage
                    if (this.selectedfolder) {
                        const currentId = this.selectedfolder.Id || "";
                        localStorage.setItem('fm_last_folder_id', currentId);
                        if (this.selectedfolder.Name) {
                            localStorage.setItem('fm_last_folder_name', this.selectedfolder.Name);
                        }
                    }

                    // Sync tree node selection
                    if (this.treeView && this.treeView.length > 0) {
                        const targetId = this.selectedfolder.Id || "";
                        this.selectNodeById(targetId);
                    }
                } else if (folderId !== "") {
                    // Fallback to root if the saved folder no longer exists
                    localStorage.removeItem('fm_last_folder_id');
                    localStorage.removeItem('fm_last_folder_name');
                    this.loadFolders(null);
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
                        ParentId: element.ParentId || element.Id
                    },
                    label: element.Name,
                    expandedIcon: "pi pi-folder-open",
                    collapsedIcon: "pi pi-folder",
                    expanded: false,
                    children: this.getChildrenNode(element.ChildrenFolders)
                };
                childs.push(add);
            });
            return childs;
        } else {
            return [];
        }
    }

    selectNodeById(id: string) {
        if (id === undefined || id === null) return;
        const node = this.findNodeById(this.treeView, id);
        if (node) {
            this.selectedNode = node;
            this.expandParents(node);
        } else {
            this.selectedNode = null;
        }
    }

    findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
        if (!nodes || nodes.length === 0) return null;
        for (const node of nodes) {
            if (node.data && String(node.data.Id) === String(id)) {
                return node;
            }
            if (node.children && node.children.length > 0) {
                const found = this.findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    expandParents(node: TreeNode) {
        node.expanded = true;
    }

    selectFile() {
        if (!this.isGetFullImageInfo) {
            if (this.selectedfiles.length > 0) {
                var selectedUrls: any[] = [];
                this.selectedfiles.forEach(element => {
                    selectedUrls.push({
                        Id: element.Id,
                        Url: element.Url,
                        ThumbUrl: element.ThumbUrl,
                        FullUrl: element.FullUrl,
                        FullThumbUrl: element.FullThumbUrl
                    });
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
        if (file == null) {
            if (this.selectedfolder && this.selectedfolder.Files) {
                this.selectedfolder.Files.forEach((element: any) => {
                    element.selected = false;
                });
            }
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
        const baseZ = (this.config?.baseZIndex || 20000) + 1000;
        const ref = this.dialogService.open(FMMiniWindowModal, {
            data: {
                objectType: "folder",
                folderId: this.selectedfolder ? (this.selectedfolder.Id || "") : ""
            },
            header: 'Thư mục',
            width: '45%',
            baseZIndex: baseZ
        });
        ref?.onClose.subscribe((data: any) => {
            if (data) {
                this.loadViews(this.selectedfolder ? (this.selectedfolder.Id || "") : "");
                this.loadFolders(this.selectedfolder);
            }
        });
    }

    @HostListener('window:paste', ['$event'])
    onWindowPaste(event: ClipboardEvent) {
        const target = event.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
            return;
        }

        const clipboardData = event.clipboardData || (window as any).clipboardData;
        if (!clipboardData || !clipboardData.items) return;

        for (let i = 0; i < clipboardData.items.length; i++) {
            const item = clipboardData.items[i];
            if (item.type && item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                if (blob) {
                    event.preventDefault();
                    event.stopPropagation();
                    const ext = item.type === 'image/png' ? 'png' : (item.type === 'image/webp' ? 'webp' : 'jpg');
                    const fileName = `pasted_${moment().format('YYYYMMDD_HHmmss')}.${ext}`;
                    const file = new File([blob], fileName, { type: item.type });
                    this.newFileWithPastedImage(file);
                    return;
                }
            }
        }
    }

    newFileWithPastedImage(file: File) {
        const baseZ = (this.config?.baseZIndex || 20000) + 1000;
        const ref = this.dialogService.open(FMMiniWindowModal, {
            data: {
                objectType: "file",
                folderId: this.selectedfolder ? (this.selectedfolder.Id || "") : "",
                type: this.filetype,
                initialFile: file
            },
            header: 'Tải tập tin & Chỉnh sửa ảnh',
            width: '75%',
            contentStyle: { 'max-height': '92vh', 'overflow': 'auto' },
            baseZIndex: baseZ
        });
        ref?.onClose.subscribe((data: any) => {
            if (data) {
                this.loadFolders(this.selectedfolder, data.uploadedFiles);
            }
        });
    }

    newFile() {
        const baseZ = (this.config?.baseZIndex || 20000) + 1000;
        const ref = this.dialogService.open(FMMiniWindowModal, {
            data: {
                objectType: "file",
                folderId: this.selectedfolder ? (this.selectedfolder.Id || "") : "",
                type: this.filetype
            },
            header: 'Tải tập tin & Chỉnh sửa ảnh',
            width: '75%',
            contentStyle: { 'max-height': '92vh', 'overflow': 'auto' },
            baseZIndex: baseZ
        });
        ref?.onClose.subscribe((data: any) => {
            if (data) {
                this.loadFolders(this.selectedfolder, data.uploadedFiles);
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
                        if (this.selectedfolder && this.selectedfolder.Id === folder.Id) {
                            localStorage.removeItem('fm_last_folder_id');
                            localStorage.removeItem('fm_last_folder_name');
                            this.selectedfolder = { Id: "" };
                        }
                        this.loadViews(this.selectedfolder ? (this.selectedfolder.Id || "") : "");
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
        this.selectedNode = event.node;
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
