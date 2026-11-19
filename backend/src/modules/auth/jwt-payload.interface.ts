export interface JwtPayload {
  sub: string;
  correo: string;
  nombreUsuario: string;
  perfil: 'usuario' | 'administrador';
  iat?: number;
  exp?: number;
}
