import { Type } from 'class-transformer';
import { IsIn, IsInt, IsMongoId, IsOptional, Max, Min } from 'class-validator';

export class ListarPublicacionesDto {
  @IsOptional() @IsIn(['fecha', 'likes'])
  orden: 'fecha' | 'likes' = 'fecha';

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  offset = 0;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50)
  limit = 6;

  @IsOptional() @IsMongoId()
  usuarioId?: string;
}
