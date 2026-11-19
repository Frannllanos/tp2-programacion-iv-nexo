import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtPayload } from './jwt-payload.interface';
import { UsuarioActual } from './usuario-actual.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  }))
  registrar(@Body() dto: RegistroDto, @UploadedFile() archivo?: Express.Multer.File) {
    if (!archivo) throw new BadRequestException('La imagen de perfil es obligatoria.');
    return this.auth.registrar(dto, archivo);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('autorizar')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  autorizar(@UsuarioActual() usuario: JwtPayload) {
    return this.auth.autorizar(usuario.sub);
  }

  @Post('refrescar')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  refrescar(@UsuarioActual() usuario: JwtPayload) {
    return this.auth.refrescar(usuario);
  }
}
