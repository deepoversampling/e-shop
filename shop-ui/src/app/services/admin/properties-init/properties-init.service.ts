import {effect, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {PropertyDraftCache} from '../../models/property-draft-cache';
import {PropertyResponseDto} from '../../models/property-response-dto';
import {PropertyControllerService} from '../../services/property-controller.service';
import {firstValueFrom} from 'rxjs';
import {KeycloakService} from '../../keycloak/keycloak.service';
import {ErrorHandlerService} from '../../error-handler/error-handler.service';
import {PropertyHelpersService} from '../../../common/helpers/property/property-helpers.service';
import {getLastIndex} from '../../../common/utils/utils';
import {IS_BROWSER} from '../../../common/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class PropertiesInitService { // FIXME DONE
  private readonly _ready: WritableSignal<boolean> = signal<boolean>(false);
  public readonly ready: Signal<boolean> = this._ready.asReadonly();

  // Manages full property data, unlike ResourcesInitService which exposes only template-derived properties
  private readonly _properties: WritableSignal<PropertyResponseDto[]> = signal<PropertyResponseDto[]>([]);
  public readonly properties: Signal<PropertyResponseDto[]> = this._properties.asReadonly();

  private _propertyVisibilities: Record<number, boolean> = {}; // One per property

  private _propertyDraftCaches: Record<number, PropertyDraftCache> = {}; // None or many (new property)

  constructor(
    private readonly _keycloakService: KeycloakService,
    private readonly _propertyService: PropertyControllerService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _propertyHelpersService: PropertyHelpersService
  ) {
    // Initializes or resets based on authentication state
    effect(async (): Promise<void> => {
      this._ready.set(false);

      if (this._keycloakService.isAuthenticated() && this._keycloakService.userRole === 'ADMIN') {
        await this.init();
      } else {
        this.reset();
      }

      this._ready.set(true);
    });
  }

  // Fetches properties, applies continuous constraints and sets them
  public async init(): Promise<void> {
    if (!IS_BROWSER) return;

    let properties: PropertyResponseDto[] = [];
    try {
      properties = await firstValueFrom(this._propertyService.getProperties());
    } catch (err: any) {
      this._errorHandlerService.handle(err);
    }

    this._propertyHelpersService.applyContinuousConstraintsForProperties(properties);
    this.initPropertyStates(properties);
    this._properties.set(properties);
  }

  // Initializes property visibilities if they don't exist yet
  private initPropertyStates(properties: PropertyResponseDto[]): void {
    properties.forEach((property: PropertyResponseDto): void => {
      if (this._propertyVisibilities[property.id!] === undefined) {
        this._propertyVisibilities[property.id!] = false;
      }
    });
  }

  private reset(): void {
    this._properties.set([]);
    this._propertyVisibilities = {};
    this._propertyDraftCaches = {};
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /*                                                propertyVisibilities                                              */
  public isPropertyVisible(property: PropertyResponseDto): boolean {
    return this._propertyVisibilities[property.id!];
  }

  public changePropertyVisibility(property: PropertyResponseDto): void {
    this._propertyVisibilities[property.id!] = !this._propertyVisibilities[property.id!];
  }

  /*                                                propertyDraftCaches                                               */
  public get propertyDraftCaches(): Record<number, PropertyDraftCache> {
    return this._propertyDraftCaches;
  }

  public createPropertyDraftCache(): void {
    const lastIndex: number = getLastIndex(this._propertyDraftCaches);

    this._propertyDraftCaches[lastIndex + 1] = {
      name: '',
      unit: '',
      preset: '',
      presets: []
    };
  }

  public removePropertyDraftCache(id: number): void {
    delete this._propertyDraftCaches[id];
  }

}
