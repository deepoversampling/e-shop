import {PropertyResponseDto} from './property-response-dto';

export interface CategoryTemplateDraftCache {
  property: PropertyResponseDto | null; // Currently selected property
  properties: Array<PropertyResponseDto>; // List of added properties
}
