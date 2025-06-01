import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Viaje {
  id: number;
  destino: string;
  fechaInicio: string;
  fechaFin: string;
  precio: number;
  descripcion: string;
  imagen: string;
  disponible: boolean;
}

export interface Itinerario {
  id: number;
  viajeId: number;
  dia: number;
  actividad: string;
  horaInicio: string;
  horaFin: string;
  ubicacion: string;
}

export interface Coordinador {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  foto: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  private viajes: Viaje[] = [
    {
      id: 1,
      destino: 'Playa del Carmen',
      fechaInicio: '2023-12-15',
      fechaFin: '2023-12-20',
      precio: 1200,
      descripcion: 'Disfruta de las hermosas playas de arena blanca y aguas cristalinas en este paraíso caribeño.',
      imagen: 'https://picsum.photos/id/1036/500/300',
      disponible: true
    },
    {
      id: 2,
      destino: 'Ciudad de México',
      fechaInicio: '2024-01-10',
      fechaFin: '2024-01-15',
      precio: 950,
      descripcion: 'Explora la rica historia y cultura de la capital mexicana con sus museos, gastronomía y arquitectura.',
      imagen: 'https://picsum.photos/id/1037/500/300',
      disponible: true
    },
    {
      id: 3,
      destino: 'Cancún',
      fechaInicio: '2024-02-05',
      fechaFin: '2024-02-12',
      precio: 1500,
      descripcion: 'Vacaciones todo incluido en uno de los destinos turísticos más populares de México.',
      imagen: 'https://picsum.photos/id/1038/500/300',
      disponible: true
    },
    {
      id: 4,
      destino: 'Oaxaca',
      fechaInicio: '2024-03-20',
      fechaFin: '2024-03-25',
      precio: 850,
      descripcion: 'Descubre la riqueza cultural, gastronómica y artesanal de esta hermosa ciudad colonial.',
      imagen: 'https://picsum.photos/id/1039/500/300',
      disponible: false
    }
  ];

  private itinerarios: Itinerario[] = [
    { id: 1, viajeId: 1, dia: 1, actividad: 'Check-in en hotel', horaInicio: '15:00', horaFin: '16:00', ubicacion: 'Hotel Playa Paraíso' },
    { id: 2, viajeId: 1, dia: 1, actividad: 'Cena de bienvenida', horaInicio: '19:00', horaFin: '21:00', ubicacion: 'Restaurante del hotel' },
    { id: 3, viajeId: 1, dia: 2, actividad: 'Tour a Tulum', horaInicio: '09:00', horaFin: '16:00', ubicacion: 'Zona arqueológica de Tulum' },
    { id: 4, viajeId: 1, dia: 3, actividad: 'Día libre en la playa', horaInicio: '08:00', horaFin: '18:00', ubicacion: 'Playa del Carmen' },
    { id: 5, viajeId: 2, dia: 1, actividad: 'Check-in en hotel', horaInicio: '14:00', horaFin: '15:00', ubicacion: 'Hotel Centro Histórico' },
    { id: 6, viajeId: 2, dia: 1, actividad: 'Visita al Zócalo', horaInicio: '16:00', horaFin: '18:00', ubicacion: 'Centro Histórico' },
    { id: 7, viajeId: 2, dia: 2, actividad: 'Museo de Antropología', horaInicio: '10:00', horaFin: '14:00', ubicacion: 'Chapultepec' }
  ];

  private coordinadores: Coordinador[] = [
    { id: 1, nombre: 'Carlos', apellido: 'Rodríguez', telefono: '555-123-4567', email: 'carlos@viajesapp.com', foto: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, nombre: 'Laura', apellido: 'Gómez', telefono: '555-987-6543', email: 'laura@viajesapp.com', foto: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 3, nombre: 'Miguel', apellido: 'Hernández', telefono: '555-456-7890', email: 'miguel@viajesapp.com', foto: 'https://randomuser.me/api/portraits/men/3.jpg' }
  ];

  private reglas: string[] = [
    'Llegar al punto de encuentro 30 minutos antes de la hora de salida.',
    'Llevar identificación oficial vigente.',
    'Respetar los horarios establecidos en el itinerario.',
    'No consumir bebidas alcohólicas en exceso durante las actividades grupales.',
    'Mantener limpio el transporte y las instalaciones visitadas.',
    'Seguir las indicaciones del coordinador en todo momento.',
    'En caso de emergencia, contactar inmediatamente al coordinador asignado.',
    'Respetar a los compañeros de viaje y al personal de servicio.',
    'No se permiten mascotas en los viajes grupales.',
    'Cancelaciones con menos de 72 horas de anticipación no son reembolsables.'
  ];

  private viajesSubject = new BehaviorSubject<Viaje[]>(this.viajes);
  private viajesAgendadosSubject = new BehaviorSubject<Viaje[]>([]);

  constructor() { }

  getViajes() {
    return this.viajesSubject.asObservable();
  }

  getViajeById(id: number) {
    return this.viajes.find(viaje => viaje.id === id);
  }

  getItinerarioByViajeId(viajeId: number) {
    return this.itinerarios.filter(itinerario => itinerario.viajeId === viajeId);
  }

  getCoordinadores() {
    return this.coordinadores;
  }

  getReglas() {
    return this.reglas;
  }

  getViajesAgendados() {
    return this.viajesAgendadosSubject.asObservable();
  }

  agendarViaje(viajeId: number) {
    const viaje = this.getViajeById(viajeId);
    if (viaje && viaje.disponible) {
      const viajesAgendados = this.viajesAgendadosSubject.value;
      if (!viajesAgendados.some(v => v.id === viajeId)) {
        this.viajesAgendadosSubject.next([...viajesAgendados, viaje]);
        return true;
      }
    }
    return false;
  }

  cancelarViaje(viajeId: number) {
    const viajesAgendados = this.viajesAgendadosSubject.value;
    const nuevosViajes = viajesAgendados.filter(v => v.id !== viajeId);
    this.viajesAgendadosSubject.next(nuevosViajes);
  }

  // Métodos para administradores
  addViaje(viaje: Viaje) {
    const newId = Math.max(...this.viajes.map(v => v.id), 0) + 1;
    const newViaje = { ...viaje, id: newId };
    this.viajes = [...this.viajes, newViaje];
    this.viajesSubject.next(this.viajes);
    return newViaje;
  }

  updateViaje(viaje: Viaje) {
    this.viajes = this.viajes.map(v => v.id === viaje.id ? viaje : v);
    this.viajesSubject.next(this.viajes);
  }

  deleteViaje(id: number) {
    this.viajes = this.viajes.filter(v => v.id !== id);
    this.viajesSubject.next(this.viajes);
    // También eliminar de viajes agendados si existe
    const viajesAgendados = this.viajesAgendadosSubject.value;
    if (viajesAgendados.some(v => v.id === id)) {
      this.cancelarViaje(id);
    }
  }
}