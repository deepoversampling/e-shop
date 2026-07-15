import {Component} from '@angular/core';
import {CartCardComponent} from '../components/cart-card/cart-card.component';
import {CartResponseDto} from '../../../../../services/models/cart-response-dto';
import {CartControllerService} from '../../../../../services/services/cart-controller.service';
import {ItemResponseDto} from '../../../../../services/models/item-response-dto';
import {ErrorHandlerService} from '../../../../../services/error-handler/error-handler.service';
import {PaymentControllerService} from '../../../../../services/services/payment-controller.service';
import {CheckoutResponseDto} from '../../../../../services/models/checkout-response-dto';
import {CartsInitService} from '../../../../../services/user/carts-init/carts-init.service';
import {ExpandableDirective} from '../../../../../common/directives/expandable/expandable.directive';
import {ThumbnailBarComponent} from '../../../../../common/components/thumbnail-bar/thumbnail-bar.component';
import {MenuComponent} from '../../../../../common/components/menu/menu.component';
import {CurrencyFormatterService} from '../../../../../common/helpers/currency/currency-formatter.service';
import {THUMBNAILS_COUNT} from '../../../../../common/constants/constants';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  imports: [
    MenuComponent,
    CartCardComponent,
    ThumbnailBarComponent,
    ExpandableDirective
  ],
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent { // FIXME DONE
  protected readonly thumbnailsCount: number = THUMBNAILS_COUNT;

  constructor(
    private readonly _cartsInitService: CartsInitService,
    private readonly _cartService: CartControllerService,
    private readonly _paymentService: PaymentControllerService,
    private readonly _currencyFormatterService: CurrencyFormatterService,
    private readonly _errorHandlerService: ErrorHandlerService
  ) {}

  protected get isReady(): boolean {
    return this._cartsInitService.ready();
  }

  protected get carts(): CartResponseDto[] {
    return this._cartsInitService.carts();
  }

  // Checks if all items are present and available
  protected isCartValid(cart: CartResponseDto): boolean {
    return !(cart.items!
      .some((item: ItemResponseDto): boolean => !item.present! || !item.available!));
  }

  protected isActive(cart: CartResponseDto): boolean {
    return cart.id! === this._cartsInitService.activeCartId;
  }

  protected hasItems(cart: CartResponseDto): boolean {
    return cart.items!.length > 0;
  }

  protected getTotal(cart: CartResponseDto): string {
    return this._currencyFormatterService.getCartTotal(cart);
  }

  protected async createCart(): Promise<void> {
    this._cartService.createCart()
      .subscribe({
        next: async (): Promise<void> => {
          await this._cartsInitService.init();
        },
        error: (err: any): void => {
          this._errorHandlerService.handle(err);
        }
      });
  }

  protected async removeCart(cart: CartResponseDto): Promise<void> {
    const activeCartId: number = this._cartsInitService.activeCartId;

    this._cartService.deleteCartById({
      'cart-id': cart.id!
    }).subscribe({
      next: async (): Promise<void> => {
        await this._cartsInitService.init();
        this._cartsInitService.removeCartStates(cart);
        if (activeCartId !== cart.id!) { // If the removed cart wasn't active, the active one should be reverted
          this.activateCart(activeCartId);
        }
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected activateCart(arg: number | CartResponseDto): void {
    const cartId: number = typeof arg === 'number'
      ? arg
      : arg.id!;

    // Ignores the cart which is already active
    if (cartId === this._cartsInitService.activeCartId) return;
    this._cartsInitService.activeCartId = cartId;
  }

  // Caches are not touched because they will be gone after redirect
  protected pay(cart: CartResponseDto): void {
    this._paymentService.hostedCheckout({
      'cart-id': cart.id!
    }).subscribe({
      next: (checkoutResponseDto: CheckoutResponseDto): void => {
        // Redirects the user to the Stripe-hosted checkout page using the URL returned from the backend
        window.location.href = checkoutResponseDto.url!;
      },
      error: async (err: any): Promise<void> => {
        this._errorHandlerService.handle(err);

        const activeCartId: number = this._cartsInitService.activeCartId;
        await this._cartsInitService.init(); // Refreshes carts to prevent stale variantQuantity next time
        this._cartsInitService.activeCartId = activeCartId;
      }
    });
  }

  protected isVisible(cart: CartResponseDto): boolean {
    return this._cartsInitService.isVisible(cart, this._cartsInitService.cartVisibilities);
  }

  protected changeVisibility(cart: CartResponseDto): void {
    this._cartsInitService.changeVisibility(cart, this._cartsInitService.cartVisibilities);
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
