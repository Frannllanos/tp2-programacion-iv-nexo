import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models/usuario.model';

interface SesionGuardada {
  usuario: Usuario;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly storageKey = 'nexo_sesion';
  private readonly sesionInicial = this.leerSesion();

  private readonly _usuario = signal<Usuario | null>(null);
  private readonly _token = signal<string | null>(this.sesionInicial?.token ?? null);
  private readonly _validada = signal(false);

  readonly usuario = this._usuario.asReadonly();
  readonly token = this._token.asReadonly();
  readonly validada = this._validada.asReadonly();
  readonly autenticado = computed(() => this._usuario() !== null && this._token() !== null && this._validada());

  establecerSesion(usuario: Usuario, token: string): void {
    this._usuario.set(usuario);
    this._token.set(token);
    this._validada.set(true);
    this.persistir();
  }

  establecerUsuario(usuario: Usuario): void {
    this._usuario.set(usuario);
    this.persistir();
  }

  actualizarToken(token: string): void {
    this._token.set(token);
    this._validada.set(true);
    this.persistir();
  }

  marcarValidada(): void {
    if (this._usuario() && this._token()) {
      this._validada.set(true);
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('tp2_usuario_sprint_1_2');
    this._usuario.set(null);
    this._token.set(null);
    this._validada.set(false);
  }

  private persistir(): void {
    const usuario = this._usuario();
    const token = this._token();
    if (!usuario || !token) return;

    const sesion: SesionGuardada = { usuario, token };
    localStorage.setItem(this.storageKey, JSON.stringify(sesion));
  }

  private leerSesion(): SesionGuardada | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;

    try {
      const sesion = JSON.parse(raw) as SesionGuardada;
      if (!sesion.usuario || !sesion.token) throw new Error('Sesion invalida');
      return sesion;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
