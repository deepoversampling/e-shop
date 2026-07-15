import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {CategoryTemplateResponseDto} from '../../../services/models/category-template-response-dto';
import {CategoryResponseDto} from '../../../services/models/category-response-dto';
import {FormsModule} from '@angular/forms';
import {ResourcesInitService} from '../../../services/resources-init/resources-init.service';
import {PropertyResponseDto} from '../../../services/models/property-response-dto';
import {PropertyPresetDto} from '../../../services/models/property-preset-dto';
import {formatPreset, formatPropertyName, isPropertyContinuous} from '../../../common/utils/property/property-utils';

@Component({
  selector: 'app-filter',
  imports: [
    FormsModule
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent { // FIXME DONE
  public readonly selectedCategory: InputSignal<CategoryResponseDto> = input.required();
  public readonly filters: InputSignal<Record<number, string | null>> = input.required();
  public readonly filtersChange: OutputEmitterRef<Record<number, string | null>> = output<Record<number, string | null>>();

  constructor(private readonly _resourcesInitService: ResourcesInitService) {}

  protected isPropertyContinuous(property: PropertyResponseDto): boolean {
    return isPropertyContinuous(property);
  }

  protected formatPreset(property: PropertyResponseDto, preset: PropertyPresetDto): string {
    return formatPreset(property, preset);
  }

  protected get categoryTemplate(): CategoryTemplateResponseDto {
    return this._resourcesInitService.getCategoryTemplate(this.selectedCategory());
  }

  protected getFilterValue(property: PropertyResponseDto): string | null {
    return this.filters()[property.id!];
  }

  protected formatPropertyName(property: PropertyResponseDto): string {
    return formatPropertyName(property);
  }

  protected onFilterChange(value: number | string | null, property: PropertyResponseDto): void {
    if (typeof value === 'number') {
      value = value.toString();
    }

    const updatedFilters = {...this.filters(), [property.id!]: value};
    this.filtersChange.emit(updatedFilters);
  }

}
