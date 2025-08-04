export interface Viaje {
  id?: string;
  destino: string;
  descripcion: string;
  precio: number;
  fecha: string;
  fechaInicio?: string;
  fechaFin?: string;
  imagen?: string;
  disponible?: boolean;
  agendado?: boolean;
  userId?: string;
}
