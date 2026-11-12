import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';

export interface UsuarioPublico {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: Date;
  descripcion: string;
  fotoPerfilUrl: string;
  perfil: 'usuario' | 'administrador';
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private readonly model: Model<UsuarioDocument>) {}

  async existeCorreoONombreUsuario(correo: string, nombreUsuario: string): Promise<boolean> {
    const existe = await this.model.exists({ $or: [{ correo: correo.toLowerCase() }, { nombreUsuario: nombreUsuario.toLowerCase() }] });
    return Boolean(existe);
  }

  async crear(data: Partial<Usuario>): Promise<UsuarioDocument> {
    return this.model.create(data);
  }

  async buscarParaLogin(identificador: string): Promise<UsuarioDocument | null> {
    const value = identificador.trim().toLowerCase();
    return this.model.findOne({ $or: [{ correo: value }, { nombreUsuario: value }] }).select('+contrasenaHash').exec();
  }

  async obtenerDocumento(id: string): Promise<UsuarioDocument> {
    const usuario = await this.model.findById(id).exec();
    if (!usuario) throw new NotFoundException('Usuario no encontrado.');
    return usuario;
  }

  async obtenerPublico(id: string): Promise<UsuarioPublico> {
    const usuario = await this.obtenerDocumento(id);
    return this.aPublico(usuario);
  }

  aPublico(usuario: UsuarioDocument): UsuarioPublico {
    return {
      id: String(usuario._id),
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      nombreUsuario: usuario.nombreUsuario,
      fechaNacimiento: usuario.fechaNacimiento,
      descripcion: usuario.descripcion,
      fotoPerfilUrl: usuario.fotoPerfilUrl,
      perfil: usuario.perfil,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    };
  }

  autorPublico(usuario: UsuarioDocument | any) {
    return {
      id: String(usuario._id),
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      nombreUsuario: usuario.nombreUsuario,
      fotoPerfilUrl: usuario.fotoPerfilUrl,
    };
  }
}
