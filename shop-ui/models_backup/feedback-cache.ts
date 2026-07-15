import {FormControl} from '@angular/forms';

export interface FeedbackCache {
  note: number;
  comment: FormControl<string | null>;
  resetNoteTrigger: boolean;
}
