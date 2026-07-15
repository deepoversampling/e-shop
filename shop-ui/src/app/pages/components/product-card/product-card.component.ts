import {Component, input, InputSignal} from '@angular/core';
import {ProductResponseDto} from '../../../services/models/product-response-dto';
import {ProductVariantResponseDto} from '../../../services/models/product-variant-response-dto';
import {CartControllerService} from '../../../services/services/cart-controller.service';
import {KeycloakService} from '../../../services/keycloak/keycloak.service';
import {FormsModule} from '@angular/forms';
import {ImgErrorHandlerDirective} from '../../../common/directives/img-error-handler/img-error-handler.directive';
import {ImgFadeOnLoadDirective} from '../../../common/directives/img-fade-on-load/img-fade-on-load.directive';
import {CartResponseDto} from '../../../services/models/cart-response-dto';
import {ItemResponseDto} from '../../../services/models/item-response-dto';
import {ErrorHandlerService} from '../../../services/error-handler/error-handler.service';
import {NgOptimizedImage} from '@angular/common';
import {CartsInitService} from '../../../services/user/carts-init/carts-init.service';
import {ProductsInitService} from '../../../services/user/products-init/products-init.service';
import {RatingComponent} from '../../../common/components/rating/rating.component';
import {CurrencyFormatterService} from '../../../common/helpers/currency/currency-formatter.service';
import {VariantPropertiesFormatterService} from '../../../common/helpers/variant/variant-properties-formatter.service';
import {SearchInitService} from '../../../services/search-init/search-init.service';
import {toNgSrc} from '../../../common/utils/utils';
import {IMAGE_FIT, IMAGE_SIZE} from '../../../common/constants/constants';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  imports: [
    RatingComponent,
    FormsModule,
    ImgErrorHandlerDirective,
    ImgFadeOnLoadDirective,
    NgOptimizedImage
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent { // FIXME DONE
  public readonly product: InputSignal<ProductResponseDto> = input.required<ProductResponseDto>();

  constructor(
    private readonly _keycloakService: KeycloakService,
    private readonly _variantPropertiesFormatterService: VariantPropertiesFormatterService,
    private readonly _cartsInitService: CartsInitService,
    private readonly _productsInitService: ProductsInitService,
    private readonly _cartService: CartControllerService,
    private readonly _currencyFormatterService: CurrencyFormatterService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _searchInitService: SearchInitService,
    private readonly _toastrService: ToastrService
  ) {}

  protected get quantity(): number | null {
    return this._searchInitService.getQuantityCache(this.currentVariant);
  }

  protected set quantity(quantity: number) {
    this._searchInitService.setQuantityCache(this.currentVariant, quantity);
  }

  protected get variantIndex(): number {
    return this._searchInitService.getVariantIndexCache(this.product());
  }

  protected set variantIndex(variantIndex: number) {
    this._searchInitService.setVariantIndexCache(this.product(), variantIndex);
  }

  protected get productTitle(): string {
    return `  ${this.product().name} (${this.variantIndex + 1} / ${this.variants.length})`;
  }

  protected get variants(): ProductVariantResponseDto[] {
    return this.product().variants!;
  }

  protected get currentVariant(): ProductVariantResponseDto {
    return this.variants[this.variantIndex];
  }

  protected prevVariant(): void {
    if (this.variantIndex > 0) {
      this.variantIndex--;
    }
  }

  protected nextVariant(): void {
    if (this.variantIndex < this.variants.length - 1) {
      this.variantIndex++;
    }
  }

  protected get isAuthenticated(): boolean {
    return this._keycloakService.isAuthenticated();
  }

  protected getVariantProperties(variant: ProductVariantResponseDto): string[] {
    return this._variantPropertiesFormatterService.formatVariantProperties(variant);
  }

  protected isQuantityValid(): boolean {
    if (this.quantity === null) {
      return false;
    }

    return this.quantity % 1 === 0 && this.quantity > 0 && this.quantity <= this.currentVariant.quantity!;
  }

  protected alreadyInCart(): boolean {
    const cart: CartResponseDto | undefined =
      this._cartsInitService.carts()
        .find((cart: CartResponseDto): boolean => cart.id === this._cartsInitService.activeCartId);

    // Cart can be undefined initially because carts are set in effect
    return !!cart?.items
      ?.some((item: ItemResponseDto): boolean => item.productSnapshot?.productVariantId === this.currentVariant.id);
  }

  protected isOwnProduct(): boolean {
    return this._productsInitService.products()
      .flatMap((product: ProductResponseDto): ProductVariantResponseDto[] => product.variants!)
      .some((variant: ProductVariantResponseDto): boolean => variant.id! === this.currentVariant.id!);
  }

  protected formatPrice(variant: ProductVariantResponseDto): string {
    return this._currencyFormatterService.formatPrice(variant);
  }

  protected get ngSrc(): string {
    return toNgSrc(this.currentVariant.image!, IMAGE_SIZE, IMAGE_FIT);
  }

  protected addToCard(): void {
    if (this.quantity === null) return;

    this._cartService.addItem({
      'cart-id': this._cartsInitService.activeCartId,
      body: {
        productVariantId: this.currentVariant.id!,
        quantity: this.quantity
      }
    }).subscribe({
      next: async (item: ItemResponseDto): Promise<void> => {
        const currentCartId: number = this._cartsInitService.activeCartId;
        await this._cartsInitService.init();
        this._cartsInitService.activeCartId = currentCartId;
        this.quantity = 0;

        this._toastrService.info(
          `${item.quantity} x ${item.productSnapshot?.name} added to cart`,
          'OK'
        );
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

}
