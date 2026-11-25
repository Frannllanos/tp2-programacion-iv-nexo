import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionService } from '../services/session.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(SessionService);
  const router = inject(Router);
  const token = session.token();

  const requestConToken = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(requestConToken).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // La pantalla /cargando maneja por si misma el 401 de /autorizar
        // para evitar una doble redireccion durante el arranque de la app.
        const esAutorizacionInicial = request.url.includes('/auth/autorizar');
        if (!esAutorizacionInicial) {
          session.cerrarSesion();
          void router.navigateByUrl('/login');
        }
      }
      return throwError(() => error);
    }),
  );
};
