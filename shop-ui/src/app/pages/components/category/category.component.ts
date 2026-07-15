import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {CategoryResponseDto} from '../../../services/models/category-response-dto';
import {ResourcesInitService} from '../../../services/resources-init/resources-init.service';
import {CategoryHelpersService} from '../../../common/helpers/category/category-helpers.service';
import {getBorder, getBoxShadow, getColor} from '../../../common/utils/cart/cart-utils';

@Component({
  selector: 'app-category',
  imports: [],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent { // FIXME DONE
  public readonly currentCategory: InputSignal<CategoryResponseDto> = input.required<CategoryResponseDto>();
  public readonly currentCategoryChange: OutputEmitterRef<CategoryResponseDto> = output<CategoryResponseDto>();
  public readonly selectedCategory: InputSignal<CategoryResponseDto> = input.required<CategoryResponseDto>();
  public readonly selectedCategoryChange: OutputEmitterRef<CategoryResponseDto> = output<CategoryResponseDto>();

  constructor(
    protected readonly _resourcesInitService: ResourcesInitService,
    private readonly _categoryHelpersService: CategoryHelpersService
  ) {}

  // Current category has to be recalculated when the clicked category has parent or children
  protected onClick(category: CategoryResponseDto): void {
    if (category === this.selectedCategory()) return; // Ignore the same clicked

    // Bottom category button with subcategories
    if (this._categoryHelpersService.isBottomWithChildren(category, this.currentCategory())) {
      this.updateTopCategory(category);
    }

    // Top category button with the parent
    if (this._categoryHelpersService.isTopWithParent(category, this.currentCategory(), this._resourcesInitService.rootCategory())) {
      this.updateTopCategory(category);
    }

    this.selectedCategoryChange.emit(category);
  }

  protected hasChildren(category: CategoryResponseDto): boolean {
    return this._categoryHelpersService.hasChildren(category);
  }

  protected hasParent(category: CategoryResponseDto): boolean {
    return this._categoryHelpersService.findParent(category, this._resourcesInitService.rootCategory()) !== undefined;
  }

  protected isSelected(category: CategoryResponseDto): boolean {
    return category.id! === this.selectedCategory().id!;
  }

  protected getColor(category: CategoryResponseDto): string {
    return getColor(category, this.isSelected(category));
  }

  protected getBorder(category: CategoryResponseDto): string {
    return getBorder(category);
  }

  protected getBoxShadow(category: CategoryResponseDto): string {
    return getBoxShadow(category, this.isSelected(category));
  }

  private updateTopCategory(category: CategoryResponseDto): void {
    const parentCategory: CategoryResponseDto | undefined =
      this._categoryHelpersService.findParent(category, this._resourcesInitService.rootCategory());

    if (parentCategory !== undefined) {
      this.currentCategoryChange.emit(parentCategory);
    }
  }

}
