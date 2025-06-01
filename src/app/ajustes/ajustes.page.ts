import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
  IonList, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, 
  IonRadioGroup, IonRadio, IonButton, IonIcon, IonItemDivider, 
  IonRange, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, moonOutline, languageOutline, colorPaletteOutline, 
  personOutline, lockClosedOutline, logOutOutline, saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
    IonList, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, 
    IonRadioGroup, IonRadio, IonButton, IonIcon, IonItemDivider, 
    IonRange, IonToast, CommonModule, FormsModule
  ]
})
export class AjustesPage implements OnInit {
  // Ajustes de notificaciones
  notificaciones = {
    viajes: true,
    promociones: true,
    recordatorios: true,
    actualizaciones: false
  };

  // Ajustes de apariencia
  temaOscuro: boolean = false;
  idioma: string = 'es';
  tamanoFuente: number = 14;

  // Ajustes de privacidad
  compartirUbicacion: boolean = true;
  datosAnalytics: boolean = true;
  perfilPublico: boolean = false;

  // Ajustes de preferencias de viaje
  moneda: string = 'MXN';
  distancia: string = 'km';

  showToast: boolean = false;
  toastMessage: string = '';

  constructor() {
    addIcons({ notificationsOutline, moonOutline, languageOutline, colorPaletteOutline, 
      personOutline, lockClosedOutline, logOutOutline, saveOutline });
  }

  ngOnInit() {
    // Cargar ajustes guardados si existen
    this.cargarAjustes();
  }

  cargarAjustes() {
    // Aquí se cargarían los ajustes desde localStorage o un servicio
    const ajustesGuardados = localStorage.getItem('ajustes');
    if (ajustesGuardados) {
      const ajustes = JSON.parse(ajustesGuardados);
      this.notificaciones = ajustes.notificaciones || this.notificaciones;
      this.temaOscuro = ajustes.temaOscuro || this.temaOscuro;
      this.idioma = ajustes.idioma || this.idioma;
      this.tamanoFuente = ajustes.tamanoFuente || this.tamanoFuente;
      this.compartirUbicacion = ajustes.compartirUbicacion !== undefined ? ajustes.compartirUbicacion : this.compartirUbicacion;
      this.datosAnalytics = ajustes.datosAnalytics !== undefined ? ajustes.datosAnalytics : this.datosAnalytics;
      this.perfilPublico = ajustes.perfilPublico || this.perfilPublico;
      this.moneda = ajustes.moneda || this.moneda;
      this.distancia = ajustes.distancia || this.distancia;
    }
  }

  guardarAjustes() {
    const ajustes = {
      notificaciones: this.notificaciones,
      temaOscuro: this.temaOscuro,
      idioma: this.idioma,
      tamanoFuente: this.tamanoFuente,
      compartirUbicacion: this.compartirUbicacion,
      datosAnalytics: this.datosAnalytics,
      perfilPublico: this.perfilPublico,
      moneda: this.moneda,
      distancia: this.distancia
    };
    
    localStorage.setItem('ajustes', JSON.stringify(ajustes));
    this.toastMessage = 'Ajustes guardados correctamente';
    this.showToast = true;
    
    // Aplicar tema oscuro
    this.aplicarTema();
  }

  aplicarTema() {
    document.body.classList.toggle('dark', this.temaOscuro);
  }

  cambiarTamanoFuente() {
    document.documentElement.style.setProperty('--ion-font-size', `${this.tamanoFuente}px`);
  }

  cerrarSesion() {
    // Aquí iría la lógica para cerrar sesión
    this.toastMessage = 'Sesión cerrada';
    this.showToast = true;
  }
}
