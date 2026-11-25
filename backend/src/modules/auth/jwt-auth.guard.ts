import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly usuarios: UsuariosService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    const token = this.extraerToken(request);

    if (!token) {
      throw new UnauthorizedException('Falta el token de autenticacion.');
    }

    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      const usuario = await this.usuarios.obtenerDocumento(payload.sub);
      if (usuario.activo === false) {
        throw new UnauthorizedException('El usuario se encuentra deshabilitado.');
      }
      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('El token es invalido o esta vencido.');
    }
  }

  private extraerToken(request: Request): string | undefined {
    const [tipo, token] = request.headers.authorization?.split(' ') ?? [];
    return tipo === 'Bearer' ? token : undefined;
  }
}
