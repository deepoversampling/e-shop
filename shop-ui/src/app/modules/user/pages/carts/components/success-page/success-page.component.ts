import {Component, Inject, OnDestroy, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import {Router} from '@angular/router';
import {countdown} from '../countdown';
import {CHECKOUT_REDIRECT_COUNTDOWN_SECONDS} from '../../../../../../common/constants/constants';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-success-page',
  imports: [],
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.scss'
})
export class SuccessPageComponent implements OnDestroy { // FIXME DONE
  private readonly _intervalID?: number;
  protected readonly _countdownCurrent: WritableSignal<number> = signal<number>(CHECKOUT_REDIRECT_COUNTDOWN_SECONDS);

  constructor(
    private readonly _router: Router,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    if (isPlatformServer(this._platformId)) return;
    this._intervalID = countdown(this._countdownCurrent, (): void => this.goToShop());
  }

  public ngOnDestroy(): void {
    if (this._intervalID !== undefined) {
      clearInterval(this._intervalID);
    }
  }

  protected goToShop(): void {
    this._router.navigate(['/search']);
  }

}
