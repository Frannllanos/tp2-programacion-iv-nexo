import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'publicaciones' },
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
    loadComponent: () => import('./features/publicaciones/publicaciones').then((m) => m.Publicaciones),
  },
  {
    path: 'mi-perfil',
    loadComponent: () => import('./features/mi-perfil/mi-perfil').then((m) => m.MiPerfil),
  },
  { path: '**', redirectTo: 'publicaciones' },
];
