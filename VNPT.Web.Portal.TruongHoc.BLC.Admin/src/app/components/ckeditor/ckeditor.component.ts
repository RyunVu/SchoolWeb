import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FileManagerModal } from '../file-manager/file-manager.component';

declare var CKEDITOR: any;
declare var jQuery: any;
declare var $: any;
@Component({
    standalone: false,
    selector: 'ckeditor',
    templateUrl: './ckeditor.component.html'
})
export class CkEditorComponent implements AfterViewInit, OnDestroy, OnChanges {
    @Input() id: string = "";
    @Input() value: string = "";
    @Input() placeCode: string = "";
    @Input() placeId: string = "";
    @Input() rows: number = 30;
    @Input() defaultFolder: any = {};
    @Output() onEditorKeyup = new EventEmitter<any>();
    idReally: string;
    editor: any;

    seflChangeData: boolean = false;
    ngOnChanges(changes: SimpleChanges) {
        // if (changes.value && !changes.value.firstChange) {
        //     var editor = CKEDITOR.instances[this.idReally];
        //     setTimeout(() => {
        //         if (!this.seflChangeData){
        //             editor.setData(changes.value.currentValue);
        //         }else{
        //             //this.seflChangeData = false;
        //         }
        //     }, 100);
        // }


        //this.doSomething(changes.categoryId.currentValue);
        // You can also use categoryId.previousValue and 
        // categoryId.firstChange for comparing old and new values

    }
    constructor(
        public dialogService: DialogService,
    ) {
        if (!this.id) {
            this.idReally = this.id = this.guid();
        } else {
            this.idReally = this.id;
        }
        if (!this.rows) {
            this.rows = 30;
        }
    }
    currentEditor: any;
    openDialog(edt: any) {
        if (!edt) {
            edt = this.currentEditor;
        }
        const ref = this.dialogService.open(FileManagerModal, {
            data: {
                filetype: 'image',
                multipleselect: true,
                isGetFullImageInfo: true,
                DefaultFolder: this.defaultFolder
            },
            header: 'Quản lý file',
            width: '70%',
        })!.onClose.subscribe((data: any) => {
            if (data) {
                var fileUrls = data.urls;
                for (var i = 0; i < fileUrls.length; i++) {
                    var image = fileUrls[i];
                    var img = new Image();
                    var mainThis = this;
                    img.onload = function (args) {
                        let that = this as any;
                        mainThis.seflChangeData = true;
                        console.log(that['width']);
                        if(that['width'] > 960)
                        {
                            edt.insertHtml('<img alt="" data-cke-saved-src="' + that['src'] + '" src="' + that['src'] + '" style="max-width:960px">');
                        }
                        else
                        {
                            edt.insertHtml('<img alt="" data-cke-saved-src="' + that['src'] + '" src="' + that['src'] + '" style="max-width:960px; width: ' + that['width'] + 'px;">');
                        }
                        
                    }
                    img.src = image.FullUrl;
                }
            }
        });
    }


    openFileDialog(edt: any) {
        if (!edt) {
            edt = this.currentEditor;
        }
        const ref = this.dialogService.open(FileManagerModal, {
            data: {
                filetype: 'file',
                multipleselect: true,
                isGetFullImageInfo: true,
                DefaultFolder: this.defaultFolder
            },
            header: 'Quản lý file',
            width: '70%',
        })!.onClose.subscribe((data: any) => {
            if (data) {
                var fileUrls = data.urls;
                for (var i = 0; i < fileUrls.length; i++) {
                    var image = fileUrls[i];
                    edt.insertHtml("<p><a data-cke-saved-href='"+ image['FullUrl'] + "' href='"+ image['FullUrl'] + "' target='_blank'>"+ image['Name'] + "</a></p><br/>");
                }
            }
        });
    }

    ngAfterViewInit() {
        let that = this;

        $(function () {
            var editor = CKEDITOR.replace(that.idReally, {
                height: '500px',
            });

            //that.currentEditor = editor;
            editor.addCommand("mySimpleCommand", { // create named command
                exec: function (edt: any) {
                    that.currentEditor = edt;
                    $('#click-image-' + that.idReally).get(0).click();
                }
            });

            editor.addCommand("chooseFileCommand", { // create named command
                exec: function (edt: any) {
                    that.currentEditor = edt;
                    $('#click-file-' + that.idReally).get(0).click();
                }
            });

            //var dialogObj = new CKEDITOR.dialog( editor, 'smiley' );
            CKEDITOR.on('dialogDefinition', function (e: any) {
                var dialogName = e.data.name;
                if (dialogName == "image") {
                    var dialogDefinition = e.data.definition;
                    dialogDefinition.onLoad = function () {
                        var h = this.getSize().height;
                        var w = this.getSize().width;
                    };
                }

            });
            editor.ui.addButton('SuperButton', { // add new button and bind our command
                label: "Chọn hình ảnh từ Server",
                command: 'mySimpleCommand',
                toolbar: 'insert',
                icon: '/assets/ckeditor/images/image.png'
            });

            editor.ui.addButton('SuperFileButton', { // add new button and bind our command
                label: "Chọn tập tin từ Server",
                command: 'chooseFileCommand',
                toolbar: 'insert',
                icon: '/assets/ckeditor/images/file.png'
            });


            editor.on('change', function () {
                var content = editor.getData()
                that.onEditorKeyup.emit(content);
            });
        });
    }
    guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    ngOnDestroy() {
        CKEDITOR.remove(this.idReally);
    }
}