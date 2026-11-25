import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cargando' },
  {
    path: 'cargando',
    loadComponent: () => import('./features/cargando/cargando').then((m) => m.Cargando),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    canActivate: [guestGuard],
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
  {
    path: 'dashboard/usuarios',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/dashboard-usuarios/dashboard-usuarios').then((m) => m.DashboardUsuarios),
  },
  {
    path: 'dashboard/estadisticas',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/dashboard-estadisticas/dashboard-estadisticas').then((m) => m.DashboardEstadisticas),
  },
  { path: '**', redirectTo: 'login' },
];
