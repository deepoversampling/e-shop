import {SortBy, SortBy2, SortBy3} from '../enums/sort-by';
import {SortDirection} from '../enums/sort-direction';

export const SORT_BY_OPTIONS: {value: SortBy, label: string}[] = [
  {value: SortBy.NAME, label: 'Name'},
  {value: SortBy.CREATED_DATE, label: 'Created Date'},
  {value: SortBy.RATE, label: 'Rate'},
  {value: SortBy.POPULARITY, label: 'Popularity'},
  {value: SortBy.AVAILABILITY, label: 'Availability'},
  {value: SortBy.PRICE, label: 'Price'}
];

export const SORT_BY_OPTIONS2: {value: SortBy2, label: string}[] = [
  {value: 'name', label: 'Name'},
  {value: 'createdDate', label: 'Created Date'},
  {value: 'rate', label: 'Rate'},
  {value: 'popularity', label: 'Popularity'},
  {value: 'availability', label: 'Availability'},
  {value: 'price', label: 'Price'}
];

export const SORT_BY_OPTIONS3: {value: SortBy3, label: string}[] = [
  {value: SortBy3.NAME, label: 'Name'},
  {value: SortBy3.CREATED_DATE, label: 'Created Date'},
  {value: SortBy3.RATE, label: 'Rate'},
  {value: SortBy3.POPULARITY, label: 'Popularity'},
  {value: SortBy3.AVAILABILITY, label: 'Availability'},
  {value: SortBy3.PRICE, label: 'Price'}
];

export const SORT_DIRECTION_OPTIONS: {value: SortDirection, label: string}[] = [
  {value: SortDirection.ASC, label: 'Ascending'},
  {value: SortDirection.DESC, label: 'Descending'}
];
