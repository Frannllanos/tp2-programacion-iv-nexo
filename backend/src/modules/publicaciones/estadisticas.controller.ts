import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EstadisticasService } from './estadisticas.service';

@Controller('publicaciones/estadisticas')
@UseGuards(JwtAuthGuard, AdminGuard)
export class EstadisticasController {
  constructor(private readonly estadisticas: EstadisticasService) {}

  @Get('publicaciones-por-usuario')
  publicacionesPorUsuario(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.estadisticas.publicacionesPorUsuario(desde, hasta);
  }

  @Get('comentarios-por-dia')
  comentariosPorDia(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.estadisticas.comentariosPorDia(desde, hasta);
  }

  @Get('comentarios-por-publicacion')
  comentariosPorPublicacion(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.estadisticas.comentariosPorPublicacion(desde, hasta);
  }
}
