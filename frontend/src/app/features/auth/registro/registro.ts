import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { obtenerMensajeError } from '../../../core/services/http-error.util';
import { SessionService } from '../../../core/services/session.service';

function contrasenasCoinciden(group: AbstractControl): ValidationErrors | null {
  const a = group.get('contrasena')?.value;
  const b = group.get('repetirContrasena')?.value;
  return a && b && a !== b ? { contrasenasNoCoinciden: true } : null;
}

function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const fecha = new Date(`${control.value}T00:00:00`);
  return fecha > new Date() ? { fechaFutura: true } : null;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly modal = inject(ModalService);
  private readonly router = inject(Router);

  readonly enviando = signal(false);
  readonly archivo = signal<File | null>(null);
  readonly preview = signal<string | null>(null);

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    nombreUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9._-]+$/)]],
    contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
    repetirContrasena: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
    descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(280)]],
  }, { validators: [contrasenasCoinciden] });

  invalido(nombre: keyof typeof this.formulario.controls): boolean {
    const control = this.formulario.controls[nombre];
    return control.invalid && (control.touched || control.dirty);
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
      this.modal.error('Archivo inválido', 'Seleccioná una imagen. El servidor igualmente validará sus bytes reales.');
      input.value = '';
      this.archivo.set(null);
      this.preview.set(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.preview.set(String(reader.result));
    reader.readAsDataURL(file);
  }

  registrar(): void {
    if (this.formulario.invalid || !this.archivo()) {
      this.formulario.markAllAsTouched();
      if (!this.archivo()) this.modal.error('Falta la foto de perfil', 'Seleccioná una imagen para completar el registro.');
      return;
    }

    const valores = this.formulario.getRawValue();
    this.enviando.set(true);
    this.auth.registrar({ ...valores, imagenPerfil: this.archivo()! }).subscribe({
      next: (usuario) => {
        this.session.establecerUsuario(usuario);
        this.enviando.set(false);
        this.modal.success('Cuenta creada', 'Tu perfil fue creado correctamente.');
        void this.router.navigateByUrl('/publicaciones');
      },
      error: (error) => {
        this.enviando.set(false);
        this.modal.error('No pudimos registrarte', obtenerMensajeError(error));
      },
    });
  }
}
