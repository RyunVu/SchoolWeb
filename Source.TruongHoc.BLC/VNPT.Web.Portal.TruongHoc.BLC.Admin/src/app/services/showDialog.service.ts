import { Injectable } from "@angular/core";
import { ActivationEnd, Router } from "@angular/router";
import { DialogService } from "primeng/dynamicdialog";

@Injectable()
export class ShowDialogService {
    dialogRef: any;
    constructor(
        private router: Router,
        private dialogService: DialogService
    ) {
        this.router.events.subscribe((event: any) => {
            if (event instanceof ActivationEnd) {
                // if (this.dialogRef) {
                //     this.dialogRef.close();
                // }
            }
        });
    }

    showDialog(component: any, header: string, data: any, onClose: Function, width: any = '80%', height: any = null) {
        this.dialogRef = this.dialogService.open(component, {
            data: data,
            header: header,
            width: width,
            height: height,
            closeOnEscape: true
        }).onClose.subscribe((data: any) => {
            onClose(data);
        });
    }

    showConfirm()
    {

    }
}