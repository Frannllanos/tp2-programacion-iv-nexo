import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Publicacion } from '../../core/models/publicacion.model';
import { obtenerMensajeError } from '../../core/services/http-error.util';
import { ModalService } from '../../core/services/modal.service';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { SessionService } from '../../core/services/session.service';
import { PublicacionCardComponent } from '../../shared/components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PublicacionCardComponent],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly publicacionesService = inject(PublicacionesService);
  readonly session = inject(SessionService);
  private readonly modal = inject(ModalService);

  readonly publicaciones = signal<Publicacion[]>([]);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly orden = signal<'fecha' | 'likes'>('fecha');
  readonly pagina = signal(1);
  readonly limite = 6;
  readonly total = signal(0);
  readonly hasNext = signal(false);
  readonly imagen = signal<File | undefined>(undefined);
  readonly imagenPreview = signal<string | null>(null);

  readonly formulario = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2000)]],
  });

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando.set(true);
    this.publicacionesService.listar({
      orden: this.orden(),
      offset: (this.pagina() - 1) * this.limite,
      limit: this.limite,
    }).subscribe({
      next: (respuesta) => {
        this.publicaciones.set(respuesta.items);
        this.total.set(respuesta.total);
        this.hasNext.set(respuesta.hasNext);
        this.cargando.set(false);
      },
      error: (error) => {
        this.cargando.set(false);
        this.modal.error('No se pudieron cargar las publicaciones', obtenerMensajeError(error));
      },
    });
  }

  cambiarOrden(event: Event): void {
    this.orden.set((event.target as HTMLSelectElement).value as 'fecha' | 'likes');
    this.pagina.set(1);
    this.cargar();
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imagen.set(file);
    if (!file) { this.imagenPreview.set(null); return; }
    const reader = new FileReader();
    reader.onload = () => this.imagenPreview.set(String(reader.result));
    reader.readAsDataURL(file);
  }

  crear(): void {
    const usuario = this.session.usuario();
    if (!usuario || this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { titulo, descripcion } = this.formulario.getRawValue();
    this.guardando.set(true);
    this.publicacionesService.crear(usuario.id, titulo, descripcion, this.imagen()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.formulario.reset({ titulo: '', descripcion: '' });
        this.imagen.set(undefined);
        this.imagenPreview.set(null);
        this.pagina.set(1);
        this.orden.set('fecha');
        this.cargar();
        this.modal.success('Publicación creada', 'Tu publicación ya está visible en NEXO.');
      },
      error: (error) => {
        this.guardando.set(false);
        this.modal.error('No se pudo publicar', obtenerMensajeError(error));
      },
    });
  }

  toggleLike(publicacion: Publicacion): void {
    const usuario = this.session.usuario();
    if (!usuario) return;
    const request = publicacion.likes.includes(usuario.id)
      ? this.publicacionesService.quitarMeGusta(publicacion.id, usuario.id)
      : this.publicacionesService.darMeGusta(publicacion.id, usuario.id);
    request.subscribe({
      next: (actualizada) => this.reemplazar(actualizada),
      error: (error) => this.modal.error('No se pudo actualizar el Me gusta', obtenerMensajeError(error)),
    });
  }

  pedirEliminar(publicacion: Publicacion): void {
    const usuario = this.session.usuario();
    if (!usuario) return;
    this.modal.confirm('Eliminar publicación', 'La publicación dejará de mostrarse, pero se conservará en la base mediante baja lógica.', () => {
      this.publicacionesService.eliminar(publicacion.id, usuario.id).subscribe({
        next: () => { this.modal.success('Publicación eliminada', 'La baja lógica se realizó correctamente.'); this.cargar(); },
        error: (error) => this.modal.error('No se pudo eliminar', obtenerMensajeError(error)),
      });
    });
  }

  anterior(): void { if (this.pagina() > 1) { this.pagina.update((n) => n - 1); this.cargar(); } }
  siguiente(): void { if (this.hasNext()) { this.pagina.update((n) => n + 1); this.cargar(); } }

  private reemplazar(actualizada: Publicacion): void {
    this.publicaciones.update((items) => items.map((item) => item.id === actualizada.id ? actualizada : item));
  }
}
