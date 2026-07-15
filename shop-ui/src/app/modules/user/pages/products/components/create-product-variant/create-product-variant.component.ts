import {Component, input, InputSignal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileInputComponent} from '../file-input/file-input.component';
import {firstValueFrom} from 'rxjs';
import {
  TwoDecimalValidatorDirective
} from '../../../../../../common/directives/two-decimal-validator/two-decimal-validator.directive';
import {ProductResponseDto} from '../../../../../../services/models/product-response-dto';
import {ResourcesInitService} from '../../../../../../services/resources-init/resources-init.service';
import {ProductControllerService} from '../../../../../../services/services/product-controller.service';
import {CategoryTemplateResponseDto} from '../../../../../../services/models/category-template-response-dto';
import {FilePreview} from '../../../../../../services/models/file-preview';
import {ProductVariantResponseDto} from '../../../../../../services/models/product-variant-response-dto';
import {PropertyResponseDto} from '../../../../../../services/models/property-response-dto';
import {PropertyPresetDto} from '../../../../../../services/models/property-preset-dto';
import {ErrorHandlerService} from '../../../../../../services/error-handler/error-handler.service';
import {ProductsInitService} from '../../../../../../services/user/products-init/products-init.service';
import {formatPreset, formatPropertyName} from '../../../../../../common/utils/property/property-utils';
import {VariantHelpersService} from '../../../../../../common/helpers/variant/variant-helpers.service';
import {ActiveToast, ToastrService} from 'ngx-toastr';
import {
  VariantPropertiesFormatterService
} from '../../../../../../common/helpers/variant/variant-properties-formatter.service';
import {CurrencyFormatterService} from '../../../../../../common/helpers/currency/currency-formatter.service';

@Component({
  selector: 'app-create-product-variant',
  imports: [
    TwoDecimalValidatorDirective,
    ReactiveFormsModule,
    FormsModule,
    FileInputComponent
  ],
  templateUrl: './create-product-variant.component.html',
  styleUrl: './create-product-variant.component.scss'
})
export class CreateProductVariantComponent { // FIXME DONE
  public readonly product: InputSignal<ProductResponseDto> = input.required<ProductResponseDto>();

  constructor(
    private readonly _resourcesInitService: ResourcesInitService,
    private readonly _productsInitService: ProductsInitService,
    private readonly _productService: ProductControllerService,
    private readonly _variantHelpersService: VariantHelpersService,
    private readonly _variantPropertiesFormatterService: VariantPropertiesFormatterService,
    private readonly _currencyFormatterService: CurrencyFormatterService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _toastrService: ToastrService
  ) {
  }

  protected formatPreset(property: PropertyResponseDto, preset: PropertyPresetDto): string {
    return formatPreset(property, preset);
  }

  protected get categoryTemplate(): CategoryTemplateResponseDto {
    return this._resourcesInitService.getCategoryTemplate(this.product().categoryId!);
  }

  protected get price(): string {
    return this._productsInitService.getVariantDraftCachePrice(this.product());
  }

  protected set price(price: string) {
    this._productsInitService.setVariantDraftCachePrice(price, this.product());
  }

  protected get quantity(): number | null {
    return this._productsInitService.getVariantDraftCacheQuantity(this.product());
  }

  protected set quantity(quantity: number | null) {
    this._productsInitService.setVariantDraftCacheQuantity(quantity, this.product());
  }

  protected get properties(): Record<number, string | null> {
    return this._productsInitService.getVariantDraftCacheProperties(this.product());
  }

  protected get filePreview(): FilePreview | null {
    return this._productsInitService.getVariantDraftCacheFilePreview(this.product());
  }

  protected set filePreview(filePreview: FilePreview | null) {
    this._productsInitService.setVariantDraftCacheFilePreview(this.product(), filePreview);
  }

  protected get isRequestValid(): boolean {
    const price: string = this.price;
    const quantity: number | null = this.quantity;
    if (price.length === 0 || quantity === null || quantity % 1 !== 0 || quantity === 0) return false;

    return this._variantHelpersService.isVariantDraftCachePropertiesValid(this.product(), this.properties);
  }

  protected formatPropertyName(property: PropertyResponseDto): string {
    return formatPropertyName(property);
  }

  protected cancel(): void {
    this._productsInitService.clearVariantDraftCaches(this.product());
  }

  protected createProductVariant(): void {
    this._productService.createProductVariant({
      'product-id': this.product().id!,
      body: {
        price: Number(this.price),
        quantity: this.quantity!,
        properties: this.properties as Record<number, string>
      }
    }).subscribe({
      next: async (variant: ProductVariantResponseDto): Promise<void> => {
        await this.updateImage(variant);
        await this._productsInitService.init();
        this._productsInitService.clearVariantDraftCaches(this.product());

        this._toastrService.success(
          `Product variant with the price ${this._currencyFormatterService.formatCurrency(variant.price!)}, quantity ${variant.quantity}
          and properties: ${this._variantPropertiesFormatterService.formatVariantProperties(variant)} created successfully`,
          'Success'
        );
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  private async updateImage(variant: ProductVariantResponseDto): Promise<void> {
    const filePreview: FilePreview | null = this._productsInitService.getVariantDraftCacheFilePreview(variant.productId!);
    if (!filePreview) return;

    const file: File | undefined = filePreview.file;
    if (!file) return;

    try {
      await firstValueFrom(this._productService.uploadProductVariantImage({
        'product-id': variant.productId!,
        'product-variant-id': variant.id!,
        body: {
          'file': file
        }
      })).then((variant: ProductVariantResponseDto): ActiveToast<any> =>
        this._toastrService.success(variant.image, 'Success'));
    } catch (err: any) {
      this._errorHandlerService.handle(err);
    }
  }

}
