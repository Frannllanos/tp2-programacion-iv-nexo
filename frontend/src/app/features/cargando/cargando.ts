import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-cargando',
  standalone: true,
  templateUrl: './cargando.html',
  styleUrl: './cargando.css',
})
export class Cargando implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const token = this.session.token();
    const returnUrl = this.normalizarReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl'));

    if (!token) {
      this.session.cerrarSesion();
      this.session.marcarArranqueVerificado();
      void this.router.navigateByUrl(this.destinoSinSesion(returnUrl));
      return;
    }

    this.auth.autorizar().subscribe({
      next: (usuario) => {
        this.session.establecerUsuario(usuario);
        this.session.marcarValidada();
        void this.router.navigateByUrl(this.destinoConSesion(returnUrl));
      },
      error: () => {
        this.session.cerrarSesion();
        this.session.marcarArranqueVerificado();
        void this.router.navigateByUrl(this.destinoSinSesion(returnUrl));
      },
    });
  }

  private destinoSinSesion(returnUrl: string | null): string {
    return returnUrl === '/registro' ? '/registro' : '/login';
  }

  private destinoConSesion(returnUrl: string | null): string {
    if (!returnUrl || returnUrl === '/login' || returnUrl === '/registro') {
      return '/publicaciones';
    }
    return returnUrl;
  }

  private normalizarReturnUrl(returnUrl: string | null): string | null {
    if (!returnUrl || returnUrl === '/cargando' || returnUrl.startsWith('/cargando?')) {
      return null;
    }
    return returnUrl.startsWith('/') ? returnUrl : null;
  }
}
