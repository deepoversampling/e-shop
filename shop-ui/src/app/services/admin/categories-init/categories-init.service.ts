import {computed, effect, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {CategoryDraftCache} from '../../models/category-draft-cache';
import {CategoryCache} from '../../models/category-cache';
import {ResourcesInitService} from '../../resources-init/resources-init.service';
import {KeycloakService} from '../../keycloak/keycloak.service';
import {CategoryResponseDto} from '../../models/category-response-dto';
import {findCategory, getCategoryDepth} from '../../../common/utils/category/category-utils';
import {CategoryHelpersService} from '../../../common/helpers/category/category-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesInitService { // FIXME DONE
  public readonly empty: Signal<boolean> =
    computed((): boolean => this._resourcesInitService.rootCategory().id === undefined);

  private readonly _ready: WritableSignal<boolean> = signal<boolean>(false);
  public readonly ready: Signal<boolean> = this._ready.asReadonly();

  private readonly _currentCategory: WritableSignal<CategoryResponseDto> =
    signal<CategoryResponseDto>({});
  private readonly _selectedCategory: WritableSignal<CategoryResponseDto> =
    signal<CategoryResponseDto>({});
  private _selectedCategoryParent: CategoryResponseDto | undefined = undefined;
  private _currentCategoryParent: CategoryResponseDto | undefined = undefined;

  private _categoryDraftCaches: Record<number, CategoryDraftCache> = {}; // One per category (new category)
  private _categoryCaches: Record<number, CategoryCache> = {}; // One per category

  constructor(
    private readonly _keycloakService: KeycloakService,
    private readonly _resourcesInitService: ResourcesInitService,
    private readonly _categoryHelpersService: CategoryHelpersService,
  ) {
    // Sets current and selected category before the service is initialized to prevent {} from being used
    const rootCategory: CategoryResponseDto = this._resourcesInitService.rootCategory();
    this._currentCategory.set(rootCategory);
    this._selectedCategory.set(rootCategory);

    // Initializes or resets based on authentication state and re-initializes when root category changes
    effect((): void => {
      this._ready.set(false);

      if (this._keycloakService.isAuthenticated() && this._keycloakService.userRole === 'ADMIN') {
        this.init(this._resourcesInitService.rootCategory());
      } else {
        this.reset();
      }

      this._ready.set(true);
    });

    // effect() will be called on currentCategory or selectedCategory which is not crucial here but rather side effect
    // Sets updated values of the current category and selected category when root category changes,
    // This is any operation that modifies root category like adding, removing category or adding, removing icon
    effect((): void => {
      const rootCategory: CategoryResponseDto = this._resourcesInitService.rootCategory();
      const currentCategory: CategoryResponseDto | undefined = findCategory(this.currentCategory, rootCategory);
      const selectedCategory: CategoryResponseDto | undefined = findCategory(this.selectedCategory, rootCategory);

      // If the selected category was removed then both current and selected category have to use their parent category
      if (selectedCategory === undefined) {
        this._currentCategory.set(
          this._currentCategoryParent
            ? this._currentCategoryParent
            : rootCategory
        );

        this._selectedCategory.set(
          this._selectedCategoryParent
            ? this._selectedCategoryParent
            : rootCategory
        );
        // Otherwise only the updated values are assigned
      } else {
        this._currentCategory.set(
          currentCategory
            // Depth of current category determines if the parent has to be used
            // Depth smaller than 2 means that the category which wasn't selected has been removed
            // To always display 3 rows, current category parent has to be used instead which will cause the current category to have depth 2
            ? getCategoryDepth(currentCategory) >= 2
              ? currentCategory
              : this._currentCategoryParent
                ? this._currentCategoryParent
                : rootCategory
            : rootCategory
        );

        this._selectedCategory.set(
          selectedCategory
            ? selectedCategory
            : rootCategory
        );
      }

      // Parent of selected and current category will be needed as the fallbacks
      this._selectedCategoryParent = this._categoryHelpersService.findParent(this._selectedCategory(), this._resourcesInitService.rootCategory());
      this._currentCategoryParent = this._categoryHelpersService.findParent(this._currentCategory(), this._resourcesInitService.rootCategory());
    });
  }

  // Sets appropriate category draft caches based on empty state if they don't exist yet
  private init(category: CategoryResponseDto): void {
    if (this.empty()) {
      if (this._categoryDraftCaches[0] === undefined) {
        this._categoryDraftCaches[0] = {
          name: '',
          icon: null
        };
      }
    } else {
      if (this._categoryDraftCaches[category.id!] === undefined) {
        this._categoryDraftCaches[category.id!] = {
          name: '',
          icon: null
        };
      }

      if (this._categoryCaches[category.id!] === undefined) {
        this._categoryCaches[category.id!] = {
          icon: null
        };
      }

      const subcategories: CategoryResponseDto[] | undefined = category.subcategories;
      if (subcategories !== undefined && subcategories.length > 0) {
        for (const subcategory of subcategories) {
          this.init(subcategory);
        }
      }
    }
  }

  private reset(): void {
    this._categoryDraftCaches = {};
    this._categoryCaches = {};
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

  public set selectedCategory(category: CategoryResponseDto) {
    this._selectedCategory.set(category);
  }

  /*                                                categoryDraftCaches                                               */
  public getCategoryDraftCacheName(category: CategoryResponseDto): string {
    return this.empty()
      ? this._categoryDraftCaches[0].name
      : this._categoryDraftCaches[category.id!].name;
  }

  public setCategoryDraftCacheName(category: CategoryResponseDto, name: string): void {
    if (this.empty()) {
      this._categoryDraftCaches[0].name = name;
    } else {
      this._categoryDraftCaches[category.id!].name = name;
    }
  }

  public getCategoryDraftCacheIcon(category: CategoryResponseDto): string | null {
    return this.empty()
      ? this._categoryDraftCaches[0].icon
      : this._categoryDraftCaches[category.id!].icon;
  }

  public setCategoryDraftCacheIcon(category: CategoryResponseDto, icon: string | null): void {
    if (this.empty()) {
      this._categoryDraftCaches[0].icon = icon;
    } else {
      this._categoryDraftCaches[category.id!].icon = icon;
    }
  }

  public clearCategoryDraftCache(category: CategoryResponseDto): void {
    // The type of cache can be only inferred by the passed category
    // If it was called when no categories existed, then the passed category was {}
    if (category.id === undefined) {
      this._categoryDraftCaches[0].name = '';
      this._categoryDraftCaches[0].icon = null;
    } else {
      this._categoryDraftCaches[category.id].name = '';
      this._categoryDraftCaches[category.id].icon = null;
    }
  }

  /*                                                categoryCaches                                                    */
  public getCategoryCacheIcon(category: CategoryResponseDto): string | null {
    return this._categoryCaches[category.id!].icon;
  }

  public setCategoryCacheIcon(category: CategoryResponseDto, icon: string | null): void {
    this._categoryCaches[category.id!].icon = icon;
  }

  public clearCategoryCache(category: CategoryResponseDto): void {
    this._categoryCaches[category.id!].icon = null;
  }

  /*                                                categories                                                        */
  public removeCategoryStates(category: CategoryResponseDto): void {
    delete this._categoryCaches[category.id!];
    delete this._categoryDraftCaches[category.id!];
  }

}
