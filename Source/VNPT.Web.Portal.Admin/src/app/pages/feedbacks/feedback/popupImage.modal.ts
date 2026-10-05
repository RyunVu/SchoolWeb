import { Component, ViewEncapsulation } from "@angular/core";

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { HttpService } from "src/app/services";
import * as fs from 'file-saver';
// import * as request from 'request';
import { HttpClient } from "@angular/common/http";
import * as JSZip from 'jszip';
import * as moment from 'moment';
import { environment } from "src/environments/environment";

@Component({
    selector: "popupimage-modal",
    templateUrl: 'popupImage.modal.html',
    styleUrls: ['./popupImage.modal.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class PopupImageModal {
    items: any;

    responsiveOptions: any[] = [
        {
            breakpoint: '4000px',
            numVisible: 5
        },
        {
            breakpoint: '1366px',
            numVisible: 3
        },
        {
            breakpoint: '850px',
            numVisible: 2
        },
        {
            breakpoint: '650px',
            numVisible: 1
        }
    ];

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        public dialogService: DialogService,
        public httpClient: HttpClient
    ) {

    }

    ngOnInit() {
        // var items = this.config.data.items;
        // items.forEach((element: any) => {
        //     this.items.push({
        //         "previewImageSrc": element.Url,
        //         "thumbnailImageSrc": element.ThumbUrl,
        //         "alt": element.Name,
        //         "title": element.Name
        //     })
        // });
        this.items = this.config.data.items;
    }
    cancel() {
        this.ref.close();
    }

    // async download(item: any, dest) {

    //     /* Create an empty file where we can save data */
    //     const file = fs.createWriteStream(dest);

    //     /* Using Promises so that we can use the ASYNC AWAIT syntax */
    //     await new Promise((resolve, reject) => {
    //         request({
    //             /* Here you should specify the exact link to the file you are trying to download */
    //             uri: item.Url,
    //             gzip: true,
    //         })
    //             .pipe(file)
    //             .on('finish', async () => {
    //                 console.log(`The file is finished downloading.`);
    //                 resolve();
    //             })
    //             .on('error', (error) => {
    //                 reject(error);
    //             });
    //     })
    //         .catch((error) => {
    //             console.log(`Something happened: ${error}`);
    //         });
    // }

    downloadFile(item: any) {
        this.httpClient.get(`${environment.mediaUrl}${item.Url}`, { responseType: 'blob' }).subscribe((data) => {
            if (data && data != undefined && data != null) {
                fs.saveAs(data, item.Name);
            }
        });
    }

    strlizeImage(imageUrl: any) {
        return imageUrl == null ? "assets/img/noimage.png" : imageUrl.indexOf('http://') == 0 || imageUrl.indexOf('https://') == 0 ? imageUrl : environment.mediaUrl + imageUrl;
    }
    ldButton = false;
    downloadFiles() {
        var zip = new JSZip();
        var l = this.items.length;
        this.ldButton = true;
        this.items.forEach((element: any, index: any) => {
            this.httpClient.get(`${environment.mediaUrl}${element.Url}`, { responseType: 'blob' }).subscribe((data) => {
                zip.file(element.Name, data, {
                    binary: true
                });

                if(index == l - 1) {
                    setTimeout(() => {
                        zip
                        .generateAsync({
                            type: "blob"
                        })
                        .then((content) => {
                            fs.saveAs(content, moment().format('YYYYMMDD_HHmmss') + ".zip");
                            this.ldButton = false;
                        });
                    }, 500);
                }
            });
        });


    }
}