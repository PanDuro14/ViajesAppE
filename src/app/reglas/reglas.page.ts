import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, 
  IonLabel, IonIcon, IonAccordionGroup, IonAccordion } from '@ionic/angular/standalone';
import { ViajesService } from '../services/viajes.service';
import { addIcons } from 'ionicons';
import { informationCircleOutline, warningOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-reglas',
  templateUrl: './reglas.page.html',
  styleUrls: ['./reglas.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, 
    IonLabel, IonIcon, IonAccordionGroup, IonAccordion, CommonModule, FormsModule
  ]
})
export class ReglasPage implements OnInit {
  reglas: string[] = [];
  politicasCancelacion: any[] = [
    { titulo: 'Cancelación con más de 30 días de anticipación', descripcion: 'Reembolso del 90% del monto total pagado.' },
    { titulo: 'Cancelación entre 15 y 30 días de anticipación', descripcion: 'Reembolso del 50% del monto total pagado.' },
    { titulo: 'Cancelación entre 7 y 14 días de anticipación', descripcion: 'Reembolso del 25% del monto total pagado.' },
    { titulo: 'Cancelación con menos de 7 días de anticipación', descripcion: 'No hay reembolso.' }
  ];
  
  faq: any[] = [
    { 
      pregunta: '¿Qué documentos necesito para viajar?', 
      respuesta: 'Para viajes nacionales, necesitas una identificación oficial con fotografía. Para viajes internacionales, pasaporte vigente y, dependiendo del destino, posiblemente visa.' 
    },
    { 
      pregunta: '¿Puedo cambiar la fecha de mi viaje?', 
      respuesta: 'Sí, es posible cambiar la fecha con al menos 15 días de anticipación, sujeto a disponibilidad y posible diferencia de tarifa.' 
    },
    { 
      pregunta: '¿Qué incluye el precio del viaje?', 
      respuesta: 'El precio incluye transporte, alojamiento y las actividades mencionadas en el itinerario. No incluye gastos personales, propinas ni actividades opcionales.' 
    },
    { 
      pregunta: '¿Hay descuentos para niños o adultos mayores?', 
      respuesta: 'Sí, ofrecemos 15% de descuento para niños menores de 12 años y 10% para adultos mayores de 65 años.' 
    }
  ];

  constructor(private viajesService: ViajesService) {
    addIcons({ informationCircleOutline, warningOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.reglas = this.viajesService.getReglas();
  }
}
