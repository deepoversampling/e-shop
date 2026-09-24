import {Directive, ElementRef, HostListener} from '@angular/core';
import {PRICE_REGEX} from '../../constants/regex';

@Directive({
  selector: '[appTwoDecimalValidator]'
})
export class TwoDecimalValidatorDirective { // FIXME DONE
  private readonly specialKeys: string[] = ['Backspace', 'Enter', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight'];
  private readonly combinationKeys: string[] = ['a', 'c', 'v', 'x', 'z'];

  constructor(private readonly _inputRef: ElementRef<HTMLInputElement>) {}

  @HostListener('keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent): void {
    // Prevents interfering with special keys or combinations
    if (this.specialKeys.includes(event.key)
      || event.ctrlKey && this.combinationKeys.includes(event.key.toLowerCase())) return;

    const input: HTMLInputElement = this._inputRef.nativeElement;
    const current: string = input.value;
    const selectionIndexFrom: number = input.selectionStart ?? 0;
    const selectionIndexTo: number = input.selectionEnd ?? 0;
    // Simulates the new value of input
    const next: string = current.slice(0, selectionIndexFrom) + event.key + current.slice(selectionIndexTo);

    if (!PRICE_REGEX.test(next)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  private onPaste(event: ClipboardEvent): void {
    const input: HTMLInputElement = this._inputRef.nativeElement;
    const current: string = input.value;
    const selectionIndexFrom: number = input.selectionStart ?? 0;
    const selectionIndexTo: number = input.selectionEnd ?? 0;
    const pasted: string = event.clipboardData?.getData('text') ?? '';
    // Simulates the new value of input
    const next: string = current.slice(0, selectionIndexFrom) + pasted + current.slice(selectionIndexTo);

    if (!PRICE_REGEX.test(next)) {
      event.preventDefault();
    }
  }

}
