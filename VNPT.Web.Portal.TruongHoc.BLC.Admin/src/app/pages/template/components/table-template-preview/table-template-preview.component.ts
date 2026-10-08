import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { orderBy, groupBy, filter, debounce } from 'lodash';

@Component({
    standalone: false,
    selector: 'table-template-preview-component',
    templateUrl: './table-template-preview.component.html',
    styleUrls: ['./table-template-preview.component.scss']
})
export class TableTemplatePreviewComponent implements OnInit, OnChanges {
    @Input() columns: any = [];
    @Input() cells: any = [];

    @Output() updateAction = new EventEmitter<any>();
    @Output() deleteAction = new EventEmitter<any>();

    tableHeader: any[] = [];
    tableColumns: any[] = [];
    tableRows: any[] = [];

    selectedItem: any;

    showContextMenu: any = debounce(this._showContextMenu, 400);
    hideContextMenu: any = debounce(this._hideContextMenu, 400);

    constructor(
        public message: MessageService,
    ) {
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.loadTablePreview();
    }

    ngOnInit() {
    }

    _showContextMenu(event: any, selectedItem: any) {
        if (!selectedItem) {
            return;
        }
        const contextMenu = document.getElementById('contextMenu');
        if (contextMenu) {
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${event.clientX - 50}px`;
            contextMenu.style.top = `${event.clientY - 50}px`;
        }

        this.selectedItem = selectedItem;
    }

    _hideContextMenu(event: any, force: boolean = false) {
        const contextMenu = document.getElementById('contextMenu');
        if (contextMenu && (force || !contextMenu.contains(event.relatedTarget as Node))) {
            contextMenu.style.display = 'none';

            this.selectedItem = null;
        }
    }

    updateItem() {
        this.updateAction.emit(this.selectedItem);
        this._hideContextMenu({}, true);
    }

    deleteItem() {
        this.deleteAction.emit(this.selectedItem);
        this._hideContextMenu({}, true);
    }

    private loadTablePreview() {
        this.tableHeader = this.populateTableHeader(this.columns || []);
        this.tableColumns = this.populateTableCols(this.columns || []);
        this.tableRows = this.populateTableRows(this.cells || []);
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
                obj[cell.TableColumnId] = {
                    Id: cell.Id,
                    Value: cell.ReadOnly ? cell.Value : '{{Người dùng nhập liệu}}',
                    TableCellId: cell.Id,
                    ReadOnly: cell.ReadOnly,
                    IsCell: true,
                };
            });

            return obj;
        });

        return result;
    }
}
