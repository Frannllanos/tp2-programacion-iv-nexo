import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';

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
}
