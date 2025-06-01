import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class HomePage {
  menuItems = [
    { title: 'Itinerario', route: '/itinerario', icon: 'document-text-outline' },
    { title: 'Administrador', route: '/admin', icon: 'settings-outline' },
    { title: 'Fotos de mis viajes', route: '/fotos', icon: 'images-outline' },
    { title: 'Mi coordinador', route: '/coordinador', icon: 'person-outline' },
    { title: 'Mis viajes agendados', route: '/viajes', icon: 'calendar-outline' },
    { title: 'Reglas y normas', route: '/reglas', icon: 'book-outline' },
    { title: 'Ajustes generales', route: '/ajustes', icon: 'cog-outline' },
  ];
}
