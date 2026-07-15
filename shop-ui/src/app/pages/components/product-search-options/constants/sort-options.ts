import {SortBy} from '../enums/sort-by';
import {SortDirection} from '../enums/sort-direction';

export const SORT_BY_OPTIONS: {value: SortBy, label: string}[] = [
  {value: SortBy.NAME, label: 'Name'},
  {value: SortBy.CREATED_DATE, label: 'Created Date'},
  {value: SortBy.RATE, label: 'Rate'},
  {value: SortBy.POPULARITY, label: 'Popularity'},
  {value: SortBy.AVAILABILITY, label: 'Availability'},
  {value: SortBy.PRICE, label: 'Price'}
];

export const SORT_DIRECTION_OPTIONS: {value: SortDirection, label: string}[] = [
  {value: SortDirection.ASC, label: 'Ascending'},
  {value: SortDirection.DESC, label: 'Descending'}
];
