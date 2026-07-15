import {PropertyResponseDto} from '../../../services/models/property-response-dto';
import {PropertyPresetDto} from '../../../services/models/property-preset-dto';
import {CategoryTemplateResponseDto} from '../../../services/models/category-template-response-dto';

// Returns formatted preset value
export function formatPreset(property: PropertyResponseDto, preset: PropertyPresetDto | string): string {
  const unit: string | undefined = property.unit;
  const value: string = typeof preset === 'object'
    ? preset.value!
    : preset;
  const unitAppendix: string = unit ? ' ' + unit : '';

  if (isPropertyContinuous(property)) {
    return value.replace('|', '-') + unitAppendix;
  } else if (unit === 'GB' && Number(value!) >= 1024) {
    return (Number(value) / 1024) + ' TB';
  } else if (property.name === 'Laptop GPU Memory' && preset === '0') {
    return 'Integrated (shared)';
  } else {
    return value + unitAppendix;
  }
}

// Checks if the property is continuous by checking continuous-only fields
export function isPropertyContinuous(property: PropertyResponseDto): boolean {
  return property.step !== undefined
    && property.min !== undefined
    && property.max !== undefined;
}

// Returns properties map from category templates map
export function categoryTemplatesMapToPropertiesMap(categoryTemplatesMap: Record<number, CategoryTemplateResponseDto>): Record<number, PropertyResponseDto> {
  return Object.values(categoryTemplatesMap)
    .flatMap((categoryTemplate: CategoryTemplateResponseDto): PropertyResponseDto[] => categoryTemplate.properties!)
    .reduce((properties: Record<number, PropertyResponseDto>, property: PropertyResponseDto): Record<number, PropertyResponseDto> => {
        // Some properties may exist in multiple templates and are written only once
        if (properties[property.id!] === undefined) {
          properties[property.id!] = property;
        }
        return properties;
      }, {}
    );
}

// Returns the clean property name, e.g. Laptop Brand -> Brand
export function formatPropertyName(property: PropertyResponseDto): string {
  const spaceIndex: number = property.name!.indexOf(' ') ?? 0;
  return property.name!.substring(spaceIndex + 1);
}

// FIXME DONE
