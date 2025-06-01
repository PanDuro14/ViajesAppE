import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'itinerario',
    loadComponent: () => import('./itinerario/itinerario.page').then((m) => m.ItinerarioPage),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.page').then((m) => m.AdminPage),
  },
  {
    path: 'fotos',
    loadComponent: () => import('./fotos/fotos.page').then((m) => m.FotosPage),
  },
  {
    path: 'coordinador',
    loadComponent: () => import('./coordinador/coordinador.page').then((m) => m.CoordinadorPage),
  },
  {
    path: 'viajes',
    loadComponent: () => import('./viajes/viajes.page').then((m) => m.ViajesPage),
  },
  {
    path: 'reglas',
    loadComponent: () => import('./reglas/reglas.page').then((m) => m.ReglasPage),
  },
  {
    path: 'ajustes',
    loadComponent: () => import('./ajustes/ajustes.page').then((m) => m.AjustesPage),
  },
  
  // Err 404
  { path: '**', redirectTo: 'home' },
];