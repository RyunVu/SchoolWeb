import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SearchEntity } from 'src/app/shared';
import { hkdStatuses, loaiHinhs } from 'src/app/shared/constants';

@Component({
  standalone: false,
  // tslint:disable-next-line: component-selector
  selector: 'business-search-form',
  templateUrl: './business-search-form.component.html',
})
export class BusinessSearchFormComponent implements OnInit, OnDestroy {
  @Input() searchPlaceholder = 'Nhập từ khóa';
  @Input() loading = false;

  @Output() search = new EventEmitter<SearchEntity>();
  @Output() paramsChange = new EventEmitter<SearchEntity>();

  // Internal variables
  searchForm: FormGroup = new FormGroup({});
  paramChangeSub: Subscription;

  hkdStatuses = hkdStatuses;
  loaiHinhs = loaiHinhs;
  constructor() {
    this.initForm();

    this.paramChangeSub = this.searchForm.valueChanges.subscribe((value) => {
      this.paramsChange.emit(value);
    });
  }

  ngOnInit(): void {}

  onFormSubmit(): void {
    if (this.searchForm) {
      this.search.emit(this.searchForm.value);
    }
  }

  reset(): void {
    this.searchForm.reset();
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: no-unused-expression
    this.paramChangeSub && this.paramChangeSub.unsubscribe();
  }

  private initForm(): void {
    this.searchForm = new FormGroup({
      keyword: new FormControl(''),
      streetAddr: new FormControl(''),
      ward: new FormControl(''),
      city: new FormControl(''),
      businessType: new FormControl(''),
      revenueFrom: new FormControl(''),
      revenueTo: new FormControl(''),
      taxFrom: new FormControl(''),
      taxTo: new FormControl(''),
      status: new FormControl(''),
      loaiHinh: new FormControl(''),
    });
  }
}
