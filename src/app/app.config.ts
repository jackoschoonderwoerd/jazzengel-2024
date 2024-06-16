import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { provideServiceWorker } from '@angular/service-worker';
import { provideNativeDateAdapter } from '@angular/material/core';





export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withFetch(),
            withInterceptors([

            ])
        ),
        provideAnimationsAsync(),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        // importProvidersFrom(
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        // importProvidersFrom(
        //   provideFunctions(() => getFunctions())),
        provideStorage(() => getStorage()), provideAnimationsAsync(),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        provideNativeDateAdapter()
    ],
};
