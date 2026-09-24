import {makeStateKey, StateKey} from '@angular/core';
import {CategoryResponseDto} from '../../services/models/category-response-dto';
import {CategoryTemplateResponseDto} from '../../services/models/category-template-response-dto';
import {PropertyResponseDto} from '../../services/models/property-response-dto';
import {PageResponseProductResponseDto} from '../../services/models/page-response-product-response-dto';

export const ROOT_CATEGORY_KEY: StateKey<CategoryResponseDto> =
  makeStateKey<CategoryResponseDto>('root-category');
export const CATEGORY_TEMPLATES_KEY: StateKey<Record<number, CategoryTemplateResponseDto>> =
  makeStateKey<Record<number, CategoryTemplateResponseDto>>('category-templates');
export const PROPERTIES_KEY: StateKey<Record<number, PropertyResponseDto>> =
  makeStateKey<Record<number, PropertyResponseDto>>('properties');
export const PRODUCT_RESPONSE_KEY: StateKey<PageResponseProductResponseDto> =
  makeStateKey<PageResponseProductResponseDto>('product-response');
// FIXME DONE
