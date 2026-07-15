import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
  WritableSignal
} from '@angular/core';
import {CategoryResponseDto} from '../../../../../services/models/category-response-dto';
import {ResourcesInitService} from '../../../../../services/resources-init/resources-init.service';
import {ErrorHandlerService} from '../../../../../services/error-handler/error-handler.service';
import {CategoryControllerService} from '../../../../../services/services/category-controller.service';
import {FormsModule} from '@angular/forms';
import {ICONS} from './icons';
import {CategoryRequestDto} from '../../../../../services/models/category-request-dto';
import {CategoriesInitService} from '../../../../../services/admin/categories-init/categories-init.service';
import {MenuComponent} from '../../../../../common/components/menu/menu.component';
import {CategoryHelpersService} from '../../../../../common/helpers/category/category-helpers.service';
import {getBorder, getBoxShadow, getColor} from '../../../../../common/utils/cart/cart-utils';
import {StrictHttpResponse} from '../../../../../services/strict-http-response';
import {getLocation} from '../../../../../common/utils/utils';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-category-list',
  imports: [
    MenuComponent,
    FormsModule
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit, AfterViewChecked { // FIXME DONE
  protected readonly icons: string[] = ICONS;

  @ViewChildren('category')
  private readonly _categoryRefs!: QueryList<ElementRef<HTMLButtonElement>>;
  private readonly _categoryRects: WritableSignal<Record<number, DOMRect>> = signal<Record<number, DOMRect>>({});

  constructor(
    private readonly _resourcesInitService: ResourcesInitService,
    private readonly _categoriesInitService: CategoriesInitService,
    private readonly _categoryService: CategoryControllerService,
    private readonly _categoryHelpersService: CategoryHelpersService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _toastrService: ToastrService
  ) {}

  // Updates DOMRects on window resize and scroll
  ngOnInit(): void {
    window.addEventListener('resize', (): void => {
      this._categoryRefs.forEach((categoryRef: ElementRef<HTMLButtonElement>): void => {
        this.updateDOMRect(categoryRef.nativeElement);
      });
    });
    window.addEventListener('scroll', (): void => {
      this._categoryRefs.forEach((categoryRef: ElementRef<HTMLButtonElement>): void => {
        this.updateDOMRect(categoryRef.nativeElement);
      });
    });
  }

  // Attaches transitionstart and transitionend listeners if they are not added yet and
  // updates DOMRect every change detection cycle
  ngAfterViewChecked(): void {
    this._categoryRefs.forEach((categoryRef: ElementRef<HTMLButtonElement>): void => {
      const btn: HTMLButtonElement = categoryRef.nativeElement;

      if (!btn.hasAttribute('data-transition')) {
        btn.addEventListener('transitionstart', (): void => this.updateDOMRect(btn));
        btn.addEventListener('transitionend', (): void => this.updateDOMRect(btn));
        btn.setAttribute('data-transition', 'true');
      }

      this.updateDOMRect(btn);
    });
  }

  private updateDOMRect(btn: HTMLButtonElement): void {
    const categoryId: string | undefined = btn.dataset['id'];
    if (categoryId === undefined) return;

    const rect: DOMRect = btn.getBoundingClientRect();
    this._categoryRects.update((prev: Record<number, DOMRect>): Record<number, DOMRect> => ({
      ...prev,
      [Number(categoryId)]: rect
    }));
  }

  // Returns path from the category button's parent to itself
  protected getPath(category: CategoryResponseDto): string {
    const parentCategory: CategoryResponseDto | undefined =
      this._categoryHelpersService.findParent(category, this._resourcesInitService.rootCategory());

    if (parentCategory === undefined) {
      return '';
    }

    const rect: DOMRect = this._categoryRects()[category.id!];
    const parentRect: DOMRect = this._categoryRects()[parentCategory.id!];
    if (rect === undefined || parentRect === undefined) {
      return '';
    }

    // Start point of the path is  the middle-bottom point of the category button's parent DOMRect
    const startX: number = parentRect.x + parentRect.width / 2;
    const startY: number = parentRect.y + parentRect.height;
    // End point of the path is the middle-top point of the category button DOMRect
    const endX: number = rect.x + rect.width / 2;
    const endY: number = rect.y;

    // Middle point between bottom point of the category button's parent DOMRect and top point of the category button DOMRect
    const midY: number = startY + (endY - startY) / 2;

    // Bezier points
    const x1: number = startX;
    const y1: number = midY;

    const x2: number = endX;
    const y2: number = midY;

    return `M ${startX} ${startY}
            C ${x1} ${y1}, ${x2} ${y2}, ${endX} ${endY}`;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  public get currentCategory(): CategoryResponseDto {
    return this._categoriesInitService.currentCategory;
  }

  public set currentCategory(category: CategoryResponseDto) {
    this._categoriesInitService.currentCategory = category;
  }

  public get selectedCategory(): CategoryResponseDto {
    return this._categoriesInitService.selectedCategory;
  }

  public set selectedCategory(category: CategoryResponseDto) {
    this._categoriesInitService.selectedCategory = category;
  }

  protected onClick(category: CategoryResponseDto): void {
    if (this.shouldUpdateTopCategory(category)) {
      this.updateTopCategory(category);
    }

    this.selectedCategory = category;
  }

  // Decides if the current category has to be recalculated when the category has parent or children
  private shouldUpdateTopCategory(category: CategoryResponseDto): boolean {
    return this._categoryHelpersService.isBottomWithChildren(category, this.currentCategory) // Bottom category button with subcategories
      || this._categoryHelpersService.isTopWithParent(category, this.currentCategory, this._resourcesInitService.rootCategory()); // Top category button with the parent
  }

  protected hasChildren(category: CategoryResponseDto): boolean {
    return this._categoryHelpersService.hasChildren(category);
  }

  protected hasParent(category: CategoryResponseDto): boolean {
    return this._categoryHelpersService.findParent(category, this._resourcesInitService.rootCategory()) !== undefined;
  }

  private updateTopCategory(category: CategoryResponseDto): void {
    const parentCategory: CategoryResponseDto | undefined =
      this._categoryHelpersService.findParent(category, this._resourcesInitService.rootCategory());

    if (parentCategory !== undefined) {
      this.currentCategory = parentCategory;
    }
  }

  protected isSelected(category: CategoryResponseDto): boolean {
    return category.id === this.selectedCategory.id;
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

  protected isIcon(icon: string): boolean {
    if (!this.isEmpty) {
      return icon === this.getCategoryIcon(this.selectedCategory);
    }
    return false;
  }

  protected isDraftIcon(icon: string): boolean {
    return icon === this.getCategoryDraftIcon(this.selectedCategory);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  protected get isReady(): boolean {
    return this._categoriesInitService.ready();
  }

  protected get isEmpty(): boolean {
    return this._categoriesInitService.empty();
  }

  // Returns icon from the cache if it is set or current icon if exists
  protected getCategoryIcon(category: CategoryResponseDto): string | null {
    const currentIcon: string | null = category.icon !== undefined
      ? category.icon.substring(7)
      : null;

    return this._categoriesInitService.getCategoryCacheIcon(category) ?? (currentIcon ?? null);
  }

  // Do nothing when the category tree is empty
  protected setCategoryIcon(category: CategoryResponseDto, icon: string): void {
    if (!this.isEmpty) {
      this._categoriesInitService.setCategoryCacheIcon(category, icon);
    }
  }

  // Do nothing when the category tree is empty
  protected resetCategoryIcon(category: CategoryResponseDto): void {
    if (!this.isEmpty) {
      this._categoriesInitService.setCategoryCacheIcon(category, null);
    }
  }

  protected getCategoryDraftIcon(category: CategoryResponseDto): string | null {
    return this._categoriesInitService.getCategoryDraftCacheIcon(category);
  }

  protected setCategoryDraftIcon(category: CategoryResponseDto, icon: string): void {
    this._categoriesInitService.setCategoryDraftCacheIcon(category, icon);
  }

  protected resetCategoryDraftIcon(category: CategoryResponseDto): void {
    return this._categoriesInitService.setCategoryDraftCacheIcon(category, null);
  }

  protected getCategoryDraftName(category: CategoryResponseDto): string {
    return this._categoriesInitService.getCategoryDraftCacheName(category);
  }

  protected setCategoryDraftName(category: CategoryResponseDto, name: string): void {
    this._categoriesInitService.setCategoryDraftCacheName(category, name);
  }

  protected hasCategoryIcon(category: CategoryResponseDto): boolean {
    return this._categoriesInitService.getCategoryCacheIcon(category) !== null // Icon is set
      // Category doesn't have icon yet or icon in cache is different from the current one
      && (category.icon === undefined
        || this._categoriesInitService.getCategoryCacheIcon(category) !== category.icon.substring(7));
  }

  protected hasCategoryDraftName(category: CategoryResponseDto): boolean {
    return this.getCategoryDraftName(category).length > 0;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  protected removeCategory(category: CategoryResponseDto): void {
    if (category.id === undefined) return;

    this._categoryService.deleteCategoryById({
      'category-id': category.id
    }).subscribe({
      next: async (): Promise<void> => {
        await this._resourcesInitService.init();
        this._categoriesInitService.removeCategoryStates(category);
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected createCategory(parentCategory: CategoryResponseDto): void {
    const icon: string | null = this.getCategoryDraftIcon(parentCategory);
    const parentCategoryId: number | undefined = parentCategory.id;

    const body: CategoryRequestDto = {
      name: this.getCategoryDraftName(parentCategory)
    };
    if (parentCategoryId !== undefined) {
      body.parentId = parentCategoryId;
    }
    if (icon !== null) {
      body.icon = 'fas fa-' + icon;
    }

    this._categoryService.createCategory$Response({
      body: body
    }).subscribe({
      next: async (response: StrictHttpResponse<CategoryResponseDto>): Promise<void> => {
        await this._resourcesInitService.init();
        this._categoriesInitService.clearCategoryDraftCache(parentCategory);

        this._toastrService.success(
          `Category ${response.body.name} has been created`,
          'Success'
        );
        console.log(getLocation(response));
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected updateCategoryIcon(category: CategoryResponseDto): void {
    const icon: string | null = this.getCategoryIcon(category);
    if (category.id === undefined || icon === null) return;

    this._categoryService.patchCategoryIconById({
      'category-id': category.id,
      body: {
        icon: 'fas fa-' + icon
      }
    }).subscribe({
      next: async (): Promise<void> => {
        await this._resourcesInitService.init();
        this._categoriesInitService.clearCategoryCache(category);
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected removeCategoryIcon(category: CategoryResponseDto): void {
    if (category.id === undefined) return;

    this._categoryService.patchCategoryIconById({
      'category-id': category.id,
      body: {
        icon: ''
      }
    }).subscribe({
      next: async (): Promise<void> => {
        await this._resourcesInitService.init();
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

}
