import { Injectable, signal } from '@angular/core';

export type ModalKind = 'info' | 'success' | 'error' | 'confirm';

export interface ModalState {
  visible: boolean;
  kind: ModalKind;
  titulo: string;
  mensaje: string;
  confirmarTexto?: string;
  cancelarTexto?: string;
  onConfirm?: () => void;
}

const CLOSED: ModalState = {
  visible: false,
  kind: 'info',
  titulo: '',
  mensaje: '',
};

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly _state = signal<ModalState>(CLOSED);
  readonly state = this._state.asReadonly();

  success(titulo: string, mensaje: string): void {
    this._state.set({ visible: true, kind: 'success', titulo, mensaje });
  }

  error(titulo: string, mensaje: string): void {
    this._state.set({ visible: true, kind: 'error', titulo, mensaje });
  }

  info(titulo: string, mensaje: string): void {
    this._state.set({ visible: true, kind: 'info', titulo, mensaje });
  }

  confirm(titulo: string, mensaje: string, onConfirm: () => void): void {
    this._state.set({
      visible: true,
      kind: 'confirm',
      titulo,
      mensaje,
      confirmarTexto: 'Confirmar',
      cancelarTexto: 'Cancelar',
      onConfirm,
    });
  }

  confirmar(): void {
    const action = this._state().onConfirm;
    this.cerrar();
    action?.();
  }

  cerrar(): void {
    this._state.set(CLOSED);
  }
}
