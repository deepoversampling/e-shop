import {Injectable} from '@angular/core';
import {ResourcesInitService} from '../../../services/resources-init/resources-init.service';
import {PropertyResponseDto} from '../../../services/models/property-response-dto';
import {ProductVariantPropertyValueLinkDto} from '../../../services/models/product-variant-property-value-link-dto';
import {ProductVariantResponseDto} from '../../../services/models/product-variant-response-dto';
import {formatPreset, formatPropertyName} from '../../utils/property/property-utils';

@Injectable({
  providedIn: 'root'
})
export class VariantPropertiesFormatterService { // FIXME DONE

  constructor(
    private readonly _resourcesInitService: ResourcesInitService
  ) {}

  // Returns formatted properties of the product variant (e.g. Smartphone Battery Capacity: 4000 mAh)
  public formatVariantProperties(variant: ProductVariantResponseDto): string[] {
    return variant.properties!
      .map((variantProperty: ProductVariantPropertyValueLinkDto): string => {
        const property: PropertyResponseDto = this._resourcesInitService.getProperty(variantProperty.propertyId!);
        const formattedValue: string = formatPreset(property, variantProperty.value!);
        const formattedName: string = formatPropertyName(property);

        return formattedName + ': ' + formattedValue;
      });
  }

}
