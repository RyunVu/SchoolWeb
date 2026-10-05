/**
 * Angular dependence
 */
import {
  AbstractControl,
  Validators,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';
import { get } from 'lodash';
import {
  EmailRegExp,
  MultipleEmailsRegExp,
  StrongPasswordRegExp,
  PhoneRegRex,
  URLRegExp,
} from './regex';

/**
 * A class to implement some custom Angular validators function such as email
 */
export class CustomValidators {
  /**
   * Set the input as required.
   * @param message Custom error message that will be shown to the user.
   */
  static required(message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!Validators.required(control)) {
        return null;
      }

      return {
        required: {
          message,
        },
      };
    };
  }

  /**
   * Set the input as number.
   * @param message Custom error message that will be shown to the user.
   */
  static isNumber(message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (!isNaN(control.value)) {
        return null;
      }

      return {
        isNumber: {
          message,
        },
      };
    };
  }

  /**
   * Will not accept input containing only empty spaces.
   * @param message Custom error message that will be shown to the user.
   */
  static noEmpty(message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (control.value.trim() !== '') {
        return null;
      }

      return {
        noEmpty: {
          message,
        },
      };
    };
  }

  /**
   * Set the minimal required length of the input value
   * @param length Minimal length.
   * @param message Custom error message that will be shown to the user. Supports placeholders.
   */
  static minLength(length: number, message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      const validationResult = Validators.minLength(length)(control);

      if (validationResult) {
        validationResult.minlength.message = message;
      }

      return validationResult;
    };
  }

  /**
   * Set the maximal required length of the input value
   * @param length Maximal length.
   * @param message Custom error message that will be shown to the user. Supports placeholders.
   */
  static maxLength(length: number, message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      const validationResult = Validators.maxLength(length)(control);

      if (validationResult) {
        validationResult.maxlength.message = message;
      }

      return validationResult;
    };
  }

  /**
   * Set the minimal required value of the number input
   * @param min Minimal value.
   * @param message Custom error message that will be shown to the user. Supports placeholders.
   */
  static minNumber(
    min: number,
    message: string = '',
    options?: { notEqual: boolean }
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (control.value >= min && !get(options, 'notEqual')) {
        return null;
      }

      if (control.value > min && get(options, 'notEqual')) {
        return null;
      }

      return {
        minNumber: {
          requiredRange: min,
          message,
        },
      };
    };
  }

  /**
   * Set the maximal required value of the number input
   * @param max Maximal value.
   * @param message Custom error message that will be shown to the user. Supports placeholders.
   */
  static maxNumber(max: number, message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (control.value <= max) {
        return null;
      }

      return {
        maxNumber: {
          requiredRange: max,
          message,
        },
      };
    };
  }

  /**
   * Requires a valid email input.
   * @param message Custom error message that will be shown to the user.
   */
  static email(message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (control.value.match(EmailRegExp)) {
        return null;
      }

      return {
        email: {
          message,
        },
      };
    };
  }

  /**
   * Requires a list of valid email input.
   * @param message Custom error message that will be shown to the user.
   */
  static multipleEmails(message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (control.value.match(MultipleEmailsRegExp)) {
        return null;
      }

      return {
        multipleEmails: {
          message,
        },
      };
    };
  }

  /**
   * Requires a valid password input.
   * @param message       Custom error message that will be shown to the user.
   * @param minLength     Required minimum characters of password
   */
  static strongPassword(
    message: string = '',
    minLength: number = 8
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (control.value.match(StrongPasswordRegExp)) {
        return null;
      }

      return {
        strongPassword: {
          message,
          minLength,
        },
      };
    };
  }

  /**
   * Requires a valid phone input.
   * @param message Custom error message that will be shown to the user.
   */
  static phone(message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (control.value.match(PhoneRegRex)) {
        return null;
      }

      return {
        phone: {
          message,
        },
      };
    };
  }

  /**
   * Requires the input to follow a specific pattern.
   * @param pattern The required pattern.
   * @param message Custom error message that will be shown to the user.
   */
  static pattern(pattern: string, message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      const validationResult = Validators.pattern(pattern)(control);

      if (validationResult) {
        validationResult.pattern.message = message;
      }

      return validationResult;
    };
  }

  /**
   * Requires the input length to be between specific range.
   * @param min Required minimum length.
   * @param max Required maximum length.
   * @param message Custom error message that will be shown to the user.
   */
  static rangeLength(
    min: number,
    max: number,
    message: string = ''
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (control.value.length >= min && control.value.length <= max) {
        return null;
      }

      return {
        rangeLength: {
          message,
          rangeMin: min,
          rangeMax: max,
        },
      };
    };
  }

  /**
   * Requires the input value to be between specific range.
   * @param min Required minimum value.
   * @param max Required maximum value.
   * @param message Custom error message that will be shown to the user.
   */
  static range(min: number, max: number, message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (control.value >= min && control.value <= max) {
        return null;
      }

      return {
        range: {
          message,
          rangeMin: min,
          rangeMax: max,
        },
      };
    };
  }

  /**
   * Requires the input value to be a number.
   * @param message Custom error message that will be shown to the user.
   */
  static digit(message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (!isNaN(control.value) && isFinite(control.value)) {
        return null;
      }

      return {
        digit: {
          message,
        },
      };
    };
  }

  /**
   * Requires the input to equal specific value and type.
   * @param comparer The value that the input must match.
   * @param message Custom error message that will be shown to the user.
   */
  static equal(comparer: any, message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (control.value === comparer) {
        return null;
      }

      return {
        equal: {
          message,
          comparer,
        },
      };
    };
  }

  /**
   * Requires the input to be a valid URL. Urls without http, https or ftp are invalid.
   * @param message Custom error message that will be shown to the user.
   */
  static url(message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      if (control.value.match(URLRegExp)) {
        return null;
      }

      return {
        url: {
          message,
        },
      };
    };
  }

  /**
   * Requires the input to be a valid date.
   * @param message Custom error message that will be shown to the user.
   */
  static date(message: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control)) {
        return null;
      }

      const parsedDate = new Date(control.value);

      if (
        parsedDate.toString() !== 'Invalid Date' &&
        !isNaN(parsedDate.valueOf())
      ) {
        return null;
      }

      return {
        date: {
          message,
        },
      };
    };
  }

  /**
   * Requires all values in a group to be the same.
   * @param message Custom error message that will be shown to the user.
   */
  static areEqual(message: string = ''): any {
    return (group: FormGroup): { [key: string]: any } | null => {
      if (CustomValidators._areGroupInputValuesEqual(group)) {
        return null;
      }

      return {
        areEqual: {
          message,
        },
      };
    };
  }

  /**
   * Requires all values in a group to be equal. Like the 'areEqual'
   * validation extension, but with specific passwords message.
   * @param message Custom error message that will be shown to the user.
   */
  static passwords(message: string = ''): any {
    return (group: FormGroup): { [key: string]: any } | null => {
      if (CustomValidators._areGroupInputValuesEqual(group)) {
        return null;
      }

      return {
        passwords: {
          message,
        },
      };
    };
  }

  private static _areGroupInputValuesEqual(group: FormGroup): boolean {
    const keys: string[] = Object.keys(group.controls);
    const keysLength = keys.length;

    if (!keysLength) {
      return true;
    }

    const initialControl = group.controls[keys[0]];

    for (let i = 1; i < keysLength; i++) {
      const currentKey = keys[i];

      if (initialControl.value !== group.controls[currentKey].value) {
        return false;
      }
    }

    return true;
  }

  static compare(field: string, message: string = ''): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.parent || !control.value) {
        return null;
      }

      const controlCompare = (control.parent.controls as any)[field];

      if (!controlCompare.value) {
        return null;
      }

      if (control.value.trim() !== controlCompare.value.trim()) {
        return {
          compare: {
            message,
          },
        };
      }

      return null;
    };
  }

  static different(field: string, message = ''): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.parent || !control.value) {
        return null;
      }

      const controlDifferent = (control.parent.controls as any)[field];

      if (!controlDifferent.value) {
        return null;
      }

      if (control.value.trim() === controlDifferent.value.trim()) {
        return {
          different: {
            message,
          },
        };
      }

      return null;
    };
  }
}
