import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  TwoDecimalValidatorDirective
} from '../../../common/directives/two-decimal-validator/two-decimal-validator.directive';
import {SORT_BY_OPTIONS, SORT_DIRECTION_OPTIONS} from './constants/sort-options';
import {ProductRequest} from '../../../services/models/product-request';
import {SortBy} from './enums/sort-by';
import {SortDirection} from './enums/sort-direction';

@Component({
  selector: 'app-product-search-options',
  imports: [
    FormsModule,
    TwoDecimalValidatorDirective
  ],
  templateUrl: './product-search-options.component.html',
  styleUrl: './product-search-options.component.scss'
})
export class ProductSearchOptionsComponent { // FIXME DONE
  protected readonly sortByOptions: { value: SortBy, label: string }[] = SORT_BY_OPTIONS;
  protected readonly sortDirectionOptions: { value: SortDirection, label: string }[] = SORT_DIRECTION_OPTIONS;

  public readonly productRequest: InputSignal<ProductRequest> = input.required<ProductRequest>();
  public readonly productRequestChange: OutputEmitterRef<ProductRequest> = output<ProductRequest>();

  // Mutated product request is emitted every time it is changed
  protected onProductRequestChange(): void {
    this.productRequestChange.emit(this.productRequest());
  }

}
