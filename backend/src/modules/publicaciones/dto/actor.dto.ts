import { IsMongoId } from 'class-validator';

export class ActorDto {
  @IsMongoId()
  usuarioId!: string;
}
