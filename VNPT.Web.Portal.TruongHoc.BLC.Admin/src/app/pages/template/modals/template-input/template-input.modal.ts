import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { orderBy, groupBy, filter } from 'lodash';

import { ResultCode, ResultModel } from 'src/app/models';
import { HttpService } from 'src/app/services';
import { getCurrentPeriodByType, unsignVietnamese } from 'src/app/utils';

@Component({
    selector: 'app-template-input-modal',
    templateUrl: './template-input.modal.html',
    styleUrls: ['./template-input.modal.scss']
})
export class TemplateInputModal implements OnInit {
    tableData: any;
    tableDetail: any;
    loading: boolean = false;
    periodType: any;
    period: any;

    tableHeader: any[] = [];
    tableColumns: any[] = [];
    tableRows: any[] = [];
    tableValues: any[] = [];

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public http: HttpService,
        public message: MessageService,
    ) {
        this.tableData = this.config.data;
        this.periodType = this.tableData.PeriodType;
        this.period = getCurrentPeriodByType(this.periodType);
    }

    ngOnInit() {
        this.loadData(this.tableData.Id, this.period);
    }

    onChangePeriod() {
        this.loadData(this.tableData.Id, this.period);
    }

    save() {
        const payload: any = this.populatePayload(this.tableRows);

        this.loading = true;
        this.http.post("Template/SaveTableValues", payload, (result: ResultModel) => {
            this.loading = false;
            if (result.Code == ResultCode.Success) {
                this.message.add({ severity: 'success', summary: 'Thông báo', detail: "Thay đổi thành công!" });
                this.ref.close(true);
            } else {
                this.message.add({ severity: 'error', summary: 'Error', detail: result.Message });
            }
        }, () => {
            this.loading = false;
            this.message.add({ severity: 'error', summary: 'Error', detail: "Vui lòng kiểm tra Internet!" });
        });
    }

    cancel() {
        this.ref.close(true);
    }

    private loadData(id: any, period: any): void {
        this.loading = true;
        this.http.post("Template/GetTableValues", {
            TableTemplateId: id,
            Period: period
        }, (result: ResultModel) => {
            this.loading = false;
            if (result.Code == ResultCode.Success) {
                this.tableDetail = result.Result;

                this.tableHeader = this.populateTableHeader(this.tableDetail.Columns || []);
                this.tableValues = this.tableDetail.Values || [];
                this.tableColumns = this.populateTableCols(this.tableDetail.Columns || []);
                this.tableRows = this.populateTableRows(this.tableDetail.Cells || []);

                // Set default cell for missing cell based on columns
                this.tableRows.forEach(row => {
                    this.tableColumns.forEach(col => {
                        if (!row[col.Id]) {
                            row[col.Id] = {};
                        }
                    });
                });
            }
        }, () => {
            this.loading = false;
        });
    }

    private populateTableHeader(cols: any[]) {
        const groupByRow = groupBy(cols, 'RowNo');

        // Sort keys by asc then Parse groupByRow to array
        const rows = Object.keys(groupByRow).sort((a: any, b: any) => a - b).map((key) => {
            const values = groupByRow[key];

            return orderBy(values, 'Order');
        });

        return rows;
    }

    private populateTableCols(cols: any[]) {
        return orderBy(filter(cols, col => !(col.ColSpan > 1)), 'ColNo');
    }

    private populateTableRows(cells: any[]) {
        const groupByRow = groupBy(cells, 'RowNo');

        // Sort keys by asc then Parse groupByRow to array
        const result = Object.keys(groupByRow).sort((a: any, b: any) => a - b).map((key) => {
            const cells = groupByRow[key];
            const obj: any = {};

            cells.forEach((cell: any) => {
                const tbtValue = this.tableValues.find(v => v.TableCellId === cell.Id) || {};

                obj[cell.TableColumnId] = {
                    Value: cell.ReadOnly ? cell.Value : tbtValue.Value,
                    TableCellId: cell.Id,
                    ReadOnly: cell.ReadOnly
                };
            });

            return obj;
        });

        return result;
    }

    private populatePayload(rows: any[]) {
        const values: any[] = [];

        rows.forEach(row => {
            Object.keys(row).forEach(key => {
                if (!row[key].ReadOnly) {
                    values.push({
                        TableCellId: row[key].TableCellId,
                        Value: row[key].Value,
                        UnsignValue: unsignVietnamese(row[key].Value)
                    });
                }
            });
        });

        return {
            TableTemplateId: this.tableData.Id,
            Period: this.period,
            Values: values
        };
    }
}
