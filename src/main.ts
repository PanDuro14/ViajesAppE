import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { environment } from './environments/environment';
import { importProvidersFrom } from '@angular/core';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import {
  documentTextOutline,
  settingsOutline,
  imagesOutline,
  personOutline,
  calendarOutline,
  bookOutline,
  cogOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

const firebaseConfig = {
  apiKey: environment.firebaseConfig.apiKey,
  authDomain: environment.firebaseConfig.authDomain,
  projectId: environment.firebaseConfig.projectId,
  storageBucket: environment.firebaseConfig.storageBucket,
  messagingSenderId: environment.firebaseConfig.messagingSenderId,
  appId: environment.firebaseConfig.appId
};

addIcons({
  'document-text-outline': documentTextOutline,
  'settings-outline': settingsOutline,
  'images-outline': imagesOutline,
  'person-outline': personOutline,
  'calendar-outline': calendarOutline,
  'book-outline': bookOutline,
  'cog-outline': cogOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideHttpClient(),
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__mydb',
        driverOrder: ['indexeddb', 'localstorage']
      })
    ),

  ]
}).catch(err => console.error(err));
