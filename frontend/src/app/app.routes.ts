import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cargando' },
  {
    path: 'cargando',
    loadComponent: () => import('./features/cargando/cargando').then((m) => m.Cargando),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'publicaciones',
    canActivate: [authGuard],
    loadComponent: () => import('./features/publicaciones/publicaciones').then((m) => m.Publicaciones),
  },
  {
    path: 'publicaciones/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/publicacion/publicacion').then((m) => m.PublicacionDetalle),
  },
  {
    path: 'mi-perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/mi-perfil/mi-perfil').then((m) => m.MiPerfil),
  },
  { path: '**', redirectTo: 'cargando' },
];
