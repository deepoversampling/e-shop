import {CartResponseDto} from '../../../services/models/cart-response-dto';
import {ItemResponseDto} from '../../../services/models/item-response-dto';
import {CategoryResponseDto} from '../../../services/models/category-response-dto';
import {DEFAULT_COLOR} from '../../constants/constants';

export function hasPendingFeedback(cart: CartResponseDto): boolean {
  return cart.items!
    .some((item: ItemResponseDto): boolean => item.note === undefined);
}

export function getColor(category: CategoryResponseDto, isSelected: boolean): string {
  return isSelected
    ? category.color!
    : 'white'
}

export function getBorder(category: CategoryResponseDto): string {
  return `2px solid ${getNormalizedColor(category)}`;
}

export function getBoxShadow(category: CategoryResponseDto, isSelected: boolean): string {
  return isSelected
    ? `0 0 8px 2px ${getNormalizedColor(category)}`
    : 'none';
}

function getNormalizedColor(category: CategoryResponseDto): string {
  return category.color ? category.color : DEFAULT_COLOR;
}
// FIXME DONE
