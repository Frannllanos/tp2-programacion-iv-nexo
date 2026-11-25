import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textoCorto', standalone: true })
export class TextoCortoPipe implements PipeTransform {
  transform(texto: string | null | undefined, limite = 120): string {
    const valor = (texto ?? '').trim();
    return valor.length > limite ? `${valor.slice(0, limite).trimEnd()}...` : valor;
  }
}
