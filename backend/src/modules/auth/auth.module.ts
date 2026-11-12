import { Module } from '@nestjs/common';
import { MediaModule } from '../media/media.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsuariosModule, MediaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
