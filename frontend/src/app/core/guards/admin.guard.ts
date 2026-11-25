import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (!session.arranqueVerificado()) {
    return router.createUrlTree(['/cargando'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (!session.autenticado()) return router.createUrlTree(['/login']);
  if (session.esAdmin()) return true;
  return router.createUrlTree(['/publicaciones']);
};
