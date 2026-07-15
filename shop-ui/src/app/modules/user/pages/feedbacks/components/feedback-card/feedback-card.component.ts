import {ItemResponseDto} from '../../../../../../services/models/item-response-dto';
import {CartResponseDto} from '../../../../../../services/models/cart-response-dto';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FeedbackControllerService} from '../../../../../../services/services/feedback-controller.service';
import {
  ImgErrorHandlerDirective
} from '../../../../../../common/directives/img-error-handler/img-error-handler.directive';
import {Component, input, InputSignal} from '@angular/core';
import {ErrorHandlerService} from '../../../../../../services/error-handler/error-handler.service';
import {NgOptimizedImage} from '@angular/common';
import {CartsInitService} from '../../../../../../services/user/carts-init/carts-init.service';
import {RatingComponent} from '../../../../../../common/components/rating/rating.component';
import {RatingSubmitComponent} from './rating-submit/rating-submit.component';
import {CurrencyFormatterService} from '../../../../../../common/helpers/currency/currency-formatter.service';
import {ItemPropertiesFormatterService} from '../../../../../../common/helpers/item/item-properties-formatter.service';
import {toNgSrc} from '../../../../../../common/utils/utils';
import {IMAGE_FIT, IMAGE_SIZE} from '../../../../../../common/constants/constants';
import {FeedbackResponseDto} from '../../../../../../services/models/feedback-response-dto';
import {ToastrService} from 'ngx-toastr';
import {SearchInitService} from '../../../../../../services/search-init/search-init.service';

@Component({
  selector: 'app-feedback-card',
  imports: [
    RatingComponent,
    RatingSubmitComponent,
    FormsModule,
    ReactiveFormsModule,
    ImgErrorHandlerDirective,
    NgOptimizedImage
  ],
  templateUrl: './feedback-card.component.html',
  styleUrl: './feedback-card.component.scss'
})
export class FeedbackCardComponent { // FIXME DONE
  public readonly cart: InputSignal<CartResponseDto> = input.required<CartResponseDto>();

  constructor(
    private readonly _itemPropertiesFormatterService: ItemPropertiesFormatterService,
    private readonly _feedbackService: FeedbackControllerService,
    private readonly _cartsInitService: CartsInitService,
    private readonly _currencyFormatterService: CurrencyFormatterService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _toastrService: ToastrService,
    private readonly _searchInitService: SearchInitService
  ) {}

  protected getItemProperties(item: ItemResponseDto): string[] {
    return this._itemPropertiesFormatterService.formatItemProperties(item);
  }

  protected getComment(item: ItemResponseDto): FormControl<string | null> {
    return this._cartsInitService.getFeedbackCacheComment(item);
  }

  protected getNote(item: ItemResponseDto): number {
    return this._cartsInitService.getFeedbackCacheNote(item);
  }

  protected setNote(note: number, item: ItemResponseDto): void {
    this._cartsInitService.setFeedbackCacheNote(note, item);
  }

  protected getResetNoteTrigger(item: ItemResponseDto): boolean {
    return this._cartsInitService.getFeedbackCacheResetNoteTrigger(item);
  }

  protected setResetNoteTrigger(state: boolean, item: ItemResponseDto): void {
    this._cartsInitService.setFeedbackCacheResetNoteTrigger(state, item);
  }

  protected hasFeedback(item: ItemResponseDto): boolean {
    return item.note !== undefined;
  }

  protected resetNote(item: ItemResponseDto): void {
    // Only notes other than default 0 will trigger reset note
    if (this.getNote(item) !== 0) {
      this.setResetNoteTrigger(true, item);
    }
  }

  protected hasComment(item: ItemResponseDto): boolean {
    return !this.getComment(item).invalid;
  }

  protected getTitle(item: ItemResponseDto): string {
    return this._currencyFormatterService.getItemSummary(item);
  }

  protected getNgSrc(item: ItemResponseDto): string {
    return toNgSrc(item.productSnapshot?.imageUrl!, IMAGE_SIZE, IMAGE_FIT);
  }

  protected addFeedback(item: ItemResponseDto): void {
    const comment: string | null = this.getComment(item).value;
    if (comment === null) return;

    this._feedbackService.createFeedback({
      body: {
        comment: comment,
        itemId: item.id!,
        note: this.getNote(item)
      }
    }).subscribe({
      next: async (feedback: FeedbackResponseDto): Promise<void> => {
        await this._cartsInitService.init();
        this._cartsInitService.removeFeedbackCache(item);

        this._searchInitService.hasResponse = false; // To reflect the commited note immediately, the response is set to false

        this._toastrService.success(
          `Feedback with the comment "${feedback.comment}" and note ${feedback.note} has been given`,
          'Success'
        );
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  // Flips the state of feedback resize trigger when validation error occurs
  // This will allow expendable directive to recalculate maxHeight multiple times on both states of feedback resize trigger
  protected updateFeedbackResizeTrigger(item: ItemResponseDto): void {
    const comment: FormControl<string | null> = this.getComment(item);
    const hasError: boolean = comment.hasError('required') || comment.hasError('maxlength');
    if (hasError) {
      const feedbackResizeTrigger: boolean = this._cartsInitService.getFeedbackResizeTrigger(this.cart());
      this._cartsInitService.setFeedbackResizeTrigger(!feedbackResizeTrigger, this.cart());
    }
  }

}
