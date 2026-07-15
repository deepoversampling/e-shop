import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';

@Component({
  selector: 'app-preset',
  imports: [],
  templateUrl: './preset.component.html',
  styleUrl: './preset.component.scss'
})
export class PresetComponent {
  public readonly preset: InputSignal<string> = input.required<string>();
  public readonly presetToRemove: OutputEmitterRef<string> = output<string>();

  protected cancel(): void {
    this.presetToRemove.emit(this.preset());
  }

}
