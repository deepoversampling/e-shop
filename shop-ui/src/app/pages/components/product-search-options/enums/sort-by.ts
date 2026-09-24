export enum SortBy {
  NAME = 'name',
  CREATED_DATE = 'createdDate',
  RATE = 'rate',
  POPULARITY = 'popularity',
  AVAILABILITY = 'availability',
  PRICE = 'price'
}

export const SORT_BY2 = ['name', 'createdDate', 'rate', 'popularity', 'availability', 'price'] as const;
export type SortBy2 = typeof SORT_BY2[number];

export const SortBy3 = {
  NAME: 'name',
  CREATED_DATE: 'createdDate',
  RATE: 'rate',
  POPULARITY: 'popularity',
  AVAILABILITY: 'availability',
  PRICE: 'price'
} as const

export type SortBy3 = typeof SortBy3[keyof typeof SortBy];
