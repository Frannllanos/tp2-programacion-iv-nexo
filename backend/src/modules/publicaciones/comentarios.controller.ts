import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MongoIdPipe } from '../../common/pipes/mongo-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { UsuarioActual } from '../auth/usuario-actual.decorator';
import { ComentariosService } from './comentarios.service';
import { CrearComentarioDto } from './dto/crear-comentario.dto';
import { EditarComentarioDto } from './dto/editar-comentario.dto';
import { ListarComentariosDto } from './dto/listar-comentarios.dto';

@Controller('publicaciones/:publicacionId/comentarios')
@UseGuards(JwtAuthGuard)
export class ComentariosController {
  constructor(private readonly comentarios: ComentariosService) {}

  @Get()
  listar(
    @Param('publicacionId', MongoIdPipe) publicacionId: string,
    @Query() dto: ListarComentariosDto,
  ) {
    return this.comentarios.listar(publicacionId, dto);
  }

  @Post()
  crear(
    @Param('publicacionId', MongoIdPipe) publicacionId: string,
    @UsuarioActual() usuario: JwtPayload,
    @Body() dto: CrearComentarioDto,
  ) {
    return this.comentarios.crear(publicacionId, usuario.sub, dto);
  }

  @Put(':comentarioId')
  @HttpCode(HttpStatus.OK)
  editar(
    @Param('publicacionId', MongoIdPipe) publicacionId: string,
    @Param('comentarioId', MongoIdPipe) comentarioId: string,
    @UsuarioActual() usuario: JwtPayload,
    @Body() dto: EditarComentarioDto,
  ) {
    return this.comentarios.editar(publicacionId, comentarioId, usuario.sub, dto);
  }
}
