import {Injectable} from '@angular/core';
import {CartResponseDto} from '../../../services/models/cart-response-dto';
import {ItemResponseDto} from '../../../services/models/item-response-dto';
import {ProductVariantResponseDto} from '../../../services/models/product-variant-response-dto';

@Injectable({
  providedIn: 'root'
})
export class CurrencyFormatterService { // FIXME DONE
  private readonly _formatter: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  // Returns formatted total value of the cart, e.g. $1,359.99
  public getCartTotal(cart: CartResponseDto): string {
    const total: number = cart.items!.reduce((currentTotal: number, item: ItemResponseDto): number => {
      const price: number = item.productSnapshot?.price!;
      const quantity: number = item.quantity!;

      return currentTotal + price * quantity;
    }, 0);

    return this.formatCurrency(total);
  }

  // Returns summary of the item in the cart, e.g. Apple iPhone 16 (1 x $1199.99)
  public getItemSummary(item: ItemResponseDto): string {
    const name: string = item.productSnapshot?.name!;
    const price: number = item.productSnapshot?.price!;
    const quantity: number = item.quantity!;

    return `${name} (${quantity} x $${this.formatCurrency(price)})`;
  }

  // Returns formatted price of the variant
  public formatPrice(variant: ProductVariantResponseDto): string {
    return this.formatCurrency(variant.price!);
  }

  public formatCurrency(value: number): string {
    return this._formatter.format(value);
  }

}
