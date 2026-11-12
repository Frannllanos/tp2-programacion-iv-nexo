import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { obtenerMensajeError } from '../../../core/services/http-error.util';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly modal = inject(ModalService);
  private readonly router = inject(Router);

  readonly enviando = signal(false);
  readonly formulario = this.fb.nonNullable.group({
    identificador: ['', [Validators.required, Validators.minLength(3)]],
    contrasena: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
    ]],
  });

  campoInvalido(nombre: 'identificador' | 'contrasena'): boolean {
    const control = this.formulario.controls[nombre];
    return control.invalid && (control.touched || control.dirty);
  }

  ingresar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { identificador, contrasena } = this.formulario.getRawValue();
    this.enviando.set(true);
    this.auth.login(identificador, contrasena).subscribe({
      next: (usuario) => {
        this.session.establecerUsuario(usuario);
        this.enviando.set(false);
        void this.router.navigateByUrl('/publicaciones');
      },
      error: (error) => {
        this.enviando.set(false);
        this.modal.error('No pudimos iniciar sesión', obtenerMensajeError(error));
      },
    });
  }
}
