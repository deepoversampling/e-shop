import {Component, input, InputSignal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PropertyDraftCache} from '../../../../../../services/models/property-draft-cache';
import {PropertiesInitService} from '../../../../../../services/admin/properties-init/properties-init.service';
import {ErrorHandlerService} from '../../../../../../services/error-handler/error-handler.service';
import {PropertyControllerService} from '../../../../../../services/services/property-controller.service';
import {PropertyRequestDto} from '../../../../../../services/models/property-request-dto';
import {PresetComponent} from '../preset/preset.component';
import {CONTINUOUS_REGEX} from '../../../../../../common/constants/constants';
import {StrictHttpResponse} from '../../../../../../services/strict-http-response';
import {PropertyResponseDto} from '../../../../../../services/models/property-response-dto';
import {getLocation} from '../../../../../../common/utils/utils';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-create-property',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PresetComponent
  ],
  templateUrl: './create-property.component.html',
  styleUrl: './create-property.component.scss'
})
export class CreatePropertyComponent { // FIXME DONE
  public readonly propertyDraftCacheId: InputSignal<number> = input.required<number>();
  public readonly propertyDraftCache: InputSignal<PropertyDraftCache> = input.required<PropertyDraftCache>();

  constructor(
    private readonly _propertiesInitService: PropertiesInitService,
    private readonly _propertyService: PropertyControllerService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _toastrService: ToastrService
  ) {}

  protected get preset(): string {
    return this.propertyDraftCache().preset;
  }

  protected get presets(): string[] {
    return this.propertyDraftCache().presets;
  }

  protected get hasName(): boolean {
    return this.propertyDraftCache().name.trim().length > 0;
  }

  protected get hasUnit(): boolean {
    return this.propertyDraftCache().unit.trim().length > 0;
  }

  protected get hasPresets(): boolean {
    return this.presets.length > 0;
  }

  private get isPropertyDraftContinuous(): boolean {
    if (!this.hasPresets) {
      return false;
    }

    return this.presets
      .every((preset: string): boolean => this.isPresetContinuous(preset));
  }

  private isPresetContinuous(preset: string): boolean {
    return CONTINUOUS_REGEX.test(preset);
  }

  protected cancel(): void {
    this._propertiesInitService.removePropertyDraftCache(this.propertyDraftCacheId());
  }

  protected createProperty(): void {
    const name: string = this.propertyDraftCache().name;
    const unit: string = this.propertyDraftCache().unit;
    const presets: string[] = this.presets;

    const body: PropertyRequestDto = {
      name: name,
      presets: presets
    };
    if (this.hasUnit) {
      body.unit = unit;
    }

    this._propertyService.createProperty$Response({
      body: body
    }).subscribe({
      next: async (response: StrictHttpResponse<PropertyResponseDto>): Promise<void> => {
        await this._propertiesInitService.init();
        this.cancel();

        this._toastrService.success(
          `Property ${response.body.name} has been created`,
          'Success'
        );
        console.log(getLocation(response));
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

  protected get hasPreset(): boolean {
    return this.preset.length > 0;
  }

  protected get isPresetUnique(): boolean {
    return !this.presets
      .includes(this.preset);
  }

  // If the property has presets
  // and is continuous then the new preset has to be continuous with valid ranges and not clashing with the last preset
  // or is discrete then new preset has to be discrete as well
  // If the property has no presets and new preset is continuous then it has to have valid ranges
  protected get isPresetValid(): boolean {
    const preset: string = this.preset;

    return this.hasPresets
      ? this.isPropertyDraftContinuous
        ? this.isPresetContinuous(preset) && this.isPresetRangeValid && !this.isPresetClashing
        : !this.isPresetContinuous(preset)
      : this.isPresetContinuous(preset)
        ? this.isPresetRangeValid
        : true;
  }

  // Checks if the preset has proper ranges
  private get isPresetRangeValid(): boolean {
    const parts: string[] = this.preset.split('|');
    const min: number = Number(parts[0]);
    const max: number = Number(parts[1]);
    return min < max;
  }

  // Checks if the new preset clashes with the last preset
  private get isPresetClashing(): boolean {
    const presets: string[] = this.presets;
    const lastPreset: string = presets[presets.length - 1];
    const preset: string = this.preset;
    return Number(preset.split('|')[0]) <= Number(lastPreset.split('|')[1]);
  }

  protected createPreset(): void {
    this.presets.push(this.preset);
    this.propertyDraftCache().preset = '';
  }

  protected removePreset(presetToRemove: string): void {
    const index: number = this.presets
      .findIndex((preset: string): boolean => preset === presetToRemove);
    if (index !== -1) {
      this.presets.splice(index, 1);
    }
  }

}
