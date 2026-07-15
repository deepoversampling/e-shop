import {Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {CategoryResponseDto} from '../models/category-response-dto';
import {CategoryControllerService} from '../services/category-controller.service';
import {CategoryTemplateResponseDto} from '../models/category-template-response-dto';
import {firstValueFrom} from 'rxjs';
import {PropertyResponseDto} from '../models/property-response-dto';
import {CategoryColorizeService} from '../../common/helpers/category/category-colorize.service';
import {CategoryTemplateHelpersService} from '../../common/helpers/category-template/category-template-helpers.service';
import {categoryTemplatesMapToPropertiesMap} from '../../common/utils/property/property-utils';
import {IS_BROWSER} from '../../common/constants/constants';

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

  constructor(
    private readonly _categoryService: CategoryControllerService,
    private readonly _categoryColorizeService: CategoryColorizeService,
    private readonly _categoryTemplateHelpersService: CategoryTemplateHelpersService,
  ) {}

  // Fetches and sets root category
  public async init(): Promise<void> {
    if (!IS_BROWSER) return;

    let rootCategory: CategoryResponseDto = {};

    try {
      rootCategory = await firstValueFrom(this._categoryService.getRootCategory());
    } catch (err: any) {
      let error: any = err.error;
      if (typeof error === 'string') {
        try {
          error = JSON.parse(error);
        } catch {}
      }
      console.error(error.validationErrors ? error.validationErrors : error.message, error.errorCode);
    }

    this._rootCategory.set(
      this._categoryColorizeService.colorize(rootCategory)
    );
    const categoryTemplates: Record<number, CategoryTemplateResponseDto> =
      await this._categoryTemplateHelpersService.getCategoryTemplatesMap(rootCategory);
    this._categoryTemplates.set(categoryTemplates);
    this._properties.set(
      categoryTemplatesMapToPropertiesMap(categoryTemplates)
    );
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
