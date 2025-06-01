import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
  IonList, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonSelect, IonSelectOption, IonIcon, IonBadge, IonItemDivider } from '@ionic/angular/standalone';
import { ViajesService, Viaje, Itinerario } from '../services/viajes.service';
import { addIcons } from 'ionicons';
import { timeOutline, locationOutline, calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-itinerario',
  templateUrl: './itinerario.page.html',
  styleUrls: ['./itinerario.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
    IonList, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonSelect, IonSelectOption, IonIcon, IonBadge, IonItemDivider,
    CommonModule, FormsModule
  ]
})
export class ItinerarioPage implements OnInit {
  viajes: Viaje[] = [];
  selectedViajeId: number | null = null;
  itinerarios: Itinerario[] = [];
  diasUnicos: number[] = [];

  constructor(private viajesService: ViajesService) {
    addIcons({ timeOutline, locationOutline, calendarOutline });
  }

  ngOnInit() {
    this.viajesService.getViajes().subscribe(viajes => {
      this.viajes = viajes;
      // Si hay viajes disponibles, seleccionar el primero por defecto
      if (this.viajes.length > 0) {
        this.selectedViajeId = this.viajes[0].id;
        this.cargarItinerario();
      }
    });
  }

  cargarItinerario() {
    if (this.selectedViajeId) {
      this.itinerarios = this.viajesService.getItinerarioByViajeId(this.selectedViajeId);
      // Obtener días únicos para agrupar actividades
      this.diasUnicos = [...new Set(this.itinerarios.map(item => item.dia))].sort((a, b) => a - b);
    }
  }

  cambiarViaje() {
    this.cargarItinerario();
  }

  getActividadesPorDia(dia: number): Itinerario[] {
    return this.itinerarios.filter(item => item.dia === dia);
  }

  getViajeSeleccionado(): Viaje | undefined {
    return this.viajes.find(viaje => viaje.id === this.selectedViajeId);
  }
}
