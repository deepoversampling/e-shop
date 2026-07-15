import {Component} from '@angular/core';
import {ProductResponseDto} from '../../../../../services/models/product-response-dto';
import {ProductControllerService} from '../../../../../services/services';
import {ProductDraftCache} from '../../../../../services/models/product-draft-cache';
import {ReactiveFormsModule} from '@angular/forms';
import {ProductCardComponent} from '../components/product-card/product-card.component';
import {CreateProductComponent} from '../components/create-product/create-product.component';
import {ErrorHandlerService} from '../../../../../services/error-handler/error-handler.service';
import {ProductsInitService} from '../../../../../services/user/products-init/products-init.service';
import {ExpandableDirective} from '../../../../../common/directives/expandable/expandable.directive';
import {ThumbnailBarComponent} from '../../../../../common/components/thumbnail-bar/thumbnail-bar.component';
import {MenuComponent} from '../../../../../common/components/menu/menu.component';
import {THUMBNAILS_COUNT} from '../../../../../common/constants/constants';

@Component({
  selector: 'app-product-list',
  imports: [
    MenuComponent,
    ProductCardComponent,
    CreateProductComponent,
    ReactiveFormsModule,
    ThumbnailBarComponent,
    ExpandableDirective
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent { // FIXME DONE
  protected readonly thumbnailsCount: number = THUMBNAILS_COUNT;

  constructor(
    private readonly _productsInitService: ProductsInitService,
    private readonly _productService: ProductControllerService,
    private readonly _errorHandlerService: ErrorHandlerService
  ) {}

  protected get isReady(): boolean {
    return this._productsInitService.ready();
  }

  protected get products(): ProductResponseDto[] {
    return this._productsInitService.products();
  }

  protected get productDraftCacheEntries(): [id: string, productDraftCache: ProductDraftCache][] {
    return Object.entries(this._productsInitService.productDraftCaches);
  }

  protected getProductDraftCacheId(entry: [id: string, productDraftCache: ProductDraftCache]): number {
    return Number(entry[0]);
  }

  protected getProductDraftCache(entry: [id: string, productDraftCache: ProductDraftCache]): ProductDraftCache {
    return entry[1];
  }

  protected hasVariants(product: ProductResponseDto): boolean {
    return product.variants!.length > 0;
  }

  protected createProductDraftCache(): void {
    this._productsInitService.createProductDraftCache();
  }

  protected removeProduct(product: ProductResponseDto): void {
    this._productService.deleteProductById({
      'product-id': product.id!
    }).subscribe({
      next: async (): Promise<void> => {
        await this._productsInitService.init();
        this._productsInitService.removeProductStates(product);
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected isVisible(product: ProductResponseDto): boolean {
    return this._productsInitService.isProductVisible(product);
  }

  protected changeVisibility(product: ProductResponseDto): void {
    this._productsInitService.changeProductVisibility(product);
  }

  protected isVariantDraftVisible(product: ProductResponseDto): boolean {
    return this._productsInitService.isVariantDraftVisible(product);
  }

  protected getScroll(product: ProductResponseDto): number {
    return this._productsInitService.getScroll(product);
  }

  protected setScroll(product: ProductResponseDto, scroll: number): void {
    this._productsInitService.setScroll(product, scroll);
  }

  protected getCount(product: ProductResponseDto): number {
    return product.variants!.length;
  }

}
