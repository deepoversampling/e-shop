import {Injectable, WritableSignal} from '@angular/core';
import {KeycloakService} from '../../../services/keycloak/keycloak.service';
import {GetFilteredProducts$Params} from '../../../services/fn/product-controller/get-filtered-products';
import {CategoryResponseDto} from '../../../services/models/category-response-dto';
import {findCategory, isLeafCategory} from '../../utils/category/category-utils';
import {SortBy} from '../../../pages/components/product-search-options/enums/sort-by';
import {SortDirection} from '../../../pages/components/product-search-options/enums/sort-direction';
import {ResourcesInitService} from '../../../services/resources-init/resources-init.service';
import {CategoryHelpersService} from '../category/category-helpers.service';
import {hasKeys, isIndexSignature, isObj} from '../../utils/type/type-utils';
import {PropertyPresetDto} from '../../../services/models/property-preset-dto';
import {ProductRequest} from '../../../services/models/product-request';
import {PRICE_REGEX} from '../../constants/regex';
import {QuantityCache} from '../../../services/models/quantity-cache';
import {VariantIndexCache} from '../../../services/models/variant-index-cache';
import {ProductResponseDto} from '../../../services/models/product-response-dto';
import {PageResponseProductResponseDto} from '../../../services/models/page-response-product-response-dto';
import {ProductVariantResponseDto} from '../../../services/models/product-variant-response-dto';

@Injectable({
  providedIn: 'root'
})
export class StorageService { // FIXME DONE
  private static readonly SEARCH_PARAMETERS_KEY: string = 'params_';
  private static readonly QUANTITY_CACHES_KEY: string = 'quantity-caches_';
  private static readonly VARIANT_INDEX_CACHES_KEY: string = 'variant-index-caches_';

  constructor(
    private readonly _keycloakService: KeycloakService,
    private readonly _resourcesInitService: ResourcesInitService,
    private readonly _categoryHelpersService: CategoryHelpersService,
  ) {
  }

  private save<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public saveSearchParameters(params: GetFilteredProducts$Params): void {
    this.save(StorageService.SEARCH_PARAMETERS_KEY + this._keycloakService.userProfile?.id!, params);
  }

  public saveQuantityCaches(quantityCaches: Record<number, QuantityCache>): void {
    this.save(StorageService.QUANTITY_CACHES_KEY + this._keycloakService.userProfile?.id!, quantityCaches);
  }

  public saveVariantIndexCaches(variantIndexCaches: Record<number, VariantIndexCache>): void {
    this.save(StorageService.VARIANT_INDEX_CACHES_KEY + this._keycloakService.userProfile?.id!, variantIndexCaches);
  }

  private get<T>(key: string, validate: (value: unknown) => value is T): T | null {
    const item: string | null = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    try {
      const value: any = JSON.parse(item);
      return validate(value) ? value : null;
    } catch (err: any) {
      return null;
    }
  }

  // If the value of search parameters exists in the localstorage, is parsable
  // and has the same type as the value that was saved in the localstorage then it is returned, null otherwise
  public getSearchParameters(): GetFilteredProducts$Params | null {
    const rootCategory: CategoryResponseDto = this._resourcesInitService.rootCategory();
    const searchParameters: GetFilteredProducts$Params | null = this.get(
      StorageService.SEARCH_PARAMETERS_KEY + this._keycloakService.userProfile?.id!,
      this.isValidGetFilteredProducts$Params
    );

    return (searchParameters && findCategory(searchParameters['category-id'], rootCategory) !== undefined)
      ? searchParameters
      : null;
  }

  public getVariantIndexCaches(): Record<string, VariantIndexCache> | null {
    return this.get(
      StorageService.VARIANT_INDEX_CACHES_KEY + this._keycloakService.userProfile?.id!,
      this.isVariantIndexCacheRecord
    );
  }

  public getQuantityCaches(): Record<number, QuantityCache> | null {
    return this.get(
      StorageService.QUANTITY_CACHES_KEY + this._keycloakService.userProfile?.id!,
      this.isQuantityCacheRecord
    );
  }

