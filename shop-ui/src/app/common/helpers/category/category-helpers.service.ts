import {Injectable} from '@angular/core';
import {CategoryResponseDto} from '../../../services/models/category-response-dto';
import {ResourcesInitService} from '../../../services/resources-init/resources-init.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryHelpersService { // FIXME DONE

  constructor(private readonly _resourcesInitService: ResourcesInitService) {}

  private isTop(category: CategoryResponseDto, topCategory: CategoryResponseDto): boolean {
    return category.id === topCategory.id;
  }

  private isMiddle(category: CategoryResponseDto, topCategory: CategoryResponseDto): boolean {
    // Checks if there is some matching child of top category
    return !!topCategory.subcategories
      ?.some((subcategory: CategoryResponseDto): boolean => subcategory.id === category.id);
  }

  public isBottomWithChildren(category: CategoryResponseDto, topCategory: CategoryResponseDto): boolean {
    return !this.isTop(category, topCategory)
      && !this.isMiddle(category, topCategory)
      && this.hasChildren(category);
  }

  public isTopWithParent(category: CategoryResponseDto, topCategory: CategoryResponseDto, rootCategory: CategoryResponseDto): boolean {
    return this.isTop(category, topCategory)
      && this.findParent(category, rootCategory) !== null;
  }

  public hasChildren(category: CategoryResponseDto): boolean {
    return category.subcategories !== undefined && category.subcategories.length > 0;
  }

  public findParent(categoryToFind: CategoryResponseDto, category: CategoryResponseDto): CategoryResponseDto | undefined {
    if (category.subcategories === undefined || category.subcategories.length === 0) return undefined;

    for (const subcategory of category.subcategories) {
      if (subcategory.id === categoryToFind.id) {
        return category;
      }

      const parentCategory: CategoryResponseDto | undefined = this.findParent(categoryToFind, subcategory);
      if (parentCategory) return parentCategory;
    }
    return undefined;
  }

  public hasCategoryTemplate(category: CategoryResponseDto): boolean {
    return Object.keys(this._resourcesInitService.categoryTemplates())
      .includes(category.id!.toString());
  }

}
