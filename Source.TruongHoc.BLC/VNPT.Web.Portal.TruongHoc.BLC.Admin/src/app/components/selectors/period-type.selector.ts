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

/**
 * Custom selector for Status List
 */
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'period-type-selector',
    template: `
      <p-dropdown
        [options]="list"
        styleClass="w-100"
        [(ngModel)]="selectedValue"
        (onChange)="change($event)"
        [filter]="false"
        filterBy="Name"
        [optionValue]="optionValue"
        [optionLabel]="optionLabel"
        [placeholder]="placeholder"
        [appendTo]="appendTo"
        [inputId]="inputId"
        [autoDisplayFirst]="false"
        emptyMessage="Không có dữ liệu"
        emptyFilterMessage="Không có dữ liệu"
      >
        <ng-template let-item pTemplate="selectedItem">
          <div>{{ item.Name }}</div>
        </ng-template>
        <ng-template let-item pTemplate="item">
          <div>{{ item.Name }}</div>
        </ng-template>
      </p-dropdown>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => PeriodTypeSelector),
            multi: true,
        },
    ],
})
export class PeriodTypeSelector
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

    constructor() { }

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

    private loadOptions(): void {
        this.list = [{
            Id: 'YEAR',
            Name: 'Theo năm'
        }, {
            Id: 'QUARTER',
            Name: 'Theo quý'
        }, {
            Id: 'MONTH',
            Name: 'Theo tháng'
        }, {
            Id: 'WEEK',
            Name: 'Theo tuần'
        }, {
            Id: 'DAY',
            Name: 'Theo ngày'
        }];

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
}
