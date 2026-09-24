import {
  Component,
  effect,
  Inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  PLATFORM_ID,
  TransferState
} from '@angular/core';
import {PageResponseProductResponseDto} from '../../../services/models/page-response-product-response-dto';
import {ProductControllerService} from '../../../services/services/product-controller.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {CategoryResponseDto} from '../../../services/models/category-response-dto';
import {FormsModule} from '@angular/forms';
import {catchError, debounceTime, EMPTY, Observable, Subject, switchMap, tap} from 'rxjs';
import {ProductRequest} from '../../../services/models/product-request';
import {GetFilteredProducts$Params} from '../../../services/fn/product-controller/get-filtered-products';
import {SearchInitService} from '../../../services/search-init/search-init.service';
import {ErrorHandlerService} from '../../../services/error-handler/error-handler.service';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {PRODUCT_RESPONSE_KEY} from '../../../common/constants/state-key';
import {KeycloakService} from '../../../services/keycloak/keycloak.service';
import {StorageService} from '../../../common/helpers/storage/storage.service';

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
    private readonly _searchInitService: SearchInitService,
    private readonly _transferState: TransferState,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private readonly _keycloakService: KeycloakService,
    private readonly _storageService: StorageService
  ) {
    this._productRequest$
      .pipe( // Chains RxJS operators to transform the _productRequest$ observable stream
        debounceTime(100),
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

          if (!params["category-id"]) { // Handles root category that has no categories yet
            return EMPTY;
          }

          return this._productService.getFilteredProducts(params)
            .pipe(
              tap((): void => { // Saves request parameters and body of the request in localstorage to retrieve them after page reload
                if (isPlatformBrowser(this._platformId) &&
                  this._keycloakService.isAuthenticated() && this._keycloakService.userRole === 'USER') {
                  this._storageService.saveSearchParameters(params);
                }
              }),
              catchError((err: any): Observable<never> => {
                this._errorHandlerService.handle(err);
                return EMPTY; // Observable that emits no items to the Observer and immediately emits a complete notification
              })
            );
        })
      )
      .subscribe((productResponse: PageResponseProductResponseDto): void => { // Observer is registered to listen to the Subject and the value will be multicasted to him
        this.productResponseChange.emit(productResponse);
        // Server saves product response in TransferState
        if (isPlatformServer(this._platformId)) {
          this._transferState.set(PRODUCT_RESPONSE_KEY, productResponse);
        }
      });

    if (isPlatformServer(this._platformId)) {
      this._productRequest$.next(); // Server calls next() to feed a new value to Subject only once
    } else {
      this.setupReactiveTriggers(); // Browser setup reactive triggers to feed a new value to Subject based on the signal changes (selected category, filters, page or product request)
    }
  }

  private setupReactiveTriggers(): void {
    effect((): void => {
      this.selectedCategory();
      this.filters();
      this.page();
      this.productRequest();

      // If search params in localstorage don't exist then product response from TransferState on first browser init is used to avoid double data fetch
      if (this._searchInitService.isFirstBrowserInit &&
        this._transferState.hasKey(PRODUCT_RESPONSE_KEY) &&
        !this._searchInitService.hasLocalStorageParams()) {
        this.productResponseChange.emit(
          this._transferState.get<PageResponseProductResponseDto>(PRODUCT_RESPONSE_KEY, {})
        );
        this._transferState.remove(PRODUCT_RESPONSE_KEY);
      } else {
        // New value is fed only when the current product response is stale (selected category, filters, page or product request changed)
        if (!this._searchInitService.hasResponse) {
          this._productRequest$.next();
        }
      }
    });
  }

}
