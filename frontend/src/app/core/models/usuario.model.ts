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
  createdAt: string;
  updatedAt: string;
}
