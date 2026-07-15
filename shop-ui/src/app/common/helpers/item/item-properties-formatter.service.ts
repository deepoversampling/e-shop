import {Injectable} from '@angular/core';
import {PropertyResponseDto} from '../../../services/models/property-response-dto';
import {ItemResponseDto} from '../../../services/models/item-response-dto';
import {ResourcesInitService} from '../../../services/resources-init/resources-init.service';
import {formatPreset, formatPropertyName} from '../../utils/property/property-utils';

@Injectable({
  providedIn: 'root'
})
export class ItemPropertiesFormatterService { // FIXME DONE

  constructor(
    private readonly _resourcesInitService: ResourcesInitService
  ) {}

  // Returns formatted properties of the item (e.g. Smartphone Battery Capacity: 4000 mAh)
  public formatItemProperties(item: ItemResponseDto): string[] {
    const properties: { [propertyId: string]: string } = item.productSnapshot?.properties!;

    return Object.entries(properties)
      .map(([propertyIdStr, value]: [string, string]): string => {
        const propertyId: number = Number(propertyIdStr);
        const property: PropertyResponseDto = this._resourcesInitService.getProperty(propertyId);
        const formattedValue: string = formatPreset(property, value);
        const formattedName: string = formatPropertyName(property);

        return formattedName + ': ' + formattedValue;
      });
  }

}
