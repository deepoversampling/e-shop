import {Component, input, InputSignal} from '@angular/core';
import {lengthToArray} from '../../utils/utils';
import {MAX_RATING} from '../../constants/constants';

@Component({
  selector: 'app-rating',
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent { // FIXME DONE
  public readonly rating: InputSignal<number> = input.required<number>();

  protected get fullStars(): number[] {
    return lengthToArray(Math.floor(this.rating()));
  }

  protected get hasHalfStar(): boolean {
    return this.rating() % 1 !== 0;
  }

  protected get emptyStars(): number[] {
    return lengthToArray(MAX_RATING - Math.ceil(this.rating()));
  }

}
