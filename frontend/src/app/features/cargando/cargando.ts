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
    if (!token) {
      this.session.cerrarSesion();
      void this.router.navigateByUrl('/login');
      return;
    }

    this.auth.autorizar().subscribe({
      next: (usuario) => {
        this.session.establecerUsuario(usuario);
        this.session.marcarValidada();
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(returnUrl || '/publicaciones');
      },
      error: () => {
        this.session.cerrarSesion();
        void this.router.navigateByUrl('/login');
      },
    });
  }
}
