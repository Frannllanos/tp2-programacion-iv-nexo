import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ModalService } from './core/services/modal.service';
import { SessionService } from './core/services/session.service';
import { HeaderComponent } from './shared/components/header/header';
import { ModalComponent } from './shared/components/modal/modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly session = inject(SessionService);
  private readonly auth = inject(AuthService);
  private readonly modal = inject(ModalService);
  private avisoSesion: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const token = this.session.token();
      const validada = this.session.validada();

      if (this.avisoSesion) {
        clearTimeout(this.avisoSesion);
        this.avisoSesion = null;
      }
      if (!token || !validada) return;

      const demora = this.calcularDemoraAviso(token);
      this.avisoSesion = setTimeout(() => {
        this.modal.confirm(
          'Tu sesion esta por vencer',
          'Queda 1 minuto de sesion. Queres extenderla por otros 3 minutos?',
          () => this.renovarSesion(),
          'Extender sesion',
          'Ahora no',
        );
      }, demora);
    });
  }

  private calcularDemoraAviso(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
      if (!payload.exp) return 2 * 60 * 1000;
      return Math.max(0, payload.exp * 1000 - Date.now() - 60 * 1000);
    } catch {
      return 2 * 60 * 1000;
    }
  }

  private renovarSesion(): void {
    this.auth.refrescar().subscribe({
      next: ({ token }) => {
        this.session.actualizarToken(token);
        this.modal.success('Sesion renovada', 'Tu sesion fue extendida por 3 minutos.');
      },
      error: () => {
        // El interceptor global maneja el 401 y redirige al login.
      },
    });
  }
}
