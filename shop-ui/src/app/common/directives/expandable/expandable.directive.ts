import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';

@Directive({
  selector: '[appExpandable]'
})
export class ExpandableDirective implements OnInit { // FIXME DONE
  public readonly expanded: InputSignal<boolean> = input.required<boolean>(); // Manages content state (collapsed or expanded)
  public readonly changed: InputSignal<boolean> = input.required<boolean>(); // Used to trigger maxHeight recalculation (expand on demand)
  public readonly count: InputSignal<number> = input.required<number>(); // Count is used to calculate transition duration

  private readonly _ready: WritableSignal<boolean> = signal<boolean>(false);

  constructor(private readonly _elRef: ElementRef<HTMLDivElement>) {

    // Expands the content on changed
    effect((): void => {
      if (this._ready()) {
        const el: HTMLDivElement = this._elRef.nativeElement;
        this.changed();
        requestAnimationFrame((): void => {
          el.style.maxHeight = el.scrollHeight + 'px';
        });
      }
    });

    // Expands or collapses the content on expanded
    effect((): void => {
      if (this._ready()) {
        const el: HTMLDivElement = this._elRef.nativeElement;
        if (this.expanded()) {
          requestAnimationFrame((): void => {
            el.style.maxHeight = el.scrollHeight + 'px';
          });
        } else {
          requestAnimationFrame((): void => {
            el.style.maxHeight = '0px';
          });
        }
      }
    });
  }

  // Sets up the transition and applies the initial collapsed state before the view initializes
  ngOnInit(): void {
    const el: HTMLDivElement = this._elRef.nativeElement;
    const duration: number = 100 * this.count();

    if (!this.expanded()) {
      el.style.maxHeight = '0px'; // If collapsed, hide content before the view initializes
    }
    el.style.overflow = 'hidden';
    el.style.transition = `max-height ${duration}ms ease`;

    this._ready.set(true);
  }

}
