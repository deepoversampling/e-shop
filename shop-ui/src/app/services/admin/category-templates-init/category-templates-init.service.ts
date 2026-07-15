import {effect, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {KeycloakService} from '../../keycloak/keycloak.service';
import {ResourcesInitService} from '../../resources-init/resources-init.service';
import {CategoryResponseDto} from '../../models/category-response-dto';
import {CategoryHelpersService} from '../../../common/helpers/category/category-helpers.service';
import {CategoryTemplateDraftCache} from '../../models/category-template-draft-cache';
import {getLeafCategories} from '../../../common/utils/category/category-utils';

@Injectable({
  providedIn: 'root'
})
export class CategoryTemplatesInitService { // FIXME DONE
  private readonly _ready: WritableSignal<boolean> = signal<boolean>(false);
  public readonly ready: Signal<boolean> = this._ready.asReadonly();

  private _categoryTemplateVisibilities: Record<number, boolean> = {}; // One per leaf category

  private readonly _categoryTemplateResizeTriggers: WritableSignal<Record<number, boolean>> =
    signal<Record<number, boolean>>({}); // One per leaf category without template
  public readonly categoryTemplateResizeTriggers: Signal<Record<number, boolean>> =
    this._categoryTemplateResizeTriggers.asReadonly();

  private _categoryTemplateDraftCaches: Record<number, CategoryTemplateDraftCache> = {}; // One per leaf category without template

  constructor(
    private readonly _keycloakService: KeycloakService,
    private readonly _resourcesInitService: ResourcesInitService,
    private readonly _categoryHelpersService: CategoryHelpersService
  ) {
    // Initializes or resets based on authentication state and re-initializes when root category changes
    effect((): void => {
      this._ready.set(false);

      if (this._keycloakService.isAuthenticated() && this._keycloakService.userRole === 'ADMIN') {
        this.init(getLeafCategories(this._resourcesInitService.rootCategory()));
      } else {
        this.reset();
      }

      this._ready.set(true);
    });
  }

  // Sets category template visibilities, category template resize triggers
  // and category template draft caches if they don't exist yet
  private init(categories: CategoryResponseDto[]): void {
    categories.forEach((category: CategoryResponseDto): void => {
      if (this._categoryTemplateVisibilities[category.id!] === undefined) {
        this._categoryTemplateVisibilities[category.id!] = false;
      }

      if (!this._categoryHelpersService.hasCategoryTemplate(category)) {
        if (this._categoryTemplateResizeTriggers()[category.id!] === undefined) {
          this._categoryTemplateResizeTriggers()[category.id!] = false;
        }
        if (this._categoryTemplateDraftCaches[category.id!] === undefined) {
          this._categoryTemplateDraftCaches[category.id!] = {
            property: null,
            properties: []
          };
        }
      }
    });
  }

  private reset(): void {
    this._categoryTemplateVisibilities = {};
    this._categoryTemplateDraftCaches = {};
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /*                                                categoryTemplateVisibilities                                      */
  public isCategoryTemplateVisible(category: CategoryResponseDto): boolean {
    return this._categoryTemplateVisibilities[category.id!];
  }

  public changeCategoryTemplateVisibility(category: CategoryResponseDto): void {
    this._categoryTemplateVisibilities[category.id!] = !this._categoryTemplateVisibilities[category.id!];
  }

  /*                                                categoryTemplateResizeTriggers                                    */
  public getCategoryTemplateResizeTrigger(arg: number | CategoryResponseDto): boolean {
    const categoryId: number = typeof arg === 'number' ? arg : arg.id!;
    return this._categoryTemplateResizeTriggers()[categoryId];
  }

  public setCategoryTemplateResizeTrigger(arg: number | CategoryResponseDto, state: boolean): void {
    const categoryId: number = typeof arg === 'number' ? arg : arg.id!;
    this._categoryTemplateResizeTriggers.update((prev: Record<number, boolean>): Record<number, boolean> => ({
      ...prev,
      [categoryId]: state
    }));
  }

  private removeCategoryTemplateResizeTrigger(arg: number | CategoryResponseDto): void {
    const categoryId: number = typeof arg === 'number' ? arg : arg.id!;
    delete this._categoryTemplateResizeTriggers()[categoryId];
  }

  /*                                                categoryTemplateDraftCaches                                       */
  public getCategoryTemplateDraftCache(category: CategoryResponseDto): CategoryTemplateDraftCache {
    return this._categoryTemplateDraftCaches[category.id!];
  }

  public clearCategoryTemplateDraftCache(arg: number | CategoryResponseDto): void {
    const categoryId: number = typeof arg === 'number' ? arg : arg.id!;
    this._categoryTemplateDraftCaches[categoryId].property = null;
    this._categoryTemplateDraftCaches[categoryId].properties = [];
  }

  private removeCategoryTemplateDraftCache(arg: number | CategoryResponseDto): void {
    const categoryId: number = typeof arg === 'number' ? arg : arg.id!;
    delete this._categoryTemplateDraftCaches[categoryId];
  }

  /*                                                category templates                                                */
  public removeCategoryTemplateStates(arg: number | CategoryResponseDto): void {
    this.removeCategoryTemplateResizeTrigger(arg);
    this.removeCategoryTemplateDraftCache(arg);
  }

}
