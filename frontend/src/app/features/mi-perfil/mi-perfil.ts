import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Publicacion } from '../../core/models/publicacion.model';
import { Usuario } from '../../core/models/usuario.model';
import { obtenerMensajeError } from '../../core/services/http-error.util';
import { ModalService } from '../../core/services/modal.service';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { SessionService } from '../../core/services/session.service';
import { UsuariosService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  private readonly publicacionesService = inject(PublicacionesService);
  private readonly session = inject(SessionService);
  private readonly modal = inject(ModalService);

  readonly usuario = signal<Usuario | null>(null);
  readonly publicaciones = signal<Publicacion[]>([]);
  readonly cargando = signal(true);

  ngOnInit(): void {
    const actual = this.session.usuario();
    if (!actual) { this.cargando.set(false); return; }
    this.usuariosService.obtenerPorId(actual.id).subscribe({
      next: (usuario) => {
        this.usuario.set(usuario);
        this.session.establecerUsuario(usuario);
        this.cargarPublicaciones(usuario.id);
      },
      error: (error) => {
        this.cargando.set(false);
        this.modal.error('No se pudo cargar el perfil', obtenerMensajeError(error));
      },
    });
  }

  private cargarPublicaciones(usuarioId: string): void {
    this.publicacionesService.listar({ usuarioId, orden: 'fecha', offset: 0, limit: 3 }).subscribe({
      next: (respuesta) => { this.publicaciones.set(respuesta.items); this.cargando.set(false); },
      error: (error) => { this.cargando.set(false); this.modal.error('No se pudieron cargar tus publicaciones', obtenerMensajeError(error)); },
    });
  }
}
