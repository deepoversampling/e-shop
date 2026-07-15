import { Injectable } from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService { // FIXME DONE
  constructor(private readonly _toastrService: ToastrService) {}

  public handle(err: any): void {
    let error: any = err.error;
    // DELETE/PATCH with ResponseEntity<Void> produce an empty body, so err.error is a string instead of an object
    if (typeof error === 'string') {
      try {
        error = JSON.parse(error);
      } catch {}
    }
    this._toastrService.error(error.validationErrors ? error.validationErrors : error.message, error.errorCode);
  }

}
