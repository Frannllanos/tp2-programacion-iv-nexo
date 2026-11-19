import { IsString, MaxLength, MinLength } from 'class-validator';

export class CrearPublicacionDto {
  @IsString() @MinLength(2) @MaxLength(150)
  titulo!: string;

  @IsString() @MinLength(2) @MaxLength(2000)
  descripcion!: string;
}
