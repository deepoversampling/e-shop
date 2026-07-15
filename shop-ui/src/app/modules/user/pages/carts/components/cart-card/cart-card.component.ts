import {Component, input, InputSignal} from '@angular/core';
import {CartResponseDto} from '../../../../../../services/models/cart-response-dto';
import {CartControllerService} from '../../../../../../services/services/cart-controller.service';
import {ItemResponseDto} from '../../../../../../services/models/item-response-dto';
import {
  ImgErrorHandlerDirective
} from '../../../../../../common/directives/img-error-handler/img-error-handler.directive';
import {FormsModule} from '@angular/forms';
import {ErrorHandlerService} from '../../../../../../services/error-handler/error-handler.service';
import {NgOptimizedImage} from '@angular/common';
import {CartsInitService} from '../../../../../../services/user/carts-init/carts-init.service';
import {CurrencyFormatterService} from '../../../../../../common/helpers/currency/currency-formatter.service';
import {ItemPropertiesFormatterService} from '../../../../../../common/helpers/item/item-properties-formatter.service';
import {toNgSrc} from '../../../../../../common/utils/utils';
import {IMAGE_FIT, IMAGE_SIZE} from '../../../../../../common/constants/constants';

@Component({
  selector: 'app-cart-card',
  imports: [
    ImgErrorHandlerDirective,
    FormsModule,
    NgOptimizedImage
  ],
  templateUrl: './cart-card.component.html',
  styleUrl: './cart-card.component.scss'
})
export class CartCardComponent { // FIXME DONE
  public readonly cart: InputSignal<CartResponseDto> = input.required<CartResponseDto>();

  constructor(
    private readonly _cartsInitService: CartsInitService,
    private readonly _cartService: CartControllerService,
    private readonly _itemPropertiesFormatterService: ItemPropertiesFormatterService,
    private readonly _currencyFormatterService: CurrencyFormatterService,
    private readonly _errorHandlerService: ErrorHandlerService
  ) {}

  protected getItemProperties(item: ItemResponseDto): string[] {
    return this._itemPropertiesFormatterService.formatItemProperties(item);
  }

  private getInputQuantity(item: ItemResponseDto): number | null | undefined {
    return this._cartsInitService.getItemCacheInputQuantity(item);
  }

  protected setInputQuantity(item: ItemResponseDto, quantity: number | null | undefined): void {
    this._cartsInitService.setItemCacheInputQuantity(item, quantity);
  }

  private getVariantQuantity(item: ItemResponseDto): number | undefined {
    return this._cartsInitService.getItemCacheVariantQuantity(item);
  }

  // If the input quantity wasn't modified yet, it returns currently set value (item quantity)
  protected getQuantity(item: ItemResponseDto): number | null {
    const inputQuantity: number | null | undefined = this.getInputQuantity(item);
    return inputQuantity !== undefined
      ? inputQuantity :
      item.quantity!;
  }

  protected maxQuantity(item: ItemResponseDto): number {
    return this.getVariantQuantity(item) ?? 0;
  }

  protected isQuantityValid(item: ItemResponseDto): boolean {
    const inputQuantity: number | null | undefined = this.getInputQuantity(item); // User defined quantity
    const variantQuantity: number | undefined = this.getVariantQuantity(item); // Stock of the product variant
    if (inputQuantity === undefined || inputQuantity === null || variantQuantity === undefined) return false;

    const isQuantityExcessive: boolean = inputQuantity > variantQuantity;
    const isQuantityZero: boolean = inputQuantity === 0;
    const isQuantityChanged: boolean = inputQuantity !== item.quantity!;
    const isItemPresent: boolean = item.present!;

    return !isQuantityExcessive && !isQuantityZero && isQuantityChanged && isItemPresent;
  }

  protected getTitle(item: ItemResponseDto): string {
    return this._currencyFormatterService.getItemSummary(item);
  }

  protected getNgSrc(item: ItemResponseDto): string {
    return toNgSrc(item.productSnapshot?.imageUrl!, IMAGE_SIZE, IMAGE_FIT);
  }

  protected updateQuantity(item: ItemResponseDto): void {
    const cartId: number = this.cart().id!;
    const itemId: number = item.id!;
    const quantity: number | null | undefined = this.getInputQuantity(item);
    if (quantity === undefined || quantity === null) return;

    this._cartService.patchItemQuantityById({
      'cart-id': cartId,
      'item-id': itemId,
      body: {
        quantity: quantity
      }
    }).subscribe({
      next: async (): Promise<void> => {
        const activeCartId: number = this._cartsInitService.activeCartId;
        await this._cartsInitService.init();
        this._cartsInitService.activeCartId = activeCartId;
        this.setInputQuantity(item, undefined);
      },
      error: async (err: any): Promise<void> => {
        this._errorHandlerService.handle(err);

        const activeCartId: number = this._cartsInitService.activeCartId;
        await this._cartsInitService.init(); // Refreshes carts to prevent stale variantQuantity next time
        this._cartsInitService.activeCartId = activeCartId;
      }
    });
  }

  protected removeItem(item: ItemResponseDto): void {
    const cartId: number = this.cart().id!;
    const itemId: number = item.id!;

    this._cartService.deleteItemById({
      'cart-id': cartId,
      'item-id': itemId
    }).subscribe({
      next: async (): Promise<void> => {
        const activeCartId: number = this._cartsInitService.activeCartId;
        await this._cartsInitService.init();
        this._cartsInitService.activeCartId = activeCartId;
        this._cartsInitService.removeItemCache(item);
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

}
