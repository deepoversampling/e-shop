import {Injectable} from '@angular/core';
import {CategoryTemplateResponseDto} from '../../../services/models/category-template-response-dto';
import {PropertyResponseDto} from '../../../services/models/property-response-dto';
import {CONTINUOUS_REGEX} from '../../constants/constants';
import {PropertyPresetDto} from '../../../services/models/property-preset-dto';

@Injectable({
  providedIn: 'root'
})
export class PropertyHelpersService { // FIXME DONE

  public applyContinuousConstraintsForTemplate(categoryTemplate: CategoryTemplateResponseDto): CategoryTemplateResponseDto {
    categoryTemplate.properties!
      .forEach((property: PropertyResponseDto): PropertyResponseDto => {
        if (this.isPropertyContinuous(property)) {
          this.applyContinuousConstraints(property);
        }
        return property;
      });

    return categoryTemplate;
  }

  public applyContinuousConstraintsForProperties(properties: PropertyResponseDto[]): PropertyResponseDto[] {
    return properties
      .map((property: PropertyResponseDto): PropertyResponseDto => {
        if (this.isPropertyContinuous(property)) {
          this.applyContinuousConstraints(property);
        }
        return property;
      });
  }

  private applyContinuousConstraints(property: PropertyResponseDto): void {
    property.min = this.getMin(property);
    property.max = this.getMax(property);
    property.step = this.getStep(property);
  }

  public isPropertyContinuous(property: PropertyResponseDto): boolean {
    return property.presets!
      .every((preset: PropertyPresetDto): boolean => CONTINUOUS_REGEX.test(preset.value!));
  }

  // Returns lower range value from the first preset
  private getMin(property: PropertyResponseDto): number {
    const firstPreset: string = property.presets![0].value!;
    const [min] = firstPreset.split('|'); // Destructuring

    return Number(min);
  }

  // Returns higher range value from the last preset
  private getMax(property: PropertyResponseDto): number | undefined {
    const lastPreset: string = property.presets![property.presets!.length - 1]?.value!;
    const max: string = lastPreset.split('|')[1];

    return Number(max);
  }

  // Returns longest decimal part of the preset range values
  private getStep(property: PropertyResponseDto): number {
    const highestDecimalLength: number =
      property.presets!
        .reduce((currentDecimalLength: number, preset: PropertyPresetDto): number => {
          const ranges: string[] | undefined = preset.value?.split('|'); // Min and max range values
          if (ranges !== undefined) {
            const minRangeParts: string[] = ranges[0].split('.');
            const maxRangeParts: string[] = ranges[1].split('.');
            const minRangeDecimal: string = minRangeParts[1] ?? ''; // Decimal part of min range value
            const maxRangeDecimal: string = maxRangeParts[1] ?? ''; // Decimal part of max range value
            const higherDecimalLength: number = Math.max(minRangeDecimal.length, maxRangeDecimal.length);

            return Math.max(currentDecimalLength, higherDecimalLength);
          }
          return currentDecimalLength;
        }, 0);

    return highestDecimalLength > 0
      ? this.decimalLengthToStep(highestDecimalLength)
      : 1; // When no preset has decimal part then the step is 1
  }

  private decimalLengthToStep(length: number): number {
    return Math.pow(10, -length);
  }

}
