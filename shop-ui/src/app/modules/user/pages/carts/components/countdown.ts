import {WritableSignal} from '@angular/core';

export function countdown(countdownFrom: WritableSignal<number>, callback: Function): number {
  const intervalID: number = window.setInterval((): void => {
    const current: number = countdownFrom();
    if (current > 0) {
      countdownFrom.set(current - 1);
    } else {
      clearInterval(intervalID);
      callback();
    }
  }, 1000);

  return intervalID;
}
// FIXME DONE
