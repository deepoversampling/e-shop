import {Component} from '@angular/core';
import {ErrorHandlerService} from '../../../../../services/error-handler/error-handler.service';
import {ResourcesInitService} from '../../../../../services/resources-init/resources-init.service';
import {
  CategoryTemplatesInitService
} from '../../../../../services/admin/category-templates-init/category-templates-init.service';
import {CategoryTemplateResponseDto} from '../../../../../services/models/category-template-response-dto';
import {ExpandableDirective} from '../../../../../common/directives/expandable/expandable.directive';
import {CategoryResponseDto} from '../../../../../services/models/category-response-dto';
import {CategoryTemplateControllerService} from '../../../../../services/services/category-template-controller.service';
import {MenuComponent} from '../../../../../common/components/menu/menu.component';
import {getLeafCategories} from '../../../../../common/utils/category/category-utils';
import {
  CreateCategoryTemplateComponent
} from '../components/create-category-template/create-category-template.component';
import {CategoryTemplateDraftCache} from '../../../../../services/models/category-template-draft-cache';
import {CategoryHelpersService} from '../../../../../common/helpers/category/category-helpers.service';

@Component({
  selector: 'app-category-template-list',
  imports: [
    MenuComponent,
    ExpandableDirective,
    CreateCategoryTemplateComponent
  ],
  templateUrl: './category-template-list.component.html',
  styleUrl: './category-template-list.component.scss'
})
export class CategoryTemplateListComponent { // FIXME DONE

  constructor(
    private readonly _categoryTemplatesInitService: CategoryTemplatesInitService,
    private readonly _resourcesInitService: ResourcesInitService,
    private readonly _categoryTemplateService: CategoryTemplateControllerService,
    private readonly _categoryHelpersService: CategoryHelpersService,
    private readonly _errorHandlerService: ErrorHandlerService
  ) {}

  protected get isReady(): boolean {
    return this._categoryTemplatesInitService.ready();
  }

  protected get categories(): CategoryResponseDto[] {
    return getLeafCategories(this._resourcesInitService.rootCategory());
  }

  protected hasCategoryTemplate(category: CategoryResponseDto): boolean {
    return this._categoryHelpersService.hasCategoryTemplate(category);
  }

  protected getCategoryTemplate(category: CategoryResponseDto): CategoryTemplateResponseDto {
    return this._resourcesInitService.categoryTemplates()[category.id!];
  }

  protected getCategoryTemplateDraftCache(category: CategoryResponseDto): CategoryTemplateDraftCache {
    return this._categoryTemplatesInitService.getCategoryTemplateDraftCache(category);
  }

  protected removeCategoryTemplate(categoryTemplate: CategoryTemplateResponseDto): void {
    this._categoryTemplateService.deleteCategoryTemplateByCategoryId({
      'category-id': categoryTemplate.id!
    }).subscribe({
      next: async (): Promise<void> => {
        await this._resourcesInitService.init();
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected isCategoryTemplateVisible(category: CategoryResponseDto): boolean {
    return this._categoryTemplatesInitService.isCategoryTemplateVisible(category);
  }

  protected changeCategoryTemplateVisibility(category: CategoryResponseDto): void {
    this._categoryTemplatesInitService.changeCategoryTemplateVisibility(category);
  }

  protected getCategoryTemplateResizeTrigger(category: CategoryResponseDto): boolean {
    return this._categoryTemplatesInitService.getCategoryTemplateResizeTrigger(category);
  }

}
