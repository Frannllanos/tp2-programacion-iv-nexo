import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  // En cada inicio/recarga de la SPA se pasa una vez por la pantalla de carga.
  if (!session.arranqueVerificado()) {
    return router.createUrlTree(['/cargando'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (session.autenticado()) return true;
  return router.createUrlTree(['/login']);
};
