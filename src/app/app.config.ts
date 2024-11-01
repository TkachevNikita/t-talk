import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { environment } from '../../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    NG_EVENT_PLUGINS,
  ],
};
