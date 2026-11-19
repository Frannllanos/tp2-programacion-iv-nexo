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

      this.avisoSesion = setTimeout(() => {
        this.modal.confirm(
          'Tu sesión está por vencer',
          'Quedan 3 minutos de sesión. ¿Querés extenderla por otros 5 minutos?',
          () => this.renovarSesion(),
          'Extender sesión',
          'Ahora no',
        );
      }, 2 * 60 * 1000);
    });
  }

  private renovarSesion(): void {
    this.auth.refrescar().subscribe({
      next: ({ token }) => {
        this.session.actualizarToken(token);
        this.modal.success('Sesión renovada', 'Tu sesión fue extendida por 5 minutos.');
      },
      error: () => {
        // El interceptor global maneja el 401 y redirige al login.
      },
    });
  }
}
