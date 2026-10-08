import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { cloneDeep } from 'lodash';

import { ResultCode, ResultModel } from 'src/app/models';
import { CustomValidators } from 'src/app/modules';
import { ShowDialogService } from 'src/app/services/showDialog.service';
import { AuthService, HttpService } from 'src/app/services';
import { unsignVietnamese } from 'src/app/utils';
import { TableColumnModal } from '../table-column/table-column.modal';
import { TableCellModal } from '../table-cell/table-cell.modal';

@Component({
    standalone: false,
    selector: 'app-table-template-modal',
    templateUrl: './table-template.modal.html',
    styleUrls: ['./table-template.modal.scss']
})
export class TableTemplateModal implements OnInit {
    saving: boolean = false;
    tableDetail: any = {};
    tableColumns: any[] = [];
    tableCells: any[] = [];

    entityForm: any;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        public message: MessageService,
        public showDialogService: ShowDialogService,
        public authService: AuthService
    ) {
    }

    async ngOnInit() {
        const id = this.config.data.TableTemplateId;

        if (id) {
            await this.loadData(id);
        }

        this.initForm();
    }

    addColumn() {
        this.showDialogService.showDialog(TableColumnModal, 'Thêm cột', {
        }, (data: any) => {
            if (data) {
                const columns = cloneDeep(this.tableColumns || []);

                // Check existing
                const index = columns.findIndex(tItem => tItem.ColNo === data.ColNo && tItem.RowNo === data.RowNo && tItem.Order === data.Order);

                if (index === -1) {
                    columns.push(data);
                    this.tableColumns = columns;
                } else {
                    this.message.add({ severity: 'error', summary: 'Error', detail: 'Cột đã tồn tại!' });
                }
            }
        }, '60%');
    }

    addCell() {
        this.showDialogService.showDialog(TableCellModal, 'Thêm ô', {
            columns: this.tableColumns
        }, (data: any) => {
            if (data) {
                const cells = cloneDeep(this.tableCells || []);

                // Check existing
                const index = cells.findIndex(tItem => tItem.TableColumnId === data.TableColumnId && tItem.RowNo === data.RowNo);

                if (index === -1) {
                    cells.push(data);
                    this.tableCells = cells;
                } else {
                    this.message.add({ severity: 'error', summary: 'Error', detail: 'Ô đã tồn tại!' });
                }
            }
        }, '60%');
    }

    updateItem(item: any) {
        if (item.IsCell) {
            const cell = this.tableCells.find(tItem => tItem.Id === item.Id);

            this.showDialogService.showDialog(TableCellModal, 'Cập nhật ô', {
                columns: this.tableColumns,
                item: cell
            }, (data: any) => {
                if (data) {
                    const cells = cloneDeep(this.tableCells || []);
                    const index = cells.findIndex(tItem => tItem.Id === item.Id)

                    cells[index] = data;
                    this.tableCells = cells;
                }
            }, '60%');
        } else {
            const column = this.tableColumns.find(tItem => tItem.Id === item.Id);

            this.showDialogService.showDialog(TableColumnModal, 'Cập nhật cột', {
                columns: this.tableColumns,
                item: column
            }, (data: any) => {
                if (data) {
                    const columns = cloneDeep(this.tableColumns || []);
                    const index = columns.findIndex(tItem => tItem.Id === item.Id)

                    columns[index] = data;
                    this.tableColumns = columns;
                }
            }, '60%');
        }
    }

    deleteItem(item: any) {
        if (item.IsCell) {
            const cells = cloneDeep(this.tableCells || []);

            this.tableCells = cells.filter(tItem => tItem.Id !== item.Id);
        } else {
            const columns = cloneDeep(this.tableColumns || []);

            this.tableColumns = columns.filter(tItem => tItem.Id !== item.Id);

            // Remove all cell that has TableColumnId === item.Id
            const cells = cloneDeep(this.tableCells || []);

            this.tableCells = cells.filter(tItem => tItem.TableColumnId !== item.Id);
        }
    }

    save() {
        if (this.entityForm.invalid) {
            this.entityForm.markAllAsTouched();

            return;
        }
        const payload: any = this.populateEntity();

        const id = this.config.data.TableTemplateId;
        let action = 'CreateTableTemplate';

        this.saving = true;
        if (id) {
            // Update
            action = 'UpdateTableTemplate';
        }

        this.http.post(`Template/${action}`, payload, (result: ResultModel) => {
            this.saving = false;
            if (result.Code == ResultCode.Success) {
                this.message.add({ severity: 'success', summary: 'Thông báo', detail: "Thêm thành công!" });
                this.ref.close(true);
            } else {
                this.message.add({ severity: 'error', summary: 'Error', detail: result.Message });
            }
        }, () => {
            this.saving = false;
            this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng kiểm tra Internet!" });
        });
    }

    cancel() {
        this.ref.close(true);
    }

    private loadData(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.saving = true;
            this.http.post("Template/GetTableTemplateDetail", {
                Id: id,
            }, (result: ResultModel) => {
                this.saving = false;
                if (result.Code == ResultCode.Success) {
                    const data = result.Result;
                    this.tableDetail = data && data.TableTemplate;
                    this.tableColumns = data && data.Columns;
                    this.tableCells = data && data.Cells;
                }

                resolve(this.tableDetail);
            }, (error: any) => {
                this.saving = false;
                reject(error);
            });
        })
    }

    private populateEntity(): any {
        return {
            Table: {
                Id: this.config.data.TableTemplateId,
                Name: this.entityForm.value.name,
                UnsignName: unsignVietnamese(this.entityForm.value.name),
                GroupTableId: this.entityForm.value.groupTableId,
                Type: this.entityForm.value.type,
                PeriodType: this.entityForm.value.periodType,
                Order: this.entityForm.value.order,
                UnitCode: this.entityForm.value.unitCode
            },
            Columns: this.tableColumns,
            Cells: this.tableCells
        };
    }

    private initForm(): void {
        const tableTemplate = this.tableDetail || {};

        this.entityForm = new FormGroup({
            name: new FormControl(tableTemplate.Name || '', CustomValidators.required()),
            groupTableId: new FormControl(tableTemplate.GroupTableId || '', CustomValidators.required()),
            type: new FormControl(tableTemplate.Type || '', CustomValidators.required()),
            periodType: new FormControl(tableTemplate.PeriodType || '', CustomValidators.required()),
            order: new FormControl(tableTemplate.Order || 0, [
                CustomValidators.required(),
                CustomValidators.isNumber(),
                CustomValidators.minNumber(0)
            ]),
            unitCode: new FormControl(tableTemplate.UnitCode || '', this.authService.isSuperAdmin() ? CustomValidators.required() : null)
        });
    }
}
