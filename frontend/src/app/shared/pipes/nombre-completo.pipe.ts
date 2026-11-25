import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nombreCompleto', standalone: true })
export class NombreCompletoPipe implements PipeTransform {
  transform(valor: { nombre?: string; apellido?: string } | null | undefined): string {
    if (!valor) return '';
    return `${valor.nombre ?? ''} ${valor.apellido ?? ''}`.trim();
  }
}
