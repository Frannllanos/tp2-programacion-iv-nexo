import { HttpErrorResponse } from '@angular/common/http';

export function obtenerMensajeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const mensaje = error.error?.message;
    if (Array.isArray(mensaje)) return mensaje.join(' · ');
    if (typeof mensaje === 'string') return mensaje;
    if (error.status === 0) return 'No se pudo conectar con el servidor.';
    return `La operación falló (HTTP ${error.status}).`;
  }
  return 'Ocurrió un error inesperado.';
}
