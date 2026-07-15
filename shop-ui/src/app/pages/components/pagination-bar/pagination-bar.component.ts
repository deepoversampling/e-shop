import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {PageResponseProductResponseDto} from '../../../services/models/page-response-product-response-dto';
import {lengthToArray} from '../../../common/utils/utils';

@Component({
  selector: 'app-pagination-bar',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './pagination-bar.component.html',
  styleUrl: './pagination-bar.component.scss'
})
export class PaginationBarComponent { // FIXME DONE
  readonly productResponse: InputSignal<PageResponseProductResponseDto> = input.required<PageResponseProductResponseDto>();
  readonly page: InputSignal<number> = input.required<number>();
  readonly pageChange: OutputEmitterRef<number> = output<number>();

  protected totalPages(): number[] {
    const totalPages: number = this.productResponse().totalPages!;
    return lengthToArray(totalPages);
  }

  protected goToFirstPage(): void {
    this.pageChange.emit(0);
  }

  protected goToPreviousPage(): void {
    this.pageChange.emit(
      Math.max(this.page() - 1, 0)
    );
  }

  protected goToPage(page: number): void {
    // Ignores the same page clicked
    if (page !== this.page()) {
      this.pageChange.emit(page);
    }
  }

  protected goToNextPage(): void {
    this.pageChange.emit(
      Math.min(this.page() + 1, this.totalPages().length - 1)
    );
  }

  protected goToLastPage(): void {
    this.pageChange.emit(this.totalPages().length - 1);
  }

}
