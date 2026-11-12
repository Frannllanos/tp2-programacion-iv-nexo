import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString() @MinLength(3) @MaxLength(120)
  identificador!: string;

  @IsString() @MinLength(8) @MaxLength(72)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: 'Formato de contraseña inválido.' })
  contrasena!: string;
}
