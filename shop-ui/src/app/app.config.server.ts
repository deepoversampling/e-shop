import {ApplicationConfig, mergeApplicationConfig} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';
import {provideServerRouting} from '@angular/ssr';
import {appConfig} from './app.config';
import {serverRoutes} from './app.routes.server';
import {loadServerConfig} from '../load-config/server/load-config';
import {ROOT_URL} from './tokens';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    {
      provide: ROOT_URL,
      useValue: loadServerConfig()
    }
  ]
};

export const config: ApplicationConfig = mergeApplicationConfig(appConfig, serverConfig);
