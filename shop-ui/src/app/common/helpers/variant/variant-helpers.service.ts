import { Injectable } from '@angular/core';
import {ProductResponseDto} from '../../../services/models/product-response-dto';
import {PropertyResponseDto} from '../../../services/models/property-response-dto';
import {ResourcesInitService} from '../../../services/resources-init/resources-init.service';
import {PropertyPresetDto} from '../../../services/models/property-preset-dto';

@Injectable({
  providedIn: 'root'
})
export class VariantHelpersService { // FIXME DONE

  constructor(
    private readonly _resourcesInitService: ResourcesInitService
  ) {}

  // Validates variant draft cache properties against the category template
  public isVariantDraftCachePropertiesValid(product: ProductResponseDto, variantDraftCacheProperties: Record<number, string | null>): boolean {
    const properties: PropertyResponseDto[] =
      this._resourcesInitService.getCategoryTemplate(product.categoryId!).properties!;

    // Every property from the template has to have some preset which matches with variant draft value
    return properties.every((property: PropertyResponseDto): boolean => {
      const presets: PropertyPresetDto[] = property.presets!;
      const propertyId: number = property.id!;

      return presets.some((preset: PropertyPresetDto): boolean => preset.value === variantDraftCacheProperties[propertyId]);
    });
  }

  // Returns variant draft cache properties initialized to null
  public getInitializedVariantDraftCacheProperties(product: ProductResponseDto): Record<number, string | null> {
    const properties: PropertyResponseDto[] =
      this._resourcesInitService.getCategoryTemplate(product.categoryId!).properties!;

    return this.getInitializedProperties(properties);
  }

  public getInitializedProperties(properties: PropertyResponseDto[]): Record<number, string | null> {
    return Object.fromEntries(
      properties
        .map((property: PropertyResponseDto): [number, null] => [property.id!, null])
    );
  }

}
