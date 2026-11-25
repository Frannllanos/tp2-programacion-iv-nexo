import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models/usuario.model';

interface SesionGuardada {
  usuario: Usuario;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly sesionKey = 'nexo_sesion';
  private readonly usuarioKeyAnterior = 'nexo_usuario';
  private readonly tokenKeyAnterior = 'nexo_jwt';
  private readonly sesionInicial = this.leerSesion();

  private readonly _usuario = signal<Usuario | null>(this.sesionInicial?.usuario ?? null);
  private readonly _token = signal<string | null>(this.sesionInicial?.token ?? null);
  private readonly _validada = signal(false);
  private readonly _arranqueVerificado = signal(false);

  readonly usuario = this._usuario.asReadonly();
  readonly token = this._token.asReadonly();
  readonly validada = this._validada.asReadonly();
  readonly arranqueVerificado = this._arranqueVerificado.asReadonly();
  readonly autenticado = computed(() => this._usuario() !== null && this._token() !== null && this._validada());
  readonly esAdmin = computed(() => this._usuario()?.perfil === 'administrador');

  establecerSesion(usuario: Usuario, token: string): void {
    this._usuario.set(usuario);
    this._token.set(token);
    this._validada.set(true);
    this._arranqueVerificado.set(true);
    this.persistir();
  }

  establecerUsuario(usuario: Usuario): void {
    this._usuario.set(usuario);
    this.persistir();
  }

  actualizarToken(token: string): void {
    this._token.set(token);
    this._validada.set(true);
    this._arranqueVerificado.set(true);
    this.persistir();
  }

  marcarValidada(): void {
    if (this._usuario() && this._token()) {
      this._validada.set(true);
      this._arranqueVerificado.set(true);
    }
  }

  marcarArranqueVerificado(): void {
    this._arranqueVerificado.set(true);
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.sesionKey);
    localStorage.removeItem(this.usuarioKeyAnterior);
    localStorage.removeItem(this.tokenKeyAnterior);
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
    localStorage.setItem(this.sesionKey, JSON.stringify(sesion));

    // Limpia el formato temporal usado en la version anterior para que
    // Local Storage muestre una sola sesion con usuario + JWT.
    localStorage.removeItem(this.usuarioKeyAnterior);
    localStorage.removeItem(this.tokenKeyAnterior);
  }

  private leerSesion(): SesionGuardada | null {
    const sesionRaw = localStorage.getItem(this.sesionKey);
    if (sesionRaw) {
      try {
        const sesion = JSON.parse(sesionRaw) as SesionGuardada;
        if (!sesion.usuario || !sesion.token) throw new Error('Sesion invalida');
        localStorage.removeItem(this.usuarioKeyAnterior);
        localStorage.removeItem(this.tokenKeyAnterior);
        return sesion;
      } catch {
        localStorage.removeItem(this.sesionKey);
      }
    }

    // Migracion automatica desde la version que guardaba usuario y JWT por separado.
    const usuarioRaw = localStorage.getItem(this.usuarioKeyAnterior);
    const token = localStorage.getItem(this.tokenKeyAnterior);
    if (!usuarioRaw || !token) return null;

    try {
      const sesion: SesionGuardada = {
        usuario: JSON.parse(usuarioRaw) as Usuario,
        token,
      };
      localStorage.setItem(this.sesionKey, JSON.stringify(sesion));
      localStorage.removeItem(this.usuarioKeyAnterior);
      localStorage.removeItem(this.tokenKeyAnterior);
      return sesion;
    } catch {
      localStorage.removeItem(this.usuarioKeyAnterior);
      localStorage.removeItem(this.tokenKeyAnterior);
      return null;
    }
  }
}
