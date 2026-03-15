import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTransloco } from '@jsverse/transloco';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error';
import { TranslocoHttpLoader } from './core/transloco-loader';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideAnimationsAsync(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'ar', 'de', 'fr', 'es', 'it', 'nl', 'tr'],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: environment.production,
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};

