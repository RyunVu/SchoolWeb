import {
  Component,
  Input,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

import {
  ValidationMessagesConfig,
  defaultConfig,
  DefaultErrorMessages,
} from './configuration';
import { MessageProvider } from './message-provider';

@Component({
  standalone: false,
  // tslint:disable-next-line: component-selector
  selector: 'validation-msg',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'validation-msg.component.html',
  styleUrls: ['./validation-msg.component.scss'],
})
export class ValidationMessageComponent implements OnInit {
  @Input() control: AbstractControl | undefined;
  @Input() class = 'errors';
  @Input() itemClass = 'error-item';

  config: ValidationMessagesConfig = defaultConfig;
  messageProvider: MessageProvider;

  constructor(@Optional() customConfig: ValidationMessagesConfig) {
    if (customConfig) {
      this.config = {
        ...defaultConfig,
        ...customConfig,
      };
    }

    this.messageProvider = new MessageProvider(
      this.config.defaultErrorMessages as DefaultErrorMessages
    );
  }

  ngOnInit(): void {
    this._overrideLocalConfiguration();
  }

  get errors(): string[] {
    const errors: string[] = [];

    // Only display error message if user has touched the control
    if (this.control && this.control.touched) {
      // tslint:disable-next-line:forin
      for (const errorPropertyName in this.control.errors) {
        const msg = this.messageProvider.getErrorMessage(
          errorPropertyName,
          this.control.errors[errorPropertyName]
        );

        if (msg) {
          errors.push(msg);
        }
      }
    }

    return errors;
  }

  /**
   * Merge instance specific configuration with the default and/or custom one.
   */
  private _overrideLocalConfiguration(): void {
    if (this.class) {
      this.config.class = this.class;
    }
  }
}
