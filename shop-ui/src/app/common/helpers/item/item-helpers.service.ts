import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {ItemResponseDto} from '../../../services/models/item-response-dto';
import {ProductVariantResponseDto} from '../../../services/models/product-variant-response-dto';
import {ProductResponseDto} from '../../../services/models/product-response-dto';
import {ProductControllerService} from '../../../services/services/product-controller.service';
import {ErrorHandlerService} from '../../../services/error-handler/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ItemHelpersService { // FIXME DONE

  constructor(
    private readonly _productService: ProductControllerService,
    private readonly _errorHandlerService: ErrorHandlerService
  ) {}

  // Returns current stock quantity of the product variant
  public async getVariantQuantityOfItem(item: ItemResponseDto): Promise<number | undefined> {
    let product: ProductResponseDto = {};
    try {
      product = await firstValueFrom(this._productService.getProductById({
        'product-id': item.productSnapshot?.productId!
      }));
    } catch (err: any) {
      this._errorHandlerService.handle(err);
    }

    const matchedVariant: ProductVariantResponseDto | undefined =
      product.variants
        ?.find((variant: ProductVariantResponseDto): boolean => variant.id === item.productSnapshot?.productVariantId);

    return matchedVariant?.quantity;
  }

}
