import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MongoIdPipe } from '../../common/pipes/mongo-id.pipe';
import { UsuariosService } from '../usuarios/usuarios.service';
import { AdminGuard } from './admin.guard';
import { AuthService } from './auth.service';
import { AdminCrearUsuarioDto } from './dto/admin-crear-usuario.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsuariosAdminController {
  constructor(
    private readonly usuarios: UsuariosService,
    private readonly auth: AuthService,
  ) {}

  @Get()
  listar() {
    return this.usuarios.listarTodos();
  }

  @Post()
  @UseInterceptors(FileInterceptor('imagenPerfil', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  }))
  crear(@Body() dto: AdminCrearUsuarioDto, @UploadedFile() archivo?: Express.Multer.File) {
    if (!archivo) throw new BadRequestException('La imagen de perfil es obligatoria.');
    return this.auth.crearUsuarioDesdeAdmin(dto, archivo);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deshabilitar(@Param('id', MongoIdPipe) id: string): Promise<void> {
    await this.usuarios.cambiarEstado(id, false);
  }

  @Post(':id/habilitar')
  @HttpCode(HttpStatus.OK)
  habilitar(@Param('id', MongoIdPipe) id: string) {
    return this.usuarios.cambiarEstado(id, true);
  }
}
