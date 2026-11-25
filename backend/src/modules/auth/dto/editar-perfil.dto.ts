import { IsDateString, IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class EditarPerfilDto {
  @IsString() @MinLength(2) @MaxLength(60)
  nombre!: string;

  @IsString() @MinLength(2) @MaxLength(60)
  apellido!: string;

  @IsEmail() @MaxLength(120)
  correo!: string;

  @IsString() @MinLength(3) @MaxLength(30)
  @Matches(/^[a-zA-Z0-9._-]+$/, { message: 'nombreUsuario solo admite letras, numeros, punto, guion y guion bajo.' })
  nombreUsuario!: string;

  @IsDateString({}, { message: 'fechaNacimiento debe ser una fecha valida.' })
  fechaNacimiento!: string;

  @IsString() @MinLength(3) @MaxLength(280)
  descripcion!: string;
}
