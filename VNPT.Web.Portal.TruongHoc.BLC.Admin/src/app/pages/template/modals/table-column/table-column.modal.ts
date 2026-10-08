import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomValidators } from 'src/app/modules';
import { HttpService } from 'src/app/services';
import { unsignVietnamese, uuidv4 } from 'src/app/utils';

@Component({
    standalone: false,
    selector: 'app-table-column-modal',
    templateUrl: './table-column.modal.html',
    styleUrls: ['./table-column.modal.scss']
})
export class TableColumnModal implements OnInit {
    saving = false;
    entityForm: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        public message: MessageService,
    ) {
    }

    ngOnInit() {
        this.initForm();
    }

    save() {
        if (this.entityForm.invalid) {
            this.entityForm.markAllAsTouched();

            return;
        }
        this.ref.close(this.populateEntity());
    }

    cancel() {
        this.ref.close(null);
    }

    private populateEntity(): any {
        const column = this.config.data.item || {};

        return {
            Id: column.Id || uuidv4(),
            Name: this.entityForm.value.name,
            UnsignName: unsignVietnamese(this.entityForm.value.name),
            RowNo: this.entityForm.value.rowNo,
            ColNo: this.entityForm.value.colNo,
            ColSpan: this.entityForm.value.colSpan,
            RowSpan: this.entityForm.value.rowSpan,
            Order: this.entityForm.value.order,
        };
    }

    private initForm(): void {
        const column = this.config.data.item || {};

        this.entityForm = new FormGroup({
            name: new FormControl(column.Name || '', CustomValidators.required()),
            rowNo: new FormControl(column.RowNo || 0, [
                CustomValidators.required(),
                CustomValidators.isNumber(),
                CustomValidators.minNumber(0)
            ]),
            colNo: new FormControl(column.ColNo || 0, [
                CustomValidators.required(),
                CustomValidators.isNumber(),
                CustomValidators.minNumber(0)
            ]),
            colSpan: new FormControl(column.ColSpan || 1, [
                CustomValidators.required(),
                CustomValidators.isNumber(),
                CustomValidators.minNumber(0)
            ]),
            rowSpan: new FormControl(column.RowSpan || 1, [
                CustomValidators.required(),
                CustomValidators.isNumber(),
                CustomValidators.minNumber(0)
            ]),
            order: new FormControl(column.Order || 0, [
                CustomValidators.required(),
                CustomValidators.isNumber(),
                CustomValidators.minNumber(0)
            ]),
        });
    }
}
