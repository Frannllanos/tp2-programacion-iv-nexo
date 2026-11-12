import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MongoIdPipe } from '../../common/pipes/mongo-id.pipe';
import { ActorDto } from './dto/actor.dto';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto';
import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicaciones: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  }))
  crear(@Body() dto: CrearPublicacionDto, @UploadedFile() archivo?: Express.Multer.File) {
    return this.publicaciones.crear(dto, archivo);
  }

  @Get()
  listar(@Query() dto: ListarPublicacionesDto) {
    return this.publicaciones.listar(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(
    @Param('id', MongoIdPipe) id: string,
    @Query() actor: ActorDto,
  ): Promise<void> {
    await this.publicaciones.bajaLogica(id, actor.usuarioId);
  }

  @Post(':id/me-gusta')
  @HttpCode(HttpStatus.OK)
  darMeGusta(@Param('id', MongoIdPipe) id: string, @Body() actor: ActorDto) {
    return this.publicaciones.darMeGusta(id, actor.usuarioId);
  }

  @Delete(':id/me-gusta')
  @HttpCode(HttpStatus.OK)
  quitarMeGusta(@Param('id', MongoIdPipe) id: string, @Body() actor: ActorDto) {
    return this.publicaciones.quitarMeGusta(id, actor.usuarioId);
  }
}
