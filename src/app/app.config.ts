import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { environment } from '../../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { GlobalErrorHandler } from '@t-talk/core';
import { provideMicroSentry } from '@micro-sentry/angular';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    NG_EVENT_PLUGINS,
    provideMicroSentry({
      dsn: environment.sentryDsn,
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
