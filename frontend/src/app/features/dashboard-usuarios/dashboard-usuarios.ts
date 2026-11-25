import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Usuario } from '../../core/models/usuario.model';
import { obtenerMensajeError } from '../../core/services/http-error.util';
import { ModalService } from '../../core/services/modal.service';
import { SessionService } from '../../core/services/session.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { AdminAccentDirective } from '../../shared/directives/admin-accent.directive';
import { AutoFocusDirective } from '../../shared/directives/auto-focus.directive';
import { NombreCompletoPipe } from '../../shared/pipes/nombre-completo.pipe';
import { PerfilEtiquetaPipe } from '../../shared/pipes/perfil-etiqueta.pipe';

function contrasenasCoinciden(group: AbstractControl): ValidationErrors | null {
  const a = group.get('contrasena')?.value;
  const b = group.get('repetirContrasena')?.value;
  return a && b && a !== b ? { contrasenasNoCoinciden: true } : null;
}

function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return new Date(`${control.value}T00:00:00`) > new Date() ? { fechaFutura: true } : null;
}

@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [ReactiveFormsModule, AdminAccentDirective, AutoFocusDirective, NombreCompletoPipe, PerfilEtiquetaPipe],
  templateUrl: './dashboard-usuarios.html',
  styleUrl: './dashboard-usuarios.css',
})
export class DashboardUsuarios implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuariosService = inject(UsuariosService);
  private readonly modal = inject(ModalService);
  readonly session = inject(SessionService);

  readonly usuarios = signal<Usuario[]>([]);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly archivo = signal<File | null>(null);

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    nombreUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9._-]+$/)]],
    contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
    repetirContrasena: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
    descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(280)]],
    perfil: ['usuario' as 'usuario' | 'administrador', [Validators.required]],
  }, { validators: [contrasenasCoinciden] });

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  invalido(campo: keyof typeof this.formulario.controls): boolean {
    const control = this.formulario.controls[campo];
    return control.invalid && control.touched;
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (file && !file.type.startsWith('image/')) {
      this.modal.error('Archivo invalido', 'Selecciona una imagen.');
      input.value = '';
      this.archivo.set(null);
      return;
    }
    this.archivo.set(file);
  }

  crearUsuario(): void {
    if (this.formulario.invalid || !this.archivo()) {
      this.formulario.markAllAsTouched();
      if (!this.archivo()) this.modal.error('Falta la foto', 'La imagen de perfil es obligatoria.');
      return;
    }

    this.guardando.set(true);
    this.usuariosService.crearDesdeAdmin({ ...this.formulario.getRawValue(), imagenPerfil: this.archivo()! }).subscribe({
      next: (usuario) => {
        this.usuarios.update((items) => [usuario, ...items]);
        this.guardando.set(false);
        this.formulario.reset({
          nombre: '', apellido: '', correo: '', nombreUsuario: '', contrasena: '', repetirContrasena: '',
          fechaNacimiento: '', descripcion: '', perfil: 'usuario',
        });
        this.archivo.set(null);
        const input = document.querySelector<HTMLInputElement>('#admin-foto');
        if (input) input.value = '';
        this.modal.success('Usuario creado', 'El usuario fue dado de alta correctamente.');
      },
      error: (error) => {
        this.guardando.set(false);
        this.modal.error('No se pudo crear', obtenerMensajeError(error));
      },
    });
  }

  cambiarEstado(usuario: Usuario): void {
    const accion = usuario.activo ? 'deshabilitar' : 'habilitar';
    this.modal.confirm(
      `${accion === 'deshabilitar' ? 'Deshabilitar' : 'Habilitar'} usuario`,
      `Se va a ${accion} a @${usuario.nombreUsuario}.`,
      () => this.ejecutarCambioEstado(usuario),
      'Confirmar',
      'Cancelar',
    );
  }

  private ejecutarCambioEstado(usuario: Usuario): void {
    const request: Observable<Usuario | void> = usuario.activo
      ? this.usuariosService.deshabilitar(usuario.id)
      : this.usuariosService.habilitar(usuario.id);

    request.subscribe({
      next: () => {
        this.usuarios.update((items) => items.map((item) => item.id === usuario.id ? { ...item, activo: !usuario.activo } : item));
        this.modal.success('Estado actualizado', `@${usuario.nombreUsuario} ahora esta ${usuario.activo ? 'deshabilitado' : 'habilitado'}.`);
      },
      error: (error: unknown) => this.modal.error('No se pudo actualizar', obtenerMensajeError(error)),
    });
  }

  private cargarUsuarios(): void {
    this.usuariosService.listar().subscribe({
      next: (usuarios) => { this.usuarios.set(usuarios); this.cargando.set(false); },
      error: (error) => { this.cargando.set(false); this.modal.error('No se pudieron cargar los usuarios', obtenerMensajeError(error)); },
    });
  }
}
