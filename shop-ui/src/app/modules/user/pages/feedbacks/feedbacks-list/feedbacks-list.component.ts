import {Component, effect} from '@angular/core';
import {CartResponseDto} from '../../../../../services/models/cart-response-dto';
import {FeedbackCardComponent} from '../components/feedback-card/feedback-card.component';
import {CartsInitService} from '../../../../../services/user/carts-init/carts-init.service';
import {ExpandableDirective} from '../../../../../common/directives/expandable/expandable.directive';
import {ThumbnailBarComponent} from '../../../../../common/components/thumbnail-bar/thumbnail-bar.component';
import {MenuComponent} from '../../../../../common/components/menu/menu.component';
import {CurrencyFormatterService} from '../../../../../common/helpers/currency/currency-formatter.service';
import {hasPendingFeedback} from '../../../../../common/utils/cart/cart-utils';
import {THUMBNAILS_COUNT} from '../../../../../common/constants/constants';

@Component({
  selector: 'app-feedbacks-list',
  imports: [
    MenuComponent,
    FeedbackCardComponent,
    ThumbnailBarComponent,
    ExpandableDirective
  ],
  templateUrl: './feedbacks-list.component.html',
  styleUrl: './feedbacks-list.component.scss'
})
export class FeedbacksListComponent { // FIXME DONE
  protected readonly thumbnailsCount: number = THUMBNAILS_COUNT;

  constructor(
    private readonly _cartsInitService: CartsInitService,
    private readonly _currencyFormatterService: CurrencyFormatterService,
  ) {}

  protected get isReady(): boolean {
    return this._cartsInitService.ready();
  }

  protected get carts(): CartResponseDto[] {
    return this._cartsInitService.carts();
  }

  protected getTotal(cart: CartResponseDto): string {
    return this._currencyFormatterService.getCartTotal(cart);
  }

  protected hasItems(cart: CartResponseDto): boolean {
    return cart.items!.length > 0;
  }

  protected hasPendingFeedback(cart: CartResponseDto): boolean {
    return hasPendingFeedback(cart);
  }

  protected isVisible(cart: CartResponseDto): boolean {
    return this._cartsInitService.isVisible(cart, this._cartsInitService.feedbackVisibilities);
  }

  protected changeVisibility(cart: CartResponseDto): void {
    this._cartsInitService.changeVisibility(cart, this._cartsInitService.feedbackVisibilities);
  }

  protected getScroll(cart: CartResponseDto): number {
    return this._cartsInitService.getScroll(cart);
  }

  protected setScroll(cart: CartResponseDto, scroll: number): void {
    this._cartsInitService.setScroll(cart, scroll);
  }

  protected getFeedbackResizeTrigger(cart: CartResponseDto): boolean {
    return this._cartsInitService.getFeedbackResizeTrigger(cart);
  }

  protected getCount(cart: CartResponseDto): number {
    return cart.items!.length;
  }

}
