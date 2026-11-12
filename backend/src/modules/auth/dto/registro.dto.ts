import { IsDateString, IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegistroDto {
  @IsString() @MinLength(2) @MaxLength(60)
  nombre!: string;

  @IsString() @MinLength(2) @MaxLength(60)
  apellido!: string;

  @IsEmail() @MaxLength(120)
  correo!: string;

  @IsString() @MinLength(3) @MaxLength(30)
  @Matches(/^[a-zA-Z0-9._-]+$/, { message: 'nombreUsuario solo admite letras, números, punto, guion y guion bajo.' })
  nombreUsuario!: string;

  @IsString() @MinLength(8) @MaxLength(72)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: 'La contraseña debe incluir al menos una mayúscula y un número.' })
  contrasena!: string;

  @IsString() @MinLength(8) @MaxLength(72)
  repetirContrasena!: string;

  @IsDateString({}, { message: 'fechaNacimiento debe ser una fecha válida.' })
  fechaNacimiento!: string;

  @IsString() @MinLength(3) @MaxLength(280)
  descripcion!: string;
}
