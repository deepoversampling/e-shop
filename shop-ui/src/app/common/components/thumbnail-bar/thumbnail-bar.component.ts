import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  InputSignal,
  output,
  OutputEmitterRef, signal,
  ViewChild, WritableSignal
} from '@angular/core';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {Item} from './item';
import {NgOptimizedImage} from '@angular/common';
import {ImgErrorHandlerDirective} from '../../directives/img-error-handler/img-error-handler.directive';
import {CartResponseDto} from '../../../services/models/cart-response-dto';
import {ProductResponseDto} from '../../../services/models/product-response-dto';
import {ItemResponseDto} from '../../../services/models/item-response-dto';
import {ProductVariantResponseDto} from '../../../services/models/product-variant-response-dto';
import {toNgSrc} from '../../utils/utils';
import {IMAGE_FIT, IMAGE_SIZE, THUMBNAIL_IMAGE_SIZE} from '../../constants/constants';

@Component({
  selector: 'app-thumbnail-bar',
  imports: [
    ImgErrorHandlerDirective,
    NgOptimizedImage
  ],
  templateUrl: './thumbnail-bar.component.html',
  styleUrl: './thumbnail-bar.component.scss'
})
export class ThumbnailBarComponent implements AfterViewInit { // FIXME DONE
  public readonly input: InputSignal<CartResponseDto | ProductResponseDto> = input.required<CartResponseDto | ProductResponseDto>();
  public readonly thumbnailsCount: InputSignal<number> = input.required<number>(); // Number of thumbnails to display in the bar

  public readonly scroll: InputSignal<number> = input.required<number>();
  public readonly scrollChange: OutputEmitterRef<number> = output<number>();

  private _isDragging: boolean = false;
  private _clickX: number = 0; // Horizontal position on mouse down, relative to the bar (0 to bar width - 1)
  private _scrollX: number = 0; // Horizontal scroll value from the left edge of the bar (0 to hidden width)
  // Must be signal so updates are applied after the current change detection cycle,
  // preventing ExpressionChangedAfterChecked when read inside getters
  private readonly _hiddenWidth: WritableSignal<number> = signal<number>(0); // Width of hidden part of the bar
  private _subs: Subscription[] = [];

  @ViewChild('thumbnails')
  private readonly _thumbnailsRef!: ElementRef<HTMLDivElement>;
  @ViewChild('thumbnails_reflection')
  private readonly _thumbnailsReflectionRef!: ElementRef<HTMLDivElement>;
  @ViewChild('thumbnail_wrapper')
  private readonly _thumbnailWrapperRef!: ElementRef<HTMLDivElement>;

  // Sets max width and horizontal scroll on the bar and its reflection, and calculates hidden width of the bar
  ngAfterViewInit(): void {
    const thumbnails: HTMLDivElement = this._thumbnailsRef.nativeElement;
    const thumbnailsReflection: HTMLDivElement = this._thumbnailsReflectionRef.nativeElement;
    const thumbnail: HTMLDivElement = this._thumbnailWrapperRef.nativeElement;
    if (thumbnails === undefined || thumbnailsReflection === undefined || thumbnail === undefined) return;

    const gap: number = parseFloat(getComputedStyle(thumbnails).gap);
    const thumbnailWidth: number = thumbnail.clientWidth;
    const maxWidth: number = this.thumbnailsCount() * thumbnailWidth + gap * (this.thumbnailsCount() - 1);

    thumbnails.style.maxWidth = `${maxWidth}px`;
    thumbnailsReflection.style.maxWidth = `${maxWidth}px`;
    thumbnails.scrollLeft = this.scroll();
    thumbnailsReflection.scrollLeft = this.scroll();
    this._hiddenWidth.set((this.items.length - this.thumbnailsCount()) * (gap + thumbnailWidth));
  }

  protected get items(): Item[] {
    const input: CartResponseDto | ProductResponseDto = this.input();
    let items: Item[] = [];
    if (this.hasItems(input)) {
      input.items
        ?.forEach((item: ItemResponseDto): number => items.push({
          url: item.productSnapshot?.imageUrl ?? '',
          available: item.available!
        }));
    }
    if (this.hasVariants(input)) {
      input.variants
        ?.forEach((variant: ProductVariantResponseDto): number => items.push({
          url: variant.image ?? ''
        }));
    }
    return items;
  }

  private hasItems(input: CartResponseDto | ItemResponseDto): input is CartResponseDto { // Type predicate
    return 'items' in input;
  }

  private hasVariants(input: CartResponseDto | ItemResponseDto): input is ProductResponseDto {
    return 'variants' in input;
  }

  protected isAvailable(item: Item): boolean {
    const input: CartResponseDto | ProductResponseDto = this.input();
    // Item in paid cart
    if (this.hasItems(input)) {
      if (input.isPaid) {
        return true;
      }
    }
    // Variant in product
    if (this.hasVariants(input)) {
      return true;
    }
    // Items in unpaid cart
    return item.available!;
  }

  protected getNgSrc(item: Item): string {
    return toNgSrc(item.url!, THUMBNAIL_IMAGE_SIZE, IMAGE_FIT);
  }

  // Creates and pushes observables from mousemove and mouseup events
  protected onMouseDown(event: MouseEvent): void {
    const thumbnails = event.currentTarget as HTMLElement;
    const move$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'mousemove');
    const up$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'mouseup');

    this._isDragging = true;
    this._clickX = event.pageX - thumbnails.getBoundingClientRect().left;
    this._scrollX = thumbnails.scrollLeft; // Horizontal scroll value needs to be set, to not lose it on the next mouse down event

    this._subs.push(
      move$.subscribe((e: MouseEvent): void => this.onMouseMove(e, thumbnails)),
      up$.subscribe((): void => this.onMouseEnd())
    );
  }

  // Sets updated value of the horizontal scroll
  private onMouseMove(event: MouseEvent, thumbnails: HTMLElement): void {
    if (!this._isDragging) return;
    const currentClickX: number = event.pageX - thumbnails.getBoundingClientRect().left;
    const deltaX: number = currentClickX - this._clickX; // Difference between click and move position

    thumbnails.scrollLeft = this._scrollX - deltaX;
    // Updated value of the horizontal scroll is emitted to be used by reflection of the bar
    this.scrollChange.emit(thumbnails.scrollLeft);
  }

  // Cancel the observables
  private onMouseEnd(): void {
    this._isDragging = false;
    this._subs.forEach((s: Subscription): void => s.unsubscribe());
    this._subs = [];
  }

  protected get hasScroll(): boolean {
    return this.items.length <= this.thumbnailsCount();
  }

  protected get isScrollMax(): boolean {
    return this.scroll() === this._hiddenWidth();
  }

  protected get isScrollMin(): boolean {
    return this.scroll() === 0;
  }

}
