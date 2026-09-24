import {Inject, Injectable, PLATFORM_ID, Signal, signal, StateKey, TransferState, WritableSignal} from '@angular/core';
import {CategoryResponseDto} from '../models/category-response-dto';
import {CategoryControllerService} from '../services/category-controller.service';
import {CategoryTemplateResponseDto} from '../models/category-template-response-dto';
import {firstValueFrom, tap} from 'rxjs';
import {PropertyResponseDto} from '../models/property-response-dto';
import {CategoryColorizeService} from '../../common/helpers/category/category-colorize.service';
import {CategoryTemplateHelpersService} from '../../common/helpers/category-template/category-template-helpers.service';
import {categoryTemplatesMapToPropertiesMap} from '../../common/utils/property/property-utils';
import {CATEGORY_TEMPLATES_KEY, PROPERTIES_KEY, ROOT_CATEGORY_KEY} from '../../common/constants/state-key';
import {isPlatformServer} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ResourcesInitService { // FIXME DONE
  private readonly _rootCategory: WritableSignal<CategoryResponseDto> =
    signal<CategoryResponseDto>({});
  private readonly _categoryTemplates: WritableSignal<Record<number, CategoryTemplateResponseDto>> =
    signal<Record<number, CategoryTemplateResponseDto>>({}); // k -> Category ID
  private readonly _properties: WritableSignal<Record<number, PropertyResponseDto>> =
    signal<Record<number, PropertyResponseDto>>({}); // k -> Property ID

  public readonly rootCategory: Signal<CategoryResponseDto> =
    this._rootCategory.asReadonly();
  public readonly categoryTemplates: Signal<Record<number, CategoryTemplateResponseDto>> =
    this._categoryTemplates.asReadonly();
  public readonly properties: Signal<Record<number, PropertyResponseDto>> =
    this._properties.asReadonly();

  private _isFirstBrowserInit: boolean = true;

  constructor(
    private readonly _categoryService: CategoryControllerService,
    private readonly _categoryColorizeService: CategoryColorizeService,
    private readonly _categoryTemplateHelpersService: CategoryTemplateHelpersService,
    private readonly _transferState: TransferState,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {}

  // Fetches and sets root category
  public async init(): Promise<void> {
    if (isPlatformServer(this._platformId)) {
      await this.initialize();
    } else {
      if (this._isFirstBrowserInit) {
        this.restoreState(ROOT_CATEGORY_KEY, this._rootCategory, {});
        this.restoreState(CATEGORY_TEMPLATES_KEY, this._categoryTemplates, {});
        this.restoreState(PROPERTIES_KEY, this._properties, {});
        this._isFirstBrowserInit = false;
      } else {
        await this.initialize();
      }
    }
  }

  private async initialize(): Promise<void> {
    try {
      await firstValueFrom(
        this._categoryService.getRootCategory().pipe(
          tap(async (rootCategory: CategoryResponseDto): Promise<void> => {
            const colorizedRootCategory: CategoryResponseDto = this._categoryColorizeService.colorize(rootCategory);
            this._rootCategory.set(colorizedRootCategory);

            const categoryTemplates: Record<number, CategoryTemplateResponseDto> =
              await this._categoryTemplateHelpersService.getCategoryTemplatesMap(rootCategory);
            this._categoryTemplates.set(categoryTemplates);

            const properties: Record<number, PropertyResponseDto> = categoryTemplatesMapToPropertiesMap(categoryTemplates);
            this._properties.set(properties);

            if (isPlatformServer(this._platformId)) {
              this._transferState.set(ROOT_CATEGORY_KEY, colorizedRootCategory);
              this._transferState.set(CATEGORY_TEMPLATES_KEY, categoryTemplates);
              this._transferState.set(PROPERTIES_KEY, properties);
            }
          })
        )
      );
    } catch (err: any) {
      let error: any = err.error;
      if (typeof error === 'string') {
        try {
          error = JSON.parse(error);
        } catch {}
      }
      this._rootCategory.set({}); // When the last category in the tree is being removed the root category is defaulted to {}

      // ErrorHandlerService is not used here because init() runs during app bootstrap
      // ToastrService does display the toast at this stage, but its auto-dismiss timer never starts, causing the toast to remain visible indefinitely
      // The error is therefore logged to the console instead
      console.error(error.validationErrors ? error.validationErrors : error.message, error.errorCode);
    }
  }

  private restoreState<T>(key: StateKey<T>, signal: WritableSignal<T>, fallback: T): void {
    if (this._transferState.hasKey(key)) {
      signal.set(this._transferState.get<T>(key, fallback));
      this._transferState.remove(key);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /*                                                categoryTemplates                                                 */
  public getCategoryTemplate(arg: number | CategoryResponseDto): CategoryTemplateResponseDto {
    const categoryId: number =
      typeof arg === 'number'
        ? arg
        : arg.id!;
    return this._categoryTemplates()[categoryId];
  }

  /*                                                properties                                                        */
  public getProperty(propertyId: number): PropertyResponseDto {
    return this._properties()[propertyId];
  }

}
