import {Component, input, InputSignal} from '@angular/core';
import {CartResponseDto} from '../../../../../../services/models/cart-response-dto';
import {ItemResponseDto} from '../../../../../../services/models/item-response-dto';
import {
  ImgErrorHandlerDirective
} from '../../../../../../common/directives/img-error-handler/img-error-handler.directive';
import {NgOptimizedImage} from '@angular/common';
import {CurrencyFormatterService} from '../../../../../../common/helpers/currency/currency-formatter.service';
import {ItemPropertiesFormatterService} from '../../../../../../common/helpers/item/item-properties-formatter.service';
import {toNgSrc} from '../../../../../../common/utils/utils';
import {IMAGE_FIT, IMAGE_SIZE} from '../../../../../../common/constants/constants';

@Component({
  selector: 'app-transaction-card',
  imports: [
    ImgErrorHandlerDirective,
    NgOptimizedImage
  ],
  templateUrl: './transaction-card.component.html',
  styleUrl: './transaction-card.component.scss'
})
export class TransactionCardComponent {
  public readonly cart: InputSignal<CartResponseDto> = input.required<CartResponseDto>();

  constructor(
    private readonly _itemPropertiesFormatterService: ItemPropertiesFormatterService,
    private readonly _currencyFormatterService: CurrencyFormatterService,
  ) {}

  protected getItemProperties(item: ItemResponseDto): string[] {
    return this._itemPropertiesFormatterService.formatItemProperties(item);
  }

  protected getTitle(item: ItemResponseDto): string {
    return this._currencyFormatterService.getItemSummary(item);
  }

  protected getNgSrc(item: ItemResponseDto): string {
    return  toNgSrc(item.productSnapshot?.imageUrl!, IMAGE_SIZE, IMAGE_FIT);
  }

}
