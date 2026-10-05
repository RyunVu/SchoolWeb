import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomValidators } from 'src/app/modules';
import { HttpService } from 'src/app/services';
import { unsignVietnamese, uuidv4 } from 'src/app/utils';

@Component({
    selector: 'app-table-cell-modal',
    templateUrl: './table-cell.modal.html',
    styleUrls: ['./table-cell.modal.scss']
})
export class TableCellModal implements OnInit {
    saving = false;
    entityForm: any;

    columns: any[] = [];

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        public message: MessageService,
    ) {
        this.columns = this.config.data.columns || {};
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
        const cell = this.config.data.item || {};

        return {
            Id: cell.Id || uuidv4(),
            Value: this.entityForm.value.value,
            UnsignValue: unsignVietnamese(this.entityForm.value.value),
            RowNo: this.entityForm.value.rowNo,
            TableColumnId: this.entityForm.value.tableColumnId,
            ColSpan: this.entityForm.value.colSpan,
            RowSpan: this.entityForm.value.rowSpan,
            ReadOnly: this.entityForm.value.readonly,
        };
    }

    private initForm(): void {
        const cell = this.config.data.item || {};

        this.entityForm = new FormGroup({
            value: new FormControl(cell.Value || ''),
            rowNo: new FormControl(cell.RowNo || 0, [
                CustomValidators.required(),
                CustomValidators.isNumber(),
                CustomValidators.minNumber(0)
            ]),
            tableColumnId: new FormControl(cell.TableColumnId || '', [
                CustomValidators.required(),
            ]),
            colSpan: new FormControl(cell.ColSpan || 1, [
                CustomValidators.required(),
                CustomValidators.isNumber(),
                CustomValidators.minNumber(0)
            ]),
            rowSpan: new FormControl(cell.RowSpan || 1, [
                CustomValidators.required(),
                CustomValidators.isNumber(),
                CustomValidators.minNumber(0)
            ]),
            readonly: new FormControl(cell.ReadOnly),
        });
    }
}