  public restoreSearchParameters(
    searchParameters: GetFilteredProducts$Params,
    currentCategoryToUpdate: WritableSignal<CategoryResponseDto>,
    selectedCategoryToUpdate: WritableSignal<CategoryResponseDto>,
    filtersToUpdate: WritableSignal<Record<number, string | null>>,
    pageToUpdate: WritableSignal<number>,
    productRequestToUpdate: WritableSignal<ProductRequest>,
    hasLocalStorageParams: WritableSignal<boolean>
  ): void {
    const rootCategory: CategoryResponseDto = this._resourcesInitService.rootCategory();
    const selectedCategory: CategoryResponseDto = findCategory(searchParameters["category-id"], rootCategory)!;
    const currentCategory: CategoryResponseDto = this.getCurrentCategory(selectedCategory);

    currentCategoryToUpdate.set(currentCategory);
    selectedCategoryToUpdate.set(selectedCategory);

    if (this.getIsLeafCategory(selectedCategory) && this.getHasCategoryTemplate(selectedCategory)) {
      const filters: Record<number, string> = searchParameters.body;
      this.setResolvedFilters(filtersToUpdate, filters);
    }

    // All signals are set directly with the updated value without notifying the dependents
    const page: number | undefined = searchParameters["page-number"];
    if (page && page >= 0) {
      pageToUpdate.set(page);
    }

    const size: number | undefined = searchParameters["page-size"];
    if (size && size >= 1) {
      productRequestToUpdate.set({
        ...productRequestToUpdate(),
        ['size']: size
      });
    }

    // Both sort type and direction are needed for sorting
    const sortBy: string | undefined = searchParameters.sort;
    const sortDirection: string | undefined = searchParameters.direction;
    if (sortBy && Object.values(SortBy).includes(sortBy as SortBy) &&
      sortDirection && Object.values(SortDirection).includes(sortDirection as SortDirection)) {
      productRequestToUpdate.set({
        ...productRequestToUpdate(),
        ['sortBy']: sortBy,
        ['sortDirection']: sortDirection
      });
    }

    const name: string | undefined = searchParameters.name;
    if (name) {
      productRequestToUpdate.set({
        ...productRequestToUpdate(),
        ['name']: name
      });
    }

    const quantity: number | undefined = searchParameters.quantity;
    if (quantity && quantity >= 1) {
      productRequestToUpdate.set({
        ...productRequestToUpdate(),
        ['quantity']: quantity
      });
    }

    const price: number | undefined = searchParameters.price;
    if (price && PRICE_REGEX.test(price.toString())) {
      productRequestToUpdate.set({
        ...productRequestToUpdate(),
        ['price']: price.toString()
      });
    }

    hasLocalStorageParams.set(true);
  }

  public restoreQuantityCaches(
    quantityCachesToUpdate: Record<string, QuantityCache>,
    quantityCaches: Record<string, QuantityCache>,
    productResponse: PageResponseProductResponseDto
  ): void {
    Object.entries(quantityCachesToUpdate)
      .map(
        ([key, value]: [string, QuantityCache]): [number, QuantityCache] => {
          const matchedQuantityCache: [string, QuantityCache] | undefined =
            Object.entries(quantityCaches)
              .find(([key2]: [string, QuantityCache]): boolean => key2 === key);

          if (matchedQuantityCache) {
            const quantity: number | null = matchedQuantityCache[1].quantity;
            const variant: ProductVariantResponseDto | undefined = productResponse.content!
              .flatMap((product: ProductResponseDto): ProductVariantResponseDto[] => product.variants!)
              .find((variant: ProductVariantResponseDto): boolean => variant.id! === Number(key));

            if (quantity && variant && quantity <= variant.quantity! && quantity >= 0) {
              value.quantity = quantity;
            }
          }
          return [Number(key), value];
        }
      );
  }

  public restoreVariantIndexCaches(
    variantIndexCachesToUpdate: Record<string, VariantIndexCache>,
    variantIndexCaches: Record<string, VariantIndexCache>,
    productResponse: PageResponseProductResponseDto
  ): void {
    Object.entries(variantIndexCachesToUpdate)
      .map(
        ([key, value]: [string, VariantIndexCache]): [number, VariantIndexCache] => {
          const matchedVariantIndexCache: [string, VariantIndexCache] | undefined =
            Object.entries(variantIndexCaches)
              .find(([key2]: [string, VariantIndexCache]): boolean => key2 === key);

          if (matchedVariantIndexCache) {
            const variantIndex: number = matchedVariantIndexCache[1].variantIndex;
            const product: ProductResponseDto | undefined = productResponse.content!
              .find((product: ProductResponseDto): boolean => product.id! === Number(key));

            if (product && variantIndex < product?.variants!.length && variantIndex >= 0) {
              value.variantIndex = variantIndex;
            }
          }
          return [Number(key), value];
        }
      );
  }

