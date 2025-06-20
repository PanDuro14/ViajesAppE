import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `<ion-app><router-outlet></router-outlet></ion-app>`,
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class AppComponent {}