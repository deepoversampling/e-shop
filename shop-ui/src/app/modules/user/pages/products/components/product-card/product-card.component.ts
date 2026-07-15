import {Component, input, InputSignal} from '@angular/core';
import {FileInputComponent} from '../file-input/file-input.component';
import {CreateProductVariantComponent} from '../create-product-variant/create-product-variant.component';
import {FormsModule} from '@angular/forms';
import {
  ImgErrorHandlerDirective
} from '../../../../../../common/directives/img-error-handler/img-error-handler.directive';
import {
  TwoDecimalValidatorDirective
} from '../../../../../../common/directives/two-decimal-validator/two-decimal-validator.directive';
import {ProductResponseDto} from '../../../../../../services/models/product-response-dto';
import {ProductControllerService} from '../../../../../../services/services/product-controller.service';
import {ProductVariantResponseDto} from '../../../../../../services/models/product-variant-response-dto';
import {FilePreview} from '../../../../../../services/models/file-preview';
import {ErrorHandlerService} from '../../../../../../services/error-handler/error-handler.service';
import {NgOptimizedImage} from '@angular/common';
import {ProductsInitService} from '../../../../../../services/user/products-init/products-init.service';
import {
  VariantPropertiesFormatterService
} from '../../../../../../common/helpers/variant/variant-properties-formatter.service';
import {toNgSrc} from '../../../../../../common/utils/utils';
import {IMAGE_FIT, IMAGE_SIZE} from '../../../../../../common/constants/constants';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  imports: [
    ImgErrorHandlerDirective,
    TwoDecimalValidatorDirective,
    FileInputComponent,
    CreateProductVariantComponent,
    FormsModule,
    NgOptimizedImage
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent { // FIXME DONE
  public readonly product: InputSignal<ProductResponseDto> = input.required<ProductResponseDto>();

  constructor(
    private readonly _productsInitService: ProductsInitService,
    private readonly _productService: ProductControllerService,
    private readonly _variantPropertiesFormatterService: VariantPropertiesFormatterService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _toastrService: ToastrService
  ) {}

  protected getVariantProperties(variant: ProductVariantResponseDto): string[] {
    return this._variantPropertiesFormatterService.formatVariantProperties(variant);
  }

  protected get hasVariants(): boolean {
    return this.product().variants!.length > 0;
  }

  protected getPrice(variant: ProductVariantResponseDto): string {
    const price: string | undefined = this._productsInitService.getVariantCachePrice(variant); // User-entered price, undefined before interaction
    if (price === undefined) { // Returns variant price initially and variant cache price otherwise
      return (variant.price!).toString();
    }
    return price;
  }

  protected setPrice(variant: ProductVariantResponseDto, price: string | undefined): void {
    this._productsInitService.setVariantCachePrice(variant, price);
  }

  protected getQuantity(variant: ProductVariantResponseDto): number | null {
    const quantity: number | null | undefined = this._productsInitService.getVariantCacheQuantity(variant); // User-entered quantity, undefined before interaction
    if (quantity === undefined) { // Returns variant quantity initially and variant cache quantity otherwise
      return variant.quantity!;
    }
    return quantity;
  }

  protected setQuantity(variant: ProductVariantResponseDto, quantity: number | null | undefined): void {
    this._productsInitService.setVariantCacheQuantity(variant, quantity);
  }

  protected getFilePreview(variant: ProductVariantResponseDto): FilePreview | null {
    return this._productsInitService.getVariantCacheFilePreview(variant);
  }

  protected setFilePreview(variant: ProductVariantResponseDto, filePreview: FilePreview | null): void {
    this._productsInitService.setVariantCacheFilePreview(variant, filePreview);
  }

  protected hasFilePreview(variant: ProductVariantResponseDto): boolean {
    return this.getFilePreview(variant) !== null;
  }

  protected isPriceValid(variant: ProductVariantResponseDto): boolean {
    const price: string | undefined = this._productsInitService.getVariantCachePrice(variant);
    return price !== undefined && price.length > 0 && Number(price) !== variant.price;
  }

  protected isQuantityValid(variant: ProductVariantResponseDto): boolean {
    const quantity: number | null | undefined = this._productsInitService.getVariantCacheQuantity(variant);
    return quantity !== undefined && quantity !== null && quantity % 1 === 0 && quantity !== variant.quantity;
  }

  protected hasVariantCache(variant: ProductVariantResponseDto): boolean {
    return this._productsInitService.getVariantCachePrice(variant) !== undefined
      || this._productsInitService.getVariantCacheQuantity(variant) !== undefined
      || this.getFilePreview(variant) !== null;
  }

  protected hasVariantShortage(variant: ProductVariantResponseDto): boolean {
    return variant.demand! > variant.quantity!;
  }

  protected getVariantShortage(variant: ProductVariantResponseDto): number {
    return variant.demand! - variant.quantity!;
  }

  protected hasImage(variant: ProductVariantResponseDto): boolean {
    return variant.image! !== null;
  }

  protected getNgSrc(variant: ProductVariantResponseDto): string {
    return toNgSrc(variant.image!, IMAGE_SIZE, IMAGE_FIT);
  }

  protected updatePrice(variant: ProductVariantResponseDto): void {
    const price: string | undefined = this._productsInitService.getVariantCachePrice(variant);
    if (price === undefined) return;

    this._productService.patchProductVariantPriceById({
      'product-id': variant.productId!,
      'product-variant-id': variant.id!,
      body: {
        price: Number(price)
      }
    }).subscribe({
      next: async (): Promise<void> => {
        await this._productsInitService.init();
        this.setPrice(variant, undefined);
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected updateQuantity(variant: ProductVariantResponseDto): void {
    const quantity: number | null | undefined = this._productsInitService.getVariantCacheQuantity(variant)
    if (quantity === undefined || quantity === null) return;

    this._productService.patchProductVariantQuantityById({
      'product-id': variant.productId!,
      'product-variant-id': variant.id!,
      body: {
        quantity: quantity
      }
    }).subscribe({
      next: async (): Promise<void> => {
        await this._productsInitService.init();
        this.setQuantity(variant, undefined);
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected updateImage(variant: ProductVariantResponseDto): void {
    const file: File | undefined = this.getFilePreview(variant)?.file;
    if (file === undefined) return;

    this._productService.uploadProductVariantImage({
      'product-id': variant.productId!,
      'product-variant-id': variant.id!,
      body: {
        'file': file
      }
    }).subscribe({
      next: async (variant: ProductVariantResponseDto): Promise<void> => {
        await this._productsInitService.init();
        this.setFilePreview(variant, null);

        this._toastrService.success(
          `Product variant image has been uploaded ${variant.image}`,
          'Success'
        );
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected removeVariant(variant: ProductVariantResponseDto): void {
    this._productService.deleteProductVariantById({
      'product-variant-id': variant.id!,
      'product-id': variant.productId!
    }).subscribe({
      next: async (): Promise<void> => {
        await this._productsInitService.init();
        this._productsInitService.removeVariantCache(variant);
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected removeImage(variant: ProductVariantResponseDto): void {
    this._productService.deleteProductVariantImageById({
      'product-variant-id': variant.id!,
      'product-id': variant.productId!
    }).subscribe({
      next: async (): Promise<void> => {
        await this._productsInitService.init();
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected isVariantDraftVisible(product: ProductResponseDto): boolean {
    return this._productsInitService.isVariantDraftVisible(product);
  }

  protected createVariantDraft(): void {
    this._productsInitService.changeVariantDraftVisibility(this.product());
  }

  protected clearVariantCache(variant: ProductVariantResponseDto): void {
    this._productsInitService.clearVariantCache(variant);
  }

}
