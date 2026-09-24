import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {loadBrowserConfig} from './load-config/browser/load-config';

async function main(): Promise<void> {
  (window as any).__ROOT_URL__ = await loadBrowserConfig();

    bootstrapApplication(AppComponent, appConfig)
      .catch((err: any): void => console.error(err));
}

main();
