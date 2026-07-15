import { ElementRef } from '@angular/core';
import { TwoDecimalValidatorDirective } from './two-decimal-validator.directive';

describe('TwoDecimalValidatorDirective', () => {
  it('should create an instance', () => {
    const mockEl = {
      nativeElement: document.createElement('input')
    } as ElementRef;

    const directive = new TwoDecimalValidatorDirective(mockEl);
    expect(directive).toBeTruthy();
  });
});
