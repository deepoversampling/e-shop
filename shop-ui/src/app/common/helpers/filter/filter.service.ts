import {Injectable} from '@angular/core';
import {CategoryResponseDto} from '../../../services/models/category-response-dto';
import {PropertyResponseDto} from '../../../services/models/property-response-dto';
import {ResourcesInitService} from '../../../services/resources-init/resources-init.service';
import {VariantHelpersService} from '../variant/variant-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(
    private readonly _resourcesInitService: ResourcesInitService,
    private readonly _variantHelpersService: VariantHelpersService,
  ) {}

  public getInitializedFilters(category: CategoryResponseDto): Record<number, string | null> {
    const properties: PropertyResponseDto[] =
      this._resourcesInitService.getCategoryTemplate(category).properties!;

    return this._variantHelpersService.getInitializedProperties(properties);
  }
}
