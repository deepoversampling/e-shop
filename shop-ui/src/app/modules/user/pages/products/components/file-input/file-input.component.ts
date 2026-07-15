import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {FilePreview} from '../../../../../../services/models/file-preview';

@Component({
  selector: 'app-file-input',
  imports: [],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss'
})
export class FileInputComponent { // FIXME DONE
  public readonly filePreview: InputSignal<FilePreview | null> = input.required<FilePreview | null>();
  public readonly filePreviewChange: OutputEmitterRef<FilePreview | null> = output<FilePreview | null>();

  protected setImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (!file) return;

    const filePreview: FilePreview = {};
    filePreview.file = file;
    filePreview.url = URL.createObjectURL(file);
    this.filePreviewChange.emit(filePreview);
  }

  protected getInputImageName(): string | null {
    const filePreview: FilePreview | null = this.filePreview();
    return filePreview?.file !== undefined
      ? this.formatFileName(filePreview.file.name)
      : null;
  }

  private formatFileName(name: string): string {
    const fileNameLength: number = 18;
    const delimiterIndex: number = name.lastIndexOf('.');
    const fileName: string = name.substring(0, delimiterIndex);
    return fileName.length > fileNameLength
      ? fileName.substring(0, fileNameLength) + '...'
      : fileName;
  }

  protected get hasFile(): boolean {
    return this.filePreview() !== null;
  }

  protected getInputImageUrl(): string | null {
    const filePreview: FilePreview | null = this.filePreview();
    return filePreview?.url !== undefined
      ? filePreview.url
      : null;
  }

  protected cancel(): void {
    this.filePreviewChange.emit(null);
  }

}
