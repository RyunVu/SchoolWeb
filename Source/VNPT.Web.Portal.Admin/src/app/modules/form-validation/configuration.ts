export interface DefaultErrorMessages {
  required: string;
  pattern: string;
  email: string;
  multipleEmails: string;
  minLength: string;
  maxLength: string;
  minNumber: string;
  maxNumber: string;
  isNumber: string;
  noEmpty: string;
  rangeLength: string;
  range: string;
  digit: string;
  equal: string;
  url: string;
  date: string;
  areEqual: string;
  passwords: string;
  strongPassword: string;
  phone: string;
  unknownError: string;
}

export class ValidationMessagesConfig {
  class?: string;
  itemClass?: string;
  defaultErrorMessages?: DefaultErrorMessages;
}

export const defaultConfig: ValidationMessagesConfig = {
  class: 'error-list',
  itemClass: 'error-item',
  defaultErrorMessages: {
    required: 'Trường này là bắt buộc!',
    pattern: 'The input value does not match the pattern required!',
    email: 'Trường này phải là một email hợp lệ!',
    multipleEmails:
      'Please enter valid emails and separate them by using comma (;) character!',
    minLength: 'Chiều dài tối thiểu là {0}!',
    maxLength: 'Chiều dài tối đa là {0}!',
    minNumber: 'Nhập số tối thiểu {0}!',
    maxNumber: 'Maximal value is {0}!',
    isNumber: 'Vui lòng nhập kiểu số!',
    noEmpty: 'Only blank spaces are not allowed!',
    rangeLength: 'The input must be between {0} and {1} symbols long!',
    range: 'The input must be between {0} and {1}!',
    digit: 'Trường này phải là số!',
    equal: 'The input must be equal to {0}!',
    url: 'The input must be a valid URL!',
    date: 'The input must be a valid date!',
    areEqual: 'The values in the group must match!',
    passwords: 'Both fields "Password" and "Confirm Password" must match!',
    strongPassword:
      'Password must at least {0} characters, a lowercase letter, an uppercase letter, a number.',
    phone: 'The input must be a valid phone number!',
    unknownError: 'Unknown Error!',
  },
};
