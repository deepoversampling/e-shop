import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appImgFadeOnLoad]'
})
export class ImgFadeOnLoadDirective { // FIXME DONE
  private _srcOld: string = '';
  private _firstLoad: boolean = true;

  constructor(private readonly _imgRef: ElementRef<HTMLImageElement>) {}

  // After the src changes, the absolutely positioned images (previous and new) are displayed on top
  @HostListener("load")
  private onLoad(): void {
    const img: HTMLImageElement = this._imgRef.nativeElement;

    const wrapper: HTMLElement | null = img.parentElement;
    if (wrapper === null) return;

    for (const el of Array.from(wrapper.children)) {
      if (el.classList.contains('fade-in')) {
        wrapper.removeChild(el); // Removes imgNew
      }
    }

    const imgOld: HTMLImageElement = this.createImg(this._srcOld, 'border-full-two');
    const imgNew: HTMLImageElement = this.createImg(img.src, 'border-full-two');
    requestAnimationFrame((): void =>
      imgOld.classList.add('img-fade', 'fade-out')
    );
    requestAnimationFrame((): void =>
      imgNew.classList.add('img-fade', 'fade-in')
    );

    // Skips the old <img> on first load because it has no src yet and will show a broken-image flicker
    if (this._firstLoad) {
      wrapper.append(imgNew);
      this._firstLoad = false;
    } else {
      wrapper.append(imgOld, imgNew);
    }
    imgOld.addEventListener('animationend', (): void => imgOld.remove()); // Removes imgOld

    this._srcOld = img.src;
  }

  private createImg(src: string, className: string): HTMLImageElement {
    const img: HTMLImageElement = document.createElement('img');
    img.src = src;
    img.classList.add(className);

    return img;
  }

}
