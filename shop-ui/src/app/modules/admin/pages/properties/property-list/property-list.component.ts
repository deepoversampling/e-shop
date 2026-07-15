import {Component} from '@angular/core';
import {PropertyResponseDto} from '../../../../../services/models/property-response-dto';
import {PropertiesInitService} from '../../../../../services/admin/properties-init/properties-init.service';
import {PropertyDraftCache} from '../../../../../services/models/property-draft-cache';
import {CreatePropertyComponent} from '../components/create-property/create-property.component';
import {ErrorHandlerService} from '../../../../../services/error-handler/error-handler.service';
import {PropertyControllerService} from '../../../../../services/services/property-controller.service';
import {ResourcesInitService} from '../../../../../services/resources-init/resources-init.service';
import {ReactiveFormsModule} from '@angular/forms';
import {formatPreset, isPropertyContinuous} from '../../../../../common/utils/property/property-utils';
import {PropertyPresetDto} from '../../../../../services/models/property-preset-dto';
import {ExpandableDirective} from '../../../../../common/directives/expandable/expandable.directive';
import {MenuComponent} from '../../../../../common/components/menu/menu.component';

@Component({
  selector: 'app-property-list',
  imports: [
    MenuComponent,
    CreatePropertyComponent,
    ReactiveFormsModule,
    ExpandableDirective
  ],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss'
})
export class PropertyListComponent { // FIXME DONE

  constructor(
    private readonly _propertiesInitService: PropertiesInitService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _propertyService: PropertyControllerService,
    private readonly _resourcesInitService: ResourcesInitService
  ) {}

  protected get isReady(): boolean {
    return this._propertiesInitService.ready();
  }

  protected get properties(): PropertyResponseDto[] {
    return this._propertiesInitService.properties();
  }

  protected get propertyDraftCacheEntries(): [id: string, property: PropertyDraftCache][] {
    return Object.entries(this._propertiesInitService.propertyDraftCaches);
  }

  protected getPropertyDraftCacheId(entry: [id: string, propertyDraftCache: PropertyDraftCache]): number {
    return Number(entry[0]);
  }

  protected getPropertyDraftCache(entry: [id: string, propertyDraftCache: PropertyDraftCache]): PropertyDraftCache {
    return entry[1];
  }

  protected formatPreset(property: PropertyResponseDto, preset: PropertyPresetDto): string {
    return formatPreset(property, preset);
  }

  protected isPropertyContinuous(property: PropertyResponseDto): boolean {
    return isPropertyContinuous(property);
  }

  protected createPropertyDraftCache(): void {
    this._propertiesInitService.createPropertyDraftCache();
  }

  protected removeProperty(property: PropertyResponseDto): void {
    this._propertyService.deletePropertyById({
      'property-id': property.id!
    }).subscribe({
      next: async (): Promise<void> => {
        await this._propertiesInitService.init();
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected isPropertyInTemplates(property: PropertyResponseDto): boolean {
    const properties: Record<number, PropertyResponseDto> = this._resourcesInitService.properties();
    return Object.keys(properties)
      .includes(property.id!.toString());
  }

  protected isPropertyVisible(property: PropertyResponseDto): boolean {
    return this._propertiesInitService.isPropertyVisible(property);
  }

  protected changePropertyVisibility(property: PropertyResponseDto): void {
    this._propertiesInitService.changePropertyVisibility(property);
  }

}
