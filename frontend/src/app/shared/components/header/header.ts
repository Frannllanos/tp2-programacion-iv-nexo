import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  readonly session = inject(SessionService);
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.session.cerrarSesion();
    void this.router.navigateByUrl('/login');
  }
}
