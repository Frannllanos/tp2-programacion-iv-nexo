import { IsString, MaxLength, MinLength } from 'class-validator';

export class EditarComentarioDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  mensaje!: string;
}
