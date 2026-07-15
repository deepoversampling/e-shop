import {Component} from '@angular/core';
import {CategoryResponseDto} from '../../services/models/category-response-dto';
import {ProductRequest} from '../../services/models/product-request';
import {CategoryComponent} from '../components/category/category.component';
import {MenuComponent} from '../../common/components/menu/menu.component';
import {SearchInitService} from '../../services/search-init/search-init.service';
import {ProductSearchOptionsComponent} from '../components/product-search-options/product-search-options.component';
import {FilterComponent} from '../components/filter/filter.component';
import {ProductListComponent} from '../components/product-list/product-list.component';
import {PageResponseProductResponseDto} from '../../services/models/page-response-product-response-dto';
import {PaginationBarComponent} from '../components/pagination-bar/pagination-bar.component';

@Component({
  selector: 'app-search',
  imports: [
    MenuComponent,
    CategoryComponent,
    ProductSearchOptionsComponent,
    FilterComponent,
    ProductListComponent,
    PaginationBarComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent { // FIXME DONE

  constructor(private readonly _searchInitService: SearchInitService) {}

  protected get currentCategory(): CategoryResponseDto {
    return this._searchInitService.currentCategory;
  }

  protected set currentCategory(category: CategoryResponseDto) {
    this._searchInitService.currentCategory = category;
  }

  protected get selectedCategory(): CategoryResponseDto {
    return this._searchInitService.selectedCategory;
  }

  protected set selectedCategory(category: CategoryResponseDto) {
    this._searchInitService.selectedCategory = category;
  }

  protected get productRequest(): ProductRequest {
    return this._searchInitService.productRequest;
  }

  protected set productRequest(productRequest: ProductRequest) {
    this._searchInitService.productRequest = productRequest;
  }

  public get filters(): Record<number, string | null> {
    return this._searchInitService.filters;
  }

  public set filters(filters: Record<number, string | null>) {
    this._searchInitService.filters = filters;
  }

  public get productResponse(): PageResponseProductResponseDto {
    return this._searchInitService.productResponse;
  }

  public set productResponse(productResponse: PageResponseProductResponseDto) {
    this._searchInitService.productResponse = productResponse;
  }

  public get page(): number {
    return this._searchInitService.page;
  }

  public set page(page: number) {
    this._searchInitService.page = page;
  }

  protected get isLeafCategory(): boolean {
    return this._searchInitService.isLeafCategory;
  }

  public get hasCategoryTemplate(): boolean {
    return this._searchInitService.hasCategoryTemplate;
  }

}
