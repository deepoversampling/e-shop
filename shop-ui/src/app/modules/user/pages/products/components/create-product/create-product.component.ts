import {Component, input, InputSignal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductDraftCache} from '../../../../../../services/models/product-draft-cache';
import {ResourcesInitService} from '../../../../../../services/resources-init/resources-init.service';
import {ProductControllerService} from '../../../../../../services/services/product-controller.service';
import {CategoryResponseDto} from '../../../../../../services/models/category-response-dto';
import {ErrorHandlerService} from '../../../../../../services/error-handler/error-handler.service';
import {ProductsInitService} from '../../../../../../services/user/products-init/products-init.service';
import {getLeafCategories} from '../../../../../../common/utils/category/category-utils';
import {StrictHttpResponse} from '../../../../../../services/strict-http-response';
import {ProductResponseDto} from '../../../../../../services/models/product-response-dto';
import {ToastrService} from 'ngx-toastr';
import {getLocation} from '../../../../../../common/utils/utils';

@Component({
  selector: 'app-create-product',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent { // FIXME DONE
  readonly productDraftCacheId: InputSignal<number> = input.required<number>();
  readonly productDraftCache: InputSignal<ProductDraftCache> = input.required<ProductDraftCache>();

  constructor(
    private readonly _resourcesInitService: ResourcesInitService,
    private readonly _productsInitService: ProductsInitService,
    private readonly _productService: ProductControllerService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _toastrService: ToastrService
  ) {}

  protected get leafCategories(): CategoryResponseDto[] {
    return getLeafCategories(this._resourcesInitService.rootCategory());
  }

  protected get hasName(): boolean {
    return this.productDraftCache().name.trim().length > 0;
  }

  protected get hasCategory(): boolean {
    return this.productDraftCache().categoryId !== null;
  }

  protected get hasDescription(): boolean {
    const description: FormControl<string | null> = this.productDraftCache().description;
    return !description.invalid;
  }

  protected cancel(): void {
    this._productsInitService.removeProductDraftCache(this.productDraftCacheId());
  }

  protected createProduct(): void {
    const productDraftCache: ProductDraftCache = this.productDraftCache();
    const description: string | null = this.productDraftCache().description.value;
    if (description === null) return;

    this._productService.createProduct({
      body: {
        categoryId: productDraftCache.categoryId!,
        description: description,
        name: productDraftCache.name
      }
    }).subscribe({
      next: async (product: ProductResponseDto): Promise<void> => {
        await this._productsInitService.init();
        this.cancel();

        this._toastrService.success(
          `Product ${product.name} created successfully`,
          'Success'
        );
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

}
