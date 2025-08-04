import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, query, where, getDocs, addDoc,} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Viaje } from '../../models/viaje.model';
import { ViajesService } from '../../app/services/viajes.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private firestore: Firestore,
    private viajesService: ViajesService
  ){
    this.inicializarDatos();
  }

  private async inicializarDatos() {
    const viajesRef = collection(this.firestore, 'viajes');
    const snapshot = await getDocs(viajesRef);

    if (snapshot.empty) {
      // Carga los viajes locales a Firebase si no hay datos
      const viajesLocales = await this.viajesService.getViajes().toPromise();
      if (viajesLocales) {
        for (const viaje of viajesLocales) {
          await addDoc(viajesRef, {
            destino: viaje.destino,
            descripcion: viaje.descripcion,
            precio: viaje.precio,
            fecha: viaje.fechaInicio,
            imagen: viaje.imagen,
            disponible: viaje.disponible,
            agendado: false
          });
        }
      }
    }
  }

  // Obtener todos los viajes
  getViajes(): Observable<Viaje[]> {
    const viajesRef = collection(this.firestore, 'viajes');
    return collectionData(viajesRef, { idField: 'id' }) as Observable<Viaje[]>;
  }

  // Actualizar un viaje (versión corregida)
  async updateViaje(viaje: Viaje): Promise<void> {
    if (!viaje.id) throw new Error('El viaje no tiene ID');

    // Extraemos el id para no incluirlo en los datos a actualizar
    const { id, ...viajeData } = viaje;
    const viajeDocRef = doc(this.firestore, `viajes/${id}`);

    await updateDoc(viajeDocRef, viajeData);
  }

  // Obtener viajes disponibles (opcional)
  getViajesDisponibles(): Observable<Viaje[]> {
    const viajesRef = collection(this.firestore, 'viajes');
    const q = query(
      viajesRef,
      where('disponible', '==', true)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Viaje[]>;
  }
}
