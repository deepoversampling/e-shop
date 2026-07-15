import {Component} from '@angular/core';
import {CartResponseDto} from '../../../../../services/models/cart-response-dto';
import {TransactionCardComponent} from '../components/transaction-card/transaction-card.component';
import {CartsInitService} from '../../../../../services/user/carts-init/carts-init.service';
import {ExpandableDirective} from '../../../../../common/directives/expandable/expandable.directive';
import {ThumbnailBarComponent} from '../../../../../common/components/thumbnail-bar/thumbnail-bar.component';
import {MenuComponent} from '../../../../../common/components/menu/menu.component';
import {CurrencyFormatterService} from '../../../../../common/helpers/currency/currency-formatter.service';
import {THUMBNAILS_COUNT} from '../../../../../common/constants/constants';

@Component({
  selector: 'app-transaction-list',
  imports: [
    MenuComponent,
    TransactionCardComponent,
    ThumbnailBarComponent,
    ExpandableDirective
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent {
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

  protected hasItems(cart: CartResponseDto): boolean {
    return cart.items!.length > 0;
  }

  protected getTotal(cart: CartResponseDto): string {
    return this._currencyFormatterService.getCartTotal(cart);
  }

  protected isVisible(cart: CartResponseDto): boolean {
    return this._cartsInitService.isVisible(cart, this._cartsInitService.transactionVisibilities);
  }

  protected changeVisibility(cart: CartResponseDto): void {
    this._cartsInitService.changeVisibility(cart, this._cartsInitService.transactionVisibilities);
  }

  protected getScroll(cart: CartResponseDto): number {
    return this._cartsInitService.getScroll(cart);
  }

  protected setScroll(cart: CartResponseDto, scroll: number): void {
    this._cartsInitService.setScroll(cart, scroll);
  }

  protected getCount(cart: CartResponseDto): number {
    return cart.items!.length;
  }

}
