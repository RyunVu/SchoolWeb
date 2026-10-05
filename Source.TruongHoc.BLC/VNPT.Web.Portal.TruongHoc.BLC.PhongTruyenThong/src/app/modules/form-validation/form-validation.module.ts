import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ValidationMessageComponent } from './validation-msg.component';
import { ValidationMessagesConfig } from './configuration';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [ValidationMessageComponent],
  exports: [ValidationMessageComponent],
})
export class ValidationMessagesModule {
  /**
   * Configure values for the module.
   * @param config Config object with custom global configurations.
   *  E.g. { defaultErrorMessages: { required: 'Default Custom Required Message'}}
   */
  static config(config?: ValidationMessagesConfig): ModuleWithProviders {
    return {
      ngModule: ValidationMessagesModule,
      providers: [
        {
          provide: ValidationMessagesConfig,
          useValue: config,
        },
      ],
    };
  }
}
