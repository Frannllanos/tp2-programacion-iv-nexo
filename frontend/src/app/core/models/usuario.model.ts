export type PerfilUsuario = 'usuario' | 'administrador';

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string;
  descripcion: string;
  fotoPerfilUrl: string;
  perfil: PerfilUsuario;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}
