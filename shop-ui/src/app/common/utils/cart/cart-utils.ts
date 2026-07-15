import {CartResponseDto} from '../../../services/models/cart-response-dto';
import {ItemResponseDto} from '../../../services/models/item-response-dto';
import {CategoryResponseDto} from '../../../services/models/category-response-dto';

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
  return `2px solid ${category.color}`;
}

export function getBoxShadow(category: CategoryResponseDto, isSelected: boolean): string {
  return isSelected
    ? `0 0 8px 2px ${category.color}`
    : 'none';
}
// FIXME DONE
