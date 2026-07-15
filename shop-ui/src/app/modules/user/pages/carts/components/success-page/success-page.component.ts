import {Component, OnDestroy, signal, WritableSignal} from '@angular/core';
import {Router} from '@angular/router';
import {countdown} from '../countdown';
import {CHECKOUT_REDIRECT_COUNTDOWN_SECONDS, IS_BROWSER} from '../../../../../../common/constants/constants';

@Component({
  selector: 'app-success-page',
  imports: [],
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.scss'
})
export class SuccessPageComponent implements OnDestroy { // FIXME DONE
  private readonly _intervalID?: number;
  protected readonly _countdownCurrent: WritableSignal<number> = signal<number>(CHECKOUT_REDIRECT_COUNTDOWN_SECONDS);

  constructor(private readonly _router: Router) {
    if (!IS_BROWSER) return;
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
