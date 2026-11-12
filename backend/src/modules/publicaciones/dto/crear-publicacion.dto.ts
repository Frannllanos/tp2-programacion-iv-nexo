import { IsMongoId, IsString, MaxLength, MinLength } from 'class-validator';

export class CrearPublicacionDto {
  @IsMongoId()
  usuarioId!: string;

  @IsString() @MinLength(2) @MaxLength(150)
  titulo!: string;

  @IsString() @MinLength(2) @MaxLength(2000)
  descripcion!: string;
}
