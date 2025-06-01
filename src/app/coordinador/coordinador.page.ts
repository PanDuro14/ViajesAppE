import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAvatar, IonItem, 
  IonLabel, IonIcon, IonList, IonButton } from '@ionic/angular/standalone';
import { ViajesService, Coordinador } from '../services/viajes.service';
import { addIcons } from 'ionicons';
import { callOutline, mailOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-coordinador',
  templateUrl: './coordinador.page.html',
  styleUrls: ['./coordinador.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAvatar, IonItem, 
    IonLabel, IonIcon, IonList, IonButton, CommonModule, FormsModule
  ]
})
export class CoordinadorPage implements OnInit {
  coordinadores: Coordinador[] = [];

  constructor(private viajesService: ViajesService) {
    addIcons({ callOutline, mailOutline, personOutline });
  }

  ngOnInit() {
    this.coordinadores = this.viajesService.getCoordinadores();
  }

  llamarCoordinador(telefono: string) {
    window.open(`tel:${telefono}`, '_system');
  }

  enviarEmail(email: string) {
    window.open(`mailto:${email}`, '_system');
  }
}