  // Checks if the value is of the same type as the value that was saved in localstorage
  private isValidGetFilteredProducts$Params(value: unknown): value is GetFilteredProducts$Params {
    if (!isObj(value)) {
      return false;
    }

    const obj = value as Record<string, unknown>;

    return (
      typeof (obj['page-number'] === 'number' || typeof obj['page-number'] === 'undefined') &&
      typeof (obj['page-size'] === 'number' || typeof obj['page-size'] === 'undefined') &&
      typeof (obj['sort'] === 'string' || typeof obj['sort'] === 'undefined') &&
      typeof (obj['direction'] === 'number' || typeof obj['direction'] === 'undefined') &&
      typeof (obj['name'] === 'number' || typeof obj['name'] === 'undefined') &&
      typeof (obj['quantity'] === 'number' || typeof obj['quantity'] === 'undefined') &&
      typeof (obj['price'] === 'number' || typeof obj['price'] === 'undefined') &&
      typeof obj['category-id'] === 'number' &&
      isObj(obj['body']) && isIndexSignature(obj['body'])
    );
  }

  private isVariantIndexCacheRecord(value: unknown): value is Record<string, VariantIndexCache> {
    return isObj(value) &&
      Object.values(value)
        .every((v: unknown): v is VariantIndexCache => hasKeys(v, ['variantIndex', 'sortedVariantIndex']));
  }

  private isQuantityCacheRecord(value: unknown): value is Record<string, QuantityCache> {
    return isObj(value) &&
      Object.values(value)
        .every((v: unknown): v is QuantityCache => hasKeys(v, ['quantity']));
  }

  private getCurrentCategory(selectedCategory: CategoryResponseDto): CategoryResponseDto {
    const rootCategory: CategoryResponseDto = this._resourcesInitService.rootCategory();
    const isRoot: boolean = selectedCategory.id === rootCategory.id;
    const hasChildren: boolean = this._categoryHelpersService.hasChildren(selectedCategory);
    const parent: CategoryResponseDto | undefined = this._categoryHelpersService.findParent(selectedCategory, rootCategory);
    let currentCategory: CategoryResponseDto = {};

    // Category tree has only 1 category
    if (isRoot) {
      currentCategory = rootCategory;
    } else if (parent) {
      const grandParent: CategoryResponseDto | undefined = this._categoryHelpersService.findParent(parent, rootCategory);

      // Selected category is the leaf node
      if (!hasChildren) {
        // Uses grandparent category if it exists to have 3 levels in the tree
        if (grandParent) {
          currentCategory = grandParent;
          // If the tree has only 2 levels the parent category is used
        } else {
          currentCategory = parent;
        }
        // The selected category is not root nor the leaf node so the current category is the parent
      } else {
        currentCategory = parent;
      }
    }
    return currentCategory;
  }

  private setResolvedFilters(
    filtersSignal: WritableSignal<Record<string, string | null>>,
    filters: Record<string, string>
  ): void {
    filtersSignal.set(
      Object.fromEntries(
        Object.entries(filtersSignal())
          .map(([key, value]: [string, string | null]): [number, string | null] => {
              const matchedProperty: [string, string] | undefined =
                Object.entries(filters)
                  .find(([key2]: [string, string]): boolean => key2 === key);

              if (matchedProperty) {
                const isValueValid: boolean = this._resourcesInitService.properties()[Number(key)].presets!
                  .some((preset: PropertyPresetDto): boolean => {
                    return preset.value === matchedProperty[1];
                  });

                return [Number(key), isValueValid ? matchedProperty[1] : value];
              }
              return [Number(key), value];
            }
          )
      )
    );
  }

  private getIsLeafCategory(category: CategoryResponseDto): boolean {
    return isLeafCategory(category, this._resourcesInitService.rootCategory());
  }

  private getHasCategoryTemplate(category: CategoryResponseDto): boolean {
    return this._categoryHelpersService.hasCategoryTemplate(category);
  }

}
