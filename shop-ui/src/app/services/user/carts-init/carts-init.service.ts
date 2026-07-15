import {effect, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {CartResponseDto} from '../../models/cart-response-dto';
import {ItemCache} from '../../models/item-cache';
import {FeedbackCache} from '../../models/feedback-cache';
import {KeycloakService} from '../../keycloak/keycloak.service';
import {CartControllerService} from '../../services/cart-controller.service';
import {ErrorHandlerService} from '../../error-handler/error-handler.service';
import {ItemResponseDto} from '../../models/item-response-dto';
import {FormControl, Validators} from '@angular/forms';
import {CartHelpersService} from '../../../common/helpers/cart/cart-helpers.service';
import {hasPendingFeedback} from '../../../common/utils/cart/cart-utils';
import {ItemHelpersService} from '../../../common/helpers/item/item-helpers.service';
import {IS_BROWSER} from '../../../common/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class CartsInitService { // FIXME DONE
  private readonly _ready: WritableSignal<boolean> = signal<boolean>(false);
  public readonly ready: Signal<boolean> = this._ready.asReadonly();

  private readonly _carts: WritableSignal<CartResponseDto[]> = signal<CartResponseDto[]>([]);
  public readonly carts: Signal<CartResponseDto[]> = this._carts.asReadonly();

  public activeCartId: number = 0;

  private _cartVisibilities: Record<number, boolean> = {}; // One per unpaid cart
  private _feedbackVisibilities: Record<number, boolean> = {}; // One per paid cart
  private _transactionVisibilities: Record<number, boolean> = {}; // One per paid cart

  public readonly _feedbackResizeTriggers: WritableSignal<Record<number, boolean>> =
    signal<Record<number, boolean>>({}); // One per paid cart with pending feedback
  public readonly feedbackResizeTriggers: Signal<Record<number, boolean>> =
    this._feedbackResizeTriggers.asReadonly();

  private _scrolls: Record<number, number> = {}; // One per cart

  private _itemCaches: Record<number, ItemCache> = {}; // One per item in unpaid cart
  private _feedbackCaches: Record<number, FeedbackCache> = {}; // One per item in paid cart with pending feedback

  constructor(
    private readonly _keycloakService: KeycloakService,
    private readonly _cartService: CartControllerService,
    private readonly _cartHelpersService: CartHelpersService,
    private readonly _itemHelpersService: ItemHelpersService,
    private readonly _errorHandlerService: ErrorHandlerService
  ) {
    // Initializes or resets based on authentication state
    effect(async (): Promise<void> => {
      this._ready.set(false);

      if (this._keycloakService.isAuthenticated() && this._keycloakService.userRole === 'USER') {
        await this.init();
      } else {
        this.reset();
      }

      this._ready.set(true);
    });

    // Removes feedback resize trigger for carts that have no more pending feedback when feedbackResizeTriggers changes
    effect((): void => {
      this.feedbackResizeTriggers();
      this.carts()
        .filter((cart: CartResponseDto): boolean => cart.isPaid!)
        .forEach((cart: CartResponseDto): void => {
          if (!hasPendingFeedback(cart)) {
            this.removeFeedbackResizeTrigger(cart);
          }
        });
    });
  }

  // Fetches and sets carts, ensures an unpaid cart exists, sets the active cart,
  // initializes cart states without affecting existing ones
  public async init(): Promise<void> {
    if (!IS_BROWSER) return;

    let carts: CartResponseDto[] = await this.getCarts();
    const unpaidCartExists: boolean =
      carts.some((cart: CartResponseDto): boolean => !cart.isPaid!);

    // If no unpaid cart exists, the new one becomes active
    if (!unpaidCartExists) {
      let newCart: CartResponseDto = {};
      try {
        newCart = await firstValueFrom(this._cartService.createCart());
      } catch (err: any) {
        this._errorHandlerService.handle(err);
      }
      this.activeCartId = newCart.id!;
      carts = await this.getCarts();
      // Otherwise the last one becomes active
    } else {
      this.activeCartId = carts
        .filter((cart: CartResponseDto): boolean => !cart.isPaid!)
        .reduce((highestUnpaidCartId: number, cart: CartResponseDto): number => {
          return cart.id! > highestUnpaidCartId
            ? cart.id!
            : highestUnpaidCartId;
        }, 0);
    }

    await this._cartHelpersService.resolveFeedbacksOfCarts(carts);
    await this.initCartStates(carts);
    this._carts.set(carts);
  }

  private async getCarts(): Promise<CartResponseDto[]> {
    try {
      return await firstValueFrom(this._cartService.getCarts());
    } catch (err: any) {
      this._errorHandlerService.handle(err);
      return [];
    }
  }

  // Initializes cart, feedback and transaction visibilities,
  // feedback resize triggers, scrolls, item caches and feedback caches if they don't exist yet
  private async initCartStates(carts: CartResponseDto[]): Promise<void> {
    await Promise.all(
      carts.flatMap((cart: CartResponseDto): Promise<void>[] => {
        if (this._scrolls[cart.id!] === undefined) {
          this._scrolls[cart.id!] = 0;
        }

        // Unpaid carts
        if (!cart.isPaid!) {
          if (this._cartVisibilities[cart.id!] === undefined) {
            this._cartVisibilities[cart.id!] = false;
          }

          // Builds an array of async variant quantity fetch operations per item in unpaid carts
          return cart.items!
            .map(async (item: ItemResponseDto): Promise<void> => {
              if (this._itemCaches[item.id!] === undefined) {
                this._itemCaches[item.id!] = {};
              }
              // Variant quantity for present item is always refreshed
              const variantQuantity: number | undefined = await this._itemHelpersService.getVariantQuantityOfItem(item);
              this._itemCaches[item.id!].variantQuantity = item.present
                ? variantQuantity
                : undefined;
            });
          // Paid Carts
        } else {
          if (this._feedbackVisibilities[cart.id!] === undefined) {
            this._feedbackVisibilities[cart.id!] = false;
          }

          if (this._transactionVisibilities[cart.id!] === undefined) {
            this._transactionVisibilities[cart.id!] = false;
          }

          // Only carts with pending feedback have feedback resize trigger set
          if (hasPendingFeedback(cart) && this._feedbackResizeTriggers()[cart.id!] === undefined) {
            this._feedbackResizeTriggers()[cart.id!] = false;
          }

          cart.items!
            // Only items with pending feedback (inferred by existence of the note property) have feedback cache and feedback reset trigger set
            .filter((item: ItemResponseDto): boolean => item.note === undefined)
            .forEach((itemWithPendingFeedback: ItemResponseDto): void => {
              if (this._feedbackCaches[itemWithPendingFeedback.id!] === undefined) {
                this._feedbackCaches[itemWithPendingFeedback.id!] = {
                  note: 0,
                  comment: new FormControl('', [
                    Validators.required,
                    Validators.maxLength(255)
                  ]),
                  resetNoteTrigger: false
                };
              }
            });

          return [];
        }
      })
    );
  }

  private reset(): void {
    this._carts.set([]);
    this.activeCartId = 0;
    this._cartVisibilities = {};
    this._feedbackVisibilities = {};
    this._transactionVisibilities = {};
    this._itemCaches = {};
    this._feedbackCaches = {};
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /*                                                visibilities                                                      */
  public get cartVisibilities(): Record<number, boolean> {
    return this._cartVisibilities;
  }

  public get feedbackVisibilities(): Record<number, boolean> {
    return this._feedbackVisibilities;
  }

  public get transactionVisibilities(): Record<number, boolean> {
    return this._transactionVisibilities;
  }

  public isVisible(cart: CartResponseDto, visibilities: Record<number, boolean>): boolean {
    return visibilities[cart.id!];
  }

  public changeVisibility(cart: CartResponseDto, visibilities: Record<number, boolean>): void {
    visibilities[cart.id!] = !visibilities[cart.id!];
  }

  /*                                                feedbackResizeTriggers                                            */
  public getFeedbackResizeTrigger(cart: CartResponseDto): boolean {
    return this._feedbackResizeTriggers()[cart.id!];
  }

  public setFeedbackResizeTrigger(state: boolean, cart: CartResponseDto): void {
    this._feedbackResizeTriggers.update((prev: Record<number, boolean>): Record<number, boolean> => ({
      ...prev,
      [cart.id!]: state
    }));
  }

  public removeFeedbackResizeTrigger(cart: CartResponseDto): void {
    delete this._feedbackResizeTriggers()[cart.id!];
  }

  /*                                                scrolls                                                           */
  public getScroll(cart: CartResponseDto): number {
    return this._scrolls[cart.id!];
  }

  public setScroll(cart: CartResponseDto, scroll: number): void {
    this._scrolls[cart.id!] = scroll;
  }

  /*                                                itemCaches                                                        */
  public getItemCacheInputQuantity(item: ItemResponseDto): number | null | undefined {
    return this._itemCaches[item.id!].inputQuantity;
  }

  public setItemCacheInputQuantity(item: ItemResponseDto, quantity: number | null | undefined): void {
    this._itemCaches[item.id!].inputQuantity = quantity;
  }

  public getItemCacheVariantQuantity(item: ItemResponseDto): number | undefined {
    return this._itemCaches[item.id!].variantQuantity;
  }

  public removeItemCache(item: ItemResponseDto): void {
    delete this._itemCaches[item.id!];
  }

  /*                                                feedbackCaches                                                    */
  public getFeedbackCacheComment(item: ItemResponseDto): FormControl<string | null> {
    return this._feedbackCaches[item.id!].comment;
  }

  public getFeedbackCacheNote(item: ItemResponseDto): number {
    return this._feedbackCaches[item.id!].note;
  }

  public setFeedbackCacheNote(note: number, item: ItemResponseDto): void {
    this._feedbackCaches[item.id!].note = note;
  }

  public getFeedbackCacheResetNoteTrigger(item: ItemResponseDto): boolean {
    return this._feedbackCaches[item.id!].resetNoteTrigger;
  }

  public setFeedbackCacheResetNoteTrigger(state: boolean, item: ItemResponseDto): void {
    this._feedbackCaches[item.id!].resetNoteTrigger = state;
  }

  public removeFeedbackCache(item: ItemResponseDto): void {
    delete this._feedbackCaches[item.id!];
  }

  /*                                                carts                                                             */
  public removeCartStates(cart: CartResponseDto): void {
    delete this._cartVisibilities[cart.id!];
    delete this._scrolls[cart.id!];

    cart.items!
      .forEach((item: ItemResponseDto): void => this.removeItemCache(item));
  }

}
