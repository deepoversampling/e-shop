import {PropertyResponseDto} from './property-response-dto';

export interface CategoryTemplateDraftCache {
  property: PropertyResponseDto | null;
  properties: Array<PropertyResponseDto>;
}
