import {effect, Inject, Injectable, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import {CategoryResponseDto} from '../models/category-response-dto';
import {ProductRequest} from '../models/product-request';
import {ResourcesInitService} from '../resources-init/resources-init.service';
import {findCategory, isLeafCategory} from '../../common/utils/category/category-utils';
import {CategoryHelpersService} from '../../common/helpers/category/category-helpers.service';
import {PageResponseProductResponseDto} from '../models/page-response-product-response-dto';
import {QuantityCache} from '../models/quantity-cache';
import {ProductResponseDto} from '../models/product-response-dto';
import {ProductVariantResponseDto} from '../models/product-variant-response-dto';
import {VariantIndexCache} from '../models/variant-index-cache';
import {SortBy} from '../../pages/components/product-search-options/enums/sort-by';
import {KeycloakService} from '../keycloak/keycloak.service';
import {isPlatformBrowser} from '@angular/common';
import {StorageService} from '../../common/helpers/storage/storage.service';
import {FilterService} from '../../common/helpers/filter/filter.service';
import {GetFilteredProducts$Params} from '../fn/product-controller/get-filtered-products';

@Injectable({
  providedIn: 'root'
})
export class SearchInitService { // FIXME DONE
  private readonly _currentCategory: WritableSignal<CategoryResponseDto> =
    signal<CategoryResponseDto>({});
  private readonly _selectedCategory: WritableSignal<CategoryResponseDto> =
    signal<CategoryResponseDto>({});
  private readonly _productRequest: WritableSignal<ProductRequest> =
    signal<ProductRequest>({
      size: 100,
      sortBy: null,
      sortDirection: null,
      name: '',
      quantity: null,
      price: ''
    });
  private readonly _filters: WritableSignal<Record<number, string | null>> =
    signal<Record<number, string | null>>({});
  private readonly _productResponse: WritableSignal<PageResponseProductResponseDto> =
    signal<PageResponseProductResponseDto>({});
  private readonly _page: WritableSignal<number> =
    signal<number>(0);

  private _variantIndexCaches: Record<number, VariantIndexCache> = {}; // One per product
  private _quantityCaches: Record<number, QuantityCache> = {}; // One per variant

  private _hasResponse: boolean = false; // False initially or on setter for selected category, product request, filters or page. True on setter for product response
  private _useSortedVariantIndex: boolean = false; // True if sort by availability or price is used
  public isFirstBrowserInit: boolean = true; // Changes to false on setter for selected category, filters, page or product request
  public hasLocalStorageParams: WritableSignal<boolean> = signal<boolean>(false); // True if the search params from localstorage is valid and used to avoid using product response from Transfer State

  constructor(
    private readonly _resourcesInitService: ResourcesInitService,
    private readonly _categoryHelpersService: CategoryHelpersService,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private readonly _keycloakService: KeycloakService,
    private readonly _storageService: StorageService,
    private readonly _filterService: FilterService
  ) {
    const rootCategory: CategoryResponseDto = this._resourcesInitService.rootCategory();

    // If the params item exists in localstorage the search fields are set based on it in the browser for the logged-in user
    if (isPlatformBrowser(this._platformId) &&
      this._keycloakService.isAuthenticated() && this._keycloakService.userRole === 'USER') {
      // Search parameters retrieved from localstorage are valid
      const searchParameters: GetFilteredProducts$Params | null = this._storageService.getSearchParameters();
      if (searchParameters) {
        // Filters retrieved from the localstorage require initialized filters because they are already cleaned of null values
        this.setInitializedFilters(
          findCategory(searchParameters['category-id'], rootCategory)!
        );
        this._storageService.restoreSearchParameters(
          searchParameters,
          this._currentCategory,
          this._selectedCategory,
          this._filters,
          this._page,
          this._productRequest,
          this.hasLocalStorageParams
        );
      } else {
        // Sets current and selected category to default root category when the params item doesn't exist in localstorage
        this.setCurrentAndSelectedCategoriesAsRoot();
        this.setInitializedFilters(rootCategory);
      }
    } else {
      // Sets current and selected category to default root category before the service is initialized to prevent {} from being used in components
      this.setCurrentAndSelectedCategoriesAsRoot();
      this.setInitializedFilters(rootCategory);
    }

    // Sets current and selected category to default root category when root category changes avoiding overriding them initially in the first browser init
    effect((): void => {
      if (!this.isFirstBrowserInit) {
        this.setCurrentAndSelectedCategoriesAsRoot();
        this.setInitializedFilters(rootCategory);
      }
    });

    effect((): void => {
      // Restores variant index caches from localstorage in the browser for logged-in users
      // The only variant index caches and quantity caches that can be safely retrieved are those that can be validated against the current products
      // This way these caches have to be retrieved each time the product response changes
      // Initial value of product response set in the signal initialization is ignored
      if (this._productResponse().content !== undefined &&
        isPlatformBrowser(this._platformId) &&
        this._keycloakService.isAuthenticated() && this._keycloakService.userRole === 'USER') {
        const variantIndexCaches: Record<string, VariantIndexCache> | null = this._storageService.getVariantIndexCaches();
        const quantityCaches: Record<string, QuantityCache> | null = this._storageService.getQuantityCaches();

        if (variantIndexCaches) {
          this._storageService.restoreVariantIndexCaches(this._variantIndexCaches, variantIndexCaches, this._productResponse());
        }

        if (quantityCaches) {
          this._storageService.restoreQuantityCaches(this._quantityCaches, quantityCaches, this._productResponse());
        }
      }
    });
  }

  private setCurrentAndSelectedCategoriesAsRoot(): void {
    const rootCategory: CategoryResponseDto = this._resourcesInitService.rootCategory();
    this._currentCategory.set(rootCategory);
    this._selectedCategory.set(rootCategory);
  }

  private setInitializedFilters(selectedCategory: CategoryResponseDto): void {
    // Sets filters map initialized to default values if the category is leaf category and template exists
    if (this.getIsLeafCategory(selectedCategory) && this.getHasCategoryTemplate(selectedCategory)) {
      this._filters.set(this._filterService.getInitializedFilters(selectedCategory));
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /*                                                currentCategory                                                   */
  public get currentCategory(): CategoryResponseDto {
    return this._currentCategory();
  }

  public set currentCategory(category: CategoryResponseDto) {
    this._currentCategory.set(category);
  }

  /*                                                selectedCategory                                                  */
  public get selectedCategory(): CategoryResponseDto {
    return this._selectedCategory();
  }

  // Marks current product response as stale (false), sets or resets filters, resets page to 0, and sets selected category
  public set selectedCategory(category: CategoryResponseDto) {
    this._hasResponse = false;

    if (this.isFirstBrowserInit) {
      this.isFirstBrowserInit = false;
    }

    this._filters.set(
      this.getIsLeafCategory(category) && this.getHasCategoryTemplate(category)
        ? this._filterService.getInitializedFilters(category)
        : {}
    );

    this._page.set(0);
    this._selectedCategory.set(category);
  }

  /*                                                productRequest                                                    */
  public get productRequest(): ProductRequest {
    return this._productRequest();
  }

  // Marks current product response as stale (false), toggles use of sorted variant index and resets their value,
  // normalizes size, ensures sort direction when sorting is used, resets page to 0, and updates product request
  public set productRequest(productRequest: ProductRequest) {
    this._hasResponse = false;

    if (this.isFirstBrowserInit) {
      this.isFirstBrowserInit = false;
    }

    this._useSortedVariantIndex = productRequest.sortBy === SortBy.AVAILABILITY || productRequest.sortBy === SortBy.PRICE;
    if (this._useSortedVariantIndex) {
      Object.values(this._variantIndexCaches)
        .forEach((variantIndexCache: VariantIndexCache): void => {
          variantIndexCache.sortedVariantIndex = 0; // Sorted variant indexes are reset each time sorting by availability or price is used
        });
    }

    const size: number = productRequest.size === null || productRequest.size < 1
      ? 100
      : productRequest.size;

    const sortDirection: string | null = productRequest.sortDirection !== null
      ? productRequest.sortDirection
      : productRequest.sortBy !== null
        ? 'asc'
        : null;

    this._page.set(0);

    // Object with the same reference is being passed so to notify dependents update is used
    // Size and sort direction need to be cleaned up (numerical size and sort direction set if the sort by is used
    // and sort direction wasn't set)
    this._productRequest.update((): ProductRequest => ({
      ...productRequest,
      ['size']: size,
      ['sortDirection']: sortDirection
    }));
  }

  /*                                                filters                                                           */
  public get filters(): Record<number, string | null> {
    return this._filters();
  }

  // Marks current product response as stale (false), resets page to 0, and set filters
  public set filters(filters: Record<number, string | null>) {
    this._hasResponse = false;

    if (this.isFirstBrowserInit) {
      this.isFirstBrowserInit = false;
    }

    this._page.set(0);
    this._filters.set(filters);
  }

  /*                                                productResponse                                                   */
  public get productResponse(): PageResponseProductResponseDto {
    return this._productResponse();
  }

  // Marks product response as fresh (true), initializes variant index caches and quantity caches if they don't exist yet,
  // resets variant index caches if needed and sets product response
  public set productResponse(productResponse: PageResponseProductResponseDto) {
    this._hasResponse = true;

    productResponse.content!
      .forEach((product: ProductResponseDto): void => {
        if (this._variantIndexCaches[product.id!] === undefined) {
          this._variantIndexCaches[product.id!] = {
            variantIndex: 0,
            sortedVariantIndex: 0
          };
        }
        product.variants!
          .forEach((variant: ProductVariantResponseDto): void => {
            if (this._quantityCaches[variant.id!] === undefined) {
              this._quantityCaches[variant.id!] = {
                quantity: 0
              };
            }
          });
        const variantIndex: number = this._variantIndexCaches[product.id!].variantIndex;
        const sortedVariantIndex: number = this._variantIndexCaches[product.id!].sortedVariantIndex;
        const variantsCount: number = product.variants!.length - 1;
        // resets variant index caches to 0 if the product has fewer variants than set in them
        if (variantIndex > variantsCount) {
          this._variantIndexCaches[product.id!].variantIndex = 0;
        }
        if (sortedVariantIndex > variantsCount) {
          this._variantIndexCaches[product.id!].sortedVariantIndex = 0;
        }
      });

    this._productResponse.set(productResponse);
  }

  /*                                                page                                                              */
  public get page(): number {
    return this._page();
  }

  // Marks current product response as stale (false), and sets page
  public set page(page: number) {
    this._hasResponse = false;

    if (this.isFirstBrowserInit) {
      this.isFirstBrowserInit = false;
    }

    this._page.set(page);
  }

  /*                                                productCaches                                                     */
  public getQuantityCache(variant: ProductVariantResponseDto): number | null {
    return this._quantityCaches[variant.id!].quantity;
  }

  public setQuantityCache(variant: ProductVariantResponseDto, quantity: number | null): void {
    this._quantityCaches[variant.id!].quantity = quantity;
    // Platform check not needed because the method is only used in the browser
    if (this._keycloakService.isAuthenticated() && this._keycloakService.userRole === 'USER') {
      this._storageService.saveQuantityCaches(this._quantityCaches);
    }
  }

  // Returns appropriate variant index
  public getVariantIndexCache(product: ProductResponseDto): number {
    return this._useSortedVariantIndex
      ? this._variantIndexCaches[product.id!].sortedVariantIndex
      : this._variantIndexCaches[product.id!].variantIndex;
  }

  // Sets appropriate variant index
  public setVariantIndexCache(product: ProductResponseDto, variantIndex: number): void {
    if (this._useSortedVariantIndex) {
      this._variantIndexCaches[product.id!].sortedVariantIndex = variantIndex;
    } else {
      this._variantIndexCaches[product.id!].variantIndex = variantIndex;
    }
    // Platform check not needed because the method is only used in the browser
    if (this._keycloakService.isAuthenticated() && this._keycloakService.userRole === 'USER') {
      this._storageService.saveVariantIndexCaches(this._variantIndexCaches);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public get hasResponse(): boolean {
    return this._hasResponse;
  }

  public set hasResponse(hasResponse: boolean) {
    this._hasResponse = hasResponse;
  }

  public get isLeafCategory(): boolean {
    return isLeafCategory(this._selectedCategory(), this._resourcesInitService.rootCategory());
  }

  public get hasCategoryTemplate(): boolean {
    return this._categoryHelpersService.hasCategoryTemplate(this._selectedCategory());
  }

  private getIsLeafCategory(category: CategoryResponseDto): boolean {
    return isLeafCategory(category, this._resourcesInitService.rootCategory());
  }

  private getHasCategoryTemplate(category: CategoryResponseDto): boolean {
    return this._categoryHelpersService.hasCategoryTemplate(category);
  }

}
