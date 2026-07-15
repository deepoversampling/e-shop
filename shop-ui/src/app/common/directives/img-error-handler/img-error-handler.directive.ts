import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appImgErrorHandler]'
})
export class ImgErrorHandlerDirective { // FIXME DONE
  constructor(private readonly _imgRef: ElementRef<HTMLImageElement>) {}

  @HostListener("error")
  private onError(): void {
    this._imgRef.nativeElement.src = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
  }

}
