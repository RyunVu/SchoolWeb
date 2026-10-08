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
 * Custom selector for Street List
 */
@Component({
  standalone: false,
  // tslint:disable-next-line: component-selector
  selector: 'street-selector',
  template: `
    <p-select
      [options]="streets"
      styleClass="w-100"
      [(ngModel)]="selectedValue"
      (onChange)="change($event)"
      [filter]="true"
      [optionValue]="optionValue"
      [disabled]="disabled"
      [optionLabel]="optionLabel"
      [placeholder]="placeholder"
      [inputId]="inputId"
      [appendTo]="appendTo"
      emptyMessage="Không có dữ liệu"
      emptyFilterMessage="Không có dữ liệu"
    ></p-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => StreetSelectorComponent),
      multi: true,
    },
  ],
})
export class StreetSelectorComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  @Input() inputId = '';
  @Input() appendTo: string | undefined;
  @Input() optionLabel = 'Name';
  @Input() optionValue = 'Id';
  @Input() placeholder = 'Tên đường';
  @Input() parentId = '';
  @Input() allowAllOption = true;

  @Input() disabled: boolean = false;
  @Output() selectorChange = new EventEmitter<any>();

  streets: any[] = [];
  selectedValue: any;
  debouncedLoadStreets = debounce(this.loadStreets, 1000);
  propagateChange = (_: any) => {};

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.debouncedLoadStreets();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.parentId) {
      this.debouncedLoadStreets();
    }
  }

  writeValue(value: any): void {
    this.selectedValue = value;
    this.triggerChangeEvent(value);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  change(event: any): void {
    this.selectedValue = event && event.value;
    this.propagateChange(this.selectedValue);
    this.triggerChangeEvent(this.selectedValue);
  }

  private loadStreets(): void {
    this.httpService.post(
      'Location/GetStreets',
      { ParentId: this.parentId },
      (res: any) => {
        this.streets = res.Result || [];

        if (this.allowAllOption) {
          this.streets = [{ Id: '', Name: 'Tất cả' }].concat(this.streets);
        }

        if (this.selectedValue) {
          this.triggerChangeEvent(this.selectedValue);
        }
      },
      (error: any) => {
        // throw error;
      }
    );
  }

  private triggerChangeEvent(value: any): void {
    const selectedCity = this.streets.find(
      (item) => item[this.optionValue] === value
    );

    if (selectedCity) {
      this.selectorChange.emit(selectedCity);
    }
  }
}
