import {effect, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {ProductResponseDto} from '../../models/product-response-dto';
import {VariantCache} from '../../models/variant-cache';
import {VariantDraftCache} from '../../models/variant-draft-cache';
import {ProductDraftCache} from '../../models/product-draft-cache';
import {KeycloakService} from '../../keycloak/keycloak.service';
import {ProductControllerService} from '../../services/product-controller.service';
import {ErrorHandlerService} from '../../error-handler/error-handler.service';
import {ProductVariantResponseDto} from '../../models/product-variant-response-dto';
import {FilePreview} from '../../models/file-preview';
import {FormControl, Validators} from '@angular/forms';
import {VariantHelpersService} from '../../../common/helpers/variant/variant-helpers.service';
import {getLastIndex} from '../../../common/utils/utils';
import {IS_BROWSER} from '../../../common/constants/constants';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsInitService { // FIXME DONE
  private readonly _ready: WritableSignal<boolean> = signal<boolean>(false);
  public readonly ready: Signal<boolean> = this._ready.asReadonly();

  public readonly _products: WritableSignal<ProductResponseDto[]> = signal<ProductResponseDto[]>([]);
  public readonly products: Signal<ProductResponseDto[]> = this._products.asReadonly();

  private _productVisibilities: Record<number, boolean> = {}; // One per product
  private _variantDraftVisibilities: Record<number, boolean> = {}; // One per product

  private _scrolls: Record<number, number> = {}; // One per product

  private _variantCaches: Record<number, VariantCache> = {};  // One per variant
  private _variantDraftCaches: Record<number, VariantDraftCache> = {}; // One per product (new variant)
  private _productDraftCaches: Record<number, ProductDraftCache> = {}; // None or many (new product)

  constructor(
    private readonly _keycloakService: KeycloakService,
    private readonly _productService: ProductControllerService,
    private readonly _variantHelpersService: VariantHelpersService,
    private readonly _errorHandlerService: ErrorHandlerService
  ) {
    // Initializes or resets based on authentication state
    effect(async (): Promise<void> => {
      this._ready.set(false);

      if (this._keycloakService.isAuthenticated() && this._keycloakService.userRole === 'USER') {
        await this.init();
      } else {
        this.reset();
      }

      this._ready.set(true);
    });
  }

  // Fetches and sets products,
  // initializes product states without affecting existing ones
  public async init(): Promise<void> {
    if (!IS_BROWSER) return;

    let products: ProductVariantResponseDto[] = [];
    try {
      products = await firstValueFrom(this._productService.getProductsByOwner());
    } catch (err: any) {
      this._errorHandlerService.handle(err);
    }

    this.initProductStates(products);
    this._products.set(products);
  }

  // Initializes product visibilities, variant draft visibilities, scrolls, variant draft caches,
  // and variant caches if they don't exist yet
  private initProductStates(products: ProductVariantResponseDto[]): void {
    products.forEach((product: ProductResponseDto): void => {
      if (this._productVisibilities[product.id!] === undefined) {
        this._productVisibilities[product.id!] = false;
      }

      if (this._variantDraftVisibilities[product.id!] === undefined) {
        this._variantDraftVisibilities[product.id!] = false;
      }

      if (this._scrolls[product.id!] === undefined) {
        this._scrolls[product.id!] = 0;
      }

      if (this._variantDraftCaches[product.id!] === undefined) {
        this._variantDraftCaches[product.id!] = {
          price: '0',
          quantity: 0,
          filePreview: null,
          properties: this._variantHelpersService.getInitializedVariantDraftCacheProperties(product)
        };
      }

      product.variants!
        .forEach((variant: ProductVariantResponseDto): void => {
          if (this._variantCaches[variant.id!] === undefined) {
            this._variantCaches[variant.id!] = {
              filePreview: null
            };
          }
        });
    });
  }

  private reset(): void {
    this._products.set([]);
    this._productVisibilities = {};
    this._variantDraftVisibilities = {};
    this._variantCaches = {};
    this._variantDraftCaches = {};
    this._productDraftCaches = {};
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /*                                                productVisibilities                                               */
  public isProductVisible(product: ProductResponseDto): boolean {
    return this._productVisibilities[product.id!];
  }

  public changeProductVisibility(product: ProductResponseDto): void {
    this._productVisibilities[product.id!] = !this._productVisibilities[product.id!];
  }

  /*                                                scrolls                                                           */
  public getScroll(product: ProductResponseDto): number {
    return this._scrolls[product.id!];
  }

  public setScroll(product: ProductResponseDto, scroll: number): void {
    this._scrolls[product.id!] = scroll;
  }

  /*                                                variantDraftVisibilities                                          */
  public isVariantDraftVisible(product: ProductResponseDto): boolean {
    return this._variantDraftVisibilities[product.id!];
  }

  public changeVariantDraftVisibility(product: ProductResponseDto): void {
    this._variantDraftVisibilities[product.id!] = !this._variantDraftVisibilities[product.id!];
  }

  /*                                                variantCaches                                                     */
  public getVariantCachePrice(variant: ProductVariantResponseDto): string | undefined {
    return this._variantCaches[variant.id!].price;
  }

  public setVariantCachePrice(variant: ProductVariantResponseDto, price: string | undefined): void {
    this._variantCaches[variant.id!].price = price;
  }

  public getVariantCacheQuantity(variant: ProductVariantResponseDto): number | null | undefined {
    return this._variantCaches[variant.id!].quantity;
  }

  public setVariantCacheQuantity(variant: ProductVariantResponseDto, quantity: number | null | undefined): void {
    this._variantCaches[variant.id!].quantity = quantity;
  }

  public getVariantCacheFilePreview(variant: ProductVariantResponseDto): FilePreview | null {
    return this._variantCaches[variant.id!].filePreview;
  }

  public setVariantCacheFilePreview(variant: ProductVariantResponseDto, filePreview: FilePreview | null): void {
    if (filePreview === null) {
      this._variantCaches[variant.id!].filePreview = null;
      return;
    }

    this._variantCaches[variant.id!].filePreview = {
      file: filePreview.file,
      url: filePreview.url
    };
  }

  public clearVariantCache(variant: ProductVariantResponseDto): void {
    this._variantCaches[variant.id!].filePreview = null;
  }

  public removeVariantCache(variant: ProductVariantResponseDto): void {
    delete this._variantCaches[variant.id!];
  }

  /*                                                variantDraftCaches                                                */
  public getVariantDraftCachePrice(product: ProductResponseDto): string {
    return this._variantDraftCaches[product.id!].price;
  }

  public setVariantDraftCachePrice(price: string, product: ProductResponseDto): void {
    this._variantDraftCaches[product.id!].price = price;
  }

  public getVariantDraftCacheQuantity(product: ProductResponseDto): number | null {
    return this._variantDraftCaches[product.id!].quantity;
  }

  public setVariantDraftCacheQuantity(quantity: number | null, product: ProductResponseDto): void {
    this._variantDraftCaches[product.id!].quantity = quantity;
  }

  public getVariantDraftCacheProperties(product: ProductResponseDto): Record<number, string | null> {
    return this._variantDraftCaches[product.id!].properties;
  }

  public getVariantDraftCacheFilePreview(arg: number | ProductResponseDto): FilePreview | null {
    const productId: number = typeof arg === 'number'
      ? arg
      : arg.id!;
    return this._variantDraftCaches[productId].filePreview;
  }

  public setVariantDraftCacheFilePreview(product: ProductResponseDto, filePreview: FilePreview | null): void {
    if (filePreview === null) {
      this._variantDraftCaches[product.id!].filePreview = null;
      return;
    }

    this._variantDraftCaches[product.id!].filePreview = {
      file: filePreview.file,
      url: filePreview.url
    };
  }

  public clearVariantDraftCaches(product: ProductResponseDto): void {
    this._variantDraftCaches[product.id!].price = '0';
    this._variantDraftCaches[product.id!].quantity = 0;
    this._variantDraftCaches[product.id!].filePreview = null;
    this._variantDraftCaches[product.id!].properties = this._variantHelpersService.getInitializedVariantDraftCacheProperties(product);
    this._variantDraftVisibilities[product.id!] = false;
  }

  /*                                                productDraftCaches                                                */
  public get productDraftCaches(): Record<number, ProductDraftCache> {
    return this._productDraftCaches;
  }

  public createProductDraftCache(): void {
    const lastIndex: number = getLastIndex(this._productDraftCaches);

    this._productDraftCaches[lastIndex + 1] = {
      name: '',
      categoryId: null,
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ])
    };
  }

  public removeProductDraftCache(id: number): void {
    delete this._productDraftCaches[id];
  }

  /*                                                products                                                          */
  public removeProductStates(product: ProductResponseDto): void {
    delete this._productVisibilities[product.id!];
    delete this._variantDraftVisibilities[product.id!];
    delete this._variantDraftCaches[product.id!];

    product.variants!
      .forEach((variant: ProductVariantResponseDto): void => this.removeVariantCache(variant));
  }

}
