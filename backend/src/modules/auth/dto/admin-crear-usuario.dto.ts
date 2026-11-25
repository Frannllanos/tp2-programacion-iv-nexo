import { IsIn } from 'class-validator';
import { RegistroDto } from './registro.dto';

export class AdminCrearUsuarioDto extends RegistroDto {
  @IsIn(['usuario', 'administrador'])
  perfil!: 'usuario' | 'administrador';
}
