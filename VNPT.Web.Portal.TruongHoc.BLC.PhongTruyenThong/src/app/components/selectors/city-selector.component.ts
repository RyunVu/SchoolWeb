import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { HttpService } from 'src/app/services';
import { Parameter } from 'src/app/services/staticparameters.service';

/**
 * Custom selector for Cities List
 */
@Component({
  standalone: false,
  // tslint:disable-next-line: component-selector
  selector: 'city-selector',
  template: `
    <p-select
      [options]="cities"
      styleClass="w-100"
      [(ngModel)]="selectedValue"
      (onChange)="onChange($event)"
      [filter]="true"
      [optionValue]="optionValue"
      [optionLabel]="optionLabel"
      [placeholder]="placeholder"
      [appendTo]="appendTo"
      [inputId]="inputId"
      [disabled]="disabled"
      emptyMessage="Không có dữ liệu"
      emptyFilterMessage="Không có dữ liệu"
    ></p-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable-next-line:no-forward-ref
      useExisting: forwardRef(() => CitySelectorComponent),
      multi: true,
    },
  ],
})
export class CitySelectorComponent implements OnInit, ControlValueAccessor {
  @Input() inputId = '';
  @Input() appendTo: string | undefined;
  @Input() optionLabel = 'Name';
  @Input() optionValue = 'Id';
  @Input() placeholder = 'Tỉnh/Thành phố';
  @Input() selectFirstAsDefault = false;
  @Input() allowAllOption = true;
  @Input() checkPermisstion: boolean = false;
  @Input() disabled: boolean = false;

  @Output() selectorChange = new EventEmitter<any>();

  cities: any[] = [];
  selectedValue: any;
  propagateChange = (_: any) => { };

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.loadCities();
  }

  writeValue(value: any): void {
    this.selectedValue = value;
    this.triggerChangeEvent(value);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  onChange(event: any): void {
    this.selectedValue = event && event.value;
    this.propagateChange(this.selectedValue);
    this.triggerChangeEvent(this.selectedValue);
  }

  private loadCities(): void {
    if (this.checkPermisstion) {
      this.httpService.post(
        'UserLocation/GetCities',
        { ParentId: Parameter.province.Id },
        (res: any) => {
          this.cities = res.Result || [];
          if (this.selectFirstAsDefault) {
            this.setFirstAsDefault();
          }
          if (this.selectedValue) {
            this.triggerChangeEvent(this.selectedValue);
          }
          if (this.allowAllOption) {
            this.cities = [{ Id: '', Name: 'Tất cả' }].concat(this.cities);
          }
        },
        (error: any) => {
          // throw error;
        }
      );
    } else {
      this.httpService.post(
        'Location/GetCities',
        { Code: 'DLT' },
        (res: any) => {
          this.cities = res.Result || [];
          if (this.selectFirstAsDefault) {
            this.setFirstAsDefault();
          }
          if (this.selectedValue) {
            this.triggerChangeEvent(this.selectedValue);
          }
          if (this.allowAllOption) {
            this.cities = [{ Id: '', Name: 'Tất cả' }].concat(this.cities);
          }
        },
        (error: any) => {
          // throw error;
        }
      );
    }

  }

  private setFirstAsDefault(): void {
    if (this.cities && this.cities.length) {
      this.selectedValue = this.cities[0].Id;
      this.propagateChange(this.selectedValue);
    }
  }

  private triggerChangeEvent(value: any): void {
    const selectedCity = this.cities.find(
      (item) => item[this.optionValue] === value
    );

    if (selectedCity) {
      this.selectorChange.emit(selectedCity);
    }
  }
}
