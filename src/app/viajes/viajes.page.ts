import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, 
  IonCardSubtitle, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonBadge, 
  IonBackButton, IonButtons, IonIcon, IonToast, IonImg, IonGrid, IonRow, IonCol, IonSearchbar, 
  IonSegmentButton, IonSegment, IonThumbnail, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { ViajesService, Viaje } from '../services/viajes.service';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { calendarOutline, cashOutline, timeOutline, locationOutline, heartOutline, heart } from 'ionicons/icons';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, 
    IonCardSubtitle, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonBadge, 
    IonBackButton, IonButtons, IonIcon, IonToast, IonImg, IonGrid, IonRow, IonCol, IonSearchbar,
    IonSegmentButton, IonSegment, IonThumbnail, IonItemSliding, IonItemOptions, IonItemOption,
    CommonModule, FormsModule
  ]
})
export class ViajesPage implements OnInit {
  viajes$: Observable<Viaje[]>;
  viajesAgendados$: Observable<Viaje[]>;
  searchTerm: string = '';
  filteredViajes: Viaje[] = [];
  showToast: boolean = false;
  toastMessage: string = '';
  activeTab: 'disponibles' | 'agendados' = 'disponibles';

  constructor(private viajesService: ViajesService) {
    addIcons({ calendarOutline, cashOutline, timeOutline, locationOutline, heartOutline, heart });
    this.viajes$ = this.viajesService.getViajes();
    this.viajesAgendados$ = this.viajesService.getViajesAgendados();
  }

  ngOnInit() {
    this.viajes$.subscribe(viajes => {
      this.filteredViajes = viajes;
    });
  }

  filterViajes() {
    this.viajes$.subscribe(viajes => {
      this.filteredViajes = viajes.filter(viaje => 
        viaje.destino.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        viaje.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }

  agendarViaje(viaje: Viaje) {
    const success = this.viajesService.agendarViaje(viaje.id);
    if (success) {
      this.toastMessage = `¡Viaje a ${viaje.destino} agendado con éxito!`;
    } else {
      this.toastMessage = `Este viaje ya está en tu agenda o no está disponible.`;
    }
    this.showToast = true;
  }

  cancelarViaje(viaje: Viaje) {
    this.viajesService.cancelarViaje(viaje.id);
    this.toastMessage = `Viaje a ${viaje.destino} cancelado.`;
    this.showToast = true;
  }

  segmentChanged(event: any) {
    this.activeTab = event.detail.value;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
