import {Injectable} from '@angular/core';
import {CartResponseDto} from '../../../services/models/cart-response-dto';
import {ItemResponseDto} from '../../../services/models/item-response-dto';
import {ErrorHandlerService} from '../../../services/error-handler/error-handler.service';
import {FeedbackControllerService} from '../../../services/services/feedback-controller.service';
import {FeedbackResponseDto} from '../../../services/models/feedback-response-dto';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartHelpersService { // FIXME DONE

  constructor(
    private readonly _feedbackService: FeedbackControllerService,
    private readonly _errorHandlerService: ErrorHandlerService
  ) {}

  public async resolveFeedbacksOfCarts(carts: CartResponseDto[]): Promise<void[]> {
    return await Promise.all(
      carts
        .map(async (cart: CartResponseDto): Promise<void> => {
          // Feedbacks fetched per cart
          let cartFeedbacks: FeedbackResponseDto[] = [];

          if (cart.isPaid!) {
            try {
              cartFeedbacks = await firstValueFrom(
                this._feedbackService.getFeedbacksByCartId({
                  'cart-id': cart.id!
                })
              );
            } catch (err: any) {
              this._errorHandlerService.handle(err);
              return;
            }

            // Items are decorated with note and comment property from fetched feedbacks
            cart.items!
              .forEach((item: ItemResponseDto): void => {
                const note: number | undefined = cartFeedbacks
                  .find((feedback: FeedbackResponseDto): boolean => feedback.productVariantId === item.productSnapshot?.productVariantId)?.note;
                const comment: string | undefined = cartFeedbacks
                  .find((feedback: FeedbackResponseDto): boolean => feedback.productVariantId === item.productSnapshot?.productVariantId)?.comment;

                item.note = note;
                item.comment = comment;
              });
          }
        })
    );
  }

}
