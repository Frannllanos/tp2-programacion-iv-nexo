import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const guestGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  // Login y registro tambien muestran el spinner una vez al iniciar/recargar.
  if (!session.arranqueVerificado()) {
    return router.createUrlTree(['/cargando'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return session.autenticado()
    ? router.createUrlTree(['/publicaciones'])
    : true;
};
