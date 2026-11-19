import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MongoIdPipe } from '../../common/pipes/mongo-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { UsuarioActual } from '../auth/usuario-actual.decorator';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto';
import { PublicacionesService } from './publicaciones.service';

@Controller('publicaciones')
@UseGuards(JwtAuthGuard)
export class PublicacionesController {
  constructor(private readonly publicaciones: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  }))
  crear(
    @UsuarioActual() usuario: JwtPayload,
    @Body() dto: CrearPublicacionDto,
    @UploadedFile() archivo?: Express.Multer.File,
  ) {
    return this.publicaciones.crear(dto, usuario.sub, archivo);
  }

  @Get()
  listar(@Query() dto: ListarPublicacionesDto) {
    return this.publicaciones.listar(dto);
  }

  @Get(':id')
  obtener(@Param('id', MongoIdPipe) id: string) {
    return this.publicaciones.obtenerUno(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(
    @Param('id', MongoIdPipe) id: string,
    @UsuarioActual() usuario: JwtPayload,
  ): Promise<void> {
    await this.publicaciones.bajaLogica(id, usuario.sub);
  }

  @Post(':id/me-gusta')
  @HttpCode(HttpStatus.OK)
  darMeGusta(
    @Param('id', MongoIdPipe) id: string,
    @UsuarioActual() usuario: JwtPayload,
  ) {
    return this.publicaciones.darMeGusta(id, usuario.sub);
  }

  @Delete(':id/me-gusta')
  @HttpCode(HttpStatus.OK)
  quitarMeGusta(
    @Param('id', MongoIdPipe) id: string,
    @UsuarioActual() usuario: JwtPayload,
  ) {
    return this.publicaciones.quitarMeGusta(id, usuario.sub);
  }
}
