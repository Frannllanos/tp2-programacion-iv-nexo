import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Comentario, Publicacion } from '../../core/models/publicacion.model';
import { ComentariosService } from '../../core/services/comentarios.service';
import { obtenerMensajeError } from '../../core/services/http-error.util';
import { ModalService } from '../../core/services/modal.service';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './publicacion.html',
  styleUrl: './publicacion.css',
})
export class PublicacionDetalle implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly publicaciones = inject(PublicacionesService);
  private readonly comentariosService = inject(ComentariosService);
  private readonly modal = inject(ModalService);
  readonly session = inject(SessionService);

  readonly publicacion = signal<Publicacion | null>(null);
  readonly comentarios = signal<Comentario[]>([]);
  readonly totalComentarios = signal(0);
  readonly hasNext = signal(false);
  readonly cargando = signal(true);
  readonly cargandoMas = signal(false);
  readonly enviando = signal(false);
  readonly editandoId = signal<string | null>(null);

  private readonly limiteComentarios = 5;
  private publicacionId = '';

  readonly formulario = this.fb.nonNullable.group({
    mensaje: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  readonly formularioEdicion = this.fb.nonNullable.group({
    mensaje: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  ngOnInit(): void {
    this.publicacionId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.publicacionId) {
      void this.router.navigateByUrl('/publicaciones');
      return;
    }

    this.cargarPublicacion();
    this.cargarComentarios(true);
  }

  crearComentario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const mensaje = this.formulario.controls.mensaje.value.trim();
    if (!mensaje) return;

    this.enviando.set(true);
    this.comentariosService.crear(this.publicacionId, mensaje).subscribe({
      next: (comentario) => {
        this.comentarios.update((items) => [comentario, ...items]);
        this.totalComentarios.update((total) => total + 1);
        this.formulario.reset({ mensaje: '' });
        this.enviando.set(false);
      },
      error: (error) => {
        this.enviando.set(false);
        this.modal.error('No se pudo comentar', obtenerMensajeError(error));
      },
    });
  }

  cargarMas(): void {
    if (!this.hasNext() || this.cargandoMas()) return;
    this.cargandoMas.set(true);

    this.comentariosService
      .listar(this.publicacionId, this.comentarios().length, this.limiteComentarios)
      .subscribe({
        next: (respuesta) => {
          this.comentarios.update((items) => [...items, ...respuesta.items]);
          this.totalComentarios.set(respuesta.total);
          this.hasNext.set(respuesta.hasNext);
          this.cargandoMas.set(false);
        },
        error: (error) => {
          this.cargandoMas.set(false);
          this.modal.error('No se pudieron cargar más comentarios', obtenerMensajeError(error));
        },
      });
  }

  iniciarEdicion(comentario: Comentario): void {
    this.editandoId.set(comentario.id);
    this.formularioEdicion.setValue({ mensaje: comentario.mensaje });
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
    this.formularioEdicion.reset({ mensaje: '' });
  }

  guardarEdicion(comentario: Comentario): void {
    if (this.formularioEdicion.invalid) {
      this.formularioEdicion.markAllAsTouched();
      return;
    }

    const mensaje = this.formularioEdicion.controls.mensaje.value.trim();
    if (!mensaje) return;

    this.comentariosService.editar(this.publicacionId, comentario.id, mensaje).subscribe({
      next: (actualizado) => {
        this.comentarios.update((items) => items.map((item) => item.id === actualizado.id ? actualizado : item));
        this.cancelarEdicion();
      },
      error: (error) => this.modal.error('No se pudo editar el comentario', obtenerMensajeError(error)),
    });
  }

  toggleLike(): void {
    const publicacion = this.publicacion();
    const usuario = this.session.usuario();
    if (!publicacion || !usuario) return;

    const request = publicacion.likes.includes(usuario.id)
      ? this.publicaciones.quitarMeGusta(publicacion.id)
      : this.publicaciones.darMeGusta(publicacion.id);

    request.subscribe({
      next: (actualizada) => this.publicacion.set(actualizada),
      error: (error) => this.modal.error('No se pudo actualizar el Me gusta', obtenerMensajeError(error)),
    });
  }

  pedirEliminar(): void {
    const publicacion = this.publicacion();
    if (!publicacion) return;

    this.modal.confirm(
      'Eliminar publicación',
      'La publicación dejará de mostrarse, pero se conservará mediante baja lógica.',
      () => {
        this.publicaciones.eliminar(publicacion.id).subscribe({
          next: () => {
            this.modal.success('Publicación eliminada', 'La baja lógica se realizó correctamente.');
            void this.router.navigateByUrl('/publicaciones');
          },
          error: (error) => this.modal.error('No se pudo eliminar', obtenerMensajeError(error)),
        });
      },
    );
  }

  esComentarioPropio(comentario: Comentario): boolean {
    return this.session.usuario()?.id === comentario.usuarioId;
  }

  dioLike(): boolean {
    const publicacion = this.publicacion();
    const usuario = this.session.usuario();
    return Boolean(publicacion && usuario && publicacion.likes.includes(usuario.id));
  }

  puedeEliminar(): boolean {
    const publicacion = this.publicacion();
    const usuario = this.session.usuario();
    return Boolean(publicacion && usuario && (publicacion.autor.id === usuario.id || usuario.perfil === 'administrador'));
  }

  private cargarPublicacion(): void {
    this.publicaciones.obtener(this.publicacionId).subscribe({
      next: (publicacion) => {
        this.publicacion.set(publicacion);
        this.cargando.set(false);
      },
      error: (error) => {
        this.cargando.set(false);
        this.modal.error('No se pudo cargar la publicación', obtenerMensajeError(error));
        void this.router.navigateByUrl('/publicaciones');
      },
    });
  }

  private cargarComentarios(reemplazar: boolean): void {
    this.comentariosService.listar(this.publicacionId, 0, this.limiteComentarios).subscribe({
      next: (respuesta) => {
        if (reemplazar) this.comentarios.set(respuesta.items);
        else this.comentarios.update((items) => [...items, ...respuesta.items]);
        this.totalComentarios.set(respuesta.total);
        this.hasNext.set(respuesta.hasNext);
      },
      error: (error) => this.modal.error('No se pudieron cargar los comentarios', obtenerMensajeError(error)),
    });
  }
}
