import {Injectable} from '@angular/core';
import {categoriesToIds, getLeafCategories} from '../../utils/category/category-utils';
import {CategoryResponseDto} from '../../../services/models/category-response-dto';
import {CategoryTemplateResponseDto} from '../../../services/models/category-template-response-dto';
import {firstValueFrom} from 'rxjs';
import {CategoryTemplateControllerService} from '../../../services/services/category-template-controller.service';
import {PropertyHelpersService} from '../property/property-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryTemplateHelpersService { // FIXME DONE

  constructor(
    private readonly _categoryTemplateService: CategoryTemplateControllerService,
    private readonly _propertyHelpersService: PropertyHelpersService
  ) {
  }

  // Fetches and returns category templates map for leaf categories and applies continuous-property constraints on them
  public async getCategoryTemplatesMap(rootCategory: CategoryResponseDto): Promise<Record<number, CategoryTemplateResponseDto>> {
    const categoryTemplatesMap: Record<number, CategoryTemplateResponseDto> = {};
    const leafCategoryIds: number[] = categoriesToIds(getLeafCategories(rootCategory));

    await Promise.all(
      leafCategoryIds.map(async (categoryId: number): Promise<void> => {
        let categoryTemplate: CategoryTemplateResponseDto = {};

        try {
          categoryTemplate = await firstValueFrom(
            this._categoryTemplateService.getCategoryTemplateByCategoryId({
              'category-id': categoryId
            })
          );
        } catch (err: any) {
          let error: any = err.error;
          if (typeof error === 'string') {
            try {
              error = JSON.parse(error);
            } catch {}
          }
          console.error(error.validationErrors ? error.validationErrors : error.message, error.errorCode);
          return;
        }

        categoryTemplatesMap[categoryTemplate.categoryId!] =
          this._propertyHelpersService.applyContinuousConstraintsForTemplate(categoryTemplate);
      })
    );

    return categoryTemplatesMap;
  }

}
