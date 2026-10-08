import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ResultCode, ResultModel } from 'src/app/models';

import { HttpService } from 'src/app/services';

/**
 * Custom selector for Status List
 */
@Component({
    standalone: false,
    // tslint:disable-next-line: component-selector
    selector: 'table-group-selector',
    template: `
      <p-select
        [options]="list"
        styleClass="w-100"
        [(ngModel)]="selectedValue"
        (onChange)="change($event)"
        [filter]="true"
        filterBy="Name"
        [optionValue]="optionValue"
        [optionLabel]="optionLabel"
        [placeholder]="placeholder"
        [appendTo]="appendTo"
        [inputId]="inputId"
        emptyMessage="Không có dữ liệu"
        emptyFilterMessage="Không có dữ liệu"
      >
        <ng-template let-item pTemplate="selectedItem">
          <div>{{ item.Name }}</div>
        </ng-template>
        <ng-template let-item pTemplate="item">
          <div>{{ item.Name }}</div>
        </ng-template>
      </p-select>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => TableGroupSelector),
            multi: true,
        },
    ],
})
export class TableGroupSelector
    implements OnInit, OnChanges, ControlValueAccessor {
    @Input() inputId = '';
    @Input() appendTo = 'body';
    @Input() optionLabel = 'Name';
    @Input() optionValue = 'Id';
    @Input() placeholder = '';
    @Input() selectFirstAsDefault = false;
    @Input() allowAllOption = false;
    @Input() excludeOptions: string[] = [];

    @Output() selectorChange = new EventEmitter<any>();

    list: any[] = [];
    selectedValue: any;
    propagateChange = (_: any) => { };

    constructor(public http: HttpService) { }

    ngOnInit(): void {
        this.loadOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.parentId) {
            this.loadOptions();
        }
    }

    writeValue(value: any): void {
        this.selectedValue = value;
        this.triggerChangeEvent(value);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }

    change(event: any): void {
        this.selectedValue = event && event.value;
        this.propagateChange(this.selectedValue);
        this.triggerChangeEvent(this.selectedValue);
    }

    private async loadOptions(): Promise<void> {
        this.list = await this.loadData();

        if (this.selectFirstAsDefault) {
            this.setFirstAsDefault();
        }

        if (this.selectedValue) {
            this.triggerChangeEvent(this.selectedValue);
        }

        if (this.allowAllOption) {
            this.list = [{ Id: '', Name: 'Tất cả' }].concat(this.list);
        }

        if (this.excludeOptions && this.excludeOptions.length) {
            this.list = this.list.filter(
                (item) => !this.excludeOptions.includes(item.Id)
            );
        }
    }

    private setFirstAsDefault(): void {
        if (this.list && this.list.length) {
            this.selectedValue = this.list[0].Id;
            this.propagateChange(this.selectedValue);
        }
    }

    private triggerChangeEvent(value: any): void {
        const selectedItem = this.list.find(
            (item) => item[this.optionValue] === value
        );

        if (selectedItem) {
            this.selectorChange.emit(selectedItem);
        }
    }

    private loadData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post("Template/GetTableGroups", {
            }, (result: ResultModel) => {
                if (result.Code == ResultCode.Success) {
                    resolve(result.Result || []);
                }

                resolve([]);
            }, (err: any) => {
                reject(err);
            });
        })
    }
}
