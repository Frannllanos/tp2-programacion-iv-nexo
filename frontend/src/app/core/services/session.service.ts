import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly storageKey = 'tp2_usuario_sprint_1_2';
  private readonly _usuario = signal<Usuario | null>(this.leerUsuario());

  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed(() => this._usuario() !== null);

  establecerUsuario(usuario: Usuario): void {
    // Sprint 1-2: persistencia temporal de interfaz.
    // Sprint 3 reemplazará esta identidad por JWT/cookie validado por backend.
    localStorage.setItem(this.storageKey, JSON.stringify(usuario));
    this._usuario.set(usuario);
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.storageKey);
    this._usuario.set(null);
  }

  private leerUsuario(): Usuario | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
