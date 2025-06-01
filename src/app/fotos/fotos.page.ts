import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, 
  IonGrid, IonRow, IonCol, IonImg, IonFab, IonFabButton, IonActionSheet, 
  IonToast, IonSearchbar, IonModal, IonInput, IonTextarea, IonDatetime, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, shareOutline, heartOutline, heart, trashOutline, addOutline, saveOutline, imageOutline, closeOutline } from 'ionicons/icons';

interface Foto {
  id: number;
  url: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  likes: number;
  liked: boolean;
  destino: string;
}

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, 
    IonGrid, IonRow, IonCol, IonImg, IonFab, IonFabButton, IonActionSheet, 
    IonToast, IonSearchbar, IonModal, IonInput, IonTextarea, IonDatetime, IonItem, IonLabel,
    CommonModule, FormsModule
  ]
})
export class FotosPage implements OnInit {
  actionSheetButtons = [
    {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.sharePhoto()
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      icon: 'trash-outline',
      handler: () => this.deletePhoto()
    },
    {
      text: 'Cancelar',
      role: 'cancel'
    }
  ];
  fotos: Foto[] = [
    {
      id: 1,
      url: 'https://picsum.photos/id/1043/800/600',
      titulo: 'Amanecer en la playa',
      descripcion: 'Hermoso amanecer en Playa del Carmen',
      fecha: '2023-12-16',
      likes: 24,
      liked: false,
      destino: 'Playa del Carmen'
    },
    {
      id: 2,
      url: 'https://picsum.photos/id/1044/800/600',
      titulo: 'Ruinas de Tulum',
      descripcion: 'Visita a las ruinas mayas de Tulum',
      fecha: '2023-12-17',
      likes: 18,
      liked: false,
      destino: 'Playa del Carmen'
    },
    {
      id: 3,
      url: 'https://picsum.photos/id/1015/800/600',
      titulo: 'Cenote Azul',
      descripcion: 'Nadando en el cenote más cristalino de la Riviera Maya',
      fecha: '2023-12-18',
      likes: 32,
      liked: false,
      destino: 'Playa del Carmen'
    },
    {
      id: 4,
      url: 'https://picsum.photos/id/1016/800/600',
      titulo: 'Zócalo CDMX',
      descripcion: 'Plaza principal de la Ciudad de México',
      fecha: '2024-01-12',
      likes: 15,
      liked: false,
      destino: 'Ciudad de México'
    },
    {
      id: 5,
      url: 'https://picsum.photos/id/1018/800/600',
      titulo: 'Museo de Antropología',
      descripcion: 'Visita al famoso museo en Chapultepec',
      fecha: '2024-01-13',
      likes: 27,
      liked: false,
      destino: 'Ciudad de México'
    },
    {
      id: 6,
      url: 'https://picsum.photos/id/1019/800/600',
      titulo: 'Playa Delfines',
      descripcion: 'La mejor vista de Cancún desde el mirador',
      fecha: '2024-02-07',
      likes: 41,
      liked: false,
      destino: 'Cancún'
    }
  ];

  filteredFotos: Foto[] = [];
  searchTerm: string = '';
  showActionSheet: boolean = false;
  selectedFoto: Foto | null = null;
  showToast: boolean = false;
  toastMessage: string = '';
  showModal: boolean = false;
  newFoto: Foto = this.getEmptyFoto();

  constructor() {
    addIcons({ cameraOutline, shareOutline, heartOutline, heart, trashOutline, addOutline, saveOutline, imageOutline, closeOutline });
  }

  ngOnInit() {
    this.filteredFotos = [...this.fotos];
  }

  filterFotos() {
    this.filteredFotos = this.fotos.filter(foto => 
      foto.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      foto.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      foto.destino.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  likePhoto(foto: Foto) {
    foto.liked = !foto.liked;
    if (foto.liked) {
      foto.likes++;
      this.toastMessage = '¡Te gusta esta foto!';
    } else {
      foto.likes--;
      this.toastMessage = 'Ya no te gusta esta foto';
    }
    this.showToast = true;
  }

  openActionSheet(foto: Foto) {
    this.selectedFoto = foto;
    this.showActionSheet = true;
  }

  sharePhoto() {
    if (this.selectedFoto) {
      this.toastMessage = `Compartiendo foto: ${this.selectedFoto.titulo}`;
      this.showToast = true;
    }
    this.showActionSheet = false;
  }

  deletePhoto() {
    if (this.selectedFoto) {
      this.fotos = this.fotos.filter(f => f.id !== this.selectedFoto!.id);
      this.filteredFotos = this.filteredFotos.filter(f => f.id !== this.selectedFoto!.id);
      this.toastMessage = 'Foto eliminada con éxito';
      this.showToast = true;
    }
    this.showActionSheet = false;
  }

  getEmptyFoto(): Foto {
    return {
      id: 0,
      url: '',
      titulo: '',
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      likes: 0,
      liked: false,
      destino: ''
    };
  }

  addNewPhoto() {
    this.newFoto = this.getEmptyFoto();
    this.showModal = true;
  }

  savePhoto() {
    if (this.validatePhoto()) {
      // Generar ID único
      const newId = Math.max(...this.fotos.map(f => f.id), 0) + 1;
      
      // Si no hay URL, generar una aleatoria
      if (!this.newFoto.url) {
        const randomId = Math.floor(Math.random() * 100) + 1000;
        this.newFoto.url = `https://picsum.photos/id/${randomId}/800/600`;
      }
      
      // Crear nueva foto con ID asignado
      const photoToAdd = { ...this.newFoto, id: newId };
      
      // Agregar a la lista de fotos
      this.fotos.unshift(photoToAdd);
      this.filteredFotos = [...this.fotos];
      
      this.toastMessage = 'Foto agregada con éxito';
      this.showToast = true;
      this.showModal = false;
    } else {
      this.toastMessage = 'Por favor completa todos los campos requeridos';
      this.showToast = true;
    }
  }

  validatePhoto(): boolean {
    return !!this.newFoto.titulo && 
           !!this.newFoto.descripcion && 
           !!this.newFoto.destino;
  }

  cancelAddPhoto() {
    this.showModal = false;
  }

  generateRandomImage() {
    const randomId = Math.floor(Math.random() * 100) + 1000;
    this.newFoto.url = `https://picsum.photos/id/${randomId}/800/600`;
  }
}
