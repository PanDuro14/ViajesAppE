import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ModalController } from '@ionic/angular';  // Importa ModalController
import { PaymentComponent } from '../payment/payment.component';  // Importa PaymentComponent



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class HomePage {

  ngOnInit() {
    console.log('HomePage initialized');
    return 'Ola';
  }
  menuItems = [
    { title: 'Itinerario', route: '/itinerario', icon: 'document-text-outline' },
    { title: 'Administrador', route: '/admin', icon: 'settings-outline' },
    { title: 'Fotos de mis viajes', route: '/fotos', icon: 'images-outline' },
    { title: 'Mi coordinador', route: '/coordinador', icon: 'person-outline' },
    { title: 'Mis viajes agendados', route: '/viajes', icon: 'calendar-outline' },
    { title: 'Reglas y normas', route: '/reglas', icon: 'book-outline' },
    { title: 'Ajustes generales', route: '/ajustes', icon: 'cog-outline' },
    { title: 'Iniciar sesión', route: '/login', icon: 'log-in-outline' }
  ];

  constructor(private modalController: ModalController) {
    console.log('HomePage constructor called');
  }

  // Método para abrir el modal de pago
  async openPaymentModal() {
    const modal = await this.modalController.create({
      component: PaymentComponent,  // Componente a mostrar
    });

    // Presentar el modal
    return await modal.present();
  }
}
