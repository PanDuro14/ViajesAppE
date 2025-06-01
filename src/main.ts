import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  settingsOutline,
  imagesOutline,
  personOutline,
  calendarOutline,
  bookOutline,
  cogOutline
} from 'ionicons/icons';

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
    provideIonicAngular({})
  ]
}).catch(err => console.error(err));
