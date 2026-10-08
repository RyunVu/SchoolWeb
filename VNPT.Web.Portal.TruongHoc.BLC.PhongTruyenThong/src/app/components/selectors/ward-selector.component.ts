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
import { debounce } from 'lodash';

import { HttpService } from 'src/app/services';

/**
 * Custom selector for Ward List
 */
@Component({
    standalone: false,
    // tslint:disable-next-line: component-selector
    selector: 'ward-selector',
    template: `
    <p-select
      [options]="wards"
      styleClass="w-100"
      [(ngModel)]="selectedValue"
      (onChange)="change($event)"
      [filter]="true"
      [optionValue]="optionValue"
      [optionLabel]="optionLabel"
      [disabled]="disabled"
      [placeholder]="placeholder"
      [appendTo]="appendTo"
      [inputId]="inputId"
      emptyMessage="Không có dữ liệu"
      emptyFilterMessage="Không có dữ liệu"
    ></p-select>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            // tslint:disable-next-line:no-forward-ref
            useExisting: forwardRef(() => WardSelectorComponent),
            multi: true,
        },
    ],
})
export class WardSelectorComponent
    implements OnInit, OnChanges, ControlValueAccessor {
    @Input() inputId = '';
    @Input() appendTo: string | undefined;
    @Input() optionLabel = 'Name';
    @Input() optionValue = 'Id';
    @Input() placeholder = 'Xã/Phường';
    @Input() parentId = '';
    @Input() selectFirstAsDefault = false;
    @Input() allowAllOption = true;
    @Input() checkPermisstion: boolean = false;
    @Input() disabled: boolean = false;
    @Output() selectorChange = new EventEmitter<any>();

    wards: any[] = [];
    selectedValue: any;
    debouncedLoadWards = debounce(this.loadWards, 500);
    propagateChange = (_: any) => { };

    constructor(private httpService: HttpService) { }

    ngOnInit(): void {
        this.debouncedLoadWards();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.parentId) {
            this.debouncedLoadWards();
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

    private loadWards(): void {
        if (this.checkPermisstion) {
            this.httpService.post(
                'UserLocation/GetWards',
                { ParentId: this.parentId },
                (res: any) => {
                    this.wards = res.Result || [];

                    if (this.selectFirstAsDefault) {
                        this.setFirstAsDefault();
                    }

                    if (this.selectedValue) {
                        this.triggerChangeEvent(this.selectedValue);
                    }

                    if (this.allowAllOption) {
                        this.wards = [{ Id: '', Name: 'Tất cả' }].concat(this.wards);
                    }
                },
                (error: any) => {
                    // throw error;
                }
            );
        } else {
            this.httpService.post(
                'Location/GetWards',
                { ParentId: this.parentId },
                (res: any) => {
                    this.wards = res.Result || [];

                    if (this.selectFirstAsDefault) {
                        this.setFirstAsDefault();
                    }

                    if (this.selectedValue) {
                        this.triggerChangeEvent(this.selectedValue);
                    }

                    if (this.allowAllOption) {
                        this.wards = [{ Id: '', Name: 'Tất cả' }].concat(this.wards);
                    }
                },
                (error: any) => {
                    // throw error;
                }
            );
        }
    }

    private setFirstAsDefault(): void {
        if (this.wards && this.wards.length) {
            this.selectedValue = this.wards[0].Id;
            this.propagateChange(this.selectedValue);
        }
    }

    private triggerChangeEvent(value: any): void {
        const selectedCity = this.wards.find(
            (item) => item[this.optionValue] === value
        );

        if (selectedCity) {
            this.selectorChange.emit(selectedCity);
        }
    }
}
