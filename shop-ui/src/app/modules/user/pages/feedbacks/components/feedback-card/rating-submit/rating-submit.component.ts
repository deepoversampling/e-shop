import {Component, computed, effect, input, InputSignal, output, OutputEmitterRef, Signal} from '@angular/core';
import {lengthToArray} from '../../../../../../../common/utils/utils';
import {MAX_RATING} from '../../../../../../../common/constants/constants';

@Component({
  selector: 'app-rating-submit',
  imports: [],
  templateUrl: './rating-submit.component.html',
  styleUrl: './rating-submit.component.scss'
})
export class RatingSubmitComponent { // FIXME DONE
  protected noteHover: number = 0; // Note value during hover event
  protected isHover: boolean = false;

  public readonly note: InputSignal<number> = input.required<number>();
  public readonly noteChange: OutputEmitterRef<number> = output<number>();
  public readonly resetNoteTrigger: InputSignal<boolean> = input.required<boolean>();
  public resetNoteTriggerChange: OutputEmitterRef<boolean> = output<boolean>();

  protected maxRating: Signal<number[]> = computed((): number[] => lengthToArray(MAX_RATING));

  constructor() {
    // When resetNoteTrigger becomes true, emit note with default value 0 and immediately reset the trigger to false
    effect((): void => {
      if (this.resetNoteTrigger()) {
        console.log('resetNoteTrigger()');
        this.noteChange.emit(0);
        this.resetNoteTriggerChange.emit(false);
      }
    });
  }

  protected set noteValue(note: number) {
    this.noteChange.emit(note);
  }

  protected onMouseOver(note: number): void {
    this.isHover = true;
    this.noteHover = note;
  }

  protected onMouseOut(): void {
    this.isHover = false;
  }

}
