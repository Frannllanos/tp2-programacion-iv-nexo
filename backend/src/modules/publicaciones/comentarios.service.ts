import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CrearComentarioDto } from './dto/crear-comentario.dto';
import { EditarComentarioDto } from './dto/editar-comentario.dto';
import { ListarComentariosDto } from './dto/listar-comentarios.dto';
import { Publicacion, PublicacionDocument } from './schemas/publicacion.schema';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Publicacion.name)
    private readonly model: Model<PublicacionDocument>,
    private readonly usuarios: UsuariosService,
  ) {}

  async listar(publicacionId: string, dto: ListarComentariosDto) {
    const publicacion = await this.model
      .findOne({ _id: publicacionId, activa: true })
      .select('comentarios')
      .lean()
      .exec();

    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada.');
    }

    const ordenados = [...(publicacion.comentarios ?? [])]
      .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    const total = ordenados.length;
    const items = ordenados
      .slice(dto.offset, dto.offset + dto.limit)
      .map((comentario: any) => this.mapear(comentario));

    return {
      items,
      total,
      offset: dto.offset,
      limit: dto.limit,
      hasNext: dto.offset + items.length < total,
    };
  }

  async crear(publicacionId: string, usuarioId: string, dto: CrearComentarioDto) {
    const [publicacion, usuario] = await Promise.all([
      this.model.findOne({ _id: publicacionId, activa: true }).exec(),
      this.usuarios.obtenerDocumento(usuarioId),
    ]);

    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada.');
    }

    const mensaje = dto.mensaje.trim();
    if (!mensaje) throw new BadRequestException('El comentario no puede estar vacío.');

    const comentarioId = new Types.ObjectId();
    const comentario = {
      _id: comentarioId,
      usuarioId: new Types.ObjectId(usuarioId),
      nombreUsuario: usuario.nombreUsuario,
      mensaje,
      fecha: new Date(),
      modificado: false,
    };

    publicacion.comentarios.push(comentario as any);
    await publicacion.save();

    return this.mapear(comentario);
  }

  async editar(
    publicacionId: string,
    comentarioId: string,
    usuarioId: string,
    dto: EditarComentarioDto,
  ) {
    const publicacion = await this.model
      .findOne({ _id: publicacionId, activa: true })
      .exec();

    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada.');
    }

    const comentario = (publicacion.comentarios as any).id(comentarioId);
    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado.');
    }

    if (String(comentario.usuarioId) !== usuarioId) {
      throw new ForbiddenException('Solo el autor puede editar este comentario.');
    }

    const mensaje = dto.mensaje.trim();
    if (!mensaje) throw new BadRequestException('El comentario no puede estar vacío.');

    comentario.mensaje = mensaje;
    comentario.modificado = true;
    await publicacion.save();

    return this.mapear(comentario);
  }

  private mapear(comentario: any) {
    return {
      id: String(comentario._id),
      usuarioId: String(comentario.usuarioId),
      nombreUsuario: comentario.nombreUsuario,
      mensaje: comentario.mensaje,
      fecha: comentario.fecha,
      modificado: Boolean(comentario.modificado),
    };
  }
}
