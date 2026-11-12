export interface AutorPublicacion {
  id: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  fotoPerfilUrl: string;
}

export interface ComentarioPreview {
  id: string;
  usuarioId: string;
  nombreUsuario: string;
  mensaje: string;
  fecha: string;
  modificado: boolean;
}

export interface Publicacion {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  likes: string[];
  likesCount: number;
  activa: boolean;
  autor: AutorPublicacion;
  comentarios: ComentarioPreview[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicacionesResponse {
  items: Publicacion[];
  total: number;
  offset: number;
  limit: number;
  hasNext: boolean;
}
