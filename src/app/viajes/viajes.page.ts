import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonBadge,
  IonBackButton, IonButtons, IonIcon, IonToast, IonImg, IonGrid, IonRow, IonCol, IonSearchbar,
  IonSegmentButton, IonSegment, IonThumbnail, IonItemSliding, IonItemOptions, IonItemOption
} from '@ionic/angular/standalone';
import { Observable, of, forkJoin } from 'rxjs';
import { map, tap, catchError, startWith, finalize, switchMap } from 'rxjs/operators';

import { addIcons } from 'ionicons';
import { calendarOutline, cashOutline, timeOutline, locationOutline, heartOutline, heart, card, trash } from 'ionicons/icons';
import { ModalController } from '@ionic/angular/standalone';
import { PaymentComponent } from '../payment/payment.component';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import { Viaje } from '../../models/viaje.model'; // Asegúrate de tener esta interfaz
import { ViajesService } from '../services/viajes.service';

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
  ],
  providers: [ModalController],
})
export class ViajesPage implements OnInit {
  catalogoViajes$!: Observable<Viaje[]>; // Todos los viajes disponibles
  viajesAgendados$!: Observable<Viaje[]>; // Solo los agendados
  searchTerm: string = '';
  filteredViajes: Viaje[] = [];
  showToast: boolean = false;
  toastMessage: string = '';
  activeTab: 'disponibles' | 'agendados' = 'disponibles';
  isLoading = true;

  constructor(
    private firebaseService: FirebaseService,
    private modalController: ModalController,
    private viajesService: ViajesService,
  ) {
    addIcons({calendarOutline, cashOutline, card, trash, timeOutline, locationOutline, heartOutline, heart});
  }

  ngOnInit() {
  // Obtener viajes disponibles combinando datos de Firebase y datos locales
  this.catalogoViajes$ = this.firebaseService.getViajes().pipe(
    switchMap((firebaseViajes: Viaje[]) => {
      return this.viajesService.getViajes().pipe(
        map((localViajes: any[]) => {
          // Convertir viajes locales al formato unificado
          const viajesLocalesUnificados = localViajes.map(v => ({
            idNum: v.id,
            destino: v.destino,
            descripcion: v.descripcion,
            precio: v.precio,
            fecha: v.fechaInicio || '', // Usar fechaInicio si no hay fecha
            fechaInicio: v.fechaInicio,
            fechaFin: v.fechaFin,
            imagen: v.imagen,
            disponible: v.disponible,
            agendado: false
          }));

          // Filtra los viajes disponibles
          const viajesDisponibles = firebaseViajes.filter(v => v.disponible);
          return [...viajesDisponibles, ...viajesLocalesUnificados.filter(v => v.disponible)];
        }),
        catchError(() => of([] as Viaje[])) // Tipo explícito aquí
      );
    }),
    catchError(() => of([] as Viaje[])), // Tipo explícito aquí
    tap((viajes: Viaje[]) => {
      this.filteredViajes = viajes;
      this.isLoading = false;
    }),
    finalize(() => this.isLoading = false)
  );

  // Obtener viajes agendados
  this.viajesAgendados$ = this.firebaseService.getViajes().pipe(
    map((viajes: Viaje[]) => viajes.filter(viaje => viaje.agendado)),
    catchError(() => of([] as Viaje[])) // Tipo explícito aquí
  );
}


  filterViajes() {
    this.catalogoViajes$.subscribe(viajes => {
      this.filteredViajes = viajes.filter(viaje =>
        viaje.destino.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        viaje.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }

  async agendarViaje(viaje: Viaje) {
    try {
      // Primero marca como no disponible en el catálogo
      const viajeActualizado = {
        ...viaje,
        agendado: true,
        disponible: false // Ya no aparece en disponibles
      };

      await this.firebaseService.updateViaje(viajeActualizado);
      this.toastMessage = `¡Viaje a ${viaje.destino} agendado con éxito!`;
      this.showToast = true;

      // Actualiza la lista filtrada
      this.filteredViajes = this.filteredViajes.filter(v => v.id !== viaje.id);

    } catch (error) {
      this.toastMessage = `Error al agendar el viaje: ${error}`;
      this.showToast = true;
    }
  }

  async cancelarViaje(viaje: Viaje) {
    try {
      // Vuelve a marcar como disponible
      const viajeActualizado = {
        ...viaje,
        agendado: false,
        disponible: true
      };

      await this.firebaseService.updateViaje(viajeActualizado);
      this.toastMessage = `Viaje a ${viaje.destino} cancelado.`;
      this.showToast = true;

    } catch (error) {
      this.toastMessage = `Error al cancelar el viaje: ${error}`;
      this.showToast = true;
    }
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

  async openPaymentModal() {
    const modal = await this.modalController.create({
      component: PaymentComponent,
      cssClass: 'payment-component'
    });
    await modal.present();
  }
}
