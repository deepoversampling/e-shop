import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {PropertyResponseDto} from '../../../../../../services/models/property-response-dto';

@Component({
  selector: 'app-property',
  imports: [],
  templateUrl: './property.component.html',
  styleUrl: './property.component.scss'
})
export class PropertyComponent { // FIXME DONE
  public readonly property: InputSignal<PropertyResponseDto> = input.required<PropertyResponseDto>();
  public readonly propertyToRemove: OutputEmitterRef<PropertyResponseDto> = output<PropertyResponseDto>();

  protected cancel(): void {
    this.propertyToRemove.emit(this.property());
  }

}
