import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonInput, IonTextarea, IonToggle, IonAlert,
  IonToast, IonGrid, IonRow, IonCol, IonItemSliding, IonItemOptions,
  IonItemOption, IonModal, IonDatetime } from '@ionic/angular/standalone';
import { ViajesService, Viaje } from '../services/viajes.service';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, closeOutline, saveOutline, imageOutline } from 'ionicons/icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonInput, IonTextarea, IonToggle, IonAlert,
    IonToast, IonGrid, IonRow, IonCol, IonItemSliding, IonItemOptions,
    IonItemOption, IonModal, IonDatetime,
    CommonModule, FormsModule, ReactiveFormsModule
  ]
})
export class AdminPage implements OnInit {
  alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => { this.showAlert = false; }
    },
    {
      text: 'Eliminar',
      role: 'confirm',
      handler: () => this.deleteViaje()
    }
  ];

  viajes: Viaje[] = [];
  showModal: boolean = false;
  showAlert: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  viajeToDelete: number | null = null;

  // Nuevo viaje o viaje a editar
  editingViaje: Viaje = this.getEmptyViaje();
  isEditing: boolean = false;

  constructor(private viajesService: ViajesService) {
    addIcons({ addOutline, createOutline, trashOutline, closeOutline, saveOutline, imageOutline });
  }

  ngOnInit() {
    this.loadViajes();
  }

  loadViajes() {
    this.viajesService.getViajes().subscribe(viajes => {
      this.viajes = viajes;
    });
  }

  getEmptyViaje(): Viaje {
    return {
      id: 0,
      destino: '',
      fechaInicio: '',
      fechaFin: '',
      precio: 0,
      descripcion: '',
      imagen: 'https://picsum.photos/id/1036/500/300',
      disponible: true,
      fecha: '2023-12-15'
    };
  }

  openAddModal() {
    this.isEditing = false;
    this.editingViaje = this.getEmptyViaje();
    this.showModal = true;
  }

  openEditModal(viaje: Viaje) {
    this.isEditing = true;
    this.editingViaje = {...viaje};
    this.showModal = true;
  }

  confirmDelete(id: number) {
    this.viajeToDelete = id;
    this.showAlert = true;
  }

  deleteViaje() {
    if (this.viajeToDelete) {
      this.viajesService.deleteViaje(this.viajeToDelete);
      this.toastMessage = 'Viaje eliminado con éxito';
      this.showToast = true;
      this.viajeToDelete = null;
    }
  }

  updateViajeStatus(viaje: Viaje) {
    this.viajesService.updateViaje(viaje);
  }

  saveViaje() {
    if (this.validateViaje()) {
      if (this.isEditing) {
        this.viajesService.updateViaje(this.editingViaje);
        this.toastMessage = 'Viaje actualizado con éxito';
      } else {
        this.viajesService.addViaje(this.editingViaje);
        this.toastMessage = 'Viaje agregado con éxito';
      }
      this.showToast = true;
      this.showModal = false;
    } else {
      this.toastMessage = 'Por favor completa todos los campos requeridos';
      this.showToast = true;
    }
  }

  validateViaje(): boolean {
    return !!this.editingViaje.destino &&
           !!this.editingViaje.fechaInicio &&
           !!this.editingViaje.fechaFin &&
           this.editingViaje.precio > 0 &&
           !!this.editingViaje.descripcion;
  }

  cancelEdit() {
    this.showModal = false;
  }

  generateRandomImage() {
    const randomId = Math.floor(Math.random() * 100) + 1000;
    this.editingViaje.imagen = `https://picsum.photos/id/${randomId}/500/300`;
  }
}
