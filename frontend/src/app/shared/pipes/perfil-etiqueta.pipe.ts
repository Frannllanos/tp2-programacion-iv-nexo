import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'perfilEtiqueta', standalone: true })
export class PerfilEtiquetaPipe implements PipeTransform {
  transform(perfil: 'usuario' | 'administrador' | string | null | undefined): string {
    return perfil === 'administrador' ? 'Administrador' : 'Usuario';
  }
}
