import { ElementRef } from '@angular/core';
import { ImgErrorHandlerDirective } from './img-error-handler.directive';

describe('ImgErrorHandlerDirective', () => {
  it('should create an instance', () => {
    const mockEl = {
      nativeElement: document.createElement('img')
    } as ElementRef;

    const directive = new ImgErrorHandlerDirective(mockEl);
    expect(directive).toBeTruthy();
  });
});
