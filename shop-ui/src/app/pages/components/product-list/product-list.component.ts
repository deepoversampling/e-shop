import {Component, effect, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {PageResponseProductResponseDto} from '../../../services/models/page-response-product-response-dto';
import {ProductControllerService} from '../../../services/services/product-controller.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {CategoryResponseDto} from '../../../services/models/category-response-dto';
import {FormsModule} from '@angular/forms';
import {catchError, debounceTime, EMPTY, Observable, Subject, switchMap} from 'rxjs';
import {ProductRequest} from '../../../services/models/product-request';
import {GetFilteredProducts$Params} from '../../../services/fn/product-controller/get-filtered-products';
import {SearchInitService} from '../../../services/search-init/search-init.service';
import {filter} from 'rxjs/operators';
import {IS_BROWSER} from '../../../common/constants/constants';
import {ErrorHandlerService} from '../../../services/error-handler/error-handler.service';

@Component({
  selector: 'app-product-list',
  imports: [
    ProductCardComponent,
    FormsModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent { // FIXME DONE
  public readonly selectedCategory: InputSignal<CategoryResponseDto> = input.required<CategoryResponseDto>();
  public readonly filters: InputSignal<Record<number, string | null>> = input.required<Record<number, string | null>>();
  public readonly page: InputSignal<number> = input.required<number>();
  public readonly productRequest: InputSignal<ProductRequest> = input.required<ProductRequest>();
  public readonly productResponse: InputSignal<PageResponseProductResponseDto> = input.required<PageResponseProductResponseDto>();
  public readonly productResponseChange: OutputEmitterRef<PageResponseProductResponseDto> = output<PageResponseProductResponseDto>();

  private readonly _productRequest$: Subject<void> = new Subject<void>();

  constructor(
    private readonly _productService: ProductControllerService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _searchInitService: SearchInitService
  ) {
    this._productRequest$
      .pipe( // Chains RxJS operators to transform the _productRequest$ observable stream
        debounceTime(100),
        filter((): boolean => IS_BROWSER),
        switchMap((): Observable<PageResponseProductResponseDto> => {
          const request: ProductRequest = this.productRequest();
          const pageSize: number | null = request.size;
          const sort: string | null = request.sortBy;
          const direction: string | null = request.sortDirection;
          const name: string = request.name;
          const quantity: number | null = request.quantity;
          const price: string = request.price;

          // Filters need to be cleaned to exclude null values
          const cleanedFilters: Record<string, string> = Object.fromEntries(
            Object.entries(this.filters())
              .filter(
                ([, value]: [string, string | null]): boolean => value !== null // Object keys are strings internally
              )
          ) as Record<string, string>;

          const params: GetFilteredProducts$Params = {
            'page-number': this.page(),
            "category-id": this.selectedCategory().id!,
            body: cleanedFilters
          };

          if (pageSize !== null) {
            params["page-size"] = pageSize;
          }

          if (sort !== null) {
            params['sort'] = sort;
            params['direction'] = direction!; // If sort isn't null then direction can't be null
          }

          if (name.length > 0) {
            params['name'] = name;
          }

          if (quantity !== null) {
            params['quantity'] = quantity;
          }

          if (price.length > 0) {
            params['price'] = Number(price);
          }

          return this._productService.getFilteredProducts(params)
            .pipe(
              catchError((err: any): Observable<never> => {
                this._errorHandlerService.handle(err);
                return EMPTY; // Observable that emits no items to the Observer and immediately emits a complete notification
              })
            );
        })
      )
      .subscribe((productResponse: PageResponseProductResponseDto): void => {
        this.productResponseChange.emit(productResponse);
      });

    this.setupReactiveTriggers();
  }

  // New value is fed only when the current product response is stale
  private setupReactiveTriggers(): void {
    effect((): void => {
      this.selectedCategory();
      this.filters();
      this.page();
      this.productRequest();
      if (!this._searchInitService.hasResponse) {
        this._productRequest$.next();
      }
    });
  }

}
