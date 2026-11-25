import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Publicacion } from '../../core/models/publicacion.model';
import { Usuario } from '../../core/models/usuario.model';
import { AuthService } from '../../core/services/auth.service';
import { obtenerMensajeError } from '../../core/services/http-error.util';
import { ModalService } from '../../core/services/modal.service';
import { PublicacionesService } from '../../core/services/publicaciones.service';
import { SessionService } from '../../core/services/session.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { AdminAccentDirective } from '../../shared/directives/admin-accent.directive';
import { NavegableDirective } from '../../shared/directives/navegable.directive';
import { NombreCompletoPipe } from '../../shared/pipes/nombre-completo.pipe';
import { PerfilEtiquetaPipe } from '../../shared/pipes/perfil-etiqueta.pipe';
import { TextoCortoPipe } from '../../shared/pipes/texto-corto.pipe';

function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const fecha = new Date(`${control.value}T00:00:00`);
  return fecha > new Date() ? { fechaFutura: true } : null;
}

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    NavegableDirective,
    AdminAccentDirective,
    NombreCompletoPipe,
    PerfilEtiquetaPipe,
    TextoCortoPipe,
  ],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly publicacionesService = inject(PublicacionesService);
  private readonly session = inject(SessionService);
  private readonly modal = inject(ModalService);

  readonly usuario = signal<Usuario | null>(null);
  readonly publicaciones = signal<Publicacion[]>([]);
  readonly cargando = signal(true);
  readonly editando = signal(false);
  readonly guardando = signal(false);
  readonly archivo = signal<File | null>(null);
  readonly preview = signal<string | null>(null);

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    nombreUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9._-]+$/)]],
    fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
    descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(280)]],
  });

  ngOnInit(): void {
    const actual = this.session.usuario();
    if (!actual) { this.cargando.set(false); return; }
    this.usuariosService.obtenerPorId(actual.id).subscribe({
      next: (usuario) => {
        this.usuario.set(usuario);
        this.session.establecerUsuario(usuario);
        this.cargarFormulario(usuario);
        this.cargarPublicaciones(usuario.id);
      },
      error: (error) => {
        this.cargando.set(false);
        this.modal.error('No se pudo cargar el perfil', obtenerMensajeError(error));
      },
    });
  }

  invalido(nombre: keyof typeof this.formulario.controls): boolean {
    const control = this.formulario.controls[nombre];
    return control.invalid && (control.touched || control.dirty);
  }

  comenzarEdicion(): void {
    const usuario = this.usuario();
    if (!usuario) return;
    this.cargarFormulario(usuario);
    this.archivo.set(null);
    this.preview.set(null);
    this.editando.set(true);
  }

  cancelarEdicion(): void {
    const usuario = this.usuario();
    if (usuario) this.cargarFormulario(usuario);
    this.archivo.set(null);
    this.preview.set(null);
    this.editando.set(false);
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.archivo.set(file);
    if (!file) {
      this.preview.set(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.modal.error('Archivo invalido', 'Selecciona una imagen valida.');
      input.value = '';
      this.archivo.set(null);
      this.preview.set(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.preview.set(String(reader.result));
    reader.readAsDataURL(file);
  }

  guardarPerfil(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.auth.actualizarPerfil({
      ...this.formulario.getRawValue(),
      imagenPerfil: this.archivo(),
    }).subscribe({
      next: (usuario) => {
        this.usuario.set(usuario);
        this.session.establecerUsuario(usuario);
        this.cargarFormulario(usuario);
        this.archivo.set(null);
        this.preview.set(null);
        this.editando.set(false);
        this.guardando.set(false);
        this.modal.success('Perfil actualizado', 'Tus datos se guardaron correctamente.');
      },
      error: (error) => {
        this.guardando.set(false);
        this.modal.error('No se pudo actualizar el perfil', obtenerMensajeError(error));
      },
    });
  }

  private cargarFormulario(usuario: Usuario): void {
    this.formulario.reset({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      nombreUsuario: usuario.nombreUsuario,
      fechaNacimiento: usuario.fechaNacimiento.slice(0, 10),
      descripcion: usuario.descripcion,
    });
  }

  private cargarPublicaciones(usuarioId: string): void {
    this.publicacionesService.listar({ usuarioId, orden: 'fecha', offset: 0, limit: 3 }).subscribe({
      next: (respuesta) => { this.publicaciones.set(respuesta.items); this.cargando.set(false); },
      error: (error) => { this.cargando.set(false); this.modal.error('No se pudieron cargar tus publicaciones', obtenerMensajeError(error)); },
    });
  }
}
