import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { HttpService } from 'src/app/services';

/**
 * Custom selector for Cities List
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'business-type-selector',
  template: `
    <p-dropdown
      [options]="businessTypes"
      styleClass="w-100"
      [(ngModel)]="selectedValue"
      (onChange)="change($event)"
      [filter]="true"
      [optionValue]="optionValue"
      [optionLabel]="optionLabel"
      [placeholder]="placeholder"
      [autoDisplayFirst]="false"
      [appendTo]="appendTo"
      emptyMessage="Không có dữ liệu"
      emptyFilterMessage="Không có dữ liệu"
    ></p-dropdown>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => BusinessTypeSelectorComponent),
      multi: true,
    },
  ],
})
export class BusinessTypeSelectorComponent
  implements OnInit, ControlValueAccessor
{
  @Input() appendTo = '';
  @Input() optionLabel = 'Name';
  @Input() optionValue = 'Id';
  @Input() placeholder = 'Lĩnh vực';
  @Input() allowAllOption = true;

  businessTypes: any[] = [];
  selectedValue: any;
  propagateChange = (_: any) => {};

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.loadBusinessTypes();
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  change(event: any): void {
    this.selectedValue = event && event.value;
    this.propagateChange(this.selectedValue);
  }

  private loadBusinessTypes(): void {
    this.httpService.post(
      'GeneralCategory/Items',
      { Code: 'LinhVucHKD' },
      (res: any) => {
        this.businessTypes = res.Result || [];

        if (this.allowAllOption) {
          this.businessTypes = [{ Id: '', Name: 'Tất cả' }].concat(this.businessTypes);
        }
      },
      (error: any) => {
        // throw error;
      }
    );
  }
}
